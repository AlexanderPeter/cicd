from flask import Flask
from flask_cors import CORS
from routes.poll_routes import poll_bp
from routes.vote_routes import vote_bp


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(poll_bp)
    app.register_blueprint(vote_bp)

    @app.route("/")
    def index():
        return "API is running"

    @app.route("/health")
    def health():
        return {"status": "ok"}, 200

    return app


if __name__ == "__main__":
    import logging

    logging.basicConfig(level=logging.DEBUG)
    flask_app = create_app()
    flask_app.run(debug=True, host="0.0.0.0", port=5000)
