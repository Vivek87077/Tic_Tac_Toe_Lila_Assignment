import { Server } from "socket.io";
import MatchResult from "../models/MatchResult.js";
import { checkWin, isDraw } from "./gameLogic.js";
import User from "../models/User.js";

const ROOM_PREFIX = "room_";
const matches = new Map(); // key: matchId -> state

// -------------------------- SOCKET INITIALIZATION --------------------------
export function setupMatchSocket(io) {
  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    // -------------------------- CREATE ROOM --------------------------
    socket.on("create_room", ({ userId, nickname, mode }) => {
      const matchId =
        ROOM_PREFIX + Date.now() + "_" + Math.random().toString(36).slice(2, 7);

      const state = {
        id: matchId,
        players: [{ socketId: socket.id, userId, nickname, symbol: "X" }],
        board: Array(9).fill(null),
        turnIndex: 0,
        status: "waiting",
        moves: [],
        lastMoveAt: Date.now(),
        timeoutSeconds: mode === "timed" ? 30 : null,
        mode: mode || "classic",
      };

      matches.set(matchId, state);
      socket.join(matchId);
      socket.emit("room_created", { matchId, state });
      io.emit("rooms_update", getOpenRooms());
    });

    // -------------------------- JOIN ROOM --------------------------
    socket.on("join_room", ({ matchId, userId, nickname }) => {
      const state = matches.get(matchId);
      if (!state) return socket.emit("error", "Room not found");

      // Handle spectators
      if (state.players.length >= 2) {
        state.players.push({
          socketId: socket.id,
          userId,
          nickname,
          spectator: true,
        });
        socket.join(matchId);
        return socket.emit("joined_as_spectator", { matchId });
      }

      // Add second player
      state.players.push({
        socketId: socket.id,
        userId,
        nickname,
        symbol: "O",
      });
      state.status = "playing";
      state.lastMoveAt = Date.now();

      socket.join(matchId);
      io.to(matchId).emit("match_update", sanitizeStateForClients(state));
      io.emit("rooms_update", getOpenRooms());
    });

    // -------------------------- QUICK MATCH --------------------------
    socket.on("quick_match", async ({ userId, nickname, mode }) => {
      let room = null;
      for (const s of matches.values()) {
        if (s.status === "waiting" && s.mode === (mode || "classic")) {
          room = s;
          break;
        }
      }

      if (room) {
        room.players.push({
          socketId: socket.id,
          userId,
          nickname,
          symbol: "O",
        });
        room.status = "playing";
        room.lastMoveAt = Date.now();
        socket.join(room.id);
        io.to(room.id).emit("match_update", sanitizeStateForClients(room));
        io.emit("rooms_update", getOpenRooms());
      } else {
        const matchId =
          ROOM_PREFIX +
          Date.now() +
          "_" +
          Math.random().toString(36).slice(2, 7);
        const state = {
          id: matchId,
          players: [{ socketId: socket.id, userId, nickname, symbol: "X" }],
          board: Array(9).fill(null),
          turnIndex: 0,
          status: "waiting",
          moves: [],
          lastMoveAt: Date.now(),
          timeoutSeconds: mode === "timed" ? 30 : null,
          mode: mode || "classic",
        };
        matches.set(matchId, state);
        socket.join(matchId);
        socket.emit("match_update", sanitizeStateForClients(state));
        io.emit("rooms_update", getOpenRooms());
      }
    });

    // -------------------------- MAKE MOVE --------------------------
    socket.on("make_move", async ({ matchId, cellIndex }) => {
      const state = matches.get(matchId);
      if (!state) return socket.emit("error", "Match not found");

      const pIdx = state.players.findIndex((p) => p.socketId === socket.id);
      if (pIdx === -1) return socket.emit("error", "Not part of match");
      if (state.status !== "playing")
        return socket.emit("error", "Match not playing");
      if (pIdx !== state.turnIndex)
        return socket.emit("error", "Not your turn");
      if (cellIndex < 0 || cellIndex > 8)
        return socket.emit("error", "Invalid cell");
      if (state.board[cellIndex] !== null)
        return socket.emit("error", "Cell occupied");

      // Server-authoritative move
      const symbol = state.players[pIdx].symbol;
      state.board[cellIndex] = symbol;
      state.moves.push({
        by: state.players[pIdx].userId,
        cell: cellIndex,
        at: new Date(),
      });
      state.lastMoveAt = Date.now();

      // Check win/draw
      const winnerSymbol = checkWin(state.board);
      if (winnerSymbol) {
        state.status = "finished";
        const winner = state.players.find((p) => p.symbol === winnerSymbol);
        state.winner = winner ? winner.userId : null;
      } else if (isDraw(state.board)) {
        state.status = "finished";
        state.winner = null;
      } else {
        state.turnIndex = 1 - state.turnIndex;
      }

      io.to(matchId).emit("match_update", sanitizeStateForClients(state));

      if (state.status === "finished") {
        await persistMatchResult(state);
      }
    });

    // -------------------------- LEAVE ROOM --------------------------
    socket.on("leave_room", ({ matchId }) => {
      const state = matches.get(matchId);
      if (!state) return;

      state.players = state.players.filter((p) => p.socketId !== socket.id);
      socket.leave(matchId);

      if (state.players.filter((p) => !p.spectator).length === 0) {
        matches.delete(matchId);
      } else if (state.status === "playing") {
        const remaining = state.players.filter((p) => !p.spectator);
        if (remaining.length === 1) {
          state.status = "finished";
          state.winner = remaining[0].userId;
          io.to(matchId).emit("match_update", sanitizeStateForClients(state));
          persistMatchResult(state);
        }
      }

      io.emit("rooms_update", getOpenRooms());
    });

    // -------------------------- DISCONNECT --------------------------
    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
      for (const [id, state] of matches) {
        const idx = state.players.findIndex((p) => p.socketId === socket.id);
        if (idx !== -1) {
          state.players[idx].disconnected = true;
        }
      }
    });
  });

  // -------------------------- TIMEOUT HANDLER --------------------------
  setInterval(() => {
    const now = Date.now();
    for (const state of matches.values()) {
      if (state.status !== "playing" || !state.timeoutSeconds) continue;
      if ((now - state.lastMoveAt) / 1000 > state.timeoutSeconds) {
        const loser = state.players[state.turnIndex];
        const winner = state.players[1 - state.turnIndex];
        state.status = "finished";
        state.winner = winner.userId;
        io.to(state.id).emit("match_update", sanitizeStateForClients(state));
        persistMatchResult(state);
      }
    }
  }, 1000);
}

