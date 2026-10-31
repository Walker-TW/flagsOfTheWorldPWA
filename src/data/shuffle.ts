// A shuffled copy of `items` (Fisher–Yates). Uses Math.random, so call it on
// the client: see the note on prerendering in CLAUDE.md.
export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
