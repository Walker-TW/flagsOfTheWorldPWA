import Image from "next/image";
import Link from "next/link";
import type { QuizRecord } from "@/data/quizHistory";
import type { Country } from "@/data/types";
import { AnswerTimeChart, ContinentChart, ScoreHistoryChart } from "./QuizCharts";

export interface Answer {
  country: Country;
  correct: boolean;
  ms: number;
}

interface QuizResultsProps {
  answers: Answer[];
  history: QuizRecord[];
  onRestart: () => void;
}

function longestStreak(answers: Answer[]): number {
  let best = 0;
  let current = 0;
  for (const answer of answers) {
    current = answer.correct ? current + 1 : 0;
    best = Math.max(best, current);
  }
  return best;
}

function formatDuration(ms: number): string {
  const seconds = Math.round(ms / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function QuizResults({ answers, history, onRestart }: QuizResultsProps) {
  const correct = answers.filter((a) => a.correct).length;
  const incorrect = answers.length - correct;
  const percent = Math.round((correct / answers.length) * 100);
  const totalMs = answers.reduce((sum, a) => sum + a.ms, 0);
  const missed = answers.filter((a) => !a.correct).map((a) => a.country);

  const stats = [
    { label: "Best streak", value: longestStreak(answers) },
    { label: "Total time", value: formatDuration(totalMs) },
    { label: "Per flag", value: `${(totalMs / answers.length / 1000).toFixed(1)}s` },
  ];

  return (
    <section className="grow min-h-0 overflow-y-auto flex justify-center px-4 py-4">
      <div className="my-auto flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-md w-80 text-center">
        <div className="text-gray-500 text-sm">Quiz complete</div>
        <div className="text-5xl font-bold text-gray-800">{percent}%</div>
        <div className="text-gray-600">
          <span className="text-green-600 font-medium">{correct} correct</span>
          {" · "}
          <span className="text-red-600 font-medium">{incorrect} incorrect</span>
        </div>

        <dl className="grid grid-cols-3 gap-2 w-full">
          {stats.map(({ label, value }) => (
            <div key={label} className="flex flex-col-reverse py-2 rounded-lg bg-gray-50">
              <dt className="text-xs text-gray-500">{label}</dt>
              <dd className="text-lg font-semibold text-gray-800 tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>

        <AnswerTimeChart answers={answers} />
        <ContinentChart answers={answers} />
        <ScoreHistoryChart history={history} />

        {missed.length > 0 && (
          <div className="w-full text-left">
            <div className="text-sm font-medium text-gray-600 mb-2">Flags to practise</div>
            <ul className="max-h-48 overflow-y-auto flex flex-col gap-2">
              {missed.map((country) => (
                <li key={country.flagId} className="flex items-center gap-3 text-sm text-gray-700">
                  <Image
                    src={`/nationalFlags/${country.flagId.toLowerCase()}.svg`}
                    alt=""
                    width={32}
                    height={24}
                    className="w-8 h-6 object-contain shrink-0"
                  />
                  {country.name}
                </li>
              ))}
            </ul>
          </div>
        )}

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
