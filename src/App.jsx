import React, { useState, useCallback, useEffect, useRef } from "react";
import SpinWheel from "./components/SpinWheel";
import NamePanel from "./components/NamePanel";
import WinnerModal from "./components/WinnerModal";
import { useWheel } from "./hooks/useWheel";

const DEFAULT_NAMES = `Alice\nBob\nCharlie\nDiana\nEvan`;

export default function App() {
  const [namesText, setNamesText] = useState(DEFAULT_NAMES);

  const audioCtxRef = useRef(null);
  const prevSliceRef = useRef(-1);

  const names = namesText
    .split("\n")
    .map((n) => n.trim())
    .filter((n) => n.length > 0);

  const { spinning, winner, rotation, spin, setWinner } = useWheel(names);

  const playTick = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }, []);

  useEffect(() => {
    if (!spinning || names.length === 0) return;
    const sliceAngle = (2 * Math.PI) / names.length;
    const normalized = ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const currentSlice = Math.floor(normalized / sliceAngle);
    if (currentSlice !== prevSliceRef.current) {
      playTick();
      prevSliceRef.current = currentSlice;
    }
  }, [rotation, spinning, names.length, playTick]);

  useEffect(() => {
    if (!spinning) prevSliceRef.current = -1;
  }, [spinning]);

  const handleSpin = () => {
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    spin();
  };

  const handleShuffle = () => {
    const arr = [...names].sort(() => Math.random() - 0.5);
    setNamesText(arr.join("\n"));
  };

  const handleCloseModal = () => setWinner(null);

  const handleRemoveWinner = () => {
    const updated = names.filter((n) => n !== winner);
    setNamesText(updated.join("\n"));
    setWinner(null);
  };

  const tooFewNames = names.length < 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎡</span>
          <span className="text-xl font-bold text-gray-800">Wheel of Names</span>
        </div>
        <div className="flex gap-4 text-sm text-gray-500 font-medium">
          <button className="hover:text-blue-500 transition">Customize</button>
          <button className="hover:text-blue-500 transition">Share</button>
          <button className="hover:text-blue-500 transition">Open</button>
          <button className="hover:text-blue-500 transition">New</button>
        </div>
      </nav>

      <main className="flex flex-col lg:flex-row items-start justify-center gap-8 px-6 py-8 max-w-6xl mx-auto">
        <div className="flex flex-col items-center gap-4 flex-1">
          {tooFewNames && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-xl px-5 py-2 text-sm font-medium">
              ⚠️ Please enter at least 3 names to spin the wheel.
            </div>
          )}
          <SpinWheel
            names={names}
            rotation={rotation}
            spinning={spinning}
            onSpin={handleSpin}
          />
          <button
            onClick={handleSpin}
            disabled={spinning || tooFewNames}
            className="mt-2 px-10 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-lg rounded-full shadow-md transition"
          >
            {spinning ? "Spinning..." : "SPIN"}
          </button>
        </div>

        <div className="w-full lg:w-80">
          <NamePanel
            namesText={namesText}
            setNamesText={setNamesText}
            onShuffle={handleShuffle}
            count={names.length}
          />
        </div>
      </main>

      <WinnerModal
        winner={winner}
        onClose={handleCloseModal}
        onRemove={handleRemoveWinner}
      />
    </div>
  );
}