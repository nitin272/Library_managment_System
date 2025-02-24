const express = require('express');
const bodyParser = require('body-parser');
const pool = require('../config/db');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Middleware for API Key Authentication
// app.use((req, res, next) => {
//   const apiKey = req.headers['api-key'];
//   if (!apiKey || apiKey !== process.env.API_KEY) {
//     return res.status(403).json({ message: 'Unauthorized' });
//   }
//   next();
// });

// CRUD Operations

// Get all books
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM book');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get book by ID
app.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM book WHERE book_id = $1', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new book
app.post('/', async (req, res) => {
  const { book_image,book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher } = req.body;
  try {
    await pool.query('INSERT INTO book (book_image,book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher) VALUES ($1, $2, $3, $4, $5,$6)', [book_image,book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher]);
    res.json({ message: 'Book added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err)
  }
});

// Update book
app.put('/:id', async (req, res) => {
  const { book_image, book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher} = req.body;
  try {
    await pool.query('UPDATE book SET book_image=$1, book_name=$2, book_cat_id=$3, book_collection_id=$4, book_launch_date=$5, book_publisher=$6 WHERE book_id=$7', [book_image,book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher, req.params.id]);
    res.json({ message: 'Book updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get books not borrowed
app.get('/not-borrowed', async (req, res) => {
  try {
    const query = `
      SELECT b.book_id, b.book_name, b.book_publisher 
      FROM book b 
      LEFT JOIN issuance i ON b.book_id = i.book_id 
      WHERE i.book_id IS NULL 
      OR i.issuance_id NOT IN (
        SELECT issuance_id 
        FROM issuance 
        WHERE issuance_status = 'Borrowed'
      )`;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching not borrowed books:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get outstanding books
app.get('/outstanding', async (req, res) => {
  try {
    const query = `
      SELECT 
        b.book_name,
        m.mem_name,
        i.issuance_date,
        i.target_return_date,
        b.book_publisher
      FROM issuance i 
      JOIN member m ON i.issuance_member = m.mem_id 
      JOIN book b ON i.book_id = b.book_id 
      WHERE i.issuance_status = 'Borrowed' 
      AND i.target_return_date < CURRENT_DATE`;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching outstanding books:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get top 10 most borrowed books
app.get('/top-borrowed', async (req, res) => {
  try {
    const query = `
      SELECT 
        b.book_name,
        COUNT(i.book_id) AS times_borrowed,
        COUNT(DISTINCT i.issuance_member) AS unique_members
      FROM book b
      LEFT JOIN issuance i ON b.book_id = i.book_id
      GROUP BY b.book_id, b.book_name
      ORDER BY times_borrowed DESC
      LIMIT 10`;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching top borrowed books:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete book
app.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM book WHERE book_id = $1', [req.params.id]);
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})
module.exports = app;
