export default function ReportPreview() {
  const bands = [
    { label: "0-39", color: "bg-red-800", width: "w-[39%]" },
    { label: "40-59", color: "bg-amber-700", width: "w-[20%]" },
    { label: "60-79", color: "bg-sky-700", width: "w-[20%]" },
    { label: "80-100", color: "bg-emerald-700", width: "w-[21%]" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-md mx-auto px-6">
        <div className="border border-gray-200 shadow-sm p-8">
          <p className="text-xs text-gray-400 tracking-wide uppercase">
            Assessment ID: RP-2026-0041-XC
          </p>

          <div className="mt-8 text-center">
            <p className="text-6xl font-bold text-navy-900 leading-none">58</p>
            <p className="mt-3 text-sm text-gray-600">
              Classification: Attention-Weighted
            </p>
          </div>

          <div className="mt-8">
            <div className="flex h-3 w-full overflow-hidden">
              {bands.map((band) => (
                <div
                  key={band.label}
                  className={`${band.color} ${band.width}`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>0</span>
              <span>40</span>
              <span>60</span>
              <span>80</span>
              <span>100</span>
            </div>

            <div className="mt-6 flex items-center justify-center">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-navy-900 -mb-[1px] ml-[54%] -translate-x-1/2" />
            </div>
          </div>

          <p className="mt-8 text-xs text-gray-400 text-center">
            Calibrated to: Consulting Services
          </p>
        </div>
      </div>
    </section>
  );
}
