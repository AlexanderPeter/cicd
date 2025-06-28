from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return "API is running"

@app.route('/api/polls', methods=['POST'])
def create_poll():
    data = request.get_json()
    title = data.get('title')

    if not title or title.strip() == "":
        return jsonify({'error': 'Poll title is required'}), 400

    return jsonify({
        'message': 'Poll created successfully',
        'poll': {
            'title': title.strip()
        }
    }), 201

if __name__ == '__main__':
    app.run(debug=True)
