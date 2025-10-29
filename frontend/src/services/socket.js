// src/services/socket.js
import { io } from "socket.io-client";

// Change this to your backend URL
const URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket", "polling"], // Ensure websocket transport
});
