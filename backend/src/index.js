import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { setupMatchSocket } from "./game/matchManager.js";

const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173", // Vite local dev
  "https://tic-tac-toe-lila-assignment.netlify.app/", // replace with your actual Netlify URL
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

setupMatchSocket(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
