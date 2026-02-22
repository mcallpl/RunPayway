import type { Metadata } from "next";
import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";

export const metadata: Metadata = {
  title: "Terms & Conditions \u2014 RunPayway\u2122",
  description:
    "Terms and conditions governing the use of RunPayway, the Income Structure Diagnostic platform.",
};

export default function TermsPage() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <PageContainer>
        <div className="max-w-[800px] mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-2">
            Terms &amp; Conditions
          </h1>
          <p className="text-sm text-gray-500 mb-12">
            Effective Date: January 1, 2026
          </p>

          <div className="prose-rp space-y-10 text-gray-700 leading-relaxed">
            {/* Section 1 */}
            <div>
              <h2 className="text-xl font-semibold text-navy-900 mb-3">
                1. Overview
              </h2>
              <p>
                These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your
                use of RunPayway&#8482; (&ldquo;the Service&rdquo;), a
                structured diagnostic tool that produces a deterministic income
                structure classification known as the Payway Rating.
              </p>
              <p className="mt-3">
                RunPayway is operated by PeopleStar Enterprises, Inc.
                (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;).
              </p>
              <p className="mt-3">
                By purchasing or using the Service, you agree to be bound by
                these Terms. If you do not agree, do not use the Service.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-xl font-semibold text-navy-900 mb-3">
                2. Service Description
              </h2>
              <p>
                RunPayway provides a one-time, self-administered income
                structure diagnostic. Each purchase includes:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-3">
                <li>A calibrated 12-question diagnostic assessment</li>
                <li>
                  A generated report including the Payway Rating, structural
                  composition, and exposure profile
                </li>
                <li>
                  A downloadable PDF version of the report (subject to access
                  window terms below)
                </li>
              </ul>
              <p className="mt-3">
                The Service is not a subscription, advisory service, or
                financial product. It is a one-time classification instrument.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-xl font-semibold text-navy-900 mb-3">
                3. Purchase and Payment
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The diagnostic assessment is available for a one-time
                  purchase of <strong>$79 USD</strong>.
                </li>
                <li>
                  Payment is processed through Stripe. RunPayway does not
                  store credit card or payment credentials.
                </li>
                <li>
                  Each payment generates one unique assessment. Payments are
                  non-transferable.
                </li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-xl font-semibold text-navy-900 mb-3">
                4. Refund Policy
              </h2>
              <p>
                Due to the nature of the Service (instant digital delivery of
                a one-time diagnostic), refunds are generally not provided once
                the assessment has been started or the report has been
                generated.
              </p>
              <p className="mt-3">
                Refund requests may be considered on a case-by-case basis for:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>
                  Technical errors that prevented completion of the assessment
                </li>
                <li>Duplicate charges for the same assessment</li>
                <li>
                  System failures that resulted in a missing or undelivered
                  report
                </li>
              </ul>
              <p className="mt-3">
                To request a refund, contact us through the{" "}
                <Link
                  href="/contact"
                  className="text-navy-900 underline underline-offset-2 hover:text-navy-700"
                >
                  Contact page
                </Link>
                .
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-xl font-semibold text-navy-900 mb-3">
                5. Report Access and Expiry
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Each assessment generates a unique, token-secured link to
                  your report.
                </li>
                <li>
                  The report link expires <strong>30 days</strong> after
                  purchase, regardless of whether the report has been viewed.
                </li>
                <li>
                  Once the PDF report is first downloaded, a{" "}
                  <strong>24-hour access window</strong> begins. During this
                  window, the report can be re-downloaded without limit.
                </li>
                <li>
                  After the 24-hour access window closes, the PDF cannot be
                  re-downloaded.
                </li>
                <li>
                  It is your responsibility to save the PDF during the access
                  window.
                </li>
              </ul>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-xl font-semibold text-navy-900 mb-3">
                6. Accuracy and Limitations
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The Payway Rating is a deterministic output based on your
                  inputs. Identical inputs always produce identical results.
                </li>
                <li>
                  The accuracy of the results depends on the accuracy of your
                  responses. RunPayway does not verify the truthfulness of
                  inputs.
                </li>
                <li>
                  Results are generated by a fixed scoring model. They are not
                  personalized, AI-generated, or manually reviewed.
                </li>
                <li>
                  RunPayway does not predict, forecast, or guarantee any
                  financial outcome.
                </li>
              </ul>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-xl font-semibold text-navy-900 mb-3">
                7. Disclaimer
              </h2>
              <p>
                RunPayway&#8482; is not a financial, legal, tax, or investment
                advisory service. The Payway Rating is a structural
                classification &mdash; it does not constitute a recommendation,
                evaluation, or endorsement of any financial decision.
              </p>
              <p className="mt-3">
                The Service is provided &ldquo;as is&rdquo; without warranties
                of any kind, express or implied. We do not warrant that the
                Service will be error-free, uninterrupted, or suitable for any
                particular purpose.
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="text-xl font-semibold text-navy-900 mb-3">
                8. Limitation of Liability
              </h2>
              <p>
                To the fullest extent permitted by applicable law, PeopleStar
                Enterprises, Inc. shall not be liable for any indirect,
                incidental, consequential, or punitive damages arising from
                your use of the Service, including but not limited to loss of
                revenue, data, or business opportunity.
              </p>
              <p className="mt-3">
                Our total liability for any claim related to the Service shall
                not exceed the amount you paid for the assessment.
              </p>
            </div>

            {/* Section 9 */}
            <div>
              <h2 className="text-xl font-semibold text-navy-900 mb-3">
                9. Intellectual Property
              </h2>
              <p>
                All content, methodologies, scoring models, calibration
                profiles, output logic, and branding associated with
                RunPayway&#8482; are the intellectual property of PeopleStar
                Enterprises, Inc.
              </p>
              <p className="mt-3">
                You may not reproduce, distribute, reverse-engineer, or create
                derivative works from any part of the Service or its outputs
                without express written consent.
              </p>
            </div>

            {/* Section 10 */}
            <div>
              <h2 className="text-xl font-semibold text-navy-900 mb-3">
                10. Modifications
              </h2>
              <p>
                We reserve the right to update these Terms at any time. Changes
                will be effective upon posting to this page. Continued use of
                the Service after changes constitutes acceptance of the revised
                Terms.
              </p>
            </div>

            {/* Section 11 */}
            <div>
              <h2 className="text-xl font-semibold text-navy-900 mb-3">
                11. Governing Law
              </h2>
              <p>
                These Terms are governed by the laws of the State of
                California, without regard to conflict of law principles. Any
                disputes shall be resolved in the courts located in the State
                of California.
              </p>
            </div>

            {/* Section 12 */}
            <div>
              <h2 className="text-xl font-semibold text-navy-900 mb-3">
                12. Contact
              </h2>
              <p>
                For questions about these Terms, please visit our{" "}
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
