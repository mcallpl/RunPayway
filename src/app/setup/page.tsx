"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ROLES = [
  "Independent Operator",
  "Business Owner",
  "Contractor / Consultant",
  "Commission-Based Professional",
  "W-2 Professional with Variable Compensation",
  "Hybrid Income Earner",
];

const REVENUE_MODELS = [
  "Recurring Contract Revenue",
  "Project-Based Revenue",
  "Commission Revenue",
  "Retainer Revenue",
  "Performance-Based Compensation",
  "Asset-Based Income",
  "Licensing / Royalties",
  "Transactional Sales",
  "Equity Participation",
  "Other",
];

const REVENUE_RANGES = [
  "Under $25,000",
  "$25,000 – $75,000",
  "$75,000 – $150,000",
  "$150,000 – $300,000",
  "$300,000 – $750,000",
  "$750,000+",
];

const QUARTERS = [
  "Q1 (Jan–Mar)",
  "Q2 (Apr–Jun)",
  "Q3 (Jul–Sep)",
  "Q4 (Oct–Dec)",
];

interface SetupState {
  firstName: string;
  email: string;
  role: string;
  revenueModels: string[];
  revenueRange: string;
  quarter: string;
}

const INITIAL_STATE: SetupState = {
  firstName: "",
  email: "",
  role: "",
  revenueModels: [],
  revenueRange: "",
  quarter: "",
};

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<SetupState>(INITIAL_STATE);

  useEffect(() => {
    const saved = sessionStorage.getItem("rp_setup");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(parsed);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("rp_setup", JSON.stringify(data));
  }, [data]);

  const canAdvance = (): boolean => {
    switch (step) {
      case 1:
        return data.firstName.trim().length > 0 && data.email.includes("@");
      case 2:
        return data.role.length > 0;
      case 3:
        return data.revenueModels.length > 0 && data.revenueModels.length <= 3;
      case 4:
        return data.revenueRange.length > 0;
      case 5:
        return data.quarter.length > 0;
      default:
        return false;
    }
  };

  const handleBeginDiagnostic = () => {
    sessionStorage.setItem("rp_setup", JSON.stringify(data));
    router.push("/diagnostic");
  };

  const toggleRevenueModel = (model: string) => {
    setData((prev) => {
      const exists = prev.revenueModels.includes(model);
      if (exists) {
        return { ...prev, revenueModels: prev.revenueModels.filter((m) => m !== model) };
      }
      if (prev.revenueModels.length >= 3) return prev;
      return { ...prev, revenueModels: [...prev.revenueModels, model] };
    });
  };

  if (step === 6) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-lg w-full text-center">
            <h1 className="text-2xl font-semibold mb-2">Setup Confirmed</h1>
            <p className="text-xs text-neutral-500 mb-6">
              Model RP-1.0 | Version 1.0 | Version Locked
            </p>
            <p className="text-sm text-neutral-700 mb-2">
              Your diagnostic session has been initialized.
            </p>
            <p className="text-xs text-neutral-500 mb-8">
              Quarterly Income Checkup requires approximately two minutes.
            </p>
            <button
              onClick={handleBeginDiagnostic}
              className="bg-neutral-900 text-white px-8 py-3 text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              Begin Diagnostic Submission
            </button>
            <AuthorityStrip />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-lg w-full">
          <div className="mb-8">
            <StepIndicator current={step} total={5} />
          </div>

          {step === 1 && (
            <StepWrapper
              title="Participant Identification"
              instruction="Enter the identifying details for this submission."
              support="Used only to issue your Structural Reference and deliver your report."
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">First Name</label>
                  <input
                    type="text"
                    value={data.firstName}
                    onChange={(e) => setData({ ...data, firstName: e.target.value })}
                    className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>
            </StepWrapper>
          )}

          {step === 2 && (
            <StepWrapper
              title="Primary Income Role"
              instruction="Select the role that most accurately reflects how you generate income."
              support="Select the role that represents the majority of your income."
            >
              <div className="grid grid-cols-1 gap-2">
                {ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => setData({ ...data, role })}
                    className={`border px-4 py-3 text-sm text-left transition-colors ${
                      data.role === role
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-300 hover:border-neutral-500"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </StepWrapper>
          )}

          {step === 3 && (
            <StepWrapper
              title="Revenue Structure"
              instruction="Select up to three primary revenue models that drive your income."
              support="Select up to three primary."
            >
              <div className="flex flex-wrap gap-2">
                {REVENUE_MODELS.map((model) => {
                  const selected = data.revenueModels.includes(model);
                  return (
                    <button
                      key={model}
                      onClick={() => toggleRevenueModel(model)}
                      className={`border px-3 py-1.5 text-xs transition-colors ${
                        selected
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-300 hover:border-neutral-500"
                      }`}
                    >
                      {model}
                    </button>
                  );
                })}
              </div>
            </StepWrapper>
          )}

          {step === 4 && (
            <StepWrapper
              title="Quarterly Revenue Range"
              instruction="Select your approximate gross revenue range for the most recent quarter."
              support="Select the closest range."
            >
              <div className="grid grid-cols-1 gap-2">
                {REVENUE_RANGES.map((range) => (
                  <button
                    key={range}
                    onClick={() => setData({ ...data, revenueRange: range })}
                    className={`border px-4 py-3 text-sm text-left transition-colors ${
                      data.revenueRange === range
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-300 hover:border-neutral-500"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </StepWrapper>
          )}

          {step === 5 && (
            <StepWrapper
              title="Quarter Reference"
              instruction="Select the quarter this submission represents."
              support="Used for quarter-over-quarter structural comparison."
            >
              <div className="grid grid-cols-2 gap-2">
                {QUARTERS.map((q) => (
                  <button
                    key={q}
                    onClick={() => setData({ ...data, quarter: q })}
                    className={`border px-4 py-3 text-sm text-center transition-colors ${
                      data.quarter === q
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-300 hover:border-neutral-500"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </StepWrapper>
          )}

          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="text-sm text-neutral-500 hover:text-neutral-900"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canAdvance()}
              className={`px-6 py-2 text-sm font-medium transition-colors ${
                canAdvance()
                  ? "bg-neutral-900 text-white hover:bg-neutral-800"
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <>
      <div className="flex items-center justify-between px-6 py-4">
        <span className="text-sm font-semibold tracking-wide">RUNPAYWAY™</span>
        <span className="text-xs text-neutral-500">Model RP-1.0 | Version 1.0</span>
      </div>
      <div className="border-t border-neutral-200" />
    </>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 ${
            i < current ? "bg-neutral-900" : "bg-neutral-200"
          }`}
        />
      ))}
    </div>
  );
}

function StepWrapper({
  title,
  instruction,
  support,
  children,
}: {
  title: string;
  instruction: string;
  support: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      <p className="text-sm text-neutral-600 mb-6">{instruction}</p>
      {children}
      <p className="text-xs text-neutral-400 mt-4">{support}</p>
    </div>
  );
}

function AuthorityStrip() {
  return (
    <div className="mt-12 pt-4 border-t border-neutral-200 text-center">
      <p className="text-[10px] text-neutral-400 tracking-wide">
        Registry-Referenced | Version Locked
      </p>
      <p className="text-[10px] text-neutral-400 tracking-wide">
        Model RP-1.0 | Version 1.0
      </p>
    </div>
  );
}
