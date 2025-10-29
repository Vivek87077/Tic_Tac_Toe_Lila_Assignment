# Real-time Tic-Tac-Toe Game - LILA Ffullstack assignment

A modern, real-time multiplayer Tic-Tac-Toe game built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring Socket.IO for real-time gameplay, comprehensive statistics tracking, and a beautiful responsive UI.

## 🚀 Features

### Core Gameplay

- **Real-time Multiplayer**: Instant gameplay with Socket.IO
- **Quick Match**: Automatic opponent matching
- **Room System**: Create and join custom rooms
- **Spectator Mode**: Watch ongoing games
- **Timed Mode**: Optional time limits for moves

### Statistics & Leaderboards

- **Comprehensive Stats**: Wins, losses, draws, win streaks, games played
- **ELO Rating System**: Points-based ranking (1000 starting points)
- **Multiple Leaderboards**:
  - Overall rankings (by points)
  - Top winners
  - Longest win streaks
  - Best win rates
- **User Profiles**: Detailed player statistics

### User Experience

- **Responsive Design**: Works on desktop and mobile
- **Modern UI**: Dark theme with gradient effects
- **Real-time Updates**: Live game state synchronization
- **Error Handling**: Robust error management and user feedback

## 🛠 Tech Stack

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.IO** for real-time communication
- **JWT** for authentication (future enhancement)

### Frontend

- **React 18** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Socket.IO Client** for real-time features

### Development Tools

- **ESLint** for code linting
- **Nodemon** for backend development
- **Vite** for frontend development
- **Concurrently** for running multiple services

## 📁 Project Structure

```
multitac-mern/
├── backend/
│   ├── src/
│   │   ├── app.js              # Express app setup
│   │   ├── index.js            # Server entry point
│   │   ├── game/
│   │   │   ├── gameLogic.js    # Tic-tac-toe game logic
│   │   │   └── matchManager.js # Socket.IO game management
│   │   ├── models/
│   │   │   ├── User.js         # User schema
│   │   │   └── MatchResult.js  # Match history schema
│   │   └── routes/
│   │       ├── leaderboard.js  # Leaderboard API
│   │       └── profile.js      # User profile API
│   ├── package.json
│   ├── .env                    # Environment variables
│   └── render.yaml             # Render deployment config
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GameBoard.jsx   # Game board component
│   │   │   ├── MatchCard.jsx   # Match display component
│   │   │   └── ResultModal.jsx # Game result modal
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Landing page
│   │   │   ├── Lobby.jsx       # Matchmaking page
│   │   │   ├── Game.jsx        # Game page
│   │   │   └── Leaderboard.jsx # Leaderboard page
│   │   ├── services/
│   │   │   └── socket.js       # Socket.IO client
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # React entry point
│   ├── .env                    # Frontend env variables
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── netlify.toml            # Netlify deployment config
├── .gitignore
├── README.md
└── TODO.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd multitac-mern
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:

   ```env
   MONGO_URI=mongodb://localhost:27017/multitac
   PORT=5000
   NODE_ENV=development
   ```

3. **Frontend Setup**

   ```bash
   cd ../frontend
   npm install
   ```

   The frontend `.env` file is already configured with:

   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

### Running the Application

1. **Start the Backend** (from backend directory)

   ```bash
   npm run dev
   ```

2. **Start the Frontend** (from frontend directory)

   ```bash
   npm run dev
   ```

## 🎮 How to Play

1. **Enter Nickname**: Start by entering your nickname on the home page
2. **Find Match**: Click "Continue" to enter the lobby and get matched automatically
3. **Play Game**: Make moves by clicking on the 3x3 grid
4. **Win Condition**: Get 3 in a row (horizontal, vertical, or diagonal)
5. **View Stats**: Check your performance on the leaderboard

## 📡 API Endpoints

### User Management

- `POST /api/profile/create` - Create new user
- `GET /api/profile/:id` - Get user profile

### Leaderboards

- `GET /api/leaderboard` - Get overall leaderboard
- `GET /api/leaderboard/top/:criteria` - Get leaderboard by criteria (wins, winStreak, winRate)
- `GET /api/leaderboard/profile/:userId` - Get user profile with ran

#### Production URLs

- **Frontend**: [https://tic-tac-toe-lila-assignment.netlify.app/]
- **Backend**: [https://tic-tac-toe-lila-assignment.onrender.com]

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🔮 Future Enhancements

- [ ] User authentication with JWT
- [ ] Private rooms with passwords
- [ ] Tournament system
- [ ] Chat functionality
- [ ] Game history and replay
- [ ] Achievement system
- [ ] Mobile app (React Native)
- [ ] AI opponent
- [ ] Multiple game modes (Connect 4, Checkers)

## 👥 Authors

- **Vivek Sharma** - [https://github.com/Vivek87077]

---

**Happy Gaming! 🎮**


