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
      className={`w-full text-left p-5 border transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-navy-900 focus:ring-offset-2 group ${
        selected
          ? "border-navy-900 bg-navy-900 text-white shadow-md"
          : "border-gray-300 bg-white text-gray-900 hover:border-navy-600 hover:bg-slate-50 hover:-translate-y-[1px] hover:shadow-sm"
      }`}
      aria-pressed={selected}
    >
      <span className="text-base leading-relaxed block">{text}</span>
    </button>
  );
}
