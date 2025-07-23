from datetime import datetime
from generated.models import Poll, Slot, Vote


def init_test_data(db_session):
    poll = Poll(title="Test Poll", code="ABC123")
    db_session.add(poll)
    db_session.commit()

    slot = Slot(
        start_time=datetime(2025, 7, 24, 10, 0),
        end_time=datetime(2025, 7, 24, 11, 0),
        poll_id=poll.id,
    )
    db_session.add(slot)
    db_session.commit()

    return poll.id, slot.id


def test_post_vote(client, db_session):
    _, slot_id = init_test_data(db_session)

    payload = {"participant": "Peter", "votes": [{"slot_id": slot_id, "choice": "yes"}]}

    response = client.post("/api/votes", json=payload)

    assert response.status_code == 201

    data = response.get_json()
    assert isinstance(data, dict)

    assert "message" in data
    assert data["message"] == "Votes saved/updated successfully"


def test_get_votes_by_poll(client, db_session):
    poll_id, slot_id = init_test_data(db_session)

    vote = Vote(slot_id=slot_id, participant_name="Peter", choice="yes")
    db_session.add(vote)
    db_session.commit()

    response = client.get(f"/api/votes?poll_id={poll_id}")
    assert response.status_code == 200

    votes = response.get_json()
    assert isinstance(votes, list)
    assert len(votes) == 1

    vote_data = votes[0]
    assert vote_data["slot_id"] == slot_id
    assert vote_data["participant"] == "Peter"
    assert vote_data["choice"] == "yes"
