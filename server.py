from flask import Flask, jsonify, send_from_directory, request, render_template, redirect, url_for, flash
import requests
import os

app = Flask(__name__, static_folder='static', template_folder='templates')
app.secret_key = "your_secret_key"

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

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

@app.route('/collab-form.html', methods=['GET'])
def collab_form():
    return render_template('collab-form.html')

@app.route('/post-idea-form.html', methods=['GET'])
def post_idea_form():
    return render_template('post-idea-form.html')

@app.route('/application-form.html', methods=['GET'])
def application_form():
    return render_template('application-form.html')

@app.route('/submit-collab-form', methods=['POST'])
def submit_collab_form():
    name = request.form['name']
    email = request.form['email']
    organization = request.form.get('organization', '')
    message = request.form['message']
    flash("Thank you for your collaboration interest! We'll be in touch soon.")
    return redirect(url_for('collab_form'))

@app.route('/submit-post-idea-form', methods=['POST'])
def submit_post_idea_form():
    name = request.form['name']
    email = request.form['email']
    idea = request.form['idea']
    flash("Thank you for submitting your idea!")
    return redirect(url_for('post_idea_form'))

@app.route('/submit-application-form', methods=['POST'])
def submit_application_form():
    name = request.form['name']
    email = request.form['email']
    experience = request.form['experience']
    reason = request.form['reason']
    flash("Thank you for applying! We will review your application.")
    return redirect(url_for('application_form'))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
