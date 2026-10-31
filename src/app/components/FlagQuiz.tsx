"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import FlagButtonBar from "./FlagButtonBar";
import FlagCard from "./FlagCard";
import QuizResults, { type Answer } from "./QuizResults";
import SwipeCard from "./SwipeCard";
import type { CountriesData, Country } from "@/data/types";
import countriesData from "@/data/countries.json";

const countries = countriesData as CountriesData;

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
  const [answers, setAnswers] = useState<Answer[]>([]);
  // When the current flag was shown, so each answer can be timed.
  const [shownAt, setShownAt] = useState(() => Date.now());

  const correctCount = answers.filter((a) => a.correct).length;
  const incorrectCount = answers.length - correctCount;

  const handleAnswer = (correct: boolean) => {
    const now = Date.now();
    setAnswers((a) => [...a, { country: deck[position], correct, ms: now - shownAt }]);
    setShownAt(now);
    setPosition((p) => p + 1);
  };

  const restart = () => {
    setDeck(buildDeck(length));
    setPosition(0);
    setAnswers([]);
    setShownAt(Date.now());
  };

  if (position >= deck.length) {
    return <QuizResults answers={answers} onRestart={restart} />;
  }

  const country = deck[position];

  return (
    <>
      <div className="shrink-0 flex justify-between px-6 text-sm font-medium text-gray-600">
        <span>
          {position + 1} / {deck.length}
        </span>
        <span>
          <span className="text-green-600">✓ {correctCount}</span>
          {" · "}
          <span className="text-red-600">✗ {incorrectCount}</span>
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
