const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('stats.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        // Create table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS player_stats (
            username TEXT PRIMARY KEY,
            userid INTEGER,
            wins INTEGER,
            losses INTEGER,
            current_streak INTEGER,
            highest_streak INTEGER,
            elo_1v1 INTEGER,
            elo_2v2 INTEGER,
            elo_3v3 INTEGER,
            elo_4v4 INTEGER,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// Routes
app.post('/updatestats', (req, res) => {
    const { username, userid, stats } = req.body;
    
    const sql = `INSERT OR REPLACE INTO player_stats (
        username, userid, wins, losses, current_streak, highest_streak,
        elo_1v1, elo_2v2, elo_3v3, elo_4v4, last_updated
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`;

    db.run(sql, [
        username,
        userid,
        stats.Wins,
        stats.Losses,
        stats.CurrentStreak,
        stats.HighestStreak,
        stats.ELO_1v1,
        stats.ELO_2v2,
        stats.ELO_3v3,
        stats.ELO_4v4
    ], function(err) {
        if (err) {
            console.error('Error updating stats:', err);
            res.status(500).json({ error: 'Failed to update stats' });
        } else {
            res.json({ message: 'Stats updated successfully' });
        }
    });
});

app.get('/getstats', (req, res) => {
    const { username } = req.query;
    
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    db.get('SELECT * FROM player_stats WHERE username = ?', [username], (err, row) => {
        if (err) {
            console.error('Error fetching stats:', err);
            res.status(500).json({ error: 'Failed to fetch stats' });
        } else if (!row) {
            res.status(404).json({ error: 'Player not found' });
        } else {
            // Format the response to match the input structure
            const stats = {
                username: row.username,
                userid: row.userid,
                stats: {
                    Wins: row.wins,
                    Losses: row.losses,
                    CurrentStreak: row.current_streak,
                    HighestStreak: row.highest_streak,
                    ELO_1v1: row.elo_1v1,
                    ELO_2v2: row.elo_2v2,
                    ELO_3v3: row.elo_3v3,
                    ELO_4v4: row.elo_4v4
                }
            };
            res.json(stats);
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 