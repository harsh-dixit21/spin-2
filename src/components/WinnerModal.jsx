import React from "react";

export default function WinnerModal({ winner, onClose, onRemove }) {
  if (!winner) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 min-w-[300px] max-w-sm w-full animate-bounce-in">
        <div className="text-5xl">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800">We have a winner!</h2>
        <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl px-6 py-3 text-2xl font-bold text-yellow-700 text-center w-full">
          {winner}
        </div>
        <div className="flex gap-3 mt-2 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
          >
            Close
          </button>
          <button
            onClick={onRemove}
            className="flex-1 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 font-semibold transition"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}