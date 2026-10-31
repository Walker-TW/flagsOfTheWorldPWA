"use client";

import { useState } from "react";
import FlagButtonBar from "./FlagButtonBar";
import FlagCard from "./FlagCard";
import SwipeCard from "./SwipeCard";
import type { CountriesData, Country } from "@/data/types";
import countriesData from "@/data/countries.json";

const countries = countriesData as CountriesData;

function pickRandomCountry(previous?: Country): Country {
  let next: Country;
  do {
    next = countries[Math.floor(Math.random() * countries.length)];
  } while (countries.length > 1 && next === previous);
  return next;
}

export default function FlagQuiz() {
  const [country, setCountry] = useState(() => pickRandomCountry());

  const handleAnswer = (correct: boolean) => {
    console.log(correct ? "Correct" : "Incorrect");
    setCountry((current) => pickRandomCountry(current));
  };

  return (
    <>
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
