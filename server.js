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

// Serve profile page
app.get('/@:username', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/profile.html'));
});

// Search endpoint
app.get('/search', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Missing query' });

  try {
    // TODO: Implement actual search in your database
    // This is a mock response for now
    const mockResults = [
      { username: 'Player1', level: 50 },
      { username: 'Player2', level: 45 },
      { username: 'Player3', level: 60 }
    ].filter(p => p.username.toLowerCase().includes(query.toLowerCase()));

    res.json(mockResults);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
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

    // Add mock recent matches for now
    stats.recentMatches = [
      {
        won: true,
        map: 'Stadium',
        duration: '5:30',
        score: '3-1'
      },
      {
        won: false,
        map: 'Arena',
        duration: '4:15',
        score: '2-3'
      }
    ];

    res.json(stats);
  });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
