"use client";

import { useState, useSyncExternalStore } from "react";

const subscribe = () => () => {};

// The page is prerendered at build time, so the message is picked on the
// client. isClient is false during prerender and hydration, which means the
// random pick never has to match the server HTML.
export default function OpeningMessage({ messages }: { messages: string[] }) {
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);
  const [message] = useState(
    () => messages[Math.floor(Math.random() * messages.length)],
  );

  return <p className="mt-2 text-gray-500">{isClient ? message : " "}</p>;
}
