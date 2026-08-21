from datetime import datetime

from extensions import db
from models import Menu, Order, Reservation

from services.cache_service import (
    cache_get,
    cache_set,
    cache_delete,
)


# =========================================================
# ORDER STATUS
# =========================================================

VALID_ORDER_STATUSES = {
    "pending": ["confirmed", "cancelled"],
    "confirmed": ["preparing", "cancelled"],
    "preparing": ["ready"],
    "ready": ["completed"],
    "completed": [],
    "cancelled": [],
}


def _menu_cache_key(restaurant_id: int) -> str:
    return f"menu:available:{restaurant_id}"


# =========================================================
# MENU
# =========================================================

def get_available_menu(restaurant_id: int):
    """
    Get all currently available menu items for a restaurant.

    Redis is checked first.
    PostgreSQL is used if the cache is empty.
    """

    cache_key = _menu_cache_key(restaurant_id)

    cached_menu = cache_get(cache_key)

    if cached_menu is not None:
        return cached_menu

    menu = Menu.query.filter_by(
        restaurant_id=restaurant_id,
        available=True
    ).all()

    menu_data = [
        item.to_dict()
        for item in menu
    ]

    cache_set(
        cache_key,
        menu_data,
        ttl=300
    )

    return menu_data


def search_menu(query: str, restaurant_id: int):
    """
    Search available menu items for a restaurant by:
    - name
    - category
    - description
    """

    query = query.strip()

    if not query:
        return []

    search_term = f"%{query}%"

    menu = Menu.query.filter(
        Menu.restaurant_id == restaurant_id,
        Menu.available.is_(True),
        db.or_(
            Menu.name.ilike(search_term),
            Menu.category.ilike(search_term),
            Menu.description.ilike(search_term)
        )
    ).all()

    return [
        item.to_dict()
        for item in menu
    ]


def invalidate_menu_cache(restaurant_id: int):
    """
    Clear the cached menu for a restaurant.

    Call this whenever that restaurant's menu changes.
    """

    cache_delete(
        _menu_cache_key(restaurant_id)
    )


# =========================================================
# ORDERS
# =========================================================

def create_order(
    customer_name: str,
    items: list,
    restaurant_id: int
):
    """
    Create a restaurant order, scoped to a single restaurant.

    Example items:

    [
        {"id": 1, "qty": 2},
        {"id": 4, "qty": 1}
    ]

    Prices are ALWAYS taken from PostgreSQL.
    """

    if not customer_name:
        raise ValueError(
            "Customer name is required."
        )

    if not items:
        raise ValueError(
            "Order must contain at least one item."
        )

    detailed_items = []
    total = 0.0

    for item in items:

        if not isinstance(item, dict):
            raise ValueError(
                "Each order item must be an object."
            )

        menu_id = item.get("id")
        quantity = item.get("qty", 1)

        if menu_id is None:
            raise ValueError(
                "Each item must contain a menu item id."
            )

        try:
            menu_id = int(menu_id)
            quantity = int(quantity)

        except (TypeError, ValueError):
            raise ValueError(
                "Menu id and quantity must be numbers."
            )

        if quantity <= 0:
            raise ValueError(
                "Quantity must be greater than zero."
            )

        # -------------------------------------------------
        # Always retrieve the real menu item from database,
        # scoped to this restaurant. Redis is NOT used for
        # order pricing.
        # -------------------------------------------------

        menu_item = Menu.query.filter_by(
            id=menu_id,
            restaurant_id=restaurant_id
        ).first()

        if not menu_item:
            raise ValueError(
                f"Menu item {menu_id} does not exist."
            )

        if not menu_item.available:
            raise ValueError(
                f"{menu_item.name} is currently unavailable."
            )

        item_total = (
            float(menu_item.price)
            * quantity
        )

        total += item_total

        detailed_items.append({
            "id": menu_item.id,
            "name": menu_item.name,
            "qty": quantity,
            "price": float(menu_item.price),
            "subtotal": round(item_total, 2)
        })

    order = Order(
        restaurant_id=restaurant_id,
        customer_name=customer_name,
        items=detailed_items,
        total=round(total, 2),
        status="pending"
    )

    db.session.add(order)
    db.session.commit()

    return order.to_dict()


# =========================================================
# GET ORDER
# =========================================================

def get_order(order_id: int, restaurant_id: int):
    """
    Get an existing order, scoped to a single restaurant.
    """

    order = Order.query.filter_by(
        id=order_id,
        restaurant_id=restaurant_id
    ).first()

    if not order:
        raise ValueError(
            f"Order {order_id} was not found."
        )

    return order.to_dict()


# =========================================================
# UPDATE ORDER STATUS
# =========================================================

def update_order_status(
    order_id: int,
    new_status: str,
    restaurant_id: int
):
    """
    Update an order's status, scoped to a single restaurant.

    Only valid status transitions are allowed.
    """

    order = Order.query.filter_by(
        id=order_id,
        restaurant_id=restaurant_id
    ).first()

    if not order:
        raise ValueError(
            f"Order {order_id} not found."
        )

    if not new_status:
        raise ValueError(
            "Order status is required."
        )

    new_status = (
        new_status
        .lower()
        .strip()
    )

    if new_status not in VALID_ORDER_STATUSES:
        raise ValueError(
            f"Invalid order status: {new_status}"
        )

    current_status = order.status

    allowed_statuses = VALID_ORDER_STATUSES.get(
        current_status,
        []
    )

    if new_status not in allowed_statuses:
        raise ValueError(
            f"Cannot change order from "
            f"{current_status} to {new_status}."
        )

    order.status = new_status

    db.session.commit()

    return order.to_dict()


# =========================================================
# RESERVATIONS
# =========================================================

def create_reservation(
    name: str,
    guests: int,
    reserved_at: str,
    restaurant_id: int,
    contact: str = "",
    notes: str = ""
):
    """
    Create a restaurant reservation, scoped to a single restaurant.
    """

    if not name:
        raise ValueError(
            "Name is required."
        )

    if not guests:
        raise ValueError(
            "Number of guests is required."
        )

    try:
        guests = int(guests)

    except (TypeError, ValueError):
        raise ValueError(
            "Guests must be a number."
        )

    if guests <= 0:
        raise ValueError(
            "Guests must be greater than zero."
        )

    if not reserved_at:
        raise ValueError(
            "Reservation date and time are required."
        )

    try:
        reserved_dt = datetime.fromisoformat(
            reserved_at
        )

    except (TypeError, ValueError):
        raise ValueError(
            "reserved_at must be an ISO datetime string."
        )

    reservation = Reservation(
        restaurant_id=restaurant_id,
        name=name,
        guests=guests,
        reserved_at=reserved_dt,
        contact=contact,
        notes=notes,
        status="booked"
    )

    db.session.add(reservation)
    db.session.commit()

    return reservation.to_dict()