import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline",
};

export default function Offline() {
  return (
    <main className="h-dvh flex flex-col items-center justify-center gap-2 px-4 bg-gray-50 text-center">
      <h1 className="text-2xl font-bold text-gray-800">You&apos;re offline</h1>
      <p className="text-gray-500">
        This page isn&apos;t available offline yet. Reconnect and try again.
      </p>
    </main>
  );
}
