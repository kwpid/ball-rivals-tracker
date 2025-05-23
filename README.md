# Ball Rivals Stats Tracker

A web application for tracking player statistics from the Ball Rivals Roblox game.

## Features

- Track player wins, losses, streaks, and ELO ratings
- Simple and clean web interface
- RESTful API endpoints for updating and retrieving stats
- SQLite database for data persistence

## Setup

1. Install Node.js (version 14 or higher)
2. Clone this repository
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   node server.js
   ```
5. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Update Player Stats
```
POST /updatestats
Content-Type: application/json

{
  "username": "PlayerName123",
  "userid": 123456789,
  "stats": {
    "Wins": 10,
    "Losses": 3,
    "CurrentStreak": 2,
    "HighestStreak": 5,
    "ELO_1v1": 1025,
    "ELO_2v2": 1000,
    "ELO_3v3": 980,
    "ELO_4v4": 1050
  }
}
```

### Get Player Stats
```
GET /getstats?username=PlayerName123
```

## Deployment on Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Use the following settings:
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment Variables: None required

## Development

The application uses:
- Node.js with Express for the backend
- SQLite for the database
- Vanilla JavaScript for the frontend
- Modern CSS for styling

## License

MIT 