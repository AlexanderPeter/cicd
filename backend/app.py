# import logging
import traceback
import os
import secrets
import string

from datetime import datetime
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from generated.models import Poll, Slot, Vote

load_dotenv()
Base = declarative_base()
engine = create_engine(os.getenv("DATABASE_URL"))
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()


app = Flask(__name__)
CORS(app)


def generate_unique_code(length=8):
    alphabet = string.ascii_letters + string.digits
    while True:
        code = ''.join(secrets.choice(alphabet) for _ in range(length))
        if not session.query(Poll).filter_by(code=code).first():
            return code


@app.route("/")
def index():
    return "API is running"


@app.route('/api/polls', methods=['POST'])
def create_poll():
    try:
        data = request.get_json()
        title = data.get('title')
        slots = data.get('slots', [])

        if not title or title.strip() == "":
            return jsonify({"error": "Missing title"}), 400

        code = generate_unique_code()
        db_poll = Poll(title=title.strip(), code=code)
        session.add(db_poll)
        session.commit()

        db_slots = []
        for slot in slots:
            start_time = datetime.fromisoformat(slot['start'])
            end_time = datetime.fromisoformat(slot['end'])
            db_slot = Slot(start_time=start_time, end_time=end_time, poll_id=db_poll.id)
            db_slots.append(db_slot)

        session.add_all(db_slots)
        session.commit()

        return (
            jsonify(
                {
                    'message': 'Poll created successfully',
                    'poll': {'id': db_poll.id, 'title': db_poll.title, "code": db_poll.code},
                }
            ),
            201,
        )
    except Exception:
        session.rollback()
        print("Exception occurred while creating poll:")
        traceback.print_exc()
        return jsonify({"error": "Something went wrong"}), 500
    finally:
        session.close()


@app.route("/api/polls/<code>", methods=["GET"])
def get_poll_by_code(code):
    db_poll = session.query(Poll).filter_by(code=code).first()
    if db_poll is None:
        return jsonify({"error": "Poll not found"}), 404

    db_slots = session.query(Slot).filter_by(poll_id=db_poll.id).all()
    slots = [
        {
            "id": db_slot.id,
            "start": db_slot.start_time.isoformat(),
            "end": db_slot.end_time.isoformat(),
        }
        for db_slot in db_slots
    ]

    return (
        jsonify(
            {
                "poll": {
                    "id": db_poll.id,
                    "title": db_poll.title,
                    "code": db_poll.code,
                    "slots": slots,
                }
            }
        ),
        200,
    )


@app.route('/api/votes', methods=['POST'])
def save_vote():
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


if __name__ == '__main__':
    app.run(debug=True)
