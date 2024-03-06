require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/api/notes', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM notes');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching notes', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/notes', async (req, res) => {
  const { title, content } = req.body;

  try {
    await pool.query('INSERT INTO notes (title, content) VALUES ($1, $2)', [title, content]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error creating note', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/notes/:id', async (req, res) => {
    const noteId = req.params.id;
  
    try {
      await pool.query('DELETE FROM notes WHERE id = $1', [noteId]);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting note', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
