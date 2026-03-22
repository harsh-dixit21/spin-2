import { useRef, useState, useCallback } from "react";

const COLORS = [
  "#e53e3e", "#dd6b20", "#d69e2e", "#38a169",
  "#3182ce", "#805ad5", "#d53f8c", "#00b5d8",
  "#e53e3e", "#dd6b20", "#d69e2e", "#38a169",
];

export function useWheel(names) {
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [rotation, setRotation] = useState(0);
  const animRef = useRef(null);
  const currentAngle = useRef(0);

  const getColor = (index) => COLORS[index % COLORS.length];

  // Biased spin: never land on index 0 or 1
  const getBiasedTargetIndex = useCallback((names) => {
    if (names.length <= 2) return 0;
    const eligible = names
      .map((_, i) => i)
      .filter((i) => i >= 2);
    const pick = eligible[Math.floor(Math.random() * eligible.length)];
    return pick;
  }, []);

  const spin = useCallback(() => {
    if (spinning || names.length < 3) return;

    setWinner(null);
    setSpinning(true);

    const targetIndex = getBiasedTargetIndex(names);
    const sliceAngle = (2 * Math.PI) / names.length;

    // Calculate target angle so that the pointer (pointing LEFT, at 180deg = Math.PI)
    // lands on the targetIndex slice center
    // Pointer is at the RIGHT side (3 o'clock = 0 radians in canvas terms)
    // Slice i starts at: i * sliceAngle - Math.PI/2 (top), center at (i + 0.5) * sliceAngle - Math.PI/2
    const sliceCenter = (targetIndex + 0.5) * sliceAngle;
    // We want sliceCenter to align with pointer at 0 (right side)
    // So final rotation angle = -sliceCenter (mod 2PI)
    const finalAngle = (2 * Math.PI - sliceCenter) % (2 * Math.PI);

    // Add multiple full rotations for effect (5-8 spins)
    const extraSpins = (5 + Math.floor(Math.random() * 3)) * 2 * Math.PI;
    const totalTarget = extraSpins + finalAngle;

    const startAngle = currentAngle.current % (2 * Math.PI);
    const startTime = performance.now();
    const duration = 4000 + Math.random() * 1500;

    // Easing: ease-out cubic
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOut(progress);
      const angle = startAngle + totalTarget * easedProgress;

      currentAngle.current = angle;
      setRotation(angle);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        currentAngle.current = angle;
        setSpinning(false);
        setWinner(names[targetIndex]);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  }, [spinning, names, getBiasedTargetIndex]);

  return { spinning, winner, rotation, spin, getColor, setWinner };
}