"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

interface CTABlockProps {
  variant: "primary" | "mid" | "final";
}

export default function CTABlock({ variant }: CTABlockProps) {
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
    <section className="py-16 bg-slate-50">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <ScrollReveal>
          <button
            type="button"
            onClick={handleCheckout}
            className="inline-block bg-navy-900 text-white px-8 py-4 text-lg font-medium hover:bg-navy-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:ring-offset-2 rounded-none"
          >
            See Your Payway Rating
          </button>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <p className="mt-4 text-sm text-gray-500">
            $79 &middot; One-time structural diagnostic
          </p>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          {variant === "mid" ? (
            <p className="mt-2 text-xs text-gray-400">
              Calibrated to your industry and role. Immediate report.
            </p>
          ) : (
            <p className="mt-2 text-xs text-gray-400">
              Immediate downloadable report. No subscription.
            </p>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
