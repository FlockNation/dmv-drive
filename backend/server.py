from flask import Flask, jsonify, send_from_directory, abort
import json
from backend.scrape import scrape_substack_archive
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # backend folder
POSTS_FILE = os.path.join(BASE_DIR, "posts.json")
FRONTEND_DIR = os.path.join(BASE_DIR, '..', 'frontend')

app = Flask(__name__, static_folder=FRONTEND_DIR)

@app.route("/api/posts")
def get_posts():
    try:
        with open(POSTS_FILE, "r") as f:
            posts = json.load(f)
        return jsonify(posts)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/scrape")
def trigger_scrape():
    scrape_substack_archive()
    return jsonify({"status": "scraped"}), 200

@app.route('/')
def serve_frontend():
    try:
        return send_from_directory(app.static_folder, 'index.html')
    except Exception as e:
        return f"Error serving index.html: {e}", 500

@app.route('/<path:path>')
def serve_static(path):
    if '..' in path or path.startswith('/'):
        abort(404)
    full_path = os.path.join(app.static_folder, path)
    if os.path.exists(full_path):
        return send_from_directory(app.static_folder, path)
    else:
        abort(404)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
