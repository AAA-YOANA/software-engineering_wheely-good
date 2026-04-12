from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from extensions import db
from models import Booking, Scooter

bookings_bp = Blueprint("bookings", __name__, url_prefix="/api/bookings")


def calculate_quote(duration_hours: int, price_per_hour: float = 25.0, deposit: float = 299.0):
    base_price = duration_hours * price_per_hour

    if duration_hours >= 8:
        discount_rate = 0.15
    elif duration_hours >= 4:
        discount_rate = 0.10
    else:
        discount_rate = 0.0

    discount_amount = round(base_price * discount_rate, 2)
    final_rental_price = round(base_price - discount_amount, 2)
    total_amount = round(final_rental_price + deposit, 2)

    return {
        "price_per_hour": price_per_hour,
        "base_price": base_price,
        "discount_rate": discount_rate,
        "discount_amount": discount_amount,
        "final_rental_price": final_rental_price,
        "deposit": deposit,
        "total_amount": total_amount,
    }


@bookings_bp.route("/unlock", methods=["POST"])
@jwt_required()
def unlock_scooter():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    scooter_id = data.get("scooter_id")
    start_location = str(data.get("start_location", "Unknown location")).strip()

    if not scooter_id:
        return jsonify({"message": "scooter_id is required."}), 400

    scooter = Scooter.query.get(scooter_id)
    if scooter is None:
        return jsonify({"message": "Scooter not found."}), 404

    if scooter.status == "in-use":
        return jsonify({"message": "This scooter is already in use."}), 400

    if scooter.current_battery < 10:
        return jsonify({"message": "Battery too low to unlock."}), 400

    existing_ongoing_booking = Booking.query.filter_by(
        user_id=user_id,
        status="ongoing"
    ).first()

    if existing_ongoing_booking:
        return jsonify({"message": "You already have an ongoing trip."}), 400

    booking = Booking(
        user_id=user_id,
        scooter_id=scooter.id,
        start_time=datetime.utcnow(),
        start_location=start_location,
        battery_start=scooter.current_battery,
        status="ongoing",
        duration_minutes=0,
        distance_km=0,
        cost=0,
        booking_type="instant",
        payment_status="paid",
    )

    scooter.status = "in-use"

    db.session.add(booking)
    db.session.commit()

    return jsonify({
        "message": "Scooter unlocked successfully.",
        "booking": {
            "id": booking.id,
            "status": booking.status,
            "scooter_id": booking.scooter_id,
        },
    }), 201


@bookings_bp.route("/quote", methods=["POST"])
@jwt_required()
def quote_booking():
    data = request.get_json() or {}

    scooter_id = data.get("scooter_id")
    duration_hours = data.get("duration_hours")

    if not scooter_id:
        return jsonify({"message": "scooter_id is required."}), 400

    try:
        duration_hours = int(duration_hours)
    except (TypeError, ValueError):
        return jsonify({"message": "duration_hours must be an integer."}), 400

    if duration_hours <= 0:
        return jsonify({"message": "duration_hours must be greater than 0."}), 400

    scooter = Scooter.query.get(scooter_id)
    if scooter is None:
        return jsonify({"message": "Scooter not found."}), 404

    quote = calculate_quote(duration_hours)

    return jsonify(quote), 200


@bookings_bp.route("/create", methods=["POST"])
@jwt_required()
def create_booking():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    scooter_id = data.get("scooter_id")
    duration_hours = data.get("duration_hours")
    start_location = str(data.get("start_location", "Unknown location")).strip()

    if not scooter_id:
        return jsonify({"message": "scooter_id is required."}), 400

    try:
        duration_hours = int(duration_hours)
    except (TypeError, ValueError):
        return jsonify({"message": "duration_hours must be an integer."}), 400

    if duration_hours <= 0:
        return jsonify({"message": "duration_hours must be greater than 0."}), 400

    scooter = Scooter.query.get(scooter_id)
    if scooter is None:
        return jsonify({"message": "Scooter not found."}), 404

    if scooter.status == "in-use":
        return jsonify({"message": "This scooter is already in use."}), 400

    quote = calculate_quote(duration_hours)

    booking = Booking(
        user_id=user_id,
        scooter_id=scooter.id,
        start_time=datetime.utcnow(),
        start_location=start_location,
        battery_start=scooter.current_battery,
        duration_hours=duration_hours,
        duration_minutes=duration_hours * 60,
        price_per_hour=quote["price_per_hour"],
        discount_rate=quote["discount_rate"],
        discount_amount=quote["discount_amount"],
        deposit_amount=quote["deposit"],
        total_amount=quote["total_amount"],
        cost=quote["final_rental_price"],
        booking_type="scheduled",
        payment_status="unpaid",
        status="pending_payment",
    )

    db.session.add(booking)
    db.session.commit()

    return jsonify({
        "message": "Booking created successfully.",
        "booking": booking.to_dict(),
    }), 201


@bookings_bp.route("/<int:booking_id>/confirmation", methods=["GET"])
@jwt_required()
def booking_confirmation(booking_id: int):
    user_id = int(get_jwt_identity())

    booking = Booking.query.filter_by(id=booking_id, user_id=user_id).first()
    if booking is None:
        return jsonify({"message": "Booking not found."}), 404

    return jsonify({
        "booking": booking.to_dict()
    }), 200


@bookings_bp.route("/<int:booking_id>/end", methods=["POST"])
@jwt_required()
def end_booking(booking_id: int):
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    booking = Booking.query.filter_by(id=booking_id, user_id=user_id).first()
    if booking is None:
        return jsonify({"message": "Booking not found."}), 404

    if booking.status != "ongoing":
        return jsonify({"message": "This booking is not ongoing."}), 400

    end_location = str(data.get("end_location", "")).strip()
    distance_km = data.get("distance_km", 0)
    battery_end = data.get("battery_end")
    route = data.get("route", [])

    try:
        distance_km = float(distance_km)
    except ValueError:
        return jsonify({"message": "distance_km must be numeric."}), 400

    if battery_end is not None:
        try:
            battery_end = int(battery_end)
        except ValueError:
            return jsonify({"message": "battery_end must be an integer."}), 400

    booking.end_time = datetime.utcnow()
    booking.end_location = end_location or booking.end_location
    booking.distance_km = distance_km
    booking.battery_end = battery_end
    booking.route_json = route
    booking.status = "completed"

    duration_seconds = (booking.end_time - booking.start_time).total_seconds()
    booking.duration_minutes = max(1, int(duration_seconds // 60))

    base_fee = 2.0
    per_minute_fee = 0.2
    booking.cost = round(base_fee + booking.duration_minutes * per_minute_fee, 2)

    scooter = Scooter.query.get(booking.scooter_id)
    if scooter:
        scooter.current_battery = battery_end if battery_end is not None else scooter.current_battery
        scooter.current_location = booking.end_location
        scooter.status = "low-battery" if scooter.current_battery < 30 else "available"

    db.session.commit()

    return jsonify({
        "message": "Trip ended successfully.",
        "booking": booking.to_dict(),
    }), 200