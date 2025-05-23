const express = require('express');
const cors = require('cors');
const path = require('path');
const { updatePlayer, getPlayerStats } = require('./db');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db');

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
    db.all(
      `SELECT username, stats FROM players WHERE username LIKE ? LIMIT 10`,
      [`%${query}%`],
      (err, rows) => {
        if (err) {
          console.error('Search error:', err);
          return res.status(500).json({ error: 'Search failed' });
        }

        const results = rows.map(row => {
          try {
            const stats = JSON.parse(row.stats);
            return {
              username: row.username,
              level: stats.level || 'N/A'
            };
          } catch (e) {
            return {
              username: row.username,
              level: 'N/A'
            };
          }
        });

        res.json(results);
      }
    );
  } catch (err) {
    console.error('Search error:', err);
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
