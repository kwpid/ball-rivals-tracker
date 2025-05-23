async function fetchStats() {
  const username = document.getElementById('username').value;
  const statsDiv = document.getElementById('stats');
  statsDiv.innerHTML = 'Loading...';

  try {
    const res = await fetch(`/getstats?username=${encodeURIComponent(username)}`);
    if (!res.ok) throw new Error('User not found');
    const data = await res.json();

    let html = `<h2>Stats for ${username}</h2><ul>`;
    for (const [key, value] of Object.entries(data)) {
      html += `<li><strong>${key}:</strong> ${value}</li>`;
    }
    html += `</ul>`;
    statsDiv.innerHTML = html;
  } catch (err) {
    statsDiv.innerHTML = `<span style="color:red;">Error: ${err.message}</span>`;
  }
} 