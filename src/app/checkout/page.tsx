"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useState } from "react";

function Divider() {
  return <hr className="border-divider my-20" />;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "single";
  const isAnnual = plan === "annual";
  const [subscriptionConfirmed, setSubscriptionConfirmed] = useState(false);

  return (
    <div className="mx-auto max-w-[1280px] px-10">
      <section className="max-w-[720px] py-24">
        <h1>Checkout</h1>
        <div className="mt-6 space-y-2 text-secondary">
          <p>
            RunPayway&trade; provides access to the{" "}
            <strong className="text-navy">Income Stability Score&trade;</strong>{" "}
            under <strong className="text-navy">Model RP-1.0</strong>.
          </p>
          <p>Secure payment is required before beginning the assessment.</p>
        </div>
      </section>

      <Divider />

      {/* Two column layout */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_minmax(0,80px)_auto] gap-0 pb-24">
        {/* Left: Order Summary */}
        <div className="max-w-[480px]">
          <h2>Order Summary</h2>
          {!isAnnual ? (
            <div className="mt-6 space-y-3 text-secondary">
              <h3>Stability Index Assessment</h3>
              <p className="text-xl font-semibold text-navy">$39</p>
              <p className="text-sm">Includes:</p>
              <ul className="text-sm space-y-1">
                <li>&bull; structured six-question assessment</li>
                <li>&bull; Income Stability Score&trade; (0&ndash;100)</li>
                <li>&bull; stability band classification</li>
                <li>&bull; Functional Stability Threshold positioning</li>
                <li>&bull; time-stamped digital snapshot</li>
                <li>&bull; model version identification</li>
              </ul>
              <p className="text-sm">
                Assessment reflects structural income characteristics at the time
                of submission.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-3 text-secondary">
              <h3>Annual Reassessment Access</h3>
              <p className="text-xl font-semibold text-navy">$84 per year</p>
              <p className="text-sm">Includes:</p>
              <ul className="text-sm space-y-1">
                <li>&bull; up to four Stability Index assessments within a 12-month term</li>
                <li>&bull; separate time-stamped digital snapshots for each assessment</li>
                <li>&bull; model version documentation for each report</li>
              </ul>
              <p className="text-sm">
                Subscription renews automatically each year unless canceled prior
                to renewal.
              </p>
            </div>
          )}

          <Divider />

          <h2>Payment Processing</h2>
          <div className="mt-4 space-y-2 text-secondary text-sm">
            <p>
              Payments are processed securely through{" "}
              <strong className="text-navy">Stripe</strong>.
            </p>
            <p>Accepted payment methods may include:</p>
            <ul className="space-y-1">
              <li>&bull; major credit cards</li>
              <li>&bull; debit cards</li>
              <li>&bull; supported digital wallets</li>
            </ul>
            <p>Payment authorization occurs at the time of checkout.</p>
          </div>

          {isAnnual && (
            <>
              <Divider />
              <h2>Subscription Confirmation</h2>
              <div className="mt-4 space-y-2 text-secondary text-sm">
                <p>
                  Before completing checkout for the Annual Reassessment Access
                  plan, the following confirmation must be required:
                </p>
                <label className="flex items-start gap-3 mt-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subscriptionConfirmed}
                    onChange={(e) => setSubscriptionConfirmed(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-divider"
                  />
                  <span>
                    I understand this subscription renews automatically each year
                    at $84 unless canceled prior to renewal.
                  </span>
                </label>
                <p className="text-xs text-secondary mt-2">
                  This confirmation must not be pre-selected.
                </p>
              </div>
            </>
          )}

          <Divider />

          <h2>Purchase Confirmation</h2>
          <div className="mt-4 space-y-2 text-secondary text-sm">
            <p>By completing this purchase you confirm that:</p>
            <ul className="space-y-1">
              <li>&bull; you are purchasing access to the RunPayway&trade; Stability Index assessment</li>
              <li>&bull; the assessment generates a structural income measurement under Model RP-1.0</li>
              <li>&bull; results reflect information provided at the time of submission</li>
            </ul>
          </div>

          <Divider />

          <h2>Refund Policy</h2>
          <div className="mt-4 space-y-2 text-secondary text-sm">
            <p>All completed Stability Index assessments are final.</p>
            <p>Refunds are not issued after score generation.</p>
            <p>
              If a technical error prevents score generation, support will review
              the transaction.
            </p>
          </div>

          <Divider />

          <h2>Data &amp; Snapshot Access</h2>
          <div className="mt-4 space-y-2 text-secondary text-sm">
            <p>
              Each completed assessment generates a{" "}
              <strong className="text-navy">time-stamped digital snapshot</strong>.
            </p>
            <p>Snapshots may be retrieved using:</p>
            <ul className="space-y-1">
              <li>&bull; Snapshot ID</li>
              <li>&bull; Authentication Code</li>
            </ul>
            <p>
              Snapshots reflect information provided at the time of submission.
            </p>
          </div>

          <Divider />

          <h2>Security Notice</h2>
          <div className="mt-4 space-y-2 text-secondary text-sm">
            <p>
              RunPayway&trade; does not store payment card information.
            </p>
            <p>
              Payment processing is handled directly through{" "}
              <strong className="text-navy">
                Stripe&apos;s secure payment infrastructure
              </strong>
              .
            </p>
          </div>
        </div>

        {/* Gap */}
        <div className="hidden md:block" />

        {/* Right: Payment Panel */}
        <div className="md:w-[320px] mt-12 md:mt-0">
          <div className="border border-divider rounded-lg p-8 sticky top-8">
            <h3>Complete Purchase</h3>
            <p className="mt-4 text-secondary text-sm">
              {isAnnual
                ? "Annual Reassessment Access \u2014 $84/year"
                : "Stability Index Assessment \u2014 $39"}
            </p>
            <Link
              href="/welcome"
              className={`inline-block mt-6 w-full text-center bg-navy text-white px-6 py-3 rounded-md text-sm font-medium hover:opacity-90 ${
                isAnnual && !subscriptionConfirmed
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
            >
              Proceed to Secure Payment
            </Link>
            <p className="mt-4 text-xs text-secondary">
              After successful payment, you will be directed to the{" "}
              <strong className="text-navy">Welcome &amp; Profile Setup page</strong>{" "}
              to begin the assessment.
            </p>
          </div>
        </div>
      </div>

      <Divider />

      {/* Legal Clarification */}
      <section className="max-w-[720px] pb-24">
        <h2>Legal Clarification</h2>
        <div className="mt-4 space-y-2 text-secondary text-sm">
          <p>
            Purchase of a Stability Index assessment does not constitute
            financial advice or advisory services.
          </p>
          <p>
            The Stability Index is a descriptive structural measurement generated
            under <strong className="text-navy">Model RP-1.0</strong>.
          </p>
        </div>
        <p className="mt-8 text-sm text-secondary">Model RP-1.0 | Version 1.0</p>
      </section>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1280px] px-10 py-24"><p className="text-secondary">Loading...</p></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
