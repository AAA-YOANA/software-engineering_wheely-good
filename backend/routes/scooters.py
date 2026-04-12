from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from models import Booking, Scooter

scooters_bp = Blueprint("scooters", __name__, url_prefix="/api/scooters")


def scooter_to_frontend_dict(scooter: Scooter) -> dict:
    return {
        "id": scooter.id,
        "scooter_code": scooter.scooter_code,
        "name": scooter.name,
        "battery": scooter.current_battery,
        "status": scooter.status,
        "image": scooter.image_url,
        "position": [
            float(scooter.latitude or 0),
            float(scooter.longitude or 0),
        ],
        "current_location": scooter.current_location,
    }


@scooters_bp.route("", methods=["GET"])
@jwt_required()
def get_scooters():
    search = str(request.args.get("search", "")).strip().lower()
    status = str(request.args.get("status", "all")).strip().lower()
    min_battery = request.args.get("min_battery", "0")

    query = Scooter.query

    if search:
        query = query.filter(Scooter.scooter_code.ilike(f"%{search}%"))

    if status != "all":
        query = query.filter(Scooter.status == status)

    try:
        min_battery_value = int(min_battery)
    except ValueError:
        return jsonify({"message": "min_battery must be an integer."}), 400

    query = query.filter(Scooter.current_battery >= min_battery_value)

    scooters = query.order_by(Scooter.current_battery.desc()).all()

    return jsonify({
        "scooters": [scooter_to_frontend_dict(scooter) for scooter in scooters]
    }), 200


@scooters_bp.route("/<int:scooter_id>", methods=["GET"])
@jwt_required()
def get_scooter_detail(scooter_id: int):
    scooter = Scooter.query.get(scooter_id)

    if scooter is None:
        return jsonify({"message": "Scooter not found."}), 404

    return jsonify({
        "scooter": scooter_to_frontend_dict(scooter)
    }), 200


@scooters_bp.route("/<int:scooter_id>/booking-detail", methods=["GET"])
@jwt_required()
def get_scooter_booking_detail(scooter_id: int):
    scooter = Scooter.query.get(scooter_id)

    if scooter is None:
        return jsonify({"message": "Scooter not found."}), 404

    today_usage_count = Booking.query.filter_by(scooter_id=scooter.id).count()

    return jsonify({
        "scooter": {
            "id": scooter.id,
            "scooter_code": scooter.scooter_code,
            "name": scooter.name,
            "images": [scooter.image_url] if scooter.image_url else [],
            "battery": scooter.current_battery,
            "max_speed_kmh": 35,
            "range_km": 60,
            "location": scooter.current_location,
            "today_usage_count": today_usage_count,
            "rating": 4.9,
            "status": scooter.status,
        },
        "pricing": {
            "price_per_hour": 25,
            "deposit": 299,
            "discount_rules": [
                {"min_hours": 4, "discount_rate": 0.10},
                {"min_hours": 8, "discount_rate": 0.15},
            ],
        },
    }), 200