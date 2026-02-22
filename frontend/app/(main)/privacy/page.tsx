import type { Metadata } from "next";
import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";

export const metadata: Metadata = {
  title: "Privacy Policy \u2014 RunPayway\u2122",
  description:
    "Privacy policy for RunPayway, the Income Structure Diagnostic platform. How we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <PageContainer>
        <div className="max-w-[800px] mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mb-12">
            Effective Date: January 1, 2026
          </p>

          <div className="space-y-10 text-gray-700 leading-relaxed">
            {/* Section 1 */}
            <div>
              <h2 className="text-xl font-semibold text-navy-900 mb-3">
                1. Introduction
              </h2>
              <p>
                This Privacy Policy describes how PeopleStar Enterprises, Inc.
                (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;)
                collects, uses, and protects information in connection with the
                RunPayway&#8482; Income Structure Diagnostic
                (&ldquo;the Service&rdquo;).
              </p>
              <p className="mt-3">
                By using the Service, you consent to the practices described in
                this Privacy Policy.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-xl font-semibold text-navy-900 mb-3">
                2. Information We Collect
              </h2>
              <p>We collect the following categories of information:</p>

              <h3 className="text-base font-semibold text-navy-900 mt-4 mb-2">
                a. Assessment Inputs
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Calibration selections (industry, revenue model, role)
                </li>
                <li>Responses to the 12 diagnostic questions</li>
              </ul>
              <p className="mt-2 text-sm text-gray-500">
                These inputs are used exclusively to generate your Payway
                Rating and report. They are not used for profiling, marketing,
                or any purpose outside the diagnostic.
              </p>

              <h3 className="text-base font-semibold text-navy-900 mt-4 mb-2">
                b. Purchase Information
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Email address provided during checkout</li>
                <li>Name (if provided)</li>
                <li>Stripe payment session identifier</li>
              </ul>
              <p className="mt-2 text-sm text-gray-500">
                Payment processing is handled by Stripe. We do not receive,
                store, or have access to your credit card number or financial
                account details.
              </p>

              <h3 className="text-base font-semibold text-navy-900 mt-4 mb-2">
                c. Contact Information
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Email address and message content submitted through the
                  Contact page
                </li>
              </ul>

              <h3 className="text-base font-semibold text-navy-900 mt-4 mb-2">
                d. Technical Information
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Standard server logs (IP address, browser type, access
                  timestamps) collected automatically during use of the Service
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-xl font-semibold text-navy-900 mb-3">
                3. How We Use Information
              </h2>
              <p>We use collected information to:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Generate and deliver your Payway Rating and report</li>
                <li>Provide access to your report via secure, token-based links</li>
                <li>Process payment through Stripe</li>
                <li>Respond to support inquiries submitted through the Contact page</li>
                <li>Maintain system integrity and audit logging</li>
              </ul>
              <p className="mt-3">
                We do not use your data for marketing, advertising, behavioral
                profiling, or resale to third parties.
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-xl font-semibold text-navy-900 mb-3">
                4. Data Sharing
              </h2>
              <p>We do not sell, rent, or share your personal information with third parties, except as required to operate the Service:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>
                  <strong>Stripe</strong> &mdash; Payment processing only.
                  Subject to{" "}
                  <a
                    href="https://stripe.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-navy-900 underline underline-offset-2 hover:text-navy-700"
                  >
                    Stripe&apos;s Privacy Policy
                  </a>
                  .
                </li>
                <li>
                  <strong>Hosting providers</strong> &mdash; Infrastructure
                  hosting for the application and database. Data is stored
                  securely and not shared beyond operational necessity.
                </li>
              </ul>
              <p className="mt-3">
                We may also disclose information if required by law, subpoena,
                or governmental request.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-xl font-semibold text-navy-900 mb-3">
                5. Data Retention
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Assessment data (inputs, results, report) is retained for the
                  duration necessary to deliver and support the Service.
                </li>
                <li>
                  Report access links expire 30 days after purchase.
                </li>
                <li>
                  Contact messages are retained for as long as needed to
                  resolve the inquiry.
                </li>
                <li>
                  Audit logs are retained for internal system integrity
                  purposes.
                </li>
              </ul>
              <p className="mt-3">
                We do not retain data indefinitely without operational purpose.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-xl font-semibold text-navy-900 mb-3">
                6. Security
              </h2>
              <p>
                We implement appropriate technical and organizational measures
                to protect your information, including:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>HTTPS encryption for all data in transit</li>
                <li>Token-based access control with SHA-256 hashing</li>
                <li>No storage of credit card data on our servers</li>
                <li>Server-side only processing of all scoring logic</li>
              </ul>
              <p className="mt-3">
                No method of transmission or storage is 100% secure. While we
                strive to protect your data, we cannot guarantee absolute
                security.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-xl font-semibold text-navy-900 mb-3">
                7. Cookies
              </h2>
              <p>
                RunPayway does not use tracking cookies, advertising cookies,
                or third-party analytics platforms. Functional cookies may be
                used as needed for session management and essential service
                delivery.
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="text-xl font-semibold text-navy-900 mb-3">
                8. Your Rights
              </h2>
              <p>
                Depending on your jurisdiction, you may have certain rights
                regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>The right to access the data we hold about you</li>
                <li>The right to request correction of inaccurate data</li>
                <li>The right to request deletion of your data</li>
                <li>
                  The right to restrict or object to certain processing
                  activities
                </li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, please contact us through our{" "}
                <Link
                  href="/contact"
                  className="text-navy-900 underline underline-offset-2 hover:text-navy-700"
                >
                  Contact page
                </Link>
                .
              </p>
            </div>

            {/* Section 9 */}
            <div>
              <h2 className="text-xl font-semibold text-navy-900 mb-3">
                9. Children&apos;s Privacy
              </h2>
              <p>
                RunPayway is not intended for use by individuals under the age
                of 18. We do not knowingly collect personal information from
                minors.
              </p>
            </div>

            {/* Section 10 */}
            <div>
              <h2 className="text-xl font-semibold text-navy-900 mb-3">
                10. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. Changes
                will be posted on this page with an updated effective date.
                Continued use of the Service after changes constitutes
                acceptance of the revised policy.
              </p>
            </div>

            {/* Section 11 */}
            <div>
              <h2 className="text-xl font-semibold text-navy-900 mb-3">
                11. Contact
              </h2>
              <p>
                For questions about this Privacy Policy, please visit our{" "}
                <Link
                  href="/contact"
                  className="text-navy-900 underline underline-offset-2 hover:text-navy-700"
                >
                  Contact page
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
