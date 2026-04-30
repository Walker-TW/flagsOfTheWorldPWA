import FlagButtonBar from "./components/FlagButtonBar";
import FlagCard from "./components/FlagCard";
import type { CountriesData } from "@/data/types";
import countriesData from "@/data/countries.json";

const countries = countriesData as CountriesData;

const countryToBeChosen =
  countries[Math.floor(Math.random() * countries.length)];

export default function Home() {
  return (
    <main className="h-dvh flex flex-col bg-gray-50 overflow-hidden">
      <header className="shrink-0 py-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Flags of the World
        </h1>
      </header>

      <section className="grow flex items-center justify-center px-4">
        <FlagCard {...countryToBeChosen} />
      </section>

      <footer className="shrink-0 w-full py-6 bg-white border-t border-gray-100">
        <FlagButtonBar />
      </footer>
    </main>
  );
}
