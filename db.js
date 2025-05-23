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
      callback(null, stats);
    } catch (e) {
      callback(e);
    }
  });
}

module.exports = { updatePlayer, getPlayerStats };
