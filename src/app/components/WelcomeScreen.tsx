"use client";

import { useState, useSyncExternalStore } from "react";
import Confetti from "./Confetti";

// Shown once, the first time the app is opened on a device.
// Change the words here to change what T sees.
const WELCOME_TITLE = "Hey T! ❤️";
const WELCOME_MESSAGE = "WHAT UP GUUUUUURL.";
const WELCOME_BUTTON = "LET'S DO THIS!";

export const WELCOME_SEEN_KEY = "welcomeSeen";

const subscribe = () => () => {};

function hasSeenWelcome(): boolean {
  try {
    return localStorage.getItem(WELCOME_SEEN_KEY) !== null;
  } catch {
    // Storage blocked: better to show it again than never.
    return false;
  }
}

export default function WelcomeScreen() {
  // The page is prerendered, so whether to show it is decided on the client.
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [open, setOpen] = useState(
    () => typeof window !== "undefined" && !hasSeenWelcome(),
  );
  // Pressing the button closes the screen with a burst of confetti.
  const [celebrating, setCelebrating] = useState(false);

  if (!isClient) return null;
  if (!open) return celebrating ? <Confetti /> : null;

  const dismiss = () => {
    try {
      localStorage.setItem(WELCOME_SEEN_KEY, new Date().toISOString());
    } catch {
      // Storage blocked: it just shows again next time.
    }
    setOpen(false);
    setCelebrating(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-4 p-8 short:p-6 bg-white rounded-2xl shadow-xl w-80 max-w-full text-center">
        <div className="text-5xl short:text-3xl" aria-hidden="true">
          🌍
        </div>
        <h2 id="welcome-title" className="text-2xl font-bold text-gray-800">
          {WELCOME_TITLE}
        </h2>
        <p className="text-gray-600">{WELCOME_MESSAGE}</p>
        <button
          onClick={dismiss}
          className="w-full py-3 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-700 active:scale-95 transition-all"
        >
          {WELCOME_BUTTON}
        </button>
      </div>
    </div>
  );
}
