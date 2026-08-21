from langchain_core.tools import StructuredTool

from services.restaurant_service import (
    get_available_menu,
    search_menu,
    create_order,
    get_order,
    update_order_status,
    create_reservation,
)


# =========================================================
# TOOL FACTORIES
#
# Each factory closes over restaurant_id so the LLM never
# sees or controls which restaurant it's operating on —
# it's bound once when the agent is built for that request.
# =========================================================

def make_search_menu_tool(restaurant_id: int):
    def _search_menu(query: str):
        return search_menu(query, restaurant_id)

    return StructuredTool.from_function(
        func=_search_menu,
        name="search_menu_tool",
        description=(
            "Search the restaurant menu by food name or category. "
            "Use this when the customer asks about specific food, "
            "drinks, prices, or availability."
        ),
    )


def make_get_menu_tool(restaurant_id: int):
    def _get_menu():
        return get_available_menu(restaurant_id)

    return StructuredTool.from_function(
        func=_get_menu,
        name="get_menu_tool",
        description="Get all currently available restaurant menu items.",
    )


def make_create_order_tool(restaurant_id: int):
    def _create_order(customer_name: str, items: list):
        try:
            order = create_order(
                customer_name,
                items,
                restaurant_id
            )
            return {"success": True, "order": order}
        except ValueError as e:
            return {"success": False, "error": str(e)}

    return StructuredTool.from_function(
        func=_create_order,
        name="create_order_tool",
        description=(
            "Create a restaurant order. items must look like: "
            '[{"id": 1, "qty": 2}, {"id": 4, "qty": 1}]'
        ),
    )


def make_get_order_tool(restaurant_id: int):
    def _get_order(order_id: int):
        try:
            order = get_order(order_id, restaurant_id)
            return {"success": True, "order": order}
        except ValueError as e:
            return {"success": False, "error": str(e)}

    return StructuredTool.from_function(
        func=_get_order,
        name="get_order_tool",
        description="Get the details and status of an existing order.",
    )


def make_update_order_status_tool(restaurant_id: int):
    def _update_order_status(order_id: int, status: str):
        try:
            order = update_order_status(
                order_id,
                status,
                restaurant_id
            )
            return {"success": True, "order": order}
        except ValueError as e:
            return {"success": False, "error": str(e)}

    return StructuredTool.from_function(
        func=_update_order_status,
        name="update_order_status_tool",
        description=(
            "Update the status of an existing order. "
            "Valid statuses: pending, confirmed, preparing, ready, "
            "completed, cancelled."
        ),
    )


def make_create_reservation_tool(restaurant_id: int):
    def _create_reservation(
        name: str,
        guests: int,
        reserved_at: str,
        contact: str = "",
        notes: str = ""
    ):
        try:
            reservation = create_reservation(
                name=name,
                guests=guests,
                reserved_at=reserved_at,
                restaurant_id=restaurant_id,
                contact=contact,
                notes=notes
            )
            return {"success": True, "reservation": reservation}
        except ValueError as e:
            return {"success": False, "error": str(e)}

    return StructuredTool.from_function(
        func=_create_reservation,
        name="create_reservation_tool",
        description=(
            "Create a restaurant reservation. "
            "reserved_at must be an ISO datetime string."
        ),
    )


def build_tools(restaurant_id: int):
    """
    Build the full toolset bound to a single restaurant.
    """
    return [
        make_search_menu_tool(restaurant_id),
        make_get_menu_tool(restaurant_id),
        make_create_order_tool(restaurant_id),
        make_get_order_tool(restaurant_id),
        make_update_order_status_tool(restaurant_id),
        make_create_reservation_tool(restaurant_id),
    ]