import requests
from bs4 import BeautifulSoup
import json

def scrape_substack_archive():
    url = "https://dmvdrive.substack.com/archive"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    posts = []

    for post in soup.select("a[href^='/p/']"):
        title = post.get_text(strip=True)
        href = post['href']
        full_url = f"https://dmvdrive.substack.com{href}"
        date_element = post.find_next("time")
        date = date_element['datetime'] if date_element else 'Unknown'

        posts.append({
            "title": title,
            "link": full_url,
            "pubDate": date
        })

    with open("backend/posts.json", "w") as f:
        json.dump(posts, f, indent=2)

if __name__ == "__main__":
    scrape_substack_archive()
