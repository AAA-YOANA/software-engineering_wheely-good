import re

from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

from extensions import db
from models import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def is_valid_email(email: str) -> bool:
    pattern = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"
    return bool(re.match(pattern, email))


def is_valid_password(password: str) -> bool:
    return len(password) >= 8


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}

    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))

    if not name:
        return jsonify({"message": "Name is required."}), 400

    if not email:
        return jsonify({"message": "Email is required."}), 400

    if not is_valid_email(email):
        return jsonify({"message": "Please enter a valid email address."}), 400

    if not password:
        return jsonify({"message": "Password is required."}), 400

    if not is_valid_password(password):
        return jsonify({"message": "Password must be at least 8 characters long."}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"message": "This email is already registered."}), 409

    user = User(name=name, email=email, role="customer")
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Registration successful.",
        "user": user.to_dict(),
        "access_token": access_token
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))

    if not email:
        return jsonify({"message": "Email is required."}), 400

    if not password:
        return jsonify({"message": "Password is required."}), 400

    user = User.query.filter_by(email=email).first()
    if user is None or not user.check_password(password):
        return jsonify({"message": "Invalid email or password."}), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Login successful.",
        "user": user.to_dict(),
        "access_token": access_token
    }), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))

    if user is None:
        return jsonify({"message": "User not found."}), 404

    return jsonify({"user": user.to_dict()}), 200