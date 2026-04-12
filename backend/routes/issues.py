from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from extensions import db
from models import Issue, Booking, Scooter

issues_bp = Blueprint("issues", __name__, url_prefix="/api/issues")


@issues_bp.route("", methods=["POST"])
@jwt_required()
def create_issue():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    issue_type = data.get("type")
    description = str(data.get("description", "")).strip()
    images = data.get("images", [])

    if not issue_type:
        return jsonify({"message": "type is required"}), 400

    if not description:
        return jsonify({"message": "description is required"}), 400

    # 这里简化：随便关联一个booking（你后面可以改）
    booking = Booking.query.filter_by(user_id=user_id).first()
    scooter = Scooter.query.first()

    issue = Issue(
        user_id=user_id,
        trip_id=booking.id if booking else 1,
        scooter_id=scooter.id if scooter else 1,
        issue_type=issue_type,
        description=description,
        priority="low",
        status="open",
    )

    db.session.add(issue)
    db.session.commit()

    return jsonify({
        "message": "Feedback submitted successfully",
        "issue": issue.to_dict()
    }), 201


@issues_bp.route("", methods=["GET"])
@jwt_required()
def get_issues():
    user_id = int(get_jwt_identity())

    issues = Issue.query.filter_by(user_id=user_id).order_by(Issue.created_at.desc()).all()

    result = []
    for issue in issues:
        result.append({
            "id": str(issue.id),
            "type": issue.issue_type,
            "typeLabel": issue.issue_type,
            "description": issue.description,
            "images": [],  # 后续可接入OSS
            "status": map_status(issue.status),
            "createdAt": issue.created_at.isoformat(),
            "replies": []  # 后面可扩展
        })

    return jsonify({"feedbacks": result}), 200


def map_status(status: str):
    mapping = {
        "open": "pending",
        "processing": "processing",
        "resolved": "resolved"
    }
    return mapping.get(status, "pending")