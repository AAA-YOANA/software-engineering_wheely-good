from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

from extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False, default="customer")

    phone = db.Column(db.String(50))
    address = db.Column(db.String(255))
    avatar_url = db.Column(db.String(500))
    mileage_goal = db.Column(db.Numeric(10, 2), default=1000.00)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    bookings = db.relationship("Booking", backref="user", lazy=True)
    issues = db.relationship("Issue", backref="user", lazy=True)
    payment_methods = db.relationship("PaymentMethod", backref="user", lazy=True)
    settings = db.relationship("UserSettings", backref="user", uselist=False, lazy=True)

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "phone": self.phone,
            "address": self.address,
            "avatar_url": self.avatar_url,
            "mileage_goal": float(self.mileage_goal or 0),
            "created_at": self.created_at.isoformat(),
        }


class Scooter(db.Model):
    __tablename__ = "scooters"

    id = db.Column(db.Integer, primary_key=True)
    scooter_code = db.Column(db.String(50), nullable=False, unique=True)
    name = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(500))
    current_battery = db.Column(db.Integer, default=100)
    status = db.Column(db.String(50), nullable=False, default="available")
    current_location = db.Column(db.String(255))
    latitude = db.Column(db.Numeric(10, 7))
    longitude = db.Column(db.Numeric(10, 7))
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    bookings = db.relationship("Booking", backref="scooter", lazy=True)
    issues = db.relationship("Issue", backref="scooter", lazy=True)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "scooter_code": self.scooter_code,
            "name": self.name,
            "image_url": self.image_url,
            "current_battery": self.current_battery,
            "status": self.status,
            "current_location": self.current_location,
            "latitude": float(self.latitude) if self.latitude is not None else None,
            "longitude": float(self.longitude) if self.longitude is not None else None,
        }


class Booking(db.Model):
    __tablename__ = "bookings"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    scooter_id = db.Column(db.Integer, db.ForeignKey("scooters.id"), nullable=False)

    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime)

    duration_minutes = db.Column(db.Integer, default=0)
    duration_hours = db.Column(db.Integer)

    distance_km = db.Column(db.Numeric(8, 2), default=0.00)
    start_location = db.Column(db.String(255), nullable=False)
    end_location = db.Column(db.String(255))

    battery_start = db.Column(db.Integer)
    battery_end = db.Column(db.Integer)

    cost = db.Column(db.Numeric(10, 2), default=0.00)
    price_per_hour = db.Column(db.Numeric(10, 2), default=0.00)
    discount_rate = db.Column(db.Numeric(5, 2), default=0.00)
    discount_amount = db.Column(db.Numeric(10, 2), default=0.00)
    deposit_amount = db.Column(db.Numeric(10, 2), default=0.00)
    total_amount = db.Column(db.Numeric(10, 2), default=0.00)

    booking_type = db.Column(db.String(50), nullable=False, default="instant")
    payment_status = db.Column(db.String(50), nullable=False, default="unpaid")
    status = db.Column(db.String(50), nullable=False, default="ongoing")

    route_json = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    issues = db.relationship("Issue", backref="trip", lazy=True)
    payments = db.relationship("Payment", backref="booking", lazy=True)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "date": self.start_time.strftime("%Y-%m-%d"),
            "time": self.start_time.strftime("%H:%M"),
            "duration_minutes": self.duration_minutes,
            "duration_hours": self.duration_hours,
            "distance_km": float(self.distance_km or 0),
            "start_location": self.start_location,
            "end_location": self.end_location,
            "battery_start": self.battery_start,
            "battery_end": self.battery_end,
            "cost": float(self.cost or 0),
            "price_per_hour": float(self.price_per_hour or 0),
            "discount_rate": float(self.discount_rate or 0),
            "discount_amount": float(self.discount_amount or 0),
            "deposit_amount": float(self.deposit_amount or 0),
            "total_amount": float(self.total_amount or 0),
            "booking_type": self.booking_type,
            "payment_status": self.payment_status,
            "status": self.status,
            "route": self.route_json or [],
            "scooter": {
                "id": self.scooter.id,
                "name": self.scooter.name,
                "image_url": self.scooter.image_url,
            },
        }


class Issue(db.Model):
    __tablename__ = "issues"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    trip_id = db.Column(db.Integer, db.ForeignKey("bookings.id"), nullable=False)
    scooter_id = db.Column(db.Integer, db.ForeignKey("scooters.id"), nullable=False)
    issue_type = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    priority = db.Column(db.String(50), nullable=False, default="low")
    status = db.Column(db.String(50), nullable=False, default="open")
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "trip_id": self.trip_id,
            "scooter_id": self.scooter_id,
            "issue_type": self.issue_type,
            "description": self.description,
            "priority": self.priority,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }


class PaymentMethod(db.Model):
    __tablename__ = "payment_methods"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    method_type = db.Column(db.String(50), nullable=False)
    last4 = db.Column(db.String(10), nullable=False)
    is_default = db.Column(db.Boolean, nullable=False, default=False)
    expiry_date = db.Column(db.String(20))
    holder_name = db.Column(db.String(120))
    provider_token = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "type": self.method_type,
            "last4": self.last4,
            "isDefault": self.is_default,
            "expiryDate": self.expiry_date,
            "holderName": self.holder_name,
        }


class UserSettings(db.Model):
    __tablename__ = "user_settings"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, unique=True)
    notifications_enabled = db.Column(db.Boolean, nullable=False, default=True)
    privacy_mode = db.Column(db.String(50), nullable=False, default="standard")
    language = db.Column(db.String(50), nullable=False, default="zh-CN")
    region = db.Column(db.String(50), nullable=False, default="CN")
    two_factor_enabled = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    def to_dict(self) -> dict:
        return {
            "notifications_enabled": self.notifications_enabled,
            "privacy_mode": self.privacy_mode,
            "language": self.language,
            "region": self.region,
            "two_factor_enabled": self.two_factor_enabled,
        }


class Payment(db.Model):
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey("bookings.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(50), nullable=False, default="paid")
    transaction_ref = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "booking_id": self.booking_id,
            "user_id": self.user_id,
            "payment_method": self.payment_method,
            "amount": float(self.amount or 0),
            "status": self.status,
            "transaction_ref": self.transaction_ref,
            "created_at": self.created_at.isoformat(),
        }