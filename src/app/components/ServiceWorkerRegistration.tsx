"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/serwist/sw.js")
        .then((reg) => console.log("SW registered:", reg))
        .catch((err) => console.log("SW registration failed:", err));
    }
  }, []);

  return null;
}
