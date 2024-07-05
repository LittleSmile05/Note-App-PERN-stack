document.addEventListener('DOMContentLoaded', () => {
  const noteForm = document.getElementById('noteForm');
  const notesList = document.getElementById('notesList');
  const colors = ['#DBB5FF', '#C6FFB5', '#FFD1F8', '#D1EBFF'];

  noteForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        loadNotes();
        noteForm.reset();
      } else {
        console.error('Error adding note');
      }
    } catch (error) {
      console.error('Error adding note', error);
    }
  });

  notesList.addEventListener('click', async (event) => {
    if (event.target.tagName === 'BUTTON') {
      const noteId = event.target.dataset.id;

      try {
        const response = await fetch(`/api/notes/${noteId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          loadNotes();
        } else {
          console.error('Error deleting note');
        }
      } catch (error) {
        console.error('Error deleting note', error);
      }
    }
  });

  async function loadNotes() {
    try {
      const response = await fetch('/api/notes');
      const notes = await response.json();

      notesList.innerHTML = '';
      notes.forEach((note, index) => {
        const listItem = document.createElement('li');
        const colorIndex = index % 4; // Get the color index in a cyclic manner
        listItem.style.backgroundColor = colors[colorIndex];

        if (note.content.length > 50) {
          // If content length is greater than 50, apply specific style
          listItem.classList.add('long-text-note');
        }

        listItem.innerHTML = `
          <strong>${note.title}:</strong> ${note.content}
          <button data-id="${note.id}">Delete</button>
        `;
        notesList.appendChild(listItem);

        // Check if it's the fourth note, then start a new column
        if ((index + 1) % 4 === 0) {
          const breakElement = document.createElement('br');
          notesList.appendChild(breakElement);
        }
      });
    } catch (error) {
      console.error('Error loading notes', error);
    }
  }

  loadNotes();
});
