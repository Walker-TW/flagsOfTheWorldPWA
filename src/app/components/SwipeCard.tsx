"use client";

import { useState } from "react";
import type { KeyboardEvent, PointerEvent, ReactNode } from "react";

const SWIPE_THRESHOLD = 100;
// A press that moves less than this counts as a tap, not a drag.
const TAP_SLOP = 10;
const EXIT_DISTANCE = 600;

interface SwipeCardProps {
  children: ReactNode;
  onSwipe: (correct: boolean) => void;
  // Tapping the card (or Enter/Space when it has focus).
  onTap: () => void;
  // Whether what the tap shows is showing, for screen readers.
  expanded: boolean;
}

// Drag right for correct, left for incorrect. Past the threshold the card
// flies off and onSwipe fires once the exit animation ends. A tap without a
// drag calls onTap instead.
export default function SwipeCard({
  children,
  onSwipe,
  onTap,
  expanded,
}: SwipeCardProps) {
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

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (startX === null) return;
    setStartX(null);
    // A cancelled press (e.g. the page scrolled instead) is never a tap.
    if (e.type === "pointerup" && Math.abs(dx) < TAP_SLOP) onTap();
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      setExiting(true);
      setDx(Math.sign(dx) * EXIT_DISTANCE);
    } else {
      setDx(0);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    if (!exiting) onTap();
  };

  const handleTransitionEnd = () => {
    if (exiting) onSwipe(dx > 0);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      className="relative touch-pan-y select-none cursor-grab active:cursor-grabbing rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-gray-800 focus-visible:ring-offset-2"
      style={{
        transform: `translateX(${dx}px) rotate(${dx / 20}deg)`,
        transition: startX !== null ? "none" : "transform 250ms ease-out",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
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
