// backend/server.js - SAHI KIYA HUA CODE

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware - Yeh lines routes se pehle honi zaroori hain
app.use(cors());
app.use(express.json()); // Yeh line frontend se JSON data lene ke liye zaroori hai

// Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Deoria@123', // Yahan apna password daalein
  database: 'store_ratings_db'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Successfully connected to the database.');
});

// --- API ENDPOINTS ---

// User Register
app.post('/api/register', async (req, res) => {
  try {
    // Step 1: Frontend se data lena
    const { name, email, password, address } = req.body;
    
    // Step 2: Check karna ki zaroori data mila ya nahi
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required." });
    }

    const role = 'Normal User';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 3: Database mein daalne ke liye values taiyaar karna
    const sql = "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)";
    const values = [name, email, hashedPassword, address, role];

    // Step 4: Database mein data save karna
    db.query(sql, values, (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: "Email already exists." });
        }
        console.error("Database insert error:", err);
        return res.status(500).json({ error: "Database error during registration." });
      }
      return res.status(201).json({ message: "User registered successfully." });
    });
  } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ error: "An internal server error occurred." });
  }
});


// User Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, data) => {
    if (err) return res.status(500).json({ error: "Database error." });
    if (data.length === 0) return res.status(404).json({ error: "Invalid email or password." });

    const user = data[0];
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ error: "Invalid email or password." });

    const token = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_secret_key', { expiresIn: '1h' });
    const { password: userPassword, ...otherDetails } = user;
    return res.status(200).json({ token, user: otherDetails });
  });
});

// Sabhi stores ka data bhejein
app.get('/api/stores', (req, res) => {
  const sql = "SELECT * FROM stores";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: "Error fetching stores" });
    return res.json(data);
  });
});

// Sabhi users ka data bhejein
app.get('/api/users', (req, res) => {
  const sql = "SELECT id, name, email, address, role FROM users";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: "Error fetching users" });
    return res.json(data);
  });
});

// Sabhi ratings ka data bhejein
app.get('/api/ratings', (req, res) => {
  const sql = "SELECT * FROM ratings";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: "Error fetching ratings" });
    return res.json(data);
  });
});


const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});