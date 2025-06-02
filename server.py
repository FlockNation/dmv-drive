from flask import Flask, jsonify
import requests

app = Flask(__name__)

SUBSTACK_API = "https://dmvdrive.substack.com/api/v1/posts?limit=20"

@app.route('/api/posts')
def get_posts():
    resp = requests.get(SUBSTACK_API)
    if resp.status_code == 200:
        return jsonify(resp.json())
    else:
        return jsonify({"error": "Failed to fetch posts"}), 502

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
