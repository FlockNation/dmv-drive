const LOCAL_API = '/api/posts';
const LOCAL_NOTES_API = '/api/notes';

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

async function fetchNotes() {
  try {
    const response = await fetch(LOCAL_NOTES_API);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    const notes = data.notes?.items || [];
    notes.sort((a, b) => {
      const dateA = new Date(a.comment?.date || a.context?.timestamp || 0);
      const dateB = new Date(b.comment?.date || b.context?.timestamp || 0);
      return dateB - dateA;
    });
    displayNotes(notes);
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    const notesTab = document.getElementById('notes-tab');
    if (notesTab) {
      notesTab.innerHTML = `<section><h2>Notes</h2><p>Failed to load notes.</p></section>`;
    }
  }
}

function displayNotes(notes) {
  const notesTab = document.getElementById('notes-tab');
  if (!notesTab) return;
  if (!notes.length) {
    notesTab.innerHTML = `<section><h2>Notes</h2><p>No notes available.</p></section>`;
    return;
  }

  let html = `<section><h2>Notes</h2><div class="notes-list">`;
  notes.forEach(item => {
    if (item.type === 'comment' && item.comment) {
      const noteUser = item.comment.name || 'Unknown user';
      const noteDate = item.comment.date
        ? new Date(item.comment.date).toLocaleString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })
        : 'Unknown date';
      const noteBody = item.comment.body || '';
      const photoUrl = item.comment.photo_url || 'images/default.png';
      html += `
        <div class="note-card">
          <div class="note-header">
            <img src="${photoUrl}" alt="${noteUser}" class="note-avatar" onerror="this.src='images/default.png'">
            <span class="note-user">${noteUser}</span>
            <span class="note-date">${noteDate}</span>
          </div>
          <div class="note-body">${noteBody}</div>
        </div>
      `;
    }
  });
  html += `</div></section>`;
  notesTab.innerHTML = html;
}

window.addEventListener('DOMContentLoaded', () => {
  fetchPosts();
  fetchNotes();
});
