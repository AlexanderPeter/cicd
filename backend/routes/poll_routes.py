from flask import Blueprint, request
from services.poll_service import create_poll_logic, get_poll_by_code_logic

poll_bp = Blueprint('poll_routes', __name__, url_prefix='/api/polls')


@poll_bp.route("", methods=["POST"])
def create_poll():
    return create_poll_logic(request)


@poll_bp.route("/<code>", methods=["GET"])
def get_poll_by_code(code):
    return get_poll_by_code_logic(code)
