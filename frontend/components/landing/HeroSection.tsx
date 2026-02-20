export default function HeroSection() {
  return (
    <section className="bg-navy-900 py-24 md:py-32">
      <div className="max-w-[1200px] mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
          Every income structure has a dependency.
          <br />
          See yours.
        </h1>

        <p className="mt-8 text-lg text-gray-300 max-w-2xl leading-relaxed">
          RunPayway&#8482; measures whether your revenue runs on systems or on
          attention.
        </p>

        <p className="mt-4 text-base text-gray-400 max-w-2xl leading-relaxed">
          Your Payway Rating is a standardized structural evaluation calibrated
          to your industry and role.
        </p>

        <div className="mt-10 space-y-2 text-sm text-gray-400 max-w-xl">
          <p>Credit ratings measure borrowing risk.</p>
          <p>The Payway Rating measures revenue exposure.</p>
        </div>
      </div>
    </section>
  );
}
