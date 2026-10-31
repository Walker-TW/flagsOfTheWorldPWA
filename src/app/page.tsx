import FlagQuiz from "./components/FlagQuizLoader";

export default function Home() {
  return (
    <main className="h-dvh flex flex-col bg-gray-50 overflow-hidden">
      <header className="shrink-0 py-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Flags of the World
        </h1>
      </header>

      <FlagQuiz />
    </main>
  );
}
