const express = require('express');
const cors = require('cors');
const path = require('path');
const { updatePlayer, getPlayerStats } = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the root
app.use(express.static(__dirname));

// Serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

// POST /updatestats
app.post('/updatestats', (req, res) => {
  const { username, userid, stats } = req.body;
  if (!username || !stats) return res.status(400).json({ error: 'Missing data' });

  updatePlayer(username, userid, stats, (err) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ message: 'Stats updated' });
  });
});

// GET /getstats?username=PlayerName
app.get('/getstats', (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: 'Missing username' });

  getPlayerStats(username, (err, stats) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!stats) return res.status(404).json({ error: 'Player not found' });
    res.json(stats);
  });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
