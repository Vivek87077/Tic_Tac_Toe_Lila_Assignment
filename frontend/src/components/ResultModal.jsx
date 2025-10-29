import React from "react";

const ResultModal = ({ state, onClose }) => {
  const myUserId = localStorage.getItem("userId");
  const isWinner = state.winner === myUserId;
  const isDraw = !state.winner;

  // Calculate points change
  let pointsChange = 0;
  if (isDraw) {
    pointsChange = 0; // No change for draw
  } else if (isWinner) {
    pointsChange = 10; // Win bonus
  } else {
    pointsChange = -5; // Loss penalty
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-linear-to-br from-gray-800 to-gray-900 p-8 rounded-2xl text-white text-center shadow-2xl border border-gray-700 max-w-md w-full mx-4">
        <div className="mb-6">
          <div
            className={`text-6xl mb-4 ${
              isDraw
                ? "text-yellow-400"
                : isWinner
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {isDraw ? "🤝" : isWinner ? "🎉" : "😔"}
          </div>
          <h2 className="text-3xl font-bold mb-2">
            {isDraw ? "It's a Draw!" : isWinner ? "Victory!" : "Defeat!"}
          </h2>
          <p className="text-gray-300 text-lg">
            {isDraw
              ? "Well played! Both players were evenly matched."
              : isWinner
              ? "Congratulations! You dominated the game!"
              : "Don't give up! Every loss is a learning opportunity."}
          </p>
        </div>

        <div className="bg-gray-700/50 rounded-xl p-4 mb-6">
          <div className="text-sm text-gray-400 mb-1">Points Change</div>
          <div
            className={`text-2xl font-bold ${
              pointsChange > 0
                ? "text-green-400"
                : pointsChange < 0
                ? "text-red-400"
                : "text-yellow-400"
            }`}
          >
            {pointsChange > 0 ? "+" : ""}
            {pointsChange}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Play Again
          </button>
          <button
            onClick={() => (window.location.href = "/leaderboard")}
            className="flex-1 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 border border-gray-600 hover:border-gray-500"
          >
            Leaderboard
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ResultModal;
