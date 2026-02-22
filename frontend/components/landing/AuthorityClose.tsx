"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

export default function AuthorityClose() {
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
    <section style={{ paddingTop: "120px", paddingBottom: "48px" }}>
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <ScrollReveal>
          <div className="space-y-6 text-gray-700 text-lg max-w-2xl mx-auto">
            <p>Revenue performance is tracked constantly.</p>
            <p>Revenue dependency rarely is.</p>
            <p>
              The Payway Rating&#8482; gives you a defined reference point.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="mt-10">
            <button
              type="button"
              onClick={handleCheckout}
              className="bg-navy-900 text-white px-8 py-4 text-lg font-medium rounded hover:bg-navy-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:ring-offset-2"
            >
              See Your Payway Rating&#8482;
            </button>

            <p className="mt-2 text-sm text-gray-500">
              $79 &middot; One-time structural diagnostic
            </p>

            <p className="mt-2 text-xs text-gray-400">
              Immediate downloadable report. No subscription. No recurring charges.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
