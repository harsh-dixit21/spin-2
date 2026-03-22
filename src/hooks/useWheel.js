import { useRef, useState, useCallback } from "react";

export function useWheel(names) {
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [rotation, setRotation] = useState(0);
  const animRef = useRef(null);
  const rotationRef = useRef(0);

  const getBiasedTargetIndex = useCallback((n) => {
    if (n <= 2) return 0;
    const eligible = Array.from({ length: n }, (_, i) => i).filter((i) => i >= 2);
    return eligible[Math.floor(Math.random() * eligible.length)];
  }, []);

  const spin = useCallback(() => {
    if (spinning || names.length < 3) return;
    if (animRef.current) cancelAnimationFrame(animRef.current);

    setWinner(null);
    setSpinning(true);

    const n = names.length;
    const targetIndex = getBiasedTargetIndex(n);
    const sliceAngle = (2 * Math.PI) / n;

    // Each slice i is drawn starting at: rotation - PI/2 + i * sliceAngle
    // Slice i center is at canvas angle: rotation - PI/2 + (i + 0.5) * sliceAngle
    // Pointer sits at canvas angle 0 (3 o'clock, rightmost point)
    // For pointer to point at slice i center:
    //   rotation - PI/2 + (i + 0.5) * sliceAngle = 0  (mod 2PI)
    //   rotation = PI/2 - (i + 0.5) * sliceAngle      (mod 2PI)

    const idealRotation =
      (Math.PI / 2 - (targetIndex + 0.5) * sliceAngle + 2 * Math.PI * 100) %
      (2 * Math.PI);

    // Current rotation normalized to [0, 2PI]
    const currentNorm = ((rotationRef.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    // How much more we need to rotate to reach idealRotation
    let delta = idealRotation - currentNorm;
    if (delta < 0) delta += 2 * Math.PI;

    // Add 6–9 full rotations for spin effect
    const extraSpins = (6 + Math.floor(Math.random() * 4)) * 2 * Math.PI;
    const totalSpin = extraSpins + delta;

    const startRotation = rotationRef.current;
    const endRotation = startRotation + totalSpin;

    const duration = 5000 + Math.random() * 2000;
    const startTime = performance.now();

    // Quintic ease-out for very smooth natural deceleration
    const easeOut = (t) => 1 - Math.pow(1 - t, 5);

    const animate = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const current = startRotation + (endRotation - startRotation) * easeOut(t);

      rotationRef.current = current;
      setRotation(current);

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        rotationRef.current = endRotation;
        setRotation(endRotation);
        setSpinning(false);
        setWinner(names[targetIndex]);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  }, [spinning, names, getBiasedTargetIndex]);

  return { spinning, winner, rotation, spin, setWinner };
}