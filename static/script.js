const LOCAL_API = '/api/posts';

async function fetchPosts() {
  try {
    const response = await fetch(LOCAL_API);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    displayPosts(data.posts || []);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  }
}

function displayPosts(posts) {
  const featuredContainer = document.getElementById('featured-container');
  const latestContainer = document.getElementById('latest-container');
  const archiveContainer = document.getElementById('archive-container');

  if (posts.length === 0) {
    featuredContainer.innerHTML = '<p>No posts available.</p>';
    return;
  }

  const featuredPost = posts[0];
  const latestPosts = posts.slice(0, 5);
  const archivePosts = posts;

  featuredContainer.innerHTML = generatePostHTML(featuredPost, true);
  latestContainer.innerHTML = '';
  archiveContainer.innerHTML = '';

  latestPosts.forEach(post => {
    latestContainer.innerHTML += generatePostHTML(post, false);
  });

  archivePosts.forEach(post => {
    archiveContainer.innerHTML += generatePostHTML(post, false);
  });
}

function generatePostHTML(post, isFeatured) {
  const imageUrl = post.cover_image || 'images/default.png';
  const date = post.post_date ? new Date(post.post_date).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  }) : 'Unknown date';
  const author = (post.publishedBylines && post.publishedBylines.length > 0)
    ? post.publishedBylines[0].name
    : 'Unknown author';

  return `
    <a class="post-card" href="${post.canonical_url}" target="_blank" rel="noopener noreferrer">
      <div class="post-image">
        <img src="${imageUrl}" alt="${post.title}" onerror="this.src='images/default.png'">
      </div>
      <div class="post-content">
        <div class="post-title">${post.title || 'Untitled'}</div>
        <div class="post-description">${post.subtitle || ''}</div>
        <div class="post-meta">${date} | ${author}</div>
      </div>
    </a>
  `;
}

window.addEventListener('DOMContentLoaded', fetchPosts);
