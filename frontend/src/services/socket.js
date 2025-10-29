// src/services/socket.js
import { io } from "socket.io-client";

// ✅ Detect environment and set backend URL dynamically
const URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000" // Local backend
    : "https://tic-tac-toe-lila-assignment.onrender.com"; // 🔁 Replace with your Render backend URL

export const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"], // Websocket is preferred
  withCredentials: true, // Allow CORS cookies if needed
});
