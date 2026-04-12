from flask import Flask, jsonify

from config import Config
from extensions import cors, db, jwt
from routes import (
    auth_bp,
    trips_bp,
    issues_bp,
    profile_bp,
    payment_methods_bp,
    scooters_bp,
    bookings_bp,
    payments_bp,
)


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=False,
    )

    app.register_blueprint(auth_bp)
    app.register_blueprint(trips_bp)
    app.register_blueprint(issues_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(payment_methods_bp)
    app.register_blueprint(scooters_bp)
    app.register_blueprint(bookings_bp)
    app.register_blueprint(payments_bp)

    @app.route("/")
    def home():
        return jsonify({"message": "WheelyGood backend is running."})

    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"message": "Route not found."}), 404

    @app.errorhandler(500)
    def server_error(_error):
        return jsonify({"message": "Internal server error."}), 500

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)