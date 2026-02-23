const CARDS = [
  {
    label: "WHEN IT APPEARS",
    title: "Dependency becomes visible under pressure.",
    bullets: [
      "extended absence",
      "rapid growth",
      "client loss",
      "regulatory change",
      "delegation requirements",
    ],
    close:
      "Income supported by structure continues. Income supported by personal involvement requires you to continue.",
  },
  {
    label: "WHAT IS MEASURED",
    title: "RunPayway\u2122 evaluates how income is constructed.",
    body: "It determines whether continuation depends primarily on:",
    bullets: [
      "personal involvement",
      "repeatable systems",
      "enforceable agreements",
      "concentrated relationships",
      "transferable processes",
    ],
    close:
      "It does not measure revenue size or growth. It measures structural continuity.",
  },
  {
    label: "WHAT YOU RECEIVE",
    title: "A dated structural report with a defined reference point.",
    bullets: [
      "Payway Rating\u2122 (0\u2013100)",
      "Dependency Classification",
      "% supported by structure",
      "% requiring direct involvement",
      "Structural pressure indicators",
      "Model Version (RP-1.0)",
      "Unique Assessment ID",
    ],
    close:
      "Identical inputs under the same model version produce identical results.",
  },
  {
    label: "THE SCORE",
    title: "The Payway Rating\u2122 is a structural exposure score.",
    body: "Higher ratings indicate system-supported income. Lower ratings indicate presence-dependent income.",
    close: "It defines the current continuity condition.",
  },
  {
    label: "RATING BANDS",
    title: "Every score falls into a fixed band.",
    stackedLines: [
      "80\u2013100 \u2014 Structurally Supported",
      "60\u201379 \u2014 Mixed Support",
      "40\u201359 \u2014 Attention-Weighted",
      "0\u201339 \u2014 Attention-Dependent",
    ],
    close: "Band thresholds are fixed. Movement reflects structural change.",
  },
  {
    label: "SCOPE + STANDARDS",
    title: "One-time diagnostic. Version-controlled output.",
    body: "RunPayway\u2122 produces a finalized digital report reflecting how income is structured at the time of assessment. It does not provide financial, legal, or investment advice. It provides structural clarity.",
    close: "Model Version: RP-1.0. Standards remain fixed within each version.",
  },
];

export default function CardGrid() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {CARDS.map((card) => (
            <div
              key={card.label}
              className="flex flex-col rounded-xl bg-white px-5 py-5 md:px-7 md:py-7"
              style={{
                border: "1px solid rgba(11,22,35,0.10)",
              }}
            >
              {/* Micro-label */}
              <p className="text-[12px] uppercase tracking-[0.08em] text-gray-400 font-medium mb-3">
                {card.label}
              </p>

              {/* Title */}
              <h3 className="text-[16px] md:text-[18px] font-semibold text-navy-900 leading-snug mb-4">
                {card.title}
              </h3>

              {/* Body / Bullets — flex-1 pushes close-line down */}
              <div className="flex-1">
                {card.body && (
                  <p className="text-[15px] text-gray-600 leading-[1.6] mb-3">
                    {card.body}
                  </p>
                )}

                {card.bullets && (
                  <ul className="space-y-1.5 mb-3">
                    {card.bullets.map((b) => (
                      <li
                        key={b}
                        className="text-[15px] text-gray-600 leading-[1.6] flex items-start gap-2"
                      >
                        <span className="text-gray-400 mt-0.5">&bull;</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {card.stackedLines && (
                  <div className="space-y-1.5 mb-3">
                    {card.stackedLines.map((line) => (
                      <p
                        key={line}
                        className="text-[15px] text-gray-600 leading-[1.6]"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Close line — auto-aligned to bottom */}
              <p className="text-[14px] text-gray-500 leading-[1.55] mt-4 pt-4 border-t border-gray-100 line-clamp-2">
                {card.close}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
