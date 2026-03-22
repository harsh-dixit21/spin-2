import React from "react";

export default function NamePanel({ namesText, setNamesText, onShuffle, count }) {
  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-md w-full max-w-xs h-full min-h-[520px] p-4 gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-gray-700 text-lg">Entries</span>
        <span className="text-sm text-gray-400 bg-gray-100 rounded-full px-3 py-0.5">{count}</span>
      </div>

      {/* Textarea */}
      <textarea
        className="flex-1 border border-gray-200 rounded-xl p-3 text-sm text-gray-700 focus:outline-none focus:border-blue-400 bg-gray-50 min-h-[340px]"
        placeholder={"Enter names here,\none per line...\n\n(Minimum 3 names)"}
        value={namesText}
        onChange={(e) => setNamesText(e.target.value)}
        spellCheck={false}
      />

      {/* Hint */}
      <p className="text-xs text-gray-400 text-center">
        One name per line. Minimum 3 names.
      </p>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={onShuffle}
          className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium text-sm transition flex items-center justify-center gap-1"
        >
          🔀 Shuffle
        </button>
        <button
          onClick={() => setNamesText("")}
          className="flex-1 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 font-medium text-sm transition flex items-center justify-center gap-1"
        >
          🗑 Clear
        </button>
      </div>
    </div>
  );
}