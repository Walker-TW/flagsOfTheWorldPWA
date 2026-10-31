"use client";

import { useState, type CSSProperties } from "react";

const COLORS = [
  "#ef4444",
  "#f59e0b",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
];

// A one-off burst of falling confetti over the whole screen. Plain CSS, so it
// works offline; skipped for people who ask for reduced motion.
export default function Confetti({ pieces = 80 }: { pieces?: number }) {
  const [bits] = useState(() =>
    Array.from({ length: pieces }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2.2 + Math.random() * 1.5,
      drift: (Math.random() - 0.5) * 30,
      spin: Math.random() * 360,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    })),
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden motion-reduce:hidden"
    >
      {bits.map((bit, i) => (
        <span
          key={i}
          className="confetti-piece absolute -top-4 w-2 h-3 rounded-sm"
          style={
            {
              left: `${bit.left}%`,
              backgroundColor: bit.color,
              animationDelay: `${bit.delay}s`,
              animationDuration: `${bit.duration}s`,
              "--drift": `${bit.drift}vw`,
              "--spin": `${bit.spin}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
