const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;
const SECRET = 'demo-secret';

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());

// 🔒 In-memory fake user DB
const users = {
    'user@example.com': {
      name: 'John Hacker',
      email: 'user@example.com',
      password: 'user123', // 👈 add password
      messages: [
        { from: 'alice@example.com', content: 'Hey John!' },
        { from: 'bob@example.com', content: 'Your password is weak 😬' }
      ],
      settings: {
        theme: 'dark',
        notifications: true
      },
      isAdmin: false
    },
    'admin@example.com': {
      name: 'Admin Supreme',
      email: 'admin@example.com',
      password: 'admin123', // 👈 add password
      messages: [
        { from: 'system', content: 'All systems operational.' }
      ],
      settings: {
        theme: 'light',
        notifications: false
      },
      isAdmin: true
    }
  };
// 🧠 Helper to verify token
function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).send('Unauthorized');

  try {
    const decoded = jwt.verify(auth.split(' ')[1], SECRET);
    req.user = users[decoded.email];
    if (!req.user) return res.status(401).send('User not found');
    next();
  } catch (err) {
    return res.status(401).send('Invalid token');
  }
}

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users[email];
    if (!user || user.password !== password) {
      return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ email }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  });

// 👤 Get user info
// app.get('/api/user', verifyToken, (req, res) => {
//   const { name, email } = req.user;
//   res.json({ name, email });
// });

// ✉️ Get user messages
app.get('/api/messages', verifyToken, (req, res) => {
  res.json(req.user.messages || []);
});

// ⚙️ Get user settings
app.get('/api/settings', verifyToken, (req, res) => {
  res.json(req.user.settings || {});
});

// 🛡️ Admin-only route
app.get('/api/admin', verifyToken, (req, res) => {
  if (!req.user.isAdmin) return res.status(403).send('Forbidden');
  res.json({ secret: 'Top secret admin stuff 🕵️‍♂️' });
});

app.get('/api/user', verifyToken, (req, res) => {
    res.json(req.user); // Includes name, email, messages, settings, isAdmin
  });
app.listen(PORT, () => {
  console.log(`🔐 Backend running at http://localhost:${PORT}`);
});
