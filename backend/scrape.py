import requests
from bs4 import BeautifulSoup
import json

def scrape_substack_archive():
    url = "https://dmvdrive.substack.com/archive"
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; YourBot/1.0; +https://yourdomain.com/bot)"
    }
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"Failed to fetch {url}: Status code {response.status_code}")
        return

    soup = BeautifulSoup(response.text, "html.parser")
    posts = []

    for post_link in soup.select("a[href^='/p/']"):
        title = post_link.get_text(strip=True)
        href = post_link['href']
        full_url = f"https://dmvdrive.substack.com{href}"

        date_element = post_link.find_next("time")
        date = date_element['datetime'] if date_element else "Unknown"

        excerpt_element = post_link.find_next("div", class_="post-excerpt")
        excerpt = excerpt_element.get_text(strip=True) if excerpt_element else ""

        posts.append({
            "title": title,
            "url": full_url,
            "pubDate": date,
            "excerpt": excerpt
        })

    with open("backend/posts.json", "w") as f:
        json.dump(posts, f, indent=2)

    print(f"Scraped {len(posts)} posts from {url}")

if __name__ == "__main__":
    scrape_substack_archive()
