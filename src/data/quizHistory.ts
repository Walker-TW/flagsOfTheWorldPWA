// Finished quizzes are kept in localStorage so the score trend works offline.
// It lives on this device only, and can be wiped if the browser clears site data.

export interface QuizRecord {
  date: number;
  total: number;
  correct: number;
  ms: number;
}

const STORAGE_KEY = "quizHistory";
const MAX_RECORDS = 50;

export function loadHistory(): QuizRecord[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveQuiz(record: QuizRecord): QuizRecord[] {
  const history = [...loadHistory(), record].slice(-MAX_RECORDS);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // Storage full or blocked: the chart still shows this session's quizzes.
  }
  return history;
}
