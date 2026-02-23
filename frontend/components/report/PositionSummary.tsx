interface PositionSummaryProps {
  text: string;
}

export default function PositionSummary({ text }: PositionSummaryProps) {
  // Split on double newlines to render paragraphs (Identity / Explanation / Constraint)
  const paragraphs = text.split(/\n\n+/).filter(Boolean);

  return (
    <div className="py-14 md:py-[72px] border-t border-gray-100">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 mb-6">
        Structural Position
      </h2>

      <div className="space-y-4">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className={`text-base text-gray-700 leading-[1.6] ${
              i === 0 ? "font-semibold text-navy-900" : ""
            }`}
          >
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
