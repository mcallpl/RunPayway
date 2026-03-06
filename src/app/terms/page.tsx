export default function TermsPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-10">
      <section className="max-w-[720px] py-24">
        <h1 className="text-[28px]">Terms of Use</h1>
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
          <p className="mt-2">Support inquiries:</p>
          <p><strong className="text-navy">support@runpayway.com</strong></p>
        </div>

        <hr className="border-divider" />

        {/* 1. Acceptance of Terms */}
        <div>
          <h2 className="text-[28px]">1. Acceptance of Terms</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              By creating an account, purchasing an assessment, submitting an inquiry, or
              affirmatively indicating acceptance during checkout, you agree to these Terms of
              Use.
            </p>
            <p>If you do not agree, do not use this service.</p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 2. Service Description */}
        <div>
          <h2 className="text-[28px]">2. Service Description</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              RunPayway&trade; provides access to the{" "}
              <strong className="text-navy">Income Stability Score&trade;</strong>, a structural
              income stability measurement generated under{" "}
              <strong className="text-navy">Model RP-1.0</strong>.
            </p>
            <p>
              The Stability Index is a descriptive, point-in-time structural assessment based on
              user-provided information.
            </p>
            <p>
              RunPayway&trade; is not a registered investment adviser and does not provide
              financial advice, investment advice, tax advice, or legal advice.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 3. Eligibility */}
        <div>
          <h2 className="text-[28px]">3. Eligibility</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              You must be at least <strong className="text-navy">18 years old</strong> to use
              this service.
            </p>
            <p>
              You represent that all information submitted is accurate to the best of your
              knowledge.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 4. No Financial Advisory Relationship */}
        <div>
          <h2 className="text-[28px]">4. No Financial Advisory Relationship</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>Use of the Stability Index does not create:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>A fiduciary relationship</li>
              <li>An advisory relationship</li>
              <li>An investment advisory engagement</li>
              <li>A client relationship</li>
            </ul>
            <p>
              The Stability Index is not a recommendation, endorsement, or suitability
              determination.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 5. Structural Measurement Limitation */}
        <div>
          <h2 className="text-[28px]">5. Structural Measurement Limitation</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>The Stability Index:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Measures structural income characteristics only</li>
              <li>Does not predict future financial performance</li>
              <li>Does not evaluate income amount or wealth</li>
              <li>Does not assess creditworthiness</li>
            </ul>
            <p>
              The Stability Index reflects information provided at the time of submission.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 6. Deterministic Model Framework */}
        <div>
          <h2 className="text-[28px]">6. Deterministic Model Framework</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              The Stability Index is generated under{" "}
              <strong className="text-navy">Model RP-1.0</strong> using predefined scoring
              criteria.
            </p>
            <p>Scoring methodology is version-controlled.</p>
            <p>
              Under the same model version, identical responses are intended to produce
              identical results.
            </p>
            <p>
              No machine learning or probabilistic adjustments are used under Model RP-1.0.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 7. Payment Terms */}
        <div>
          <h2 className="text-[28px]">7. Payment Terms</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              All fees are listed in <strong className="text-navy">U.S. dollars</strong>.
            </p>
            <p>Stability Index assessments are billed either:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                As a <strong className="text-navy">one-time assessment fee</strong>, or
              </li>
              <li>
                As an{" "}
                <strong className="text-navy">
                  annual subscription for reassessment access
                </strong>
              </li>
            </ul>
            <p>
              Subscriptions renew automatically at the stated annual rate unless canceled prior
              to renewal.
            </p>
            <p>No refunds are issued after score generation.</p>
            <p>
              If a technical error prevents score generation, support may review the
              transaction.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 8. Consent-Based Contact Following User Submission */}
        <div>
          <h2 className="text-[28px]">8. Consent-Based Contact Following User Submission</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              If you submit an inquiry, request enterprise information, create an account, or
              purchase an assessment, you consent to be contacted by RunPayway&trade; in
              response to that submission.
            </p>
            <p>Contact may relate to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Assessment results</li>
              <li>Account administration</li>
              <li>Billing and subscription management</li>
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

        {/* 9. Intellectual Property */}
        <div>
          <h2 className="text-[28px]">9. Intellectual Property</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              Model RP-1.0, the Stability Index framework, scoring methodology, and all related
              content are proprietary.
            </p>
            <p>You may not:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Reverse engineer scoring logic</li>
              <li>Extract scoring weights</li>
              <li>Replicate or reproduce the methodology</li>
              <li>
                Use the Stability Index for commercial redistribution without authorization
              </li>
              <li>
                Access the service through automated scraping, bots, or data extraction tools
              </li>
            </ul>
            <p>All rights reserved.</p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 10. Registry Verification */}
        <div>
          <h2 className="text-[28px]">10. Registry Verification</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>Snapshot verification confirms registry record consistency only.</p>
            <p>
              Verification does not validate the accuracy of user-provided information.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 11. Limitation of Liability */}
        <div>
          <h2 className="text-[28px]">11. Limitation of Liability</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>To the maximum extent permitted by law:</p>
            <p>
              RunPayway&trade; shall not be liable for indirect, incidental, consequential,
              special, exemplary, or punitive damages arising from use of the Stability Index.
            </p>
            <p>
              Total liability for any claim shall not exceed the amount paid for the assessment
              giving rise to the claim.
            </p>
            <p>
              This limitation applies regardless of the legal theory asserted.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 12. Disclaimer of Warranties */}
        <div>
          <h2 className="text-[28px]">12. Disclaimer of Warranties</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              The Stability Index and related services are provided{" "}
              <strong className="text-navy">&ldquo;as is&rdquo;</strong> and{" "}
              <strong className="text-navy">&ldquo;as available.&rdquo;</strong>
            </p>
            <p>
              RunPayway&trade; disclaims all warranties, express or implied, including implied
              warranties of merchantability, fitness for a particular purpose, non-infringement,
              and accuracy.
            </p>
            <p>
              No guarantee is made regarding financial outcomes or suitability for specific
              decisions.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 13. Indemnification */}
        <div>
          <h2 className="text-[28px]">13. Indemnification</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              You agree to indemnify and hold harmless RunPayway&trade;, its affiliates,
              officers, and agents from any claims, liabilities, damages, or expenses arising
              from:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Your use of the service</li>
              <li>Your violation of these Terms</li>
              <li>Your submission of inaccurate information</li>
            </ul>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 14. Force Majeure */}
        <div>
          <h2 className="text-[28px]">14. Force Majeure</h2>
          <p className="mt-4 text-sm text-secondary">
            RunPayway&trade; shall not be liable for delays or failures resulting from events
            beyond its reasonable control.
          </p>
        </div>

        <hr className="border-divider" />

        {/* 15. Data & Snapshot Records */}
        <div>
          <h2 className="text-[28px]">15. Data &amp; Snapshot Records</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              Completed assessments generate{" "}
              <strong className="text-navy">time-stamped digital snapshots</strong>.
            </p>
            <p>Snapshots reflect user-provided information at submission.</p>
            <p>
              RunPayway&trade; does not guarantee long-term archival beyond stated retention
              policies.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 16. Dispute Resolution & Arbitration */}
        <div>
          <h2 className="text-[28px]">16. Dispute Resolution &amp; Arbitration</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              Any dispute arising from these Terms or use of the Stability Index shall be
              resolved through{" "}
              <strong className="text-navy">
                binding arbitration on an individual basis
              </strong>
              .
            </p>
            <p>
              You waive any right to participate in{" "}
              <strong className="text-navy">
                class actions or representative proceedings
              </strong>
              .
            </p>
            <p>
              If arbitration is deemed unenforceable, any permitted court action shall be
              brought exclusively in the courts located in{" "}
              <strong className="text-navy">California, United States</strong>.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 17. Governing Law */}
        <div>
          <h2 className="text-[28px]">17. Governing Law</h2>
          <p className="mt-4 text-sm text-secondary">
            These Terms are governed by the laws of the{" "}
            <strong className="text-navy">State of California, United States</strong>.
          </p>
        </div>

        <hr className="border-divider" />

        {/* 18. Contact Information */}
        <div>
          <h2 className="text-[28px]">18. Contact Information</h2>
          <div className="mt-4 text-sm text-secondary space-y-1">
            <p>Questions regarding these Terms may be directed to:</p>
            <p className="mt-2 text-navy font-semibold">RunPayway&trade;</p>
            <p>PeopleStar Enterprises, Inc.</p>
            <p>24312 Airporter Way</p>
            <p>Laguna Niguel, California 92677</p>
            <p>United States</p>
            <p className="mt-2">Support inquiries:</p>
            <p><strong className="text-navy">support@runpayway.com</strong></p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* 19. Modifications to Terms */}
        <div>
          <h2 className="text-[28px]">19. Modifications to Terms</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>Terms may be updated periodically.</p>
            <p>
              Material changes will be published with an updated effective date.
            </p>
            <p>Scoring methodology changes will result in a new model version.</p>
            <p>No silent changes are made to scoring logic.</p>
          </div>
        </div>

        <hr className="border-divider" />

        <p className="text-sm text-secondary pb-24">Model RP-1.0 | Version 1.0</p>
      </section>
    </div>
  );
}
