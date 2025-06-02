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
  const collaborationsContainer = document.getElementById('collaborations-container');

  if (posts.length === 0) {
    featuredContainer.innerHTML = '<p>No posts available.</p>';
    if (collaborationsContainer) {
      collaborationsContainer.innerHTML = '<p>No collaborations yet.</p>';
    }
    return;
  }

  // Collaboration logic: a post is a collaboration if there are multiple authors or the title/description mentions "Collab"
  const isCollaboration = post => {
    // Try to support both possible field names for bylines
    const bylines = post.publishedBylines || post.authors || [];
    // If there are more than one author/byline, it's a collab
    if (Array.isArray(bylines) && bylines.length > 1) return true;
    // Otherwise, check for collab/collaboration in title or subtitle
    const lowerTitle = (post.title || '').toLowerCase();
    const lowerSubtitle = (post.subtitle || '').toLowerCase();
    return lowerTitle.includes('collab') || lowerTitle.includes('collaboration') ||
           lowerSubtitle.includes('collab') || lowerSubtitle.includes('collaboration');
  };

  const featuredPost = posts[0];
  const latestPosts = posts.slice(0, 5);
  const archivePosts = posts;

  // Collaboration posts
  const collaborationPosts = posts.filter(isCollaboration);

  featuredContainer.innerHTML = generatePostHTML(featuredPost, true);
  latestContainer.innerHTML = '';
  archiveContainer.innerHTML = '';
  if (collaborationsContainer) collaborationsContainer.innerHTML = '';

  latestPosts.forEach(post => {
    latestContainer.innerHTML += generatePostHTML(post, false);
  });

  archivePosts.forEach(post => {
    archiveContainer.innerHTML += generatePostHTML(post, false);
  });

  // Render collaborations if section exists
  if (collaborationsContainer) {
    if (collaborationPosts.length === 0) {
      collaborationsContainer.innerHTML = '<p>No collaborations yet.</p>';
    } else {
      collaborationPosts.forEach(post => {
        collaborationsContainer.innerHTML += generatePostHTML(post, false);
      });
    }
  }
}

function generatePostHTML(post, isFeatured) {
  const imageUrl = post.cover_image || post.cover_photo_url || 'images/default.png';
  const date = post.post_date || post.content_date
    ? new Date(post.post_date || post.content_date).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric'
      })
    : 'Unknown date';
  let author = 'Unknown author';
  if (post.publishedBylines && post.publishedBylines.length > 0) {
    author = post.publishedBylines.map(a => a.name).join(', ');
  } else if (post.authors && post.authors.length > 0) {
    author = Array.isArray(post.authors)
      ? post.authors.join(', ')
      : post.authors;
  }

  return `
    <a class="post-card" href="${post.canonical_url || post.web_url || '#'}" target="_blank" rel="noopener noreferrer">
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
