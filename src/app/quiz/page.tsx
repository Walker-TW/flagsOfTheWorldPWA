import type { Metadata } from "next";
import Link from "next/link";
import FlagQuiz from "../components/FlagQuizLoader";

export const metadata: Metadata = {
  title: "Quiz",
};

export default function QuizPage() {
  return (
    <main className="h-dvh flex flex-col bg-gray-50 overflow-hidden">
      <header className="shrink-0 grid grid-cols-[1fr_auto_1fr] items-center px-4 py-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-800">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Flags of the World</h1>
      </header>

      <FlagQuiz />
    </main>
  );
}
