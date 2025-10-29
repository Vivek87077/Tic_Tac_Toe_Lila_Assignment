import React from "react";

const GameBoard = ({ board, onCellClick, disabled = false }) => {
  return (
    <div className="grid grid-cols-3 gap-3 w-72 h-72 md:w-80 md:h-80">
      {board.map((cell, i) => (
        <button
          key={i}
          onClick={() => !disabled && onCellClick(i)}
          disabled={disabled || !!cell}
          className={`text-3xl md:text-4xl font-bold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg border animate-fade-in ${
            disabled || !!cell
              ? "bg-linear-to-br from-gray-800 to-gray-900 text-gray-400 cursor-not-allowed border-gray-700"
              : "bg-linear-to-br from-gray-700 to-gray-800 text-white hover:from-gray-600 hover:to-gray-700 border-gray-600 hover:border-gray-500"
          }`}
          style={{ animationDelay: `${i * 50}ms` }}
        >
          {cell || ""}
        </button>
      ))}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default GameBoard;
