from flask import jsonify

from generated.models import Vote, Slot
from persistence.database import get_session


def get_votes_by_poll_logic(request):
    session = get_session()
    poll_id = request.args.get('poll_id')

    if not poll_id:
        return jsonify({'error': 'poll_id is required'}), 400

    db_votes = (
        session.query(Vote)
        .join(Slot, Vote.slot_id == Slot.id)
        .filter(Slot.poll_id == poll_id)
        .all()
    )

    votes_data = [
        {'slot_id': vote.slot_id, 'participant': vote.participant_name, 'choice': vote.choice}
        for vote in db_votes
    ]

    return jsonify(votes_data), 200


def save_vote_logic(request):
    session = get_session()
    data = request.json
    participant = data.get('participant')
    votes = data.get('votes')

    if not participant or not isinstance(votes, list):
        return jsonify({'error': 'Invalid payload'}), 400

    for vote in votes:
        slot_id = vote['slot_id']
        choice = vote['choice']

        existing_vote = (
            session.query(Vote).filter_by(slot_id=slot_id, participant_name=participant).first()
        )

        if existing_vote:
            existing_vote.choice = choice
        else:
            new_vote = Vote(slot_id=slot_id, participant_name=participant, choice=choice)
            session.add(new_vote)

    session.commit()
    return jsonify({'message': 'Votes saved/updated successfully'}), 201
