import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../services/socket";

const Lobby = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const nickname = localStorage.getItem("nickname");
    let userId = localStorage.getItem("userId");

    if (!nickname || !userId) {
      navigate("/");
      return;
    }

    // Only connect if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    // emit quick match request with preferred mode
    const preferredMode = localStorage.getItem("preferredMode") || "classic";
    socket.emit("quick_match", { userId, nickname, mode: preferredMode });

    // listen for match updates
    const handleMatchUpdate = (state) => {
      // when the match starts or finishes, move to game page
      if (state.status === "playing" || state.status === "finished") {
        navigate(`/game?room=${state.id}`);
      }
    };

    // handle errors if any
    const handleError = (err) => {
      console.error("Socket error:", err);
    };

    socket.on("match_update", handleMatchUpdate);
    socket.on("error", handleError);

    // cleanup when leaving
    return () => {
      socket.off("match_update", handleMatchUpdate);
      socket.off("error", handleError);
      // Don't disconnect socket here - let it persist across page navigation
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center gap-4 bg-gray-900 min-h-screen justify-center text-white">
      <h2 className="text-2xl font-semibold">🎮 Finding a random player...</h2>
      <p className="text-gray-400">It usually takes 25–30 seconds</p>
      <button
        onClick={() => navigate("/")}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
      >
        Cancel
      </button>
    </div>
  );
};

export default Lobby;