// -------------------------- HELPERS --------------------------
function sanitizeStateForClients(state) {
  return {
    id: state.id,
    players: state.players.map((p) => ({
      userId: p.userId,
      nickname: p.nickname,
      symbol: p.symbol,
      spectator: !!p.spectator,
      disconnected: !!p.disconnected,
    })),
    board: state.board,
    turnIndex: state.turnIndex,
    status: state.status,
    winner: state.winner || null,
    moves: state.moves,
    mode: state.mode,
  };
}

async function persistMatchResult(state) {
  try {
    await MatchResult.create({
      players: state.players.map((p) => ({
        userId: p.userId,
        nickname: p.nickname,
        symbol: p.symbol,
      })),
      winner: state.winner,
      mode: state.mode,
      moves: state.moves,
    });

    for (const p of state.players) {
      if (p.spectator) continue;
      const u = await User.findOneAndUpdate(
        { _id: p.userId },
        {},
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      if (!u) continue;

      // Update game statistics
      u.gamesPlayed = (u.gamesPlayed || 0) + 1;
      u.lastPlayed = new Date();

      if (!state.winner) {
        // Draw
        u.draws = (u.draws || 0) + 1;
        u.winStreak = 0; // Reset win streak on draw
      } else if (state.winner === p.userId) {
        // Win
        u.wins = (u.wins || 0) + 1;
        u.winStreak = (u.winStreak || 0) + 1;
        u.maxWinStreak = Math.max(u.maxWinStreak || 0, u.winStreak);
        u.points = (u.points || 1000) + 10;
      } else {
        // Loss
        u.losses = (u.losses || 0) + 1;
        u.winStreak = 0; // Reset win streak on loss
        u.points = Math.max(0, (u.points || 1000) - 5); // Don't go below 0
      }
      await u.save();
    }
  } catch (err) {
    console.error("persistMatchResult error:", err);
  }
}

function getOpenRooms() {
  return Array.from(matches.values()).map((state) => ({
    id: state.id,
    playersCount: state.players.length,
    status: state.status,
    mode: state.mode,
  }));
}
