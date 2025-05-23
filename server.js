// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/robloxstats', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema
const playerSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  userid: Number,
  stats: Object,
}, { timestamps: true });

const Player = mongoose.model('Player', playerSchema);

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// POST /updatestats
app.post('/updatestats', async (req, res) => {
  const { username, userid, stats } = req.body;
  if (!username || !stats) return res.status(400).json({ error: 'Missing data' });

  await Player.findOneAndUpdate(
    { username },
    { username, userid, stats },
    { upsert: true, new: true }
  );

  res.json({ message: 'Stats updated' });
});

// GET /getstats
app.get('/getstats', async (req, res) => {
  const username = req.query.username;
  if (!username) return res.status(400).json({ error: 'Username required' });

  const player = await Player.findOne({ username });
  if (!player) return res.status(404).json({ error: 'User not found' });

  res.json(player.stats);
});

app.listen(port, () => console.log(`Server running on port ${port}`));
