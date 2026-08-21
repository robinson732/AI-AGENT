from flask import Blueprint, jsonify, request, g, abort
from models import Menu, Restaurant
from extensions import db

from ai import ask_agent

from services.restaurant_service import (
    create_order as service_create_order,
    create_reservation as service_create_reservation,
    get_available_menu,
)

from datetime import datetime


main = Blueprint("main", __name__, url_prefix="/r/<string:slug>")


@main.url_value_preprocessor
def resolve_restaurant(endpoint, values):
    slug = values.pop("slug", None)

    restaurant = Restaurant.query.filter_by(
        slug=slug,
        is_active=True,
    ).first()

    if not restaurant:
        abort(404, description="restaurant not found")

    g.restaurant = restaurant


@main.url_defaults
def inject_restaurant_slug(endpoint, values):
    if "slug" not in values and "restaurant" in g:
        values["slug"] = g.restaurant.slug


# ============================================================
# HOME
# ============================================================

@main.route("/")
def home():
    return {
        "message": "Restaurant AI API is running",
        "restaurant": g.restaurant.to_dict(),
    }


# ============================================================
# MENU
# ============================================================

@main.route("/menu", methods=["GET"])
def get_menu():
    menu = Menu.query.filter_by(restaurant_id=g.restaurant.id).all()

    return jsonify([
        item.to_dict()
        for item in menu
    ])


# ============================================================
# AI CHAT
# ============================================================

@main.route("/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}

    message = data.get("message")
    session_id = data.get("session_id", "default")

    if not message:
        return jsonify({"error": "message is required"}), 400

    try:
        reply = ask_agent(
            message,
            session_id,
            g.restaurant.id
        )

        return jsonify({
            "reply": reply,
            "session_id": session_id
        })

    except Exception as e:
        return jsonify({
            "error": "AI agent failed",
            "details": str(e)
        }), 500


# ============================================================
# ORDERS
# ============================================================

@main.route("/orders", methods=["POST"])
def create_order():
    data = request.get_json() or {}

    customer_name = data.get("customer_name")
    items = data.get("items")

    try:
        order = service_create_order(
            customer_name,
            items,
            g.restaurant.id
        )
        return jsonify({"order": order}), 201

    except ValueError as e:
        return jsonify({"error": str(e)}), 400


# ============================================================
# RESERVATIONS
# ============================================================

@main.route("/reservations", methods=["POST"])
def create_reservation():
    data = request.get_json() or {}

    try:
        reservation = service_create_reservation(
            name=data.get("name"),
            guests=data.get("guests"),
            reserved_at=data.get("reserved_at"),
            restaurant_id=g.restaurant.id,
            contact=data.get("contact"),
            notes=data.get("notes"),
        )
        return jsonify({"reservation": reservation}), 201

    except ValueError as e:
        return jsonify({"error": str(e)}), 400


# ============================================================
# RECOMMENDATIONS
# ============================================================

@main.route("/recommendations", methods=["GET"])
def recommendations():
    budget = request.args.get("budget")
    dietary = request.args.get("dietary")
    preferences = request.args.get("preferences")

    menu_list = get_available_menu(g.restaurant.id)

    prompt = (
        f"Given the following restaurant menu: {menu_list}, "
        "provide up to 5 recommendations for the customer."
    )

    constraints = []
    if budget:
        constraints.append(f"budget: {budget}")
    if dietary:
        constraints.append(f"dietary restrictions: {dietary}")
    if preferences:
        constraints.append(f"preferences: {preferences}")

    if constraints:
        prompt += " Consider these constraints: " + ", ".join(constraints)

    try:
        recs = ask_agent(
            message=prompt,
            session_id="recommendations",
            restaurant_id=g.restaurant.id
        )
        return jsonify({"recommendations": recs})

    except Exception as e:
        print("RECOMMENDATION ERROR:", e)
        return jsonify({"error": "AI recommendation failed"}), 500
