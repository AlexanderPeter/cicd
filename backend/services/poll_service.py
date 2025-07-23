import secrets
import string
import traceback

from datetime import datetime
from flask import jsonify

from generated.models import Poll, Slot
from persistence.database import get_session


def create_poll_logic(request):
    session = get_session()
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


def generate_unique_code(length=8):
    session = get_session()
    alphabet = string.ascii_letters + string.digits
    while True:
        code = ''.join(secrets.choice(alphabet) for _ in range(length))
        if not session.query(Poll).filter_by(code=code).first():
            return code


def get_poll_by_code_logic(code):
    session = get_session()
    result = (
        session.query(Poll, Slot)
        .join(Slot, Poll.id == Slot.poll_id)
        .filter(Poll.code == code)
        .all()
    )

    if not result:
        return jsonify({"error": "Poll not found"}), 404

    db_poll = result[0][0]
    db_slots = [row[1] for row in result]

    return (
        jsonify(
            {
                "poll": {
                    "id": db_poll.id,
                    "title": db_poll.title,
                    "code": db_poll.code,
                    "slots": [
                        {
                            "id": slot.id,
                            "start": slot.start_time.isoformat(),
                            "end": slot.end_time.isoformat(),
                        }
                        for slot in db_slots
                    ],
                }
            }
        ),
        200,
    )
