import Link from "next/link";
import countriesData from "@/data/countries.json";
import { GIFT_OPENING_MESSAGES } from "@/edition";
import FlagMosaic from "./components/FlagMosaic";
import OpeningMessage from "./components/OpeningMessage";

const QUIZ_LENGTHS = [10, 20, 50, 100];

const OPENING_MESSAGES = [
  `🌍 Welcome to the Flags of the World Quiz! 🌍`,
  "How many flags do you want to try???",
  "Choose a quiz length below to get started.",
];

export default function Home() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center gap-8 short:gap-4 px-4 py-6 bg-gray-50">
      <FlagMosaic flagIds={countriesData.map((c) => c.flagId)} />

      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Flags of the World</h1>
        <OpeningMessage
          messages={[...OPENING_MESSAGES, ...GIFT_OPENING_MESSAGES]}
        />
      </div>

      <nav className="grid grid-cols-2 short:grid-cols-5 gap-4 w-full max-w-xs short:max-w-2xl">
        {QUIZ_LENGTHS.map((length) => (
          <Link
            key={length}
            href={`/quiz?count=${length}`}
            className="py-5 short:py-3 rounded-2xl bg-white shadow-md text-center text-2xl font-bold text-gray-800 hover:bg-gray-100 active:scale-95 transition-all"
          >
            {length}
          </Link>
        ))}
        <Link
          href="/quiz?count=all"
          className="col-span-2 short:col-span-1 py-5 short:py-3 rounded-2xl bg-gray-800 shadow-md text-center text-2xl font-bold text-white hover:bg-gray-700 active:scale-95 transition-all"
        >
          All {countriesData.length}
        </Link>
      </nav>
    </main>
  );
}
