/**
 * Advisor-framed assessment questions.
 * Same 6 questions as consumer flow, reframed to third person
 * so advisors can answer on behalf of their clients.
 */

import { buildQuestions, type Question } from "@/lib/questions";

function toThirdPerson(text: string): string {
  return text
    .replace(/\byour total income\b/gi, "your client's total income")
    .replace(/\byour monthly income\b/gi, "your client's monthly income")
    .replace(/\byour income\b/gi, "your client's income")
    .replace(/\bof your\b/gi, "of your client's")
    .replace(/\bIf you stopped\b/gi, "If your client stopped")
    .replace(/\byour highest\b/gi, "your client's highest")
    .replace(/\byour lowest\b/gi, "your client's lowest")
    .replace(/\byour average\b/gi, "your client's average")
    // Catch standalone "your" at start of sentence
    .replace(/^Your /gm, "Your client's ");
}

export function buildAdvisorQuestions(industrySector: string): Question[] {
  const base = buildQuestions(industrySector);
  return base.map(q => ({
    ...q,
    prompt: toThirdPerson(q.prompt),
    note: q.note ? toThirdPerson(q.note) : undefined,
    definition: q.definition ? toThirdPerson(q.definition) : undefined,
  }));
}
