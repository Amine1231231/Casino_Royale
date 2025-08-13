// server.js
// Basic Node.js + Express backend for user management

const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory user data (for demo purposes only)
let users = [];
let loggedInUsers = [];

// Register a new user
app.post('/api/register', (req, res) => {
  const { name, clashId, password } = req.body;
  if (!name || !clashId || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  if (users.find(u => u.name === name || u.clashId === clashId)) {
    return res.status(409).json({ error: 'User already exists.' });
  }
  users.push({ name, clashId, password });
  res.json({ success: true, message: 'Registered! You can now log in.' });
});

// Login an existing user
app.post('/api/login', (req, res) => {
  const { name, password } = req.body;
  const user = users.find(u => u.name === name && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid name or password.' });
  }
  if (!loggedInUsers.find(u => u.name === name)) {
    loggedInUsers.push({ name: user.name, clashId: user.clashId, loginTime: Date.now() });
  }
  res.json({ success: true, message: 'Logged in!' });
});

// List online users
app.get('/api/online', (req, res) => {
  res.json(loggedInUsers);
});

// Logout a user
app.post('/api/logout', (req, res) => {
  const { name } = req.body;
  loggedInUsers = loggedInUsers.filter(u => u.name !== name);
  res.json({ success: true, message: 'Logged out.' });
});

// Simple index route
app.get('/', (req, res) => {
  res.send('Casino Royale backend is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
