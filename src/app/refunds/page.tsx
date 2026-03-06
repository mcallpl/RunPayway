export default function RefundsPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-10">
      <section className="max-w-[720px] py-24">
        <h1 className="text-[28px]">Refund &amp; Cancellation Policy</h1>
        <div className="mt-4 text-sm text-secondary space-y-1">
          <p>RunPayway&trade;</p>
          <p>Income Stability Score&trade;</p>
          <p>Model RP-1.0 | Version 1.0</p>
          <p>Effective Date: <strong className="text-navy">[Insert Launch Date]</strong></p>
        </div>
      </section>

      <hr className="border-divider my-20" />

      <section className="max-w-[720px] space-y-12">
        {/* Operator Block */}
        <div className="text-sm text-secondary space-y-1">
          <p className="text-navy font-semibold">RunPayway&trade;</p>
          <p>Operated by <strong className="text-navy">PeopleStar Enterprises, Inc.</strong></p>
          <p>24312 Airporter Way</p>
          <p>Laguna Niguel, California 92677</p>
          <p>United States</p>
          <p className="mt-2">Support Contact:</p>
          <p><strong className="text-navy">support@runpayway.com</strong></p>
        </div>

        <hr className="border-divider" />

        {/* 1. Overview */}
        <div>
          <h2 className="text-[28px]">1. Overview</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              This policy describes the refund and cancellation terms applicable to purchases of
              the <strong className="text-navy">Income Stability Score&trade;</strong> and
              related services offered through RunPayway&trade;.
            </p>
            <p>
              By purchasing an assessment or subscription, you acknowledge and agree to this
              policy.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 2. One-Time Assessment Purchases */}
        <div>
          <h2 className="text-[28px]">2. One-Time Assessment Purchases</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>RunPayway&trade; offers one-time Stability Index assessments.</p>
            <p>
              Because each assessment generates a{" "}
              <strong className="text-navy">
                time-stamped structural analysis and digital report
              </strong>
              , purchases are considered{" "}
              <strong className="text-navy">
                consumed once the score and report are generated
              </strong>
              .
            </p>
            <p>For this reason:</p>
            <p>
              <strong className="text-navy">
                All assessment purchases are non-refundable once the Stability Index has been
                generated.
              </strong>
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 3. Technical Error Exception */}
        <div>
          <h2 className="text-[28px]">3. Technical Error Exception</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              If a verified technical error prevents score generation or report delivery,
              RunPayway&trade; may, at its discretion:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>regenerate the report</li>
              <li>issue a replacement assessment</li>
              <li>issue a refund</li>
            </ul>
            <p>
              Requests must be submitted to support within{" "}
              <strong className="text-navy">7 days of the transaction</strong>.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 4. Subscription Access (If Applicable) */}
        <div>
          <h2 className="text-[28px]">4. Subscription Access (If Applicable)</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              Certain RunPayway&trade; services may be offered as annual reassessment
              subscriptions.
            </p>
            <p>
              Subscribers may cancel automatic renewal at any time through their account
              settings.
            </p>
            <p>
              Cancellation prevents future billing but{" "}
              <strong className="text-navy">does not refund past charges</strong>.
            </p>
            <p>
              Access to subscription benefits remains available until the end of the paid
              billing period.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 5. Duplicate Transactions */}
        <div>
          <h2 className="text-[28px]">5. Duplicate Transactions</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              If a duplicate payment occurs due to processing error or system malfunction,
              please contact support.
            </p>
            <p>Verified duplicate charges will be refunded.</p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 6. Chargebacks */}
        <div>
          <h2 className="text-[28px]">6. Chargebacks</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              If a customer initiates a chargeback without first contacting RunPayway&trade;
              support, the associated account may be suspended while the dispute is reviewed.
            </p>
            <p>
              Customers are encouraged to contact support to resolve issues before initiating a
              chargeback.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 7. Cancellation of Assessment Prior to Completion */}
        <div>
          <h2 className="text-[28px]">
            7. Cancellation of Assessment Prior to Completion
          </h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              If a customer purchases an assessment but{" "}
              <strong className="text-navy">does not submit diagnostic responses</strong>, the
              assessment remains unused.
            </p>
            <p>
              Unused assessments may remain available for completion within the account for a
              reasonable period of time.
            </p>
            <p>
              RunPayway&trade; does not guarantee indefinite storage of unused assessments.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 8. Payment Processing */}
        <div>
          <h2 className="text-[28px]">8. Payment Processing</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              Payments are processed through <strong className="text-navy">Stripe</strong>.
            </p>
            <p>RunPayway&trade; does not store full payment card numbers.</p>
            <p>
              Stripe processes payment information according to its privacy policy.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 9. Contact for Billing Issues */}
        <div>
          <h2 className="text-[28px]">9. Contact for Billing Issues</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>For billing questions or refund eligibility inquiries, contact:</p>
            <p><strong className="text-navy">support@runpayway.com</strong></p>
            <p>Requests should include:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>purchase email</li>
              <li>transaction date</li>
              <li>description of the issue</li>
            </ul>
          </div>
        </div>

        <hr className="border-divider" />

        <p className="text-sm text-secondary pb-24">Model RP-1.0 | Version 1.0</p>
      </section>
    </div>
  );
}
