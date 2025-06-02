fetch('http://localhost:5000/api/posts')
  .then(response => response.json())
  .then(posts => {
    if (!posts || posts.length === 0) {
      console.error("No posts found");
      return;
    }
    const featuredContainer = document.getElementById('featured-container');
    const latestContainer = document.getElementById('latest-container');
    const archiveContainer = document.getElementById('archive-container');

    const featuredPost = posts[0];
    const latestPosts = posts.slice(0, 5);
    const archivePosts = posts.slice(0);

    if (featuredPost) {
      featuredContainer.innerHTML = generatePostHTML(featuredPost, true);
    }

    latestPosts.forEach(post => {
      latestContainer.innerHTML += generatePostHTML(post, false);
    });

    archivePosts.forEach(post => {
      archiveContainer.innerHTML += generatePostHTML(post, false);
    });
  })
  .catch(error => {
    console.error("Failed to fetch posts:", error);
  });

function generatePostHTML(post, isFeatured) {
  const imageUrl = post.image || extractImageFromContent(post.description || '') || 'images/default.png';

  function formatDate(dateStr) {
    if (!dateStr) return 'Unknown date';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  const postUrl = post.link || '#';
  const descriptionText = stripHTML(post.description || '');

  return `
    <a class="post-card" href="${postUrl}" target="_blank" rel="noopener noreferrer">
      <div class="post-image">
        <img src="${imageUrl}" alt="${post.title || 'Post image'}" onerror="this.src='images/default.png'">
      </div>
      <div class="post-content">
        <div class="post-title">${post.title || 'No Title'}</div>
        <div class="post-description">${descriptionText}</div>
        <div class="post-meta">${formatDate(post.pubDate)}${post.author ? ' • ' + post.author : ''}</div>
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
