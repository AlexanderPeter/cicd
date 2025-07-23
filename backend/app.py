# TODO: consider import logging

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

    return app


if __name__ == "__main__":
    flask_app = create_app()
    flask_app.run(debug=True)
