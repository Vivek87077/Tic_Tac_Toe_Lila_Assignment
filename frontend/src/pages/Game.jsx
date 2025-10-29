import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { socket } from "../services/socket";
import GameBoard from "../components/GameBoard";
import ResultModal from "../components/ResultModal";

const Game = () => {
  const [searchParams] = useSearchParams();
  const matchId = searchParams.get("room");
  const navigate = useNavigate();

  const [state, setState] = useState(null); // game state from backend
  const [myUserId] = useState(localStorage.getItem("userId"));
  const [nickname] = useState(localStorage.getItem("nickname"));
  const [timeLeft, setTimeLeft] = useState(null);

  // Timer effect for timed games
  useEffect(() => {
    if (!state || state.mode !== "timed" || state.status !== "playing") {
      setTimeLeft(null);
      return;
    }

    const isMyTurn = state.players[state.turnIndex].userId === myUserId;
    if (!isMyTurn) {
      setTimeLeft(null);
      return;
    }

    setTimeLeft(30); // Reset to 30 seconds

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state, myUserId]);

  useEffect(() => {
    if (!myUserId || !nickname) {
      navigate("/");
      return;
    }
  }, [myUserId, nickname, navigate]);

  useEffect(() => {
    if (!matchId) return;

    // Only connect if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    // Listen for server updates
    const handleMatchUpdate = (newState) => {
      setState(newState);
    };

    const handleError = (err) => {
      console.error("Socket error:", err);
    };

    socket.on("match_update", handleMatchUpdate);
    socket.on("error", handleError);

    return () => {
      socket.off("match_update", handleMatchUpdate);
      socket.off("error", handleError);
      // Don't disconnect socket here - let it persist across page navigation
    };
  }, [matchId]);

  const handleMove = (cellIndex) => {
    if (!state || state.status !== "playing") return;

    const currentPlayer = state.players[state.turnIndex];
    if (currentPlayer.userId !== myUserId) {
      alert("Not your turn!");
      return;
    }

    socket.emit("make_move", { matchId, cellIndex });
  };

  const handleLeave = () => {
    socket.emit("leave_room", { matchId });
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white gap-4">
      <h2 className="text-2xl font-bold">Tic Tac Toe</h2>

      {state ? (
        <>
          <div className="text-center">
            <p className="text-lg">
              {state.status === "playing" ? (
                <>
                  Turn:{" "}
                  <span className="font-semibold text-yellow-400">
                    {state.players[state.turnIndex].nickname}
                  </span>
                </>
              ) : state.status === "finished" ? (
                state.winner ? (
                  <span className="text-green-400">
                    Winner:{" "}
                    {
                      state.players.find((p) => p.userId === state.winner)
                        ?.nickname
                    }
                  </span>
                ) : (
                  <span className="text-gray-400">It's a draw!</span>
                )
              ) : (
                <span className="text-gray-400">Waiting for player...</span>
              )}
            </p>

            {state.mode === "timed" &&
              state.status === "playing" &&
              timeLeft !== null && (
                <div className="mt-2">
                  <div
                    className={`text-sm font-semibold ${
                      timeLeft <= 10
                        ? "text-red-400 animate-pulse"
                        : "text-blue-400"
                    }`}
                  >
                    Time Left: {timeLeft}s
                  </div>
                  <div className="w-32 h-2 bg-gray-700 rounded-full mt-1 mx-auto">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        timeLeft <= 10 ? "bg-red-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${(timeLeft / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
          </div>

          <GameBoard
            board={state.board}
            onCellClick={handleMove}
            disabled={
              state.status !== "playing" ||
              state.players[state.turnIndex].userId !== myUserId
            }
          />

          <button
            onClick={handleLeave}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg mt-4 transition"
          >
            Leave Match
          </button>

          {state.status === "finished" && (
            <ResultModal state={state} onClose={() => navigate("/")} />
          )}
        </>
      ) : (
        <p>Loading game...</p>
      )}
    </div>
  );
};

export default Game;
