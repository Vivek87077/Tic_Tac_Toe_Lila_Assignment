import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import profileRoutes from "./routes/profile.js";
import leaderboardRoutes from "./routes/leaderboard.js";

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://tic-tac-toe-lila-assignment.netlify.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/profile", profileRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

export default app;
