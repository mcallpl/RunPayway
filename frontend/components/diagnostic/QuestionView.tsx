import type { DiagnosticQuestion } from "@/lib/constants";
import type { AnswerLetter } from "@/lib/types";
import AnswerButton from "./AnswerButton";

interface QuestionViewProps {
  question: DiagnosticQuestion;
  selectedAnswer: AnswerLetter | null;
  onAnswer: (letter: AnswerLetter) => void;
}

const groupColors: Record<string, string> = {
  core: "text-emerald-700 bg-emerald-50 border-emerald-200",
  modifier: "text-blue-700 bg-blue-50 border-blue-200",
  stability: "text-amber-700 bg-amber-50 border-amber-200",
};

export default function QuestionView({
  question,
  selectedAnswer,
  onAnswer,
}: QuestionViewProps) {
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

      {/* Answer Options */}
      <div className="space-y-3">
        {question.options.map((option) => (
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
