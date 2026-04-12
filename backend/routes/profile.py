from datetime import datetime, timedelta

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import func

from extensions import db
from models import Booking, User

profile_bp = Blueprint("profile", __name__, url_prefix="/api/profile")


@profile_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def get_dashboard():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if user is None:
        return jsonify({"message": "User not found."}), 404

    now = datetime.utcnow()
    week_ago = now - timedelta(days=7)
    month_ago = now - timedelta(days=30)

    total_mileage = (
        db.session.query(func.sum(Booking.distance_km))
        .filter(Booking.user_id == user_id, Booking.status.in_(["completed", "ongoing"]))
        .scalar()
        or 0
    )

    weekly_km = (
        db.session.query(func.sum(Booking.distance_km))
        .filter(Booking.user_id == user_id, Booking.start_time >= week_ago)
        .scalar()
        or 0
    )

    total_minutes_30d = (
        db.session.query(func.sum(Booking.duration_minutes))
        .filter(Booking.user_id == user_id, Booking.start_time >= month_ago)
        .scalar()
        or 0
    )

    completed_orders = (
        db.session.query(func.count(Booking.id))
        .filter(Booking.user_id == user_id, Booking.status == "completed")
        .scalar()
        or 0
    )

    avg_speed = (
        db.session.query(
            func.sum(Booking.distance_km) / func.nullif(func.sum(Booking.duration_minutes) / 60.0, 0)
        )
        .filter(Booking.user_id == user_id, Booking.duration_minutes > 0)
        .scalar()
    )

    return jsonify({
        "profile": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "address": user.address,
            "avatar_url": user.avatar_url,
            "registered_at": user.created_at.isoformat(),
            "total_mileage": float(total_mileage or 0),
            "mileage_goal": float(user.mileage_goal or 0)
        },
        "stats": {
            "weekly_km": round(float(weekly_km or 0), 1),
            "total_hours_30d": round(float(total_minutes_30d or 0) / 60, 1),
            "completed_orders": int(completed_orders or 0),
            "avg_speed_kmh": round(float(avg_speed or 0), 1)
        }
    }), 200


@profile_bp.route("", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if user is None:
        return jsonify({"message": "User not found."}), 404

    data = request.get_json() or {}

    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    address = data.get("address")
    avatar_url = data.get("avatar_url")
    mileage_goal = data.get("mileage_goal")

    if name is not None:
        user.name = str(name).strip()

    if email is not None:
        user.email = str(email).strip().lower()

    if phone is not None:
        user.phone = str(phone).strip()

    if address is not None:
        user.address = str(address).strip()

    if avatar_url is not None:
        user.avatar_url = str(avatar_url).strip()

    if mileage_goal is not None:
        try:
            user.mileage_goal = float(mileage_goal)
        except ValueError:
            return jsonify({"message": "mileage_goal must be a number."}), 400

    db.session.commit()

    return jsonify({
        "message": "Profile updated successfully.",
        "user": user.to_dict()
    }), 200