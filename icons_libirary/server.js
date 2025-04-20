const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.static(__dirname)); // serve malicious-lib.js

app.listen(PORT, () => {
  console.log(`🦠 Malicious library hosted at http://localhost:${PORT}`);
});
