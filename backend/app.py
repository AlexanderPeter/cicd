from flask import Flask, jsonify
from sqlalchemy import text
from flask_cors import CORS
from routes.poll_routes import poll_bp
from routes.vote_routes import vote_bp
from persistence.database import get_session


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(poll_bp)
    app.register_blueprint(vote_bp)

    @app.route("/")
    def index():
        return "API is running"

    @app.route("/status")
    def status():
        return jsonify({"message": "online", "color": "green"})

    @app.route("/status_db")
    def status_db():
        try:
            session = get_session()
            session.execute(text("SELECT 1"))
            session.close()
            return jsonify({"message": "online", "color": "green"})

        except Exception:
            return jsonify({"message": "offline", "color": "red"})

    return app


if __name__ == "__main__":
    import logging

    logging.basicConfig(level=logging.DEBUG)
    flask_app = create_app()
    flask_app.run(debug=True, host="0.0.0.0", port=5000)
