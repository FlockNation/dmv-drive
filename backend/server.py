from flask import Flask, jsonify, send_from_directory, abort
import json
from backend.scrape import scrape_substack_archive
import os

app = Flask(__name__, static_folder='frontend')

@app.route("/api/posts")
def get_posts():
    try:
        with open("backend/posts.json", "r") as f:
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
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    # Secure serving of static files
    if '..' in path or path.startswith('/'):
        abort(404)
    file_path = os.path.join(app.static_folder, path)
    if os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    else:
        abort(404)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
