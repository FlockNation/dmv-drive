fetch('posts.json')
  .then(res => res.json())
  .then(posts => {
    const featuredContainer = document.getElementById('featured-container');
    const latestContainer = document.getElementById('latest-container');

    posts.forEach(post => {
      const card = document.createElement('a');
      card.className = 'post-card';
      card.href = post.link;
      card.target = '_blank';
      card.innerHTML = `
        <div class="post-image">
          <img src="${post.image}" alt="${post.title}">
        </div>
        <div class="post-content">
          <h2 class="post-title">${post.title}</h2>
          <p class="post-description">${post.description}</p>
          <p class="post-meta">${post.date} • ${post.author}</p>
        </div>
      `;

      if (post.featured) {
        featuredContainer.appendChild(card);
      } else {
        latestContainer.appendChild(card);
      }
    });
  });
