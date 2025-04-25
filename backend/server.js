const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;
const SECRET = 'demo-secret';


app.use(cors({
  origin: '*', // allow requests from all origins (attacker's server)
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// app.use(cors({
//   origin: (origin, callback) => {
//     // Only allow requests from localhost:5173
//     if (origin === 'http://localhost:5173') {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use(bodyParser.json());



// database simulation 
const users = {
    'haroun@gmail.com': {
      name: 'Haroun Messsaoudi',
      email: 'haroun@gmail.com',
      password: 'haroun',
      messages: [
        { from: 'rafik@gmail.com',
           content: 'here is my credit card info  exp: 07/26, CVV: 123 text when you make the reservation' },
        { from: 'tahar@gmail.com',
           content: 'here is the steam card code ABCD-EFGH-IJKL-MNOP' }
      ],
      settings: {
        theme: 'dark',
        notifications: true
      },
      details: {
        age : 20,
        blood_type : "A+",
        city : "ouezra",
      }
    },
  };
// token authentication 
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

// this will be request by the frontend 
app.get('/api/userInfo', verifyToken, (req, res) => {
  const { name, email } = req.user;
  res.json({ name, email });
});

// this will be request by the attacker's server
app.get('/api/user', verifyToken, (req, res) => {
    res.json(req.user);
  });
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
