"use client";

import { useState } from "react";

export default function StandardCTAPrimary() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
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
        setLoading(false);
      }
    } catch {
      alert("Unable to connect. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="text-center py-12">
      {/* Pre-line */}
      <p className="text-[16px] text-gray-700 leading-[1.6] mb-6">
        Measurement replaces assumption.
      </p>

      {/* Button */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="bg-[#0B1F2E] text-white px-10 py-4 text-[16px] font-medium hover:opacity-90 transition-opacity disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#0B1F2E] focus:ring-offset-2"
      >
        {loading
          ? "Loading\u2026"
          : "Initiate Formal Structural Assessment \u2014 $79"}
      </button>

      {/* Under-button lines */}
      <div className="mt-4 space-y-1 text-[14px] text-gray-500">
        <p>One-time deterministic measurement</p>
        <p>Immediate formal report issuance</p>
        <p>No subscription model</p>
      </div>
    </div>
  );
}
