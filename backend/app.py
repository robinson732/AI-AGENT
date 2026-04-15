from flask import Flask
from config import Config
from extensions import db, cors

# import routes
from routes.chat import chat_bp
from routes.menu import menu_bp
from routes.orders import orders_bp
from routes.reservations import reservations_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # initialize extensions
    db.init_app(app)
    cors.init_app(app)

    # register blueprints
    app.register_blueprint(chat_bp)
    app.register_blueprint(menu_bp)
    app.register_blueprint(orders_bp)

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)