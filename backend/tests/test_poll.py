def test_create_poll(client):
    payload = {
        "title": "Test Poll",
        "slots": [
            {"start": "2025-07-24T10:00:00", "end": "2025-07-24T11:00:00"},
            {"start": "2025-07-24T12:00:00", "end": "2025-07-24T13:00:00"},
        ],
    }

    response = client.post("/api/polls", json=payload)
    assert response.status_code == 201
    data = response.get_json()
    assert "poll" in data
    assert data["poll"]["title"] == "Test Poll"
