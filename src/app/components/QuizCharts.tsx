"use client";

import { useState, type PointerEvent, type ReactNode } from "react";
import type { QuizRecord } from "@/data/quizHistory";
import type { Answer } from "./QuizResults";

// Plain SVG, no chart library: it ships inside the app bundle, so it works offline.

const WIDTH = 256;
const CORRECT = "#22c55e"; // green-500, matches the ✓ button
const MISSED = "#ef4444"; // red-500, matches the ✗ button
const INK = "#1f2937"; // gray-800
const GRID = "#e5e7eb"; // gray-200

// A bar with a rounded top and a square base sitting on the baseline.
function barPath(x: number, y: number, w: number, h: number): string {
  const r = Math.min(4, w / 2, h);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}

// Hovering (mouse) or tapping (touch) picks a mark; its details show in the header.
function useActiveMark() {
  const [active, setActive] = useState<number | null>(null);
  const clear = (e: PointerEvent) => {
    if (e.pointerType === "mouse") setActive(null);
  };
  return { active, setActive, clear };
}

function ChartFrame({
  title,
  readout,
  children,
}: {
  title: string;
  readout: ReactNode;
  children: ReactNode;
}) {
  return (
    <figure className="w-full text-left">
      <figcaption className="flex justify-between items-baseline gap-2 mb-2 text-sm">
        <span className="font-medium text-gray-600">{title}</span>
        <span className="text-xs text-gray-500 tabular-nums truncate">
          {readout}
        </span>
      </figcaption>
      {children}
    </figure>
  );
}

function LegendSwatch({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

export function AnswerTimeChart({ answers }: { answers: Answer[] }) {
  const { active, setActive, clear } = useActiveMark();
  const height = 80;
  const maxMs = Math.max(...answers.map((a) => a.ms), 1);
  const slot = WIDTH / answers.length;
  // Keep a 2px gap between bars until there are too many to fit one.
  const gap = slot >= 6 ? 2 : 0;
  const current = active === null ? null : answers[active];

  return (
    <ChartFrame
      title="Time per flag"
      readout={
        current ? (
          `${current.country.name} · ${(current.ms / 1000).toFixed(1)}s ${current.correct ? "✓" : "✗"}`
        ) : (
          <span className="flex gap-3">
            <LegendSwatch color={CORRECT} label="Correct" />
            <LegendSwatch color={MISSED} label="Missed" />
          </span>
        )
      }
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${height}`}
        className="w-full h-auto touch-none"
        role="img"
        aria-label={`Answer time for each of ${answers.length} flags, slowest ${(maxMs / 1000).toFixed(1)} seconds`}
        onPointerLeave={clear}
      >
        <line
          x1={0}
          x2={WIDTH}
          y1={height - 0.5}
          y2={height - 0.5}
          stroke={GRID}
        />
        {answers.map((answer, i) => {
          const h = Math.max(2, (answer.ms / maxMs) * (height - 4));
          return (
            <g key={answer.country.flagId}>
              <path
                d={barPath(
                  i * slot + gap / 2,
                  height - h,
                  Math.max(slot - gap, 0.5),
                  h,
                )}
                fill={answer.correct ? CORRECT : MISSED}
                opacity={active === null || active === i ? 1 : 0.35}
              />
              <rect
                x={i * slot}
                y={0}
                width={slot}
                height={height}
                fill="transparent"
                onPointerEnter={() => setActive(i)}
                onPointerDown={() => setActive(i)}
              />
            </g>
          );
        })}
      </svg>
    </ChartFrame>
  );
}

export function ContinentChart({ answers }: { answers: Answer[] }) {
  const byContinent = new Map<string, { correct: number; total: number }>();
  for (const { country, correct } of answers) {
    const tally = byContinent.get(country.continent) ?? {
      correct: 0,
      total: 0,
    };
    tally.total += 1;
    if (correct) tally.correct += 1;
    byContinent.set(country.continent, tally);
  }
  const rows = [...byContinent.entries()]
    .map(([continent, t]) => ({ continent, ...t, share: t.correct / t.total }))
    .sort((a, b) => a.share - b.share || b.total - a.total);

  return (
    <ChartFrame title="By continent" readout="Weakest First">
      <ul className="flex flex-col gap-1.5">
        {rows.map((row) => (
          <li
            key={row.continent}
            className="grid grid-cols-[6.5rem_1fr_2.5rem] items-center gap-2 text-xs text-gray-600"
          >
            <span className="truncate">{row.continent}</span>
            <span className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <span
                className="block h-full rounded-full"
                style={{ width: `${row.share * 100}%`, backgroundColor: INK }}
              />
            </span>
            <span className="text-right tabular-nums">
              {row.correct}/{row.total}
            </span>
          </li>
        ))}
      </ul>
    </ChartFrame>
  );
}

const formatDate = (date: number) =>
  new Date(date).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });

export function ScoreHistoryChart({ history }: { history: QuizRecord[] }) {
  const { active, setActive, clear } = useActiveMark();
  const recent = history.slice(-20);

  if (recent.length < 2) {
    return (
      <ChartFrame title="Your scores" readout="">
        <p className="text-xs text-gray-500">
          Finish another quiz to see your trend.
        </p>
      </ChartFrame>
    );
  }

  const height = 96;
  const pad = { top: 8, right: 8, bottom: 8, left: 28 };
  const plotW = WIDTH - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const percent = (r: QuizRecord) => Math.round((r.correct / r.total) * 100);
  const x = (i: number) => pad.left + (i / (recent.length - 1)) * plotW;
  const y = (p: number) => pad.top + (1 - p / 100) * plotH;
  const points = recent.map((r, i) => `${x(i)},${y(percent(r))}`).join(" ");
  const best = Math.max(...history.map(percent));
  const shown = active ?? recent.length - 1;
  const current = recent[shown];

  return (
    <ChartFrame
      title="Your scores"
      readout={`${formatDate(current.date)} · ${current.correct}/${current.total} · ${percent(current)}%`}
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${height}`}
        className="w-full h-auto touch-none"
        role="img"
        aria-label={`Score for your last ${recent.length} quizzes, latest ${percent(recent.at(-1)!)} percent, best ${best} percent`}
        onPointerLeave={clear}
      >
        {[0, 50, 100].map((p) => (
          <g key={p}>
            <line
              x1={pad.left}
              x2={WIDTH - pad.right}
              y1={y(p)}
              y2={y(p)}
              stroke={GRID}
            />
            <text
              x={pad.left - 6}
              y={y(p)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-gray-400 text-[9px]"
            >
              {p}%
            </text>
          </g>
        ))}
        <polyline
          points={points}
          fill="none"
          stroke={INK}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {recent.map((r, i) => (
          <circle
            key={r.date}
            cx={x(i)}
            cy={y(percent(r))}
            r={i === shown ? 5 : 3}
            fill={INK}
            stroke="white"
            strokeWidth={2}
          />
        ))}
        {recent.map((r, i) => (
          <rect
            key={r.date}
            x={x(i) - plotW / (recent.length - 1) / 2}
            y={0}
            width={plotW / (recent.length - 1)}
            height={height}
            fill="transparent"
            onPointerEnter={() => setActive(i)}
            onPointerDown={() => setActive(i)}
          />
        ))}
      </svg>
      <p className="mt-1 text-xs text-gray-500">Best: {best}%</p>
    </ChartFrame>
  );
}
