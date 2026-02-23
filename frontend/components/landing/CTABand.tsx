"use client";

export default function CTABand() {
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
    <section className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-[1100px] mx-auto px-6 text-center">
        <h2 className="text-[22px] md:text-[24px] font-semibold text-navy-900 mb-8">
          See Your Payway Rating&#8482;
        </h2>

        {/* Conversion layer */}
        <div className="space-y-2 text-[15px] text-gray-600 leading-[1.6] mb-8 max-w-lg mx-auto">
          <p>5 minutes. One-time. Immediate report.</p>
          <p>Calibrated to your industry, revenue model, and role.</p>
          <p>No subscription.</p>
          <p>No recurring charge.</p>
          <p>No consultation required.</p>
          <p className="font-semibold text-navy-900">
            $79 &middot; One-time structural diagnostic
          </p>
        </div>

        <button
          type="button"
          onClick={handleCheckout}
          className="bg-navy-900 text-white px-10 py-4 text-[16px] font-medium hover:bg-navy-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:ring-offset-2"
        >
          Start Diagnostic
        </button>
      </div>
    </section>
  );
}
