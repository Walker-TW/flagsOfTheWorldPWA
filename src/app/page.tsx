import Link from "next/link";
import countriesData from "@/data/countries.json";

const QUIZ_LENGTHS = [10, 20, 50, 100];

export default function Home() {
  return (
    <main className="h-dvh flex flex-col items-center justify-center gap-8 px-4 bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Flags of the World</h1>
        <p className="mt-2 text-gray-500">How many flags do you want to try?</p>
      </div>

      <nav className="grid grid-cols-2 gap-4 w-full max-w-xs">
        {QUIZ_LENGTHS.map((length) => (
          <Link
            key={length}
            href={`/quiz?count=${length}`}
            className="py-5 rounded-2xl bg-white shadow-md text-center text-2xl font-bold text-gray-800 hover:bg-gray-100 active:scale-95 transition-all"
          >
            {length}
          </Link>
        ))}
        <Link
          href="/quiz?count=all"
          className="col-span-2 py-5 rounded-2xl bg-gray-800 shadow-md text-center text-2xl font-bold text-white hover:bg-gray-700 active:scale-95 transition-all"
        >
          All {countriesData.length}
        </Link>
      </nav>
    </main>
  );
}
