"use client";

interface ActionButtonProps {
  correct: boolean;
  onPress?: () => void;
}

export default function ActionButton({ correct, onPress }: ActionButtonProps) {
  return (
    <button
      onClick={onPress}
      aria-label={correct ? "Correct answer" : "Incorrect answer"}
      aria-pressed={correct}
      className={`
        w-16 h-16
        flex items-center justify-center
        rounded-xl
        text-white
        transition-all
        duration-200
        focus:outline-none
        focus:ring-4
        focus:ring-offset-2
        active:scale-95
        ${
          correct
            ? "bg-green-500 hover:bg-green-600 focus:ring-green-400"
            : "bg-red-500 hover:bg-red-600 focus:ring-red-400"
        }
      `}
    >
      {correct ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )}
    </button>
  );
}
