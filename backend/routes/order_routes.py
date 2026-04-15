from flask import Blueprint, request, jsonify
from models.order import Order
from extensions import db

orders_bp = Blueprint("orders", __name__, url_prefix="/orders")

@orders_bp.route("/", methods=["POST"])
def create_order():
    data = request.json

    order = Order(
        item_name=data["item_name"],
        quantity=data["quantity"]
    )

    db.session.add(order)
    db.session.commit()

    return jsonify({"message": "Order placed successfully"})