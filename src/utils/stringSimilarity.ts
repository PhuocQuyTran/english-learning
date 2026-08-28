export function calculateSimilarity(
  expected: string,
  actual: string,
): number {
  if (!expected || !actual) return 0;

  const normalize = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^\w\s\d]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const exp = normalize(expected);
  const act = normalize(actual);

  if (!exp) return 0;
  if (exp === act) return 100;

  // Simple word matching logic instead of heavy Levenshtein for now
  const expWords = exp.split(" ");
  const actWords = act.split(" ");
  
  if (expWords.length === 0) return 0;

  let matchCount = 0;
  for (const word of expWords) {
    const idx = actWords.indexOf(word);
    if (idx !== -1) {
      matchCount++;
      actWords.splice(idx, 1);
    }
  }

  return Math.round((matchCount / expWords.length) * 100);
}
