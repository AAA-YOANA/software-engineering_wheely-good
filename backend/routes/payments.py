import uuid

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from extensions import db
from models import Booking, Payment, Scooter

payments_bp = Blueprint("payments", __name__, url_prefix="/api/payments")


@payments_bp.route("/pay", methods=["POST"])
@jwt_required()
def pay_booking():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    booking_id = data.get("booking_id")
    payment_method = str(data.get("payment_method", "")).strip().lower()

    if not booking_id:
        return jsonify({"message": "booking_id is required."}), 400

    if payment_method not in {"wechat", "alipay", "card"}:
        return jsonify({"message": "Invalid payment method."}), 400

    booking = Booking.query.filter_by(id=booking_id, user_id=user_id).first()
    if booking is None:
        return jsonify({"message": "Booking not found."}), 404

    if booking.payment_status == "paid":
        return jsonify({"message": "This booking has already been paid."}), 400

    payment = Payment(
        booking_id=booking.id,
        user_id=user_id,
        payment_method=payment_method,
        amount=booking.total_amount,
        status="paid",
        transaction_ref=f"TXN-{uuid.uuid4().hex[:12].upper()}",
    )

    booking.payment_status = "paid"
    booking.status = "confirmed"

    scooter = Scooter.query.get(booking.scooter_id)
    if scooter:
        scooter.status = "in-use"

    db.session.add(payment)
    db.session.commit()

    return jsonify({
        "message": "Payment successful.",
        "payment": payment.to_dict(),
        "booking": booking.to_dict(),
    }), 200