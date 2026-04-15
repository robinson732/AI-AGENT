from flask import Blueprint, jsonify
from models.menu import MenuItem

menu_bp = Blueprint("menu", __name__, url_prefix="/menu")

@menu_bp.route("/", methods=["GET"])
def get_menu():
    items = MenuItem.query.all()

    return jsonify([
        {
            "name": item.name,
            "description": item.description,
            "price": item.price
        }
        for item in items
    ])