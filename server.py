from flask import Flask, jsonify, send_from_directory
import requests
import os

app = Flask(__name__, static_folder='static')

SUBSTACK_API_POSTS = "https://dmvdrive.substack.com/api/v1/posts?limit=50"
SUBSTACK_API_NOTES = "https://dmvdrive.substack.com/api/v1/notes?limit=50"

@app.route('/api/posts')
def get_posts():
    resp = requests.get(SUBSTACK_API_POSTS)
    if resp.status_code == 200:
        posts = resp.json()
        return jsonify({"posts": posts}) 
    else:
        return jsonify({"error": "Failed to fetch posts"}), 502

@app.route('/api/notes')
def get_notes():
    resp = requests.get(SUBSTACK_API_NOTES)
    if resp.status_code == 200:
        notes = resp.json()
        return jsonify({"notes": notes}) 
    else:
        return jsonify({"error": "Failed to fetch notes"}), 502

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
