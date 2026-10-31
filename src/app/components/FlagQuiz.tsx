"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import FlagButtonBar from "./FlagButtonBar";
import FlagCard from "./FlagCard";
import SwipeCard from "./SwipeCard";
import type { CountriesData, Country } from "@/data/types";
import countriesData from "@/data/countries.json";

const countries = countriesData as CountriesData;

const EMPTY_SCORE = { correct: 0, incorrect: 0 };

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// "all", or anything that isn't a positive whole number, plays every country.
function parseQuizLength(param: string | null): number {
  const length = Number(param);
  return Number.isInteger(length) && length > 0
    ? Math.min(length, countries.length)
    : countries.length;
}

function buildDeck(length: number): Country[] {
  return shuffle(countries).slice(0, length);
}

export default function FlagQuiz() {
  const length = parseQuizLength(useSearchParams().get("count"));
  const [deck, setDeck] = useState(() => buildDeck(length));
  const [position, setPosition] = useState(0);
  const [score, setScore] = useState(EMPTY_SCORE);

  const handleAnswer = (correct: boolean) => {
    setScore((s) =>
      correct
        ? { ...s, correct: s.correct + 1 }
        : { ...s, incorrect: s.incorrect + 1 },
    );
    setPosition((p) => p + 1);
  };

  const restart = () => {
    setDeck(buildDeck(length));
    setPosition(0);
    setScore(EMPTY_SCORE);
  };

  if (position >= deck.length) {
    return <QuizResults score={score} total={deck.length} onRestart={restart} />;
  }

  const country = deck[position];

  return (
    <>
      <div className="shrink-0 flex justify-between px-6 text-sm font-medium text-gray-600">
        <span>
          {position + 1} / {deck.length}
        </span>
        <span>
          <span className="text-green-600">✓ {score.correct}</span>
          {" · "}
          <span className="text-red-600">✗ {score.incorrect}</span>
        </span>
      </div>

      <section className="grow flex items-center justify-center px-4">
        <SwipeCard key={country.flagId} onSwipe={handleAnswer}>
          <FlagCard {...country} />
        </SwipeCard>
      </section>

      <footer className="shrink-0 w-full py-6 bg-white border-t border-gray-100">
        <FlagButtonBar onAnswer={handleAnswer} />
      </footer>
    </>
  );
}

interface QuizResultsProps {
  score: typeof EMPTY_SCORE;
  total: number;
  onRestart: () => void;
}

function QuizResults({ score, total, onRestart }: QuizResultsProps) {
  const percent = Math.round((score.correct / total) * 100);

  return (
    <section className="grow flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-md w-80 text-center">
        <div className="text-gray-500 text-sm">Quiz complete</div>
        <div className="text-5xl font-bold text-gray-800">{percent}%</div>
        <div className="text-gray-600">
          <span className="text-green-600 font-medium">{score.correct} correct</span>
          {" · "}
          <span className="text-red-600 font-medium">{score.incorrect} incorrect</span>
        </div>
        <button
          onClick={onRestart}
          className="w-full py-3 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-700 active:scale-95 transition-all"
        >
          Play again
        </button>
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-800">
          Change length
        </Link>
      </div>
    </section>
  );
}
