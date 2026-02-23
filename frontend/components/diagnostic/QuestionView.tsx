import { useMemo } from "react";
import type { DiagnosticQuestion, QuestionOption } from "@/lib/constants";
import type { AnswerLetter } from "@/lib/types";
import AnswerButton from "./AnswerButton";

interface QuestionViewProps {
  question: DiagnosticQuestion;
  selectedAnswer: AnswerLetter | null;
  onAnswer: (letter: AnswerLetter) => void;
  shuffleSeed?: string;
}

const groupColors: Record<string, string> = {
  core: "text-emerald-700 bg-emerald-50 border-emerald-200",
  modifier: "text-blue-700 bg-blue-50 border-blue-200",
  stability: "text-amber-700 bg-amber-50 border-amber-200",
};

/**
 * Simple deterministic hash for shuffle seeding.
 * Produces a 32-bit integer from a string.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = ((hash << 5) - hash + ch) | 0;
  }
  return Math.abs(hash);
}

/**
 * Deterministic shuffle using a seeded PRNG (Mulberry32).
 * Same seed always produces same order.
 */
function seededShuffle<T>(arr: readonly T[], seed: number): T[] {
  const result = [...arr];
  let s = seed | 0;
  for (let i = result.length - 1; i > 0; i--) {
    // Mulberry32 step
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    const r = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    const j = Math.floor(r * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function QuestionView({
  question,
  selectedAnswer,
  onAnswer,
  shuffleSeed,
}: QuestionViewProps) {
  // Deterministic shuffle: seed = shuffleSeed + question id
  const shuffledOptions = useMemo(() => {
    if (!shuffleSeed) return question.options as QuestionOption[];
    const seed = hashString(`${shuffleSeed}:q${question.id}`);
    return seededShuffle(question.options, seed);
  }, [question.options, question.id, shuffleSeed]);

  return (
    <div className="space-y-8">
      {/* Group Label */}
      <div>
        <span
          className={`inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 border ${
            groupColors[question.group] || "text-gray-700 bg-gray-50 border-gray-200"
          }`}
        >
          {question.groupLabel}
        </span>
      </div>

      {/* Question Text */}
      <h2 className="text-xl md:text-2xl font-semibold text-navy-900 leading-snug">
        {question.text}
      </h2>

      {/* Answer Options — no ABCD labels, deterministically shuffled */}
      <div className="space-y-3">
        {shuffledOptions.map((option) => (
          <AnswerButton
            key={option.letter}
            letter={option.letter}
            text={option.text}
            selected={selectedAnswer === option.letter}
            onSelect={onAnswer}
          />
        ))}
      </div>
    </div>
  );
}
