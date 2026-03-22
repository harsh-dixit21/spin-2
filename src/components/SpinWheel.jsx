import React, { useEffect, useRef } from "react";

const COLORS = [
  "#e53e3e", "#dd6b20", "#d69e2e", "#38a169",
  "#3182ce", "#805ad5", "#d53f8c", "#00b5d8",
  "#e53e3e", "#dd6b20", "#d69e2e", "#38a169",
  "#38a169", "#3182ce",
];

export default function SpinWheel({ names, rotation, spinning, onSpin }) {
  const canvasRef = useRef(null);
  const SIZE = 500;
  const CENTER = SIZE / 2;
  const RADIUS = CENTER - 10;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, SIZE, SIZE);

    const n = names.length;

    if (n === 0) {
      ctx.fillStyle = "#e2e8f0";
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, RADIUS, 0, 2 * Math.PI);
      ctx.fill();
      return;
    }

    const sliceAngle = (2 * Math.PI) / n;

    names.forEach((name, i) => {
      const startAngle = rotation - Math.PI / 2 + i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(CENTER, CENTER);
      ctx.arc(CENTER, CENTER, RADIUS, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw label
      ctx.save();
      ctx.translate(CENTER, CENTER);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${n > 10 ? 12 : 15}px 'Segoe UI', sans-serif`;
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      ctx.shadowBlur = 4;
      const label = name.length > 14 ? name.slice(0, 14) + "…" : name;
      ctx.fillText(label, RADIUS - 12, 5);
      ctx.restore();
    });

    // Outer ring
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, RADIUS, 0, 2 * Math.PI);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 6;
    ctx.stroke();

    // Center circle
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, 28, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#cbd5e0";
    ctx.lineWidth = 4;
    ctx.stroke();

  }, [names, rotation]);

  return (
    <div className="wheel-container" style={{ width: SIZE, height: SIZE }}>
      {/* Pointer arrow on the right */}
      <div className="wheel-pointer" />

      {/* Wheel canvas */}
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        onClick={!spinning ? onSpin : undefined}
        style={{ cursor: spinning ? "not-allowed" : "pointer" }}
      />

      {/* Center spin button */}
      <button
        className="spin-btn"
        onClick={!spinning ? onSpin : undefined}
      >
        {spinning ? "⏳" : "SPIN"}
      </button>
    </div>
  );
}