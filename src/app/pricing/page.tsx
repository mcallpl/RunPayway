import Link from "next/link";

function Divider() {
  return <hr className="border-divider my-20" />;
}

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-10">
      {/* PAGE HEADER */}
      <section className="max-w-[720px] py-24">
        <h1>Pricing</h1>
        <p className="mt-6 text-secondary">
          RunPayway&trade; provides access to the{" "}
          <strong className="text-navy">Income Stability Score&trade;</strong> under{" "}
          <strong className="text-navy">Model RP-1.0</strong>.
        </p>
        <p className="mt-2 text-secondary">All fees are listed in <strong className="text-navy">U.S. dollars</strong>.</p>
      </section>

      <Divider />

      {/* PRICING CARDS */}
      <section className="py-24">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_minmax(0,100px)_1fr] max-w-[800px] mx-auto gap-0">
          {/* $39 Card */}
          <div className="border border-divider rounded-lg p-8">
            <h2>Stability Index Assessment</h2>
            <p className="text-2xl font-semibold text-navy mt-2">$39</p>
            <p className="mt-4 text-secondary">
              One-time access to a Stability Index assessment.
            </p>
            <p className="mt-4 text-secondary font-medium">Includes:</p>
            <ul className="mt-2 space-y-2 text-secondary text-sm">
              <li className="flex gap-2"><span>&bull;</span>structured six-question assessment</li>
              <li className="flex gap-2"><span>&bull;</span>Stability Index score (0&ndash;100)</li>
              <li className="flex gap-2"><span>&bull;</span>stability band classification</li>
              <li className="flex gap-2"><span>&bull;</span>Functional Stability Threshold positioning</li>
              <li className="flex gap-2"><span>&bull;</span>time-stamped digital snapshot</li>
              <li className="flex gap-2"><span>&bull;</span>model version identification</li>
            </ul>
            <p className="mt-4 text-sm text-secondary">
              The assessment reflects structural income characteristics at the time
              of submission.
            </p>
            <p className="mt-2 text-sm text-secondary">No recurring billing.</p>
            <Link
              href="/checkout?plan=single"
              className="inline-block mt-6 bg-navy text-white px-6 py-3 rounded-md text-sm font-medium hover:opacity-90"
            >
              Proceed to Checkout
            </Link>
          </div>

          {/* Gap */}
          <div className="hidden md:block" />

          {/* $84 Card */}
          <div className="border border-divider rounded-lg p-8 mt-6 md:mt-0">
            <h2>Annual Reassessment Access</h2>
            <p className="text-2xl font-semibold text-navy mt-2">$84 per year</p>
            <p className="mt-4 text-secondary">
              Access to up to{" "}
              <strong className="text-navy">
                four Stability Index assessments within a 12-month term
              </strong>
              .
            </p>
            <p className="mt-4 text-secondary font-medium">Includes:</p>
            <ul className="mt-2 space-y-2 text-secondary text-sm">
              <li className="flex gap-2"><span>&bull;</span>up to four structured assessments</li>
              <li className="flex gap-2"><span>&bull;</span>separate time-stamped digital snapshots for each assessment</li>
              <li className="flex gap-2"><span>&bull;</span>model version documentation for each report</li>
            </ul>
            <p className="mt-4 text-sm text-secondary">
              The 12-month term begins on the date of purchase.
            </p>
            <p className="mt-2 text-sm text-secondary">
              This subscription renews automatically each year at{" "}
              <strong className="text-navy">$84</strong> unless canceled before
              the renewal date.
            </p>
            <p className="mt-2 text-sm text-secondary">
              You may cancel at any time through your account settings.
            </p>
            <p className="mt-2 text-sm text-secondary">
              Cancellation takes effect at the end of the current term.
            </p>
            <p className="mt-2 text-sm text-secondary">
              Unused assessments do not carry forward and are not refundable.
            </p>
            <Link
              href="/checkout?plan=annual"
              className="inline-block mt-6 bg-navy text-white px-6 py-3 rounded-md text-sm font-medium hover:opacity-90"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </section>

      <Divider />

      {/* DETAIL SECTIONS */}
      <div className="max-w-[720px] space-y-0">
        {/* Billing & Processing */}
        <section>
          <h2>Billing &amp; Processing</h2>
          <div className="mt-4 space-y-2 text-secondary">
            <p>
              Payments are processed securely via <strong className="text-navy">Stripe</strong>.
            </p>
            <p>For recurring subscriptions:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>charges occur annually on the renewal date</li>
              <li>a receipt is issued for each transaction</li>
              <li>renewal authorization is obtained at initial purchase</li>
            </ul>
          </div>
        </section>

        <Divider />

        {/* Data & Snapshot Access */}
        <section>
          <h2>Data &amp; Snapshot Access</h2>
          <div className="mt-4 space-y-2 text-secondary">
            <p>
              Each completed assessment generates a{" "}
              <strong className="text-navy">time-stamped digital snapshot</strong>.
            </p>
            <p>Snapshots may be retrieved using:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Snapshot ID</li>
              <li>Authentication Code</li>
            </ul>
            <p>
              Snapshots reflect information provided at the time of submission.
            </p>
          </div>
        </section>

        <Divider />

        {/* Refund Policy */}
        <section>
          <h2>Refund Policy</h2>
          <div className="mt-4 space-y-2 text-secondary">
            <p>Completed Stability Index assessments are final.</p>
            <p>Refunds are not issued after score generation.</p>
            <p>
              If a technical error prevents score generation, support will review
              the transaction.
            </p>
          </div>
        </section>

        <Divider />

        {/* Subscription Disclosure */}
        <section>
          <h2>Subscription Disclosure</h2>
          <div className="mt-4 space-y-2 text-secondary">
            <p>
              By purchasing{" "}
              <strong className="text-navy">Annual Reassessment Access</strong>,
              you authorize recurring annual charges of{" "}
              <strong className="text-navy">$84</strong> to your selected payment
              method.
            </p>
            <p>A confirmation email is issued after purchase.</p>
            <p>
              A renewal reminder email will be sent prior to the renewal date.
            </p>
            <p>
              You may cancel at any time through your account settings.
            </p>
          </div>
        </section>

        <Divider />

        {/* Checkout Confirmation Requirement */}
        <section>
          <h2>Checkout Confirmation Requirement</h2>
          <div className="mt-4 space-y-2 text-secondary">
            <p>
              At checkout for{" "}
              <strong className="text-navy">Annual Reassessment Access</strong>,
              the following confirmation must be required:
            </p>
            <p className="mt-2 pl-4 border-l-2 border-divider text-sm">
              &#9744; I understand this subscription renews automatically each year
              at $84 unless canceled prior to renewal.
            </p>
            <p className="mt-2">This confirmation must not be pre-selected.</p>
          </div>
        </section>

        <Divider />

        {/* Legal Clarification */}
        <section>
          <h2>Legal Clarification</h2>
          <div className="mt-4 space-y-2 text-secondary">
            <p>
              Purchase of a Stability Index assessment does not constitute
              financial advice or advisory services.
            </p>
            <p>
              The Stability Index is a descriptive structural measurement
              generated under <strong className="text-navy">Model RP-1.0</strong>.
            </p>
          </div>
        </section>

        <div className="mt-20 pb-24">
          <p className="text-sm text-secondary">Model RP-1.0 | Version 1.0</p>
        </div>
      </div>
    </div>
  );
}
