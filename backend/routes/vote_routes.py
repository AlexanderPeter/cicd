from flask import Blueprint, request
from services.vote_service import get_votes_by_poll_logic, save_vote_logic

vote_bp = Blueprint('vote_routes', __name__, url_prefix='/api/votes')


@vote_bp.route("", methods=["GET"])
def get_votes_by_poll():
    return get_votes_by_poll_logic(request)


@vote_bp.route('', methods=['POST'])
def save_vote():
    return save_vote_logic(request)
