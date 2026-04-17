/**
 * Advisor-framed assessment questions.
 * Professionally rewritten for advisors assessing clients —
 * not a text transform of consumer questions.
 */

import { buildAdvisorQuestions as buildAdvisorQuestionsRaw } from "@/lib/questions-advisor";
import type { Question } from "@/lib/questions";

export function buildAdvisorQuestions(_industrySector: string): Question[] {
  // Advisor questions are fixed (not industry-adaptive like consumer questions)
  // Industry context is applied in the interpretation layer, not the question layer
  return buildAdvisorQuestionsRaw() as unknown as Question[];
}
