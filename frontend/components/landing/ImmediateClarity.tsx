export default function ImmediateClarity() {
  const items = [
    "Approximately 5 minutes.",
    "Industry- and role-calibrated.",
    "Complete on desktop or mobile.",
    "Instant downloadable report upon completion.",
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <p key={item} className="text-sm text-gray-700 leading-relaxed">
              {item}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
