from flask import Flask, jsonify, send_from_directory
import json
from backend.scrape import scrape_substack_archive

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
    return send_from_directory(app.static_folder, path)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
