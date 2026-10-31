"use client";

import { useState } from "react";
import type { PointerEvent, ReactNode } from "react";

const SWIPE_THRESHOLD = 100;
const EXIT_DISTANCE = 600;

interface SwipeCardProps {
  children: ReactNode;
  onSwipe: (correct: boolean) => void;
}

// Drag right for correct, left for incorrect. Past the threshold the card
// flies off and onSwipe fires once the exit animation ends.
export default function SwipeCard({ children, onSwipe }: SwipeCardProps) {
  const [startX, setStartX] = useState<number | null>(null);
  const [dx, setDx] = useState(0);
  const [exiting, setExiting] = useState(false);

  const progress = Math.min(Math.abs(dx) / SWIPE_THRESHOLD, 1);

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (exiting) return;
    setStartX(e.clientX);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (startX === null) return;
    setDx(e.clientX - startX);
  };

  const handlePointerUp = () => {
    if (startX === null) return;
    setStartX(null);
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      setExiting(true);
      setDx(Math.sign(dx) * EXIT_DISTANCE);
    } else {
      setDx(0);
    }
  };

  const handleTransitionEnd = () => {
    if (exiting) onSwipe(dx > 0);
  };

  return (
    <div
      className="relative touch-pan-y select-none cursor-grab active:cursor-grabbing"
      style={{
        transform: `translateX(${dx}px) rotate(${dx / 20}deg)`,
        transition: startX !== null ? "none" : "transform 250ms ease-out",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onTransitionEnd={handleTransitionEnd}
      onDragStart={(e) => e.preventDefault()}
    >
      {children}
      <div
        aria-hidden="true"
        className={`absolute inset-0 rounded-2xl pointer-events-none ${
          dx > 0 ? "bg-green-500" : "bg-red-500"
        }`}
        style={{ opacity: progress * 0.25 }}
      />
    </div>
  );
}
