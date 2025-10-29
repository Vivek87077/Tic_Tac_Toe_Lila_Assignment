import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema({
  players: [
    { userId: String, nickname: String, symbol: String }
  ],
  winner: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  mode: { type: String, default: 'classic' },
  moves: [
    { by: String, cell: Number, at: Date }
  ]
});

const MatchResult = mongoose.model("MatchResult", MatchSchema);
export default MatchResult;
