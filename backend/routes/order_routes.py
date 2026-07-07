from flask import Blueprint, request, jsonify
from models.order import Order
from models.menu import MenuItem
from extensions import db

orders_bp = Blueprint("orders", __name__, url_prefix="/orders")

@orders_bp.route("/", methods=["POST"])
def create_order():
    data = request.json

    item = MenuItem.query.get(data["item_id"])
    if not item:
        return jsonify({"error": "Item not found"}), 404

    total_price = item.price * data["quantity"]

    order = Order(
        customer_name=data["customer_name"],
        item_id=data["item_id"],
        quantity=data["quantity"],
        total_price=total_price
    )

    db.session.add(order)
    db.session.commit()

    return jsonify({"message": "Order placed successfully", "order_id": order.id})