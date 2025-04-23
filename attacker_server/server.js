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


app.post('/stolenr', async (req, res) => {
  const { response_, source } = req.body;
  console.log(`🕵️ Received the response from : ${source}:`, response_);

 
 

})
app.listen(PORT, () => {
  console.log(`Attacker server listening on http://localhost:${PORT}`);
});

