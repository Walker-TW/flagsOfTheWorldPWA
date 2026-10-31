"use client";

import ActionButton from "./ActionButton";

interface FlagButtonBarProps {
  onAnswer: (correct: boolean) => void;
}

export default function FlagButtonBar({ onAnswer }: FlagButtonBarProps) {
  return (
    <div className="flex gap-4 justify-center">
      <ActionButton correct={false} onPress={() => onAnswer(false)} />
      <ActionButton correct={true} onPress={() => onAnswer(true)} />
    </div>
  );
}
