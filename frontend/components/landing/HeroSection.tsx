"use client";

import { useEffect, useState } from "react";

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleCheckout = async () => {
    try {
      const response = await fetch(
        "https://peoplestar.com/RunPayway/api/create_checkout.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }
      );
      const data = await response.json();

      if (data.success && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert("Unable to start checkout. Please try again.");
      }
    } catch {
      alert("Unable to connect. Please try again.");
    }
  };

  return (
    <section className="bg-navy-900 overflow-hidden" style={{ paddingTop: "96px", paddingBottom: "80px" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        {/* H1 */}
        <h1
          className={`text-[40px] md:text-[44px] font-bold text-white leading-tight tracking-tight transition-all duration-700 ease-out ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          The Standard for Revenue Exposure.
        </h1>

        {/* Subhead */}
        <p
          className={`mt-4 md:mt-5 text-lg text-gray-300 max-w-2xl leading-relaxed transition-all duration-700 ease-out ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          RunPayway&#8482; issues a formal Payway Rating&#8482; that shows
          whether your income runs on systems &mdash; or on you.
        </p>

        {/* Contrast Lines */}
        <div
          className={`mt-4 space-y-2 text-base text-gray-400 max-w-xl transition-all duration-700 ease-out ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <p>Income supported by structure continues.</p>
          <p>Income supported by presence pauses.</p>
        </div>

        {/* Authority Close Line */}
        <p
          className={`mt-6 text-white text-base font-medium transition-all duration-700 ease-out ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          Know which one you have.
        </p>

        {/* Primary CTA */}
        <div
          className={`mt-8 transition-all duration-700 ease-out ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          <button
            type="button"
            onClick={handleCheckout}
            className="bg-navy-900 text-white border border-white/20 px-8 py-4 text-lg font-medium rounded hover:bg-navy-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-navy-900"
          >
            See Your Payway Rating&#8482;
          </button>

          <p className="mt-2 text-sm text-gray-400">
            $79 &middot; One-time structural diagnostic &middot; Immediate
            formal report
          </p>

          <p className="mt-1.5 text-xs text-gray-500">
            Private. Not publicly indexed.
          </p>
        </div>
      </div>
    </section>
  );
}
