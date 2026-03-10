"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const CLASSIFICATIONS = [
  "Individual",
  "Business Entity",
  "Team / Partnership",
];

const OPERATING_STRUCTURES = [
  "Employee (W-2)",
  "Independent Contractor",
  "Business Owner / Firm",
  "Partnership",
  "Nonprofit Organization",
];

const PRIMARY_INCOME_MODELS = [
  "Employee Salary",
  "Commission-Based",
  "Contract-Based",
  "Independent Contractor",
  "Team / Partnership Income",
  "Business Ownership",
  "Professional Practice",
  "Consulting / Client Services",
  "Agency / Brokerage Income",
  "Project-Based Work",
  "Subscription / Retainer Services",
  "Licensing / Royalty Income",
  "Product Sales",
  "Digital Product Sales",
  "Creator / Media Income",
  "Affiliate / Referral Income",
  "Real Estate Rental Income",
  "Real Estate Brokerage Income",
  "Franchise Ownership",
  "Investment / Dividend Income",
  "Hybrid Multiple Income Sources",
];

const REVENUE_STRUCTURES = [
  "Mostly One-Time Payments",
  "Repeat Clients / Returning Customers",
  "Monthly Recurring Payments",
  "Contracted Multi-Month Revenue",
  "Long-Term Recurring Income",
  "Mixed Revenue Structure",
];

const REVENUE_EXAMPLES: Record<string, string> = {
  "Mostly One-Time Payments": "commissions, project fees, one-off sales",
  "Repeat Clients / Returning Customers": "returning consulting clients",
  "Monthly Recurring Payments": "retainers, memberships, subscriptions",
  "Contracted Multi-Month Revenue": "signed engagements lasting several months",
  "Long-Term Recurring Income": "recurring advisory services or licensing",
  "Mixed Revenue Structure": "combination of one-time and recurring income",
};

const INDUSTRY_SECTORS = [
  "Real Estate",
  "Finance / Banking",
  "Insurance",
  "Technology",
  "Healthcare",
  "Legal Services",
  "Consulting / Professional Services",
  "Sales / Brokerage",
  "Media / Entertainment",
  "Construction / Trades",
  "Retail / E-Commerce",
  "Hospitality / Food Service",
  "Transportation / Logistics",
  "Manufacturing",
  "Education",
  "Nonprofit / Public Sector",
  "Agriculture",
  "Energy / Utilities",
  "Other",
];

export default function InitializationPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    assessment_title: "",
    classification: "",
    operating_structure: "",
    primary_income_model: "",
    revenue_structure: "",
    industry_sector: "",
    recipient_email: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const isValid =
    form.classification &&
    form.operating_structure &&
    form.primary_income_model &&
    form.revenue_structure &&
    form.industry_sector &&
    form.recipient_email.includes("@");

  const handleBegin = () => {
    sessionStorage.setItem("rp_profile", JSON.stringify(form));
    router.push("/diagnostic");
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">
          Income Stability Assessment
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Model RP-1.0 | Version 1.0
        </p>
      </div>

      {/* Record Header */}
      <div className="border border-gray-200 rounded-lg bg-white p-5 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-800">
            Assessment Record
          </span>
          <span className="text-xs text-neutral-400">
            Record Status: Initializing
          </span>
        </div>
        <p className="text-xs text-neutral-400">Issued Under: RunPayway™</p>
      </div>

      {/* Assessment Profile */}
      <section className="border border-gray-200 rounded-lg bg-white p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-neutral-800">
            Assessment Profile
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Administrative identification of this assessment record.
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1">
            Assessment Title (Name / Organization)
          </label>
          <input
            type="text"
            value={form.assessment_title}
            onChange={(e) => update("assessment_title", e.target.value)}
            placeholder="e.g. John Smith or Smith Consulting"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1">
            Classification
          </label>
          <select
            value={form.classification}
            onChange={(e) => update("classification", e.target.value)}
          >
            <option value="">Select</option>
            {CLASSIFICATIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1">
            Operating Structure
          </label>
          <select
            value={form.operating_structure}
            onChange={(e) => update("operating_structure", e.target.value)}
          >
            <option value="">Select</option>
            {OPERATING_STRUCTURES.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Income Context */}
      <section className="border border-gray-200 rounded-lg bg-white p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-neutral-800">
            Income Context
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Describe the structural characteristics of your income system. These
            fields provide context for the stability assessment and do not
            influence scoring.
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1">
            Primary Income Model
          </label>
          <select
            value={form.primary_income_model}
            onChange={(e) => update("primary_income_model", e.target.value)}
          >
            <option value="">Select</option>
            {PRIMARY_INCOME_MODELS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1">
            Revenue Structure
          </label>
          <p className="text-[11px] text-neutral-400 mb-1.5">How your income usually arrives.</p>
          <select
            value={form.revenue_structure}
            onChange={(e) => update("revenue_structure", e.target.value)}
          >
            <option value="">Select</option>
            {REVENUE_STRUCTURES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {form.revenue_structure && REVENUE_EXAMPLES[form.revenue_structure] && (
            <p className="text-[10px] text-neutral-400 mt-1 italic">
              Example: {REVENUE_EXAMPLES[form.revenue_structure]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1">
            Industry Sector
          </label>
          <select
            value={form.industry_sector}
            onChange={(e) => update("industry_sector", e.target.value)}
          >
            <option value="">Select</option>
            {INDUSTRY_SECTORS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Recipient Email */}
      <section className="border border-gray-200 rounded-lg bg-white p-5 space-y-4">
        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1">
            Recipient Email
          </label>
          <input
            type="email"
            value={form.recipient_email}
            onChange={(e) => update("recipient_email", e.target.value)}
            placeholder=""
          />
        </div>
      </section>

      {/* Assessment Control */}
      <div>
        <button
          disabled={!isValid}
          onClick={handleBegin}
          className="px-6 py-2.5 text-sm font-medium text-white rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: isValid ? "#1A1A1A" : undefined }}
        >
          Begin Diagnostic
        </button>
      </div>
    </div>
  );
}
