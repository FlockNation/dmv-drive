import requests
import json
import os

def scrape_substack_archive(limit=50, offset=0):
    url = f"https://dmvdrive.substack.com/api/v1/posts/?limit={limit}&offset={offset}"
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()

    posts = []
    for post in data.get('posts', []):
        posts.append({
            "title": post.get("title"),
            "link": post.get("postUrl"),
            "pubDate": post.get("publishedAt"),
            "description": post.get("previewContent"),
            "author": post.get("author", {}).get("name"),
            "image": post.get("imageUrl"),
        })

    # Make sure backend folder exists
    os.makedirs("backend", exist_ok=True)
    with open("backend/posts.json", "w") as f:
        json.dump(posts, f, indent=2)

if __name__ == "__main__":
    scrape_substack_archive()
