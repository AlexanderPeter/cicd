import os
import secrets
import string

from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()
Base = declarative_base()
engine = create_engine(os.getenv("DATABASE_URL"))
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()

from generated.models import Poll

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
    data = request.get_json()
    title = data.get('title')

    if not title or title.strip() == "":
        return jsonify({"error": "Missing title"}), 400

    code = generate_unique_code()
    poll = Poll(title=title.strip(), code=code)

    try:
        session.add(poll)
        session.commit()
        return jsonify({
            'message': 'Poll created successfully',
            'poll': {
                'id': poll.id,
                'title': poll.title,
                "code": poll.code
            }
        }), 201
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

if __name__ == '__main__':
    app.run(debug=True)
