// Pure helpers shared by server pages and client views. No file access here.
export interface AnswerView {
  option: string;
  why: string;
  because: string[];
}

/** Every answer whose because chain reaches the question, directly or through other answers. */
export function followers(answers: Record<string, AnswerView>, question: string) {
  const follows = new Set<string>([question]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const [id, a] of Object.entries(answers))
      if (!follows.has(id) && a.because.some((b) => follows.has(b))) {
        follows.add(id);
        grew = true;
      }
  }
  follows.delete(question);
  return [...follows];
}
