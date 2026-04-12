from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from extensions import db
from models import PaymentMethod

payment_methods_bp = Blueprint(
    "payment_methods",
    __name__,
    url_prefix="/api/payment-methods"
)


@payment_methods_bp.route("", methods=["GET"])
@jwt_required()
def get_payment_methods():
    user_id = int(get_jwt_identity())

    methods = (
        PaymentMethod.query
        .filter_by(user_id=user_id)
        .order_by(PaymentMethod.is_default.desc(), PaymentMethod.created_at.desc())
        .all()
    )

    return jsonify({
        "payment_methods": [method.to_dict() for method in methods]
    }), 200


@payment_methods_bp.route("", methods=["POST"])
@jwt_required()
def add_payment_method():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    method_type = str(data.get("type", "")).strip().lower()
    last4 = str(data.get("last4", "")).strip()
    expiry_date = str(data.get("expiryDate", "")).strip() or None
    holder_name = str(data.get("holderName", "")).strip() or None
    is_default = bool(data.get("isDefault", False))

    if method_type not in {"visa", "mastercard", "alipay", "wechat"}:
        return jsonify({"message": "Invalid payment method type."}), 400

    if not last4 or len(last4) > 10:
        return jsonify({"message": "Invalid last4 value."}), 400

    if is_default:
        PaymentMethod.query.filter_by(user_id=user_id, is_default=True).update(
            {"is_default": False}
        )

    elif PaymentMethod.query.filter_by(user_id=user_id).count() == 0:
        is_default = True

    payment_method = PaymentMethod(
        user_id=user_id,
        method_type=method_type,
        last4=last4,
        expiry_date=expiry_date,
        holder_name=holder_name,
        is_default=is_default
    )

    db.session.add(payment_method)
    db.session.commit()

    return jsonify({
        "message": "Payment method added successfully.",
        "payment_method": payment_method.to_dict()
    }), 201


@payment_methods_bp.route("/<int:method_id>/default", methods=["PUT"])
@jwt_required()
def set_default_payment_method(method_id: int):
    user_id = int(get_jwt_identity())

    method = PaymentMethod.query.filter_by(id=method_id, user_id=user_id).first()
    if method is None:
        return jsonify({"message": "Payment method not found."}), 404

    PaymentMethod.query.filter_by(user_id=user_id, is_default=True).update(
        {"is_default": False}
    )
    method.is_default = True
    db.session.commit()

    return jsonify({
        "message": "Default payment method updated.",
        "payment_method": method.to_dict()
    }), 200


@payment_methods_bp.route("/<int:method_id>", methods=["DELETE"])
@jwt_required()
def delete_payment_method(method_id: int):
    user_id = int(get_jwt_identity())

    method = PaymentMethod.query.filter_by(id=method_id, user_id=user_id).first()
    if method is None:
        return jsonify({"message": "Payment method not found."}), 404

    was_default = method.is_default
    db.session.delete(method)
    db.session.commit()

    if was_default:
        next_method = (
            PaymentMethod.query
            .filter_by(user_id=user_id)
            .order_by(PaymentMethod.created_at.asc())
            .first()
        )
        if next_method:
            next_method.is_default = True
            db.session.commit()

    return jsonify({"message": "Payment method deleted successfully."}), 200