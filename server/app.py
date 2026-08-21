import click
from flask import Flask
from flask_cors import CORS

from config import Config
from extensions import (
    db,
    migrate,
    init_redis,
    jwt,
    register_jwt_callbacks,
)
from routes import main
from auth_routes import auth


def create_app():
    app = Flask(__name__)

    # Load configuration
    app.config.from_object(Config)

    # CORS
    CORS(
        app,
        origins=app.config["CORS_ORIGINS"],
        supports_credentials=True
    )

    # PostgreSQL / SQLAlchemy
    db.init_app(app)

    # Flask-Migrate
    migrate.init_app(
        app,
        db
    )

    # Redis
    init_redis(app)

    # JWT (must come after init_redis, since blocklist checks Redis)
    jwt.init_app(app)
    register_jwt_callbacks(app)

    # Routes
    app.register_blueprint(main)
    app.register_blueprint(auth)

    register_cli(app)

    return app


def register_cli(app):
    @app.cli.command("create-admin")
    @click.option("--name", prompt=True)
    @click.option("--email", prompt=True)
    @click.option("--password", prompt=True, hide_input=True, confirmation_prompt=True)
    def create_admin(name, email, password):
        """Create an admin user directly in the database. Intended for one-time setup."""
        from services.auth_service import create_staff_user, AuthError

        try:
            user = create_staff_user(
                name=name,
                email=email,
                password=password,
                role="admin",
            )
            click.echo(f"Admin created: {user.email} (id={user.id})")
        except AuthError as e:
            click.echo(f"Error: {e.message}")

    @app.cli.command("seed-restaurant")
    @click.option("--name", prompt=True)
    @click.option("--slug", prompt=True)
    def seed_restaurant(name, slug):
        """Create a restaurant and optionally backfill existing NULL restaurant_id rows to it."""
        from extensions import db
        from models import Restaurant, Menu, Order, Reservation, User

        existing = Restaurant.query.filter_by(slug=slug).first()

        if existing:
            click.echo(f"Restaurant with slug '{slug}' already exists (id={existing.id})")
            restaurant = existing
        else:
            restaurant = Restaurant(name=name, slug=slug)
            db.session.add(restaurant)
            db.session.commit()
            click.echo(
                f"Created restaurant: {restaurant.name} "
                f"(id={restaurant.id}, slug={restaurant.slug})"
            )

        if click.confirm("Backfill existing NULL-restaurant_id rows to this restaurant?"):
            menu_count = Menu.query.filter_by(restaurant_id=None).update(
                {"restaurant_id": restaurant.id}
            )
            order_count = Order.query.filter_by(restaurant_id=None).update(
                {"restaurant_id": restaurant.id}
            )
            reservation_count = Reservation.query.filter_by(restaurant_id=None).update(
                {"restaurant_id": restaurant.id}
            )
            user_count = User.query.filter_by(restaurant_id=None).update(
                {"restaurant_id": restaurant.id}
            )
            db.session.commit()

            click.echo(
                f"Backfilled: {menu_count} menu items, {order_count} orders, "
                f"{reservation_count} reservations, {user_count} users"
            )


app = create_app()

if __name__ == "__main__":
    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )