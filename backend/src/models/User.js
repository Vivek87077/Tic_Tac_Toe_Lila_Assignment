import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  nickname: { type: String, required: true },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
  points: { type: Number, default: 1000 }, // ELO rating
  winStreak: { type: Number, default: 0 },
  maxWinStreak: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  lastPlayed: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);

export default User;
