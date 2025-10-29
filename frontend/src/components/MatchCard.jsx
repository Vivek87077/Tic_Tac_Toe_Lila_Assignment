import React from "react";

const MatchCard = ({ match, onJoin }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center justify-between border border-gray-200 hover:shadow-lg transition duration-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Room: {match.roomCode}
      </h2>

      <p className="text-sm text-gray-600 mb-2">
        Players: {match.players.length} / {match.maxPlayers}
      </p>

      <div className="flex flex-wrap justify-center gap-2 mb-3">
        {match.players.map((player, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full"
          >
            {player.name}
          </span>
        ))}
      </div>

      <button
        onClick={() => onJoin(match.roomCode)}
        disabled={match.players.length >= match.maxPlayers}
        className={`w-full py-2 text-white font-semibold rounded-lg transition
          ${
            match.players.length >= match.maxPlayers
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
      >
        {match.players.length >= match.maxPlayers ? "Full" : "Join Match"}
      </button>
    </div>
  );
};

export default MatchCard;
