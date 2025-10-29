import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overall");
  const navigate = useNavigate();

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      let endpoint = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/leaderboard`;

      if (activeTab !== "overall") {
        endpoint += `/top/${activeTab}`;
      }

      const res = await axios.get(endpoint);
      setLeaderboard(res.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const getTabTitle = () => {
    switch (activeTab) {
      case "wins":
        return "Top Winners";
      case "winStreak":
        return "Longest Win Streaks";
      case "winRate":
        return "Best Win Rates";
      default:
        return "Overall Rankings";
    }
  };

  const getStatDisplay = (player) => {
    switch (activeTab) {
      case "wins":
        return `${player.wins} wins`;
      case "winStreak":
        return `${player.maxWinStreak} streak`;
      case "winRate":
        return `${player.winRate}% win rate`;
      default:
        return `${player.points} pts`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
            🏆 Leaderboard
          </h1>
          <p className="text-gray-300 text-lg">
            See how you stack up against other players!
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 flex gap-1">
            {[
              { key: "overall", label: "Overall" },
              { key: "wins", label: "Wins" },
              { key: "winStreak", label: "Streaks" },
              { key: "winRate", label: "Win Rate" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-200">
            {getTabTitle()}
          </h2>

          <div className="space-y-3">
            {leaderboard.map((p, index) => (
              <div
                key={p._id || index}
                className={`flex justify-between items-center p-4 rounded-xl transition-all duration-200 ${
                  index < 3
                    ? "bg-linear-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30"
                    : "bg-gray-700/30 hover:bg-gray-600/30"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${
                      index === 0
                        ? "bg-yellow-500 text-black"
                        : index === 1
                        ? "bg-gray-400 text-black"
                        : index === 2
                        ? "bg-orange-600 text-white"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">
                      {p.nickname}
                    </div>
                    {activeTab === "overall" && (
                      <div className="text-sm text-gray-400">
                        {p.wins}W / {p.losses}L / {p.draws}D • {p.maxWinStreak}{" "}
                        streak
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-blue-400">
                    {getStatDisplay(p)}
                  </div>
                  {activeTab === "overall" && (
                    <div className="text-sm text-gray-400">
                      {p.gamesPlayed} games
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/")}
            className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            🎮 Start Playing
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
