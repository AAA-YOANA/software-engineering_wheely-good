from .auth import auth_bp
from .trips import trips_bp
from .issues import issues_bp
from .profile import profile_bp
from .payment_methods import payment_methods_bp
from .scooters import scooters_bp
from .bookings import bookings_bp
from .payments import payments_bp

__all__ = [
    "auth_bp",
    "trips_bp",
    "issues_bp",
    "profile_bp",
    "payment_methods_bp",
    "scooters_bp",
    "bookings_bp",
    "payments_bp",
]