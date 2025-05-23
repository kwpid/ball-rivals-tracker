const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db');

// Create table if not exists
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS players (
      username TEXT PRIMARY KEY,
      userid INTEGER,
      stats TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

function updatePlayer(username, userid, stats, callback) {
  const statsJSON = JSON.stringify(stats);
  db.run(`
    INSERT INTO players (username, userid, stats)
    VALUES (?, ?, ?)
    ON CONFLICT(username) DO UPDATE SET stats=excluded.stats, updated_at=CURRENT_TIMESTAMP
  `, [username, userid, statsJSON], callback);
}

function getPlayerStats(username, callback) {
  db.get(`SELECT stats FROM players WHERE username = ?`, [username], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(null, null);
    try {
      const stats = JSON.parse(row.stats);
      // Ensure the stats object has the new leaderstats structure
      const defaultStats = {
        Wins_1v1: 0,
        Losses_1v1: 0,
        Wins_2v2: 0,
        Losses_2v2: 0,
        Wins_3v3: 0,
        Losses_3v3: 0,
        Wins_4v4: 0,
        Losses_4v4: 0,
        Level: 1,
        CurrentStreak: 0,
        HighestStreak: 0,
        ELO_1v1: 1000,
        ELO_2v2: 1000,
        ELO_3v3: 1000,
        ELO_4v4: 1000
      };
      const mergedStats = { ...defaultStats, ...stats };
      callback(null, mergedStats);
    } catch (e) {
      callback(e);
    }
  });
}

module.exports = { updatePlayer, getPlayerStats };
