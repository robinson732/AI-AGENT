from flask import Blueprint, request, jsonify
from extensions import db
from models.reservation import Reservation
from datetime import datetime

reservations_bp = Blueprint("reservations", __name__, url_prefix="/reservations")


@reservations_bp.route("/", methods=["POST"])
def create_reservation():
    data = request.json

    reservation = Reservation(
        name=data["name"],
        guests=data["guests"],
        reservation_time=datetime.fromisoformat(data["reservation_time"])
    )

    db.session.add(reservation)
    db.session.commit()

    return jsonify({
        "message": "Reservation created successfully"
    })


@reservations_bp.route("/", methods=["GET"])
def get_reservations():
    reservations = Reservation.query.all()

    return jsonify([
        {
            "name": r.name,
            "guests": r.guests,
            "reservation_time": r.reservation_time
        }
        for r in reservations
    ])