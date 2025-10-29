import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [nickname, setNickname] = useState("");
  const [selectedMode, setSelectedMode] = useState("classic");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nickname.trim()) {
      const userId =
        Date.now().toString() + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("nickname", nickname.trim());
      localStorage.setItem("userId", userId);
      localStorage.setItem("preferredMode", selectedMode);
      navigate("/lobby");
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen justify-center text-white px-4 py-8">
      <div className="text-center animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
          🎮 Tic Tac Toe
        </h1>
        <p className="text-gray-300 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
          Challenge players worldwide in this classic game. Choose your mode and
          start your winning streak!
        </p>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-700">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Choose Your Nickname
            </label>
            <input
              type="text"
              placeholder="Enter nickname..."
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Game Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedMode("classic")}
                className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                  selectedMode === "classic"
                    ? "border-blue-500 bg-blue-500/20 text-blue-300"
                    : "border-gray-600 bg-gray-700/50 text-gray-400 hover:border-gray-500"
                }`}
              >
                <div className="text-sm font-semibold">Classic</div>
                <div className="text-xs opacity-75">No time limit</div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedMode("timed")}
                className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                  selectedMode === "timed"
                    ? "border-purple-500 bg-purple-500/20 text-purple-300"
                    : "border-gray-600 bg-gray-700/50 text-gray-400 hover:border-gray-500"
                }`}
              >
                <div className="text-sm font-semibold">Timed</div>
                <div className="text-xs opacity-75">30s per turn</div>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            🚀 Start Playing
          </button>
        </form>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => navigate("/leaderboard")}
          className="bg-gray-700/50 hover:bg-gray-600/50 backdrop-blur-sm px-6 py-3 rounded-xl transition-all duration-200 border border-gray-600 hover:border-gray-500"
        >
          🏆 Leaderboard
        </button>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Home;
