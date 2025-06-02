from flask import Flask, jsonify
import json
from scrape import scrape_substack_archive

app = Flask(__name__)

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

if __name__ == "__main__":
    app.run(debug=True, port=5000)
