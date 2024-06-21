const express = require('express');
const mysql = require('mysql2');
const config = require('./config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const port = 3000;
const secretKey = 'your_secret_key'; // Replace with your secret key

// Create a MySQL connection pool
const pool = mysql.createPool(config);

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
// Endpoint to get all users
app.get('/api/user', (req, res) => {
    pool.query('SELECT * FROM user', (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(results);
    });
});

// Endpoint to add a new user
app.post('/api/user/signup', async (req, res) => {
    const { name, email, contact, password, address, active } = req.body;
    if (!name || !email || !contact || !password || !address || !active) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO user (name, email, contact, password, address, active) VALUES (?, ?, ?, ?, ?, ?)';
        pool.query(sql, [name, email, contact, hashedPassword, address, active], (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.status(201).json({ id: results.insertId, name, email, contact, address, active });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/user/login', (req, res) => {
    const { email, password } = req.body;
    const secretKey = 'helloiamankit';
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const sql = 'SELECT * FROM user WHERE email = ?';
    pool.query(sql, [email], async (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
        console.log(token);
        res.json({ token });
    });
});

// Middleware to verify token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.sendStatus(401);
    }
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

// Endpoint to fetch user details
app.get('/api/user-details', authenticateToken, (req, res) => {
    const sql = 'SELECT id, name, email, contact, address, active FROM user WHERE id = ?';
    pool.query(sql, [req.user.id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(results[0]);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
