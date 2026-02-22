"use client";

import { useState } from "react";

export default function StandardCTA() {
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
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="bg-navy-900 text-white px-8 py-4 text-lg font-medium rounded-[5px] hover:bg-navy-800 transition-colors disabled:opacity-60"
    >
      {loading ? "Loading\u2026" : "See Your Payway Rating\u2122 \u2014 $79"}
    </button>
  );
}
