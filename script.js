fetch('posts.json')
  .then(response => response.json())
  .then(posts => {
    const featuredContainer = document.getElementById('featured-container');
    const latestContainer = document.getElementById('latest-container');

    const featuredPost = posts.find(post => post.featured);
    const latestPosts = posts.filter(post => !post.featured);

    if (featuredPost) {
      featuredContainer.innerHTML = generatePostHTML(featuredPost, true);
    }

    latestPosts.forEach(post => {
      latestContainer.innerHTML += generatePostHTML(post, false);
    });
  });

function generatePostHTML(post, isFeatured) {
  return `
    <a class="post-card" href="${post.url}" target="_blank">
      <div class="post-image">
        <img src="${post.image}" alt="${post.title}" onerror="this.src='images/default.png'">
      </div>
      <div class="post-content">
        <div class="post-title">${post.title}</div>
        <div class="post-description">${post.description}</div>
        <div class="post-meta">${post.date} • ${post.author}</div>
      </div>
    </a>
  `;
}
