from datetime import datetime, timedelta

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import func

from extensions import db
from models import Booking

trips_bp = Blueprint("trips", __name__, url_prefix="/api/trips")


@trips_bp.route("/history", methods=["GET"])
@jwt_required()
def get_trip_history():
    user_id = int(get_jwt_identity())
    since = datetime.utcnow() - timedelta(days=30)

    bookings = (
        Booking.query
        .filter(Booking.user_id == user_id, Booking.start_time >= since)
        .order_by(Booking.start_time.desc())
        .all()
    )

    return jsonify({
        "trips": [booking.to_dict() for booking in bookings]
    }), 200


@trips_bp.route("/weekly-stats", methods=["GET"])
@jwt_required()
def get_weekly_stats():
    user_id = int(get_jwt_identity())
    today = datetime.utcnow().date()
    start_date = today - timedelta(days=6)

    results = (
        db.session.query(
            func.date(Booking.start_time).label("trip_date"),
            func.sum(Booking.duration_minutes).label("total_minutes")
        )
        .filter(
            Booking.user_id == user_id,
            func.date(Booking.start_time) >= start_date
        )
        .group_by(func.date(Booking.start_time))
        .all()
    )

    result_map = {
        str(row.trip_date): int(row.total_minutes or 0)
        for row in results
    }

    day_names = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
    weekly_data = []
    total_minutes = 0

    for i in range(7):
        current_date = start_date + timedelta(days=i)
        minutes = result_map.get(str(current_date), 0)
        total_minutes += minutes
        weekly_data.append({
            "day": day_names[current_date.weekday()],
            "minutes": minutes
        })

    return jsonify({
        "weekly_data": weekly_data,
        "total_minutes": total_minutes
    }), 200


@trips_bp.route("/<int:trip_id>/extend", methods=["POST"])
@jwt_required()
def extend_trip(trip_id: int):
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    extra_minutes = int(data.get("extra_minutes", 0))

    if extra_minutes <= 0:
        return jsonify({"message": "extra_minutes must be greater than 0."}), 400

    booking = Booking.query.filter_by(id=trip_id, user_id=user_id).first()
    if booking is None:
        return jsonify({"message": "Trip not found."}), 404

    if booking.status != "ongoing":
        return jsonify({"message": "Only ongoing trips can be extended."}), 400

    booking.duration_minutes += extra_minutes
    booking.cost = float(booking.cost or 0) + round(extra_minutes * 0.2, 2)

    db.session.commit()

    return jsonify({
        "message": "Trip extended successfully.",
        "trip": booking.to_dict()
    }), 200