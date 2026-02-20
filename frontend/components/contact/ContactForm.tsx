"use client";

import { useState } from "react";

export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact_submit.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          checkout_email: checkoutEmail || undefined,
          message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setEmail("");
        setCheckoutEmail("");
        setMessage("");
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Unable to send message. Please try again later.");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-gray-200 p-8 text-center">
        <p className="text-lg font-semibold text-navy-900 mb-2">
          Message Received
        </p>
        <p className="text-gray-600">
          We&apos;ll review your message and respond within 1&ndash;2 business
          days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Address */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-navy-900 mb-1.5"
        >
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-navy-900 rounded-none"
        />
      </div>

      {/* Checkout Email */}
      <div>
        <label
          htmlFor="checkout-email"
          className="block text-sm font-medium text-navy-900 mb-1.5"
        >
          Email Used at Checkout{" "}
          <span className="text-gray-400 font-normal">(if different)</span>
        </label>
        <input
          type="email"
          id="checkout-email"
          name="checkout_email"
          value={checkoutEmail}
          onChange={(e) => setCheckoutEmail(e.target.value)}
          placeholder="checkout@email.com"
          className="w-full border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-navy-900 rounded-none"
        />
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-navy-900 mb-1.5"
        >
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your question or issue..."
          className="w-full border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-navy-900 rounded-none resize-vertical"
        />
      </div>

      {/* Error */}
      {status === "error" && (
        <p className="text-red-600 text-sm">{errorMessage}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="bg-navy-900 text-white px-8 py-3 font-medium hover:bg-navy-800 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-900 focus:ring-offset-2 rounded-none disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending\u2026" : "Send Message"}
      </button>
    </form>
  );
}
