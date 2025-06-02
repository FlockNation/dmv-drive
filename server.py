from flask import Flask, jsonify, send_from_directory
import requests
import os

app = Flask(__name__, static_folder='static')

SUBSTACK_API = "https://dmvdrive.substack.com/api/v1/posts?limit=60"

@app.route('/api/posts')
def get_posts():
    resp = requests.get(SUBSTACK_API)
    if resp.status_code == 200:
        posts = resp.json()
        return jsonify({"posts": posts}) 
    else:
        return jsonify({"error": "Failed to fetch posts"}), 502

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
