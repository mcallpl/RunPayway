"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function Divider() {
  return <hr className="border-divider my-20" />;
}

export default function WelcomePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    assessmentTitle: "",
    email: "",
    classification: "",
    primaryIncomeModel: "",
    revenueStructure: "",
    revenueRange: "",
    industrySector: "",
  });
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const requiredFields = [
    form.email,
    form.classification,
    form.primaryIncomeModel,
    form.revenueStructure,
    form.revenueRange,
    form.industrySector,
  ];
  const isValid = requiredFields.every((v) => v.trim() !== "") && checkbox1;

  const handleSubmit = () => {
    if (!isValid) return;
    if (typeof window !== "undefined") {
      localStorage.setItem("runpayway_profile", JSON.stringify(form));
    }
    router.push("/diagnostic");
  };

  const inputClass =
    "w-full border border-divider rounded-md px-3 py-2 text-sm text-navy bg-white focus:outline-none focus:ring-1 focus:ring-navy/30";
  const selectClass =
    "w-full border border-divider rounded-md px-3 py-2 text-sm text-navy bg-white focus:outline-none focus:ring-1 focus:ring-navy/30";
  const labelClass = "block text-sm font-medium text-navy mb-1";

  return (
    <div className="mx-auto max-w-[1280px] px-10">
      {/* Page Title + Context */}
      <section className="max-w-[720px] py-24">
        <h1>Welcome</h1>
        <div className="mt-6 space-y-3 text-secondary">
          <p>
            RunPayway&trade; generates a structural income measurement under{" "}
            <strong className="text-navy">Model RP-1.0</strong>.
          </p>
          <p>
            After completion, your assessment produces a{" "}
            <strong className="text-navy">time-stamped digital snapshot</strong>{" "}
            reflecting the information provided at the time of submission.
          </p>
          <p>
            This step establishes the{" "}
            <strong className="text-navy">Income Structure Profile</strong> used
            to contextualize your Stability Index assessment.
          </p>
        </div>
        <p className="mt-4 text-sm text-secondary">Model RP-1.0 | Version 1.0</p>
      </section>

      <Divider />

      {/* Income Structure Profile Form */}
      <section className="max-w-[720px] pb-24">
        <div className="space-y-6">
          {/* Field 1: Assessment Title */}
          <div>
            <label htmlFor="assessmentTitle" className={labelClass}>
              Assessment Title
            </label>
            <input
              id="assessmentTitle"
              type="text"
              maxLength={50}
              placeholder="Assessment title"
              value={form.assessmentTitle}
              onChange={(e) => update("assessmentTitle", e.target.value)}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-secondary">
              Example: &ldquo;John Carter Income Review&rdquo; &middot;
              &ldquo;2026 Consulting Snapshot&rdquo; &middot;
              &ldquo;Baseline Income Structure&rdquo;
            </p>
          </div>

          {/* Field 2: Email */}
          <div>
            <label htmlFor="email" className={labelClass}>
              Email <span className="text-secondary font-normal">(required)</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="customer@example.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-secondary">
              Email collected at purchase.
            </p>
          </div>

          {/* Field 3: Classification */}
          <div>
            <label htmlFor="classification" className={labelClass}>
              Classification <span className="text-secondary font-normal">(required)</span>
            </label>
            <select
              id="classification"
              value={form.classification}
              onChange={(e) => update("classification", e.target.value)}
              className={selectClass}
            >
              <option value="">Select classification</option>
              <option value="Individual">Individual</option>
              <option value="Business Entity">Business Entity</option>
              <option value="Team / Partnership">Team / Partnership</option>
            </select>
          </div>

          {/* Field 4: Primary Income Model */}
          <div>
            <label htmlFor="primaryIncomeModel" className={labelClass}>
              Primary Income Model <span className="text-secondary font-normal">(required)</span>
            </label>
            <select
              id="primaryIncomeModel"
              value={form.primaryIncomeModel}
              onChange={(e) => update("primaryIncomeModel", e.target.value)}
              className={selectClass}
            >
              <option value="">Select income model</option>
              <option value="Salary-Based">Salary-Based</option>
              <option value="Commission-Based">Commission-Based</option>
              <option value="Contractual">Contractual</option>
              <option value="Asset-Based">Asset-Based</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>

          {/* Field 5: Revenue Structure */}
          <div>
            <label htmlFor="revenueStructure" className={labelClass}>
              Revenue Structure <span className="text-secondary font-normal">(required)</span>
            </label>
            <select
              id="revenueStructure"
              value={form.revenueStructure}
              onChange={(e) => update("revenueStructure", e.target.value)}
              className={selectClass}
            >
              <option value="">Select revenue structure</option>
              <option value="Primarily Active">Primarily Active</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Recurring">Recurring</option>
              <option value="Asset-Based">Asset-Based</option>
            </select>
          </div>

          {/* Field 6: Revenue Range (Monthly) */}
          <div>
            <label htmlFor="revenueRange" className={labelClass}>
              Revenue Range (Monthly) <span className="text-secondary font-normal">(required)</span>
            </label>
            <select
              id="revenueRange"
              value={form.revenueRange}
              onChange={(e) => update("revenueRange", e.target.value)}
              className={selectClass}
            >
              <option value="">Select revenue range</option>
              <option value="Under $5,000">Under $5,000</option>
              <option value="$5,000\u2013$10,000">$5,000&ndash;$10,000</option>
              <option value="$10,001\u2013$25,000">$10,001&ndash;$25,000</option>
              <option value="$25,001\u2013$50,000">$25,001&ndash;$50,000</option>
              <option value="$50,001\u2013$100,000">$50,001&ndash;$100,000</option>
              <option value="Over $100,000">Over $100,000</option>
            </select>
            <p className="mt-1 text-xs text-secondary">
              Ranges represent approximate monthly revenue scale and are used only
              for contextual reporting.
            </p>
          </div>

          {/* Field 7: Industry Sector */}
          <div>
            <label htmlFor="industrySector" className={labelClass}>
              Industry Sector <span className="text-secondary font-normal">(required)</span>
            </label>
            <select
              id="industrySector"
              value={form.industrySector}
              onChange={(e) => update("industrySector", e.target.value)}
              className={selectClass}
            >
              <option value="">Select industry sector</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Technology">Technology</option>
              <option value="Consulting">Consulting</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Construction">Construction</option>
              <option value="Retail">Retail</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <Divider />

        {/* Acknowledgements */}
        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checkbox1}
              onChange={(e) => setCheckbox1(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-divider"
            />
            <span className="text-sm text-secondary">
              I confirm the information I provide is accurate to the best of my
              knowledge.
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checkbox2}
              onChange={(e) => setCheckbox2(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-divider"
            />
            <span className="text-sm text-secondary">
              I understand this assessment generates a time-stamped snapshot based
              on the information I provide.
            </span>
          </label>
        </div>

        {/* Primary CTA */}
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`mt-8 bg-navy text-white px-6 py-3 rounded-md text-sm font-medium ${
            isValid ? "hover:opacity-90" : "opacity-50 cursor-not-allowed"
          }`}
        >
          Begin Diagnostic
        </button>
      </section>
    </div>
  );
}
