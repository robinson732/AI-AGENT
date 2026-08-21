import sys

from app import app
from extensions import db
from models import Menu, Restaurant

MENU_ITEMS = [
    {
        "name": "Margherita Pizza",
        "description": "Classic pizza with tomatoes, mozzarella, basil, and olive oil.",
        "price": 12.5,
        "category": "Pizza",
        "available": True,
        "ingredients": "tomato, mozzarella, basil, olive oil",
    },
    {
        "name": "Grilled Chicken Salad",
        "description": "Mixed greens with grilled chicken, cherry tomatoes, cucumbers, and vinaigrette.",
        "price": 14.0,
        "category": "Salad",
        "available": True,
        "ingredients": "chicken, lettuce, tomato, cucumber, vinaigrette",
    },
    {
        "name": "Spaghetti Carbonara",
        "description": "Pasta with pancetta, egg yolk, pecorino, and black pepper.",
        "price": 15.75,
        "category": "Pasta",
        "available": True,
        "ingredients": "spaghetti, pancetta, egg, pecorino, pepper",
    },
    {
        "name": "Vegan Buddha Bowl",
        "description": "Quinoa, roasted veggies, chickpeas, avocado, and tahini dressing.",
        "price": 13.5,
        "category": "Vegan",
        "available": True,
        "ingredients": "quinoa, vegetables, chickpeas, avocado, tahini",
    },
]


def seed_menu(slug: str):
    with app.app_context():
        db.create_all()

        restaurant = Restaurant.query.filter_by(slug=slug).first()

        if not restaurant:
            print(f"No restaurant found with slug '{slug}'. Run 'flask seed-restaurant' first.")
            return

        for item_data in MENU_ITEMS:
            existing = Menu.query.filter_by(
                name=item_data["name"],
                restaurant_id=restaurant.id
            ).first()

            if not existing:
                item = Menu(restaurant_id=restaurant.id, **item_data)
                db.session.add(item)

        db.session.commit()
        print(f"Seeded menu items for restaurant '{restaurant.name}'.")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python seed.py <restaurant-slug>")
        sys.exit(1)

    seed_menu(sys.argv[1])