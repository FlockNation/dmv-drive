fetch('https://api.rss2json.com/v1/api.json?rss_url=https://dmvdrive.substack.com/feed')
  .then(response => response.json())
  .then(data => {
    const posts = data.items;
    const featuredContainer = document.getElementById('featured-container');
    const latestContainer = document.getElementById('latest-container');

   
    const featuredPost = posts[0];
    const latestPosts = posts.slice(1, 5);

    if (featuredPost) {
      featuredContainer.innerHTML = generatePostHTML(featuredPost, true);
    }

    latestPosts.forEach(post => {
      latestContainer.innerHTML += generatePostHTML(post, false);
    });
  })
  .catch(error => {
    console.error("Failed to fetch Substack feed:", error);
  });

function generatePostHTML(post, isFeatured) {
  const imageUrl = post.image || extractImageFromContent(post.content) || 'images/default.png';

  return `
    <a class="post-card" href="${post.url}" target="_blank">
      <div class="post-image">
        <img src="${imageUrl}" alt="${post.title}" onerror="this.src='images/default.png'">
      </div>
      <div class="post-content">
        <div class="post-title">${post.title}</div>
        <div class="post-description">${post.description}</div>
        <div class="post-meta">${post.date} • ${post.author}</div>
      </div>
    </a>
  `;
}

function stripHTML(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

function extractImageFromContent(htmlContent) {
  const div = document.createElement('div');
  div.innerHTML = htmlContent;
  const img = div.querySelector('img');
  return img ? img.src : null;
}
