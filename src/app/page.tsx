import FlagCard from "./components/FlagCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-center text-gray-800 py-8">
        Flags of the World
      </h1>
      <FlagCard />
    </main>
  );
}
