"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import FlagButtonBar from "./FlagButtonBar";
import FlagCard from "./FlagCard";
import QuizResults, { type Answer } from "./QuizResults";
import { loadHistory, saveQuiz } from "@/data/quizHistory";
import SwipeCard from "./SwipeCard";
import type { CountriesData, Country } from "@/data/types";
import countriesData from "@/data/countries.json";
import { shuffle } from "@/data/shuffle";

const countries = countriesData as CountriesData;

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
  const [history, setHistory] = useState(loadHistory);

  const correctCount = answers.filter((a) => a.correct).length;
  const incorrectCount = answers.length - correctCount;

  const handleAnswer = (correct: boolean) => {
    const now = Date.now();
    const finished = [
      ...answers,
      { country: deck[position], correct, ms: now - shownAt },
    ];
    setAnswers(finished);
    if (finished.length === deck.length) {
      setHistory(
        saveQuiz({
          date: now,
          total: finished.length,
          correct: finished.filter((a) => a.correct).length,
          ms: finished.reduce((sum, a) => sum + a.ms, 0),
        }),
      );
    }
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
    return (
      <QuizResults answers={answers} history={history} onRestart={restart} />
    );
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

      {/* Scrolls rather than clipping the card if the screen is too short. */}
      <section className="grow min-h-0 flex overflow-y-auto overflow-x-hidden px-4 short:py-2">
        <div className="m-auto">
          <SwipeCard key={country.flagId} onSwipe={handleAnswer}>
            <FlagCard {...country} />
          </SwipeCard>
        </div>
      </section>

      {/* Sideways there is no room for the buttons; the card is swiped instead. */}
      <footer className="shrink-0 w-full py-6 short:hidden bg-white border-t border-gray-100">
        <FlagButtonBar onAnswer={handleAnswer} />
      </footer>
    </>
  );
}
