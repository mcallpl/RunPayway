import type { AnswerLetter } from "@/lib/types";

interface AnswerButtonProps {
  letter: AnswerLetter;
  text: string;
  selected: boolean;
  onSelect: (letter: AnswerLetter) => void;
}

export default function AnswerButton({
  letter,
  text,
  selected,
  onSelect,
}: AnswerButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(letter)}
      className={`w-full text-left p-5 border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:ring-offset-2 group ${
        selected
          ? "border-navy-900 bg-navy-900 text-white"
          : "border-gray-300 bg-white text-gray-900 hover:border-navy-600 hover:bg-slate-50"
      }`}
      aria-pressed={selected}
    >
      <div className="flex items-start gap-4">
        <span
          className={`flex-shrink-0 w-8 h-8 flex items-center justify-center text-sm font-semibold border ${
            selected
              ? "border-white/30 text-white"
              : "border-gray-300 text-gray-500 group-hover:border-navy-600 group-hover:text-navy-700"
          }`}
        >
          {letter}
        </span>
        <span className="text-base leading-relaxed pt-0.5">{text}</span>
      </div>
    </button>
  );
}
