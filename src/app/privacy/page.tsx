export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-10">
      <section className="max-w-[720px] py-24">
        <h1 className="text-[28px]">Privacy Policy</h1>
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
          <p className="mt-2">Privacy Contact:</p>
          <p><strong className="text-navy">privacy@runpayway.com</strong></p>
        </div>

        <hr className="border-divider" />

        {/* 1. Overview */}
        <div>
          <h2 className="text-[28px]">1. Overview</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              This Privacy Policy describes how RunPayway&trade; collects, uses, stores, and
              protects information in connection with the{" "}
              <strong className="text-navy">Income Stability Score&trade;</strong> and related
              services.
            </p>
            <p>This policy applies to information collected through:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>The RunPayway&trade; website</li>
              <li>Stability Index assessments</li>
              <li>Account creation</li>
              <li>Subscription management</li>
              <li>Inquiry submissions</li>
              <li>Registry verification</li>
            </ul>
            <p>
              RunPayway&trade; is operated by{" "}
              <strong className="text-navy">
                PeopleStar Enterprises, Inc., which acts as the data controller for information
                collected through the RunPayway&trade; service
              </strong>
              .
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 2. Information Collected */}
        <div>
          <h2 className="text-[28px]">2. Information Collected</h2>

          <h3 className="mt-6 text-[20px]">A. Information You Provide</h3>
          <div className="mt-3 text-sm text-secondary space-y-3">
            <p>We may collect:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Name</li>
              <li>Email address</li>
              <li>Account credentials</li>
              <li>Billing information</li>
              <li>Assessment responses</li>
              <li>Enterprise inquiry details</li>
            </ul>
            <p>
              Assessment responses are used solely for Stability Index calculation.
            </p>
          </div>

          <h3 className="mt-8 text-[20px]">B. Automatically Collected Information</h3>
          <div className="mt-3 text-sm text-secondary space-y-3">
            <p>We may collect:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>IP address</li>
              <li>Device type</li>
              <li>Browser type</li>
              <li>Timestamps</li>
              <li>Session identifiers</li>
              <li>Routing data</li>
              <li>Error logs</li>
            </ul>
            <p>
              This information supports security, fraud prevention, and operational integrity.
            </p>
          </div>

          <h3 className="mt-8 text-[20px]">C. Payment Information</h3>
          <div className="mt-3 text-sm text-secondary space-y-3">
            <p>
              Payments are processed through <strong className="text-navy">Stripe</strong>.
            </p>
            <p>RunPayway&trade; does not store full payment card numbers.</p>
            <p>
              Stripe may collect and process payment information in accordance with
              Stripe&apos;s Privacy Policy:
            </p>
            <p>https://stripe.com/privacy</p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 3. Purpose of Processing */}
        <div>
          <h2 className="text-[28px]">3. Purpose of Processing</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>Information may be used to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Generate the Stability Index</li>
              <li>Deliver assessment results</li>
              <li>Maintain user accounts</li>
              <li>Process payments</li>
              <li>Administer subscriptions</li>
              <li>Respond to user-submitted inquiries</li>
              <li>
                Initiate enterprise follow-up discussions in response to inquiry submissions
              </li>
              <li>Maintain registry verification</li>
              <li>Improve system integrity and security</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p>
              RunPayway&trade; does{" "}
              <strong className="text-navy">
                not sell personal information for monetary consideration
              </strong>{" "}
              and does{" "}
              <strong className="text-navy">
                not share personal information for cross-context behavioral advertising
              </strong>
              .
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 4. Consent-Based Contact */}
        <div>
          <h2 className="text-[28px]">
            4. Consent-Based Contact Following User Submission
          </h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              If you submit an inquiry, request enterprise information, create an account, or
              purchase an assessment, you consent to be contacted by RunPayway&trade; in
              response to that submission.
            </p>
            <p>Contact may relate to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Assessment results</li>
              <li>Billing or subscription administration</li>
              <li>Enterprise or partnership discussions</li>
              <li>Service-related updates</li>
            </ul>
            <p>
              Such contact is limited to responding to your submission and administering the
              requested service.
            </p>
            <p>
              Optional marketing communications, if offered separately, will include an opt-out
              mechanism.
            </p>
            <p>RunPayway&trade; does not provide financial advisory outreach.</p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 5. Data Retention */}
        <div>
          <h2 className="text-[28px]">5. Data Retention</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              Personal information is retained only for as long as reasonably necessary to
              fulfill the purposes described in this policy, unless a longer retention period is
              required or permitted by law.
            </p>
            <p>
              Assessment snapshots are stored as{" "}
              <strong className="text-navy">time-stamped digital records</strong>.
            </p>
            <p>
              Account and billing records are retained to comply with financial, tax, and legal
              obligations.
            </p>
            <p>
              Retention periods vary depending on the category of information and applicable
              law.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 6. Data Security */}
        <div>
          <h2 className="text-[28px]">6. Data Security</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              RunPayway&trade; implements reasonable administrative, technical, and
              organizational safeguards to protect personal information.
            </p>
            <p>
              No method of transmission or storage can guarantee absolute security.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 7. Public Registry Verification */}
        <div>
          <h2 className="text-[28px]">7. Public Registry Verification</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              RunPayway&trade; provides a registry verification mechanism that confirms{" "}
              <strong className="text-navy">record consistency only</strong>.
            </p>
            <p>Registry responses display:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Snapshot ID</li>
              <li>Stability Index value</li>
              <li>Band classification</li>
              <li>Model version</li>
              <li>Timestamp</li>
            </ul>
            <p>
              Registry verification does <strong className="text-navy">not</strong> display:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Assessment responses</li>
              <li>Component-level scoring</li>
              <li>Personal identifying information</li>
            </ul>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 8. Privacy Rights */}
        <div>
          <h2 className="text-[28px]">8. Privacy Rights</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Request access to personal information</li>
              <li>Request correction of inaccurate personal information</li>
              <li>Request deletion of personal information</li>
              <li>Request limitation of processing</li>
            </ul>
            <p>
              Privacy rights requests must be submitted through the designated privacy request
              form available on the RunPayway&trade; website.
            </p>
            <p>Requests may also be submitted by email:</p>
            <p><strong className="text-navy">privacy@runpayway.com</strong></p>
            <p>
              Identity verification may be required before processing a request.
            </p>
            <p>
              Verified requests will be responded to within applicable legal timeframes.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 9. California Privacy Notice */}
        <div>
          <h2 className="text-[28px]">9. California Privacy Notice</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              If you are a California resident, you have rights under the{" "}
              <strong className="text-navy">California Consumer Privacy Act (CCPA)</strong>, as
              amended by the{" "}
              <strong className="text-navy">California Privacy Rights Act (CPRA)</strong>,
              including:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>The right to know what personal information is collected</li>
              <li>The right to request deletion</li>
              <li>The right to request correction</li>
              <li>
                The right to opt out of the sale or sharing of personal information
              </li>
              <li>The right to non-discrimination</li>
            </ul>
            <p>
              RunPayway&trade; does{" "}
              <strong className="text-navy">not sell personal information</strong> and does{" "}
              <strong className="text-navy">
                not share personal information for cross-context behavioral advertising
              </strong>
              .
            </p>
            <p>
              Requests must be submitted through the designated privacy request form or by
              email to:
            </p>
            <p><strong className="text-navy">privacy@runpayway.com</strong></p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 10. Cookies & Tracking */}
        <div>
          <h2 className="text-[28px]">10. Cookies &amp; Tracking</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>RunPayway&trade; uses cookies and similar technologies for:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Session authentication</li>
              <li>Security</li>
              <li>Performance monitoring</li>
            </ul>
            <p>
              RunPayway&trade; does{" "}
              <strong className="text-navy">
                not use cookies for behavioral advertising
              </strong>
              .
            </p>
            <p>
              Users may control cookies through their browser settings. Disabling cookies may
              affect certain site functionality.
            </p>
            <p>
              RunPayway&trade; does not respond to browser &ldquo;Do Not Track&rdquo; signals.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 11. Third-Party Service Providers */}
        <div>
          <h2 className="text-[28px]">11. Third-Party Service Providers</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>RunPayway&trade; may engage third-party providers for:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Payment processing</li>
              <li>Hosting infrastructure</li>
              <li>Email delivery</li>
              <li>Security monitoring</li>
            </ul>
            <p>
              These providers process information solely to support operational services.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 12. Children's Privacy */}
        <div>
          <h2 className="text-[28px]">12. Children&apos;s Privacy</h2>
          <p className="mt-4 text-sm text-secondary">
            RunPayway&trade; is not intended for individuals under{" "}
            <strong className="text-navy">18 years of age</strong>.
          </p>
        </div>

        <hr className="border-divider" />

        {/* 13. International Users */}
        <div>
          <h2 className="text-[28px]">13. International Users</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              RunPayway&trade; operates from the{" "}
              <strong className="text-navy">United States</strong>.
            </p>
            <p>
              Information may be processed and stored in the United States and subject to U.S.
              law.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 14. Changes to This Policy */}
        <div>
          <h2 className="text-[28px]">14. Changes to This Policy</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>This Privacy Policy may be updated periodically.</p>
            <p>
              Material changes will be published with an updated effective date.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        <p className="text-sm text-secondary pb-24">Model RP-1.0 | Version 1.0</p>
      </section>
    </div>
  );
}
