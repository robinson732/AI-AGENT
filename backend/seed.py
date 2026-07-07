from app import create_app
from extensions import db
from models.menu import MenuItem

app = create_app()

with app.app_context():
    db.create_all()

    # Seed menu items
    if not MenuItem.query.first():
        items = [
            MenuItem(name="Margherita Pizza", description="Classic cheese pizza", price=12.99, category="Pizza", vegetarian=True),
            MenuItem(name="Pepperoni Pizza", description="Pizza with pepperoni", price=14.99, category="Pizza"),
            MenuItem(name="Caesar Salad", description="Fresh salad with caesar dressing", price=8.99, category="Salad", vegetarian=True),
            MenuItem(name="Grilled Chicken Burger", description="Burger with grilled chicken", price=11.99, category="Burger"),
        ]
        db.session.add_all(items)
        db.session.commit()
        print("Database seeded!")