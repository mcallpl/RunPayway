"use client";

import { useEffect, useState } from "react";

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="bg-navy-900 py-24 md:py-32 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        <h1
          className={`text-4xl md:text-5xl font-bold text-white leading-tight transition-all duration-700 ease-out ${
            loaded
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          Every income structure has a dependency.
          <br />
          See yours.
        </h1>

        <p
          className={`mt-8 text-lg text-gray-300 max-w-2xl leading-relaxed transition-all duration-700 ease-out ${
            loaded
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          RunPayway&#8482; measures whether your revenue runs on systems or on
          attention.
        </p>

        <p
          className={`mt-4 text-base text-gray-400 max-w-2xl leading-relaxed transition-all duration-700 ease-out ${
            loaded
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          Your Payway Rating is a standardized structural evaluation calibrated
          to your industry and role.
        </p>

        <div
          className={`mt-10 space-y-2 text-sm text-gray-400 max-w-xl transition-all duration-700 ease-out ${
            loaded
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <p>Credit ratings measure borrowing risk.</p>
          <p>The Payway Rating measures revenue exposure.</p>
        </div>
      </div>
    </section>
  );
}
