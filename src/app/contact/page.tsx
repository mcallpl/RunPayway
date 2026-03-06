"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const inputClass =
    "w-full border border-divider rounded-md px-3 py-3 text-sm text-navy bg-white focus:outline-none focus:ring-1 focus:ring-navy/30";

  return (
    <div className="mx-auto max-w-[1280px] px-10">
      <section className="max-w-[720px] py-24">
        <h1 className="text-[28px]">Contact</h1>
        <div className="mt-4 text-sm text-secondary space-y-1">
          <p>RunPayway&trade;</p>
          <p>Income Stability Score&trade;</p>
          <p>Model RP-1.0 | Version 1.0</p>
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

        {/* Designated Inquiry Channel */}
        <div>
          <h2 className="text-[28px]">Designated Inquiry Channel</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              This page provides the designated communication channel for inquiries regarding{" "}
              <strong className="text-navy">
                RunPayway&trade; and the Income Stability Score&trade;
              </strong>
              .
            </p>
            <p>
              Use this form for questions related to assessments, platform operation, registry
              verification, or enterprise use.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* Contact Form */}
        <div>
          <div className="space-y-6">
            {/* Inquiry Type */}
            <div>
              <label
                htmlFor="inquiryType"
                className="block text-sm font-medium text-navy mb-1"
              >
                Inquiry Type <span className="text-secondary">(Required)</span>
              </label>
              <select
                id="inquiryType"
                className={inputClass}
                defaultValue=""
              >
                <option value="" disabled>
                  Select inquiry type
                </option>
                <option>Individual Assessment Inquiry</option>
                <option>Enterprise / Business Inquiry</option>
                <option>Registry Verification Inquiry</option>
                <option>Technical Issue</option>
                <option>Accessibility Request</option>
                <option>Other</option>
              </select>
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-navy mb-1"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Full name"
                className={inputClass}
              />
            </div>

            {/* Organization */}
            <div>
              <label
                htmlFor="organization"
                className="block text-sm font-medium text-navy mb-1"
              >
                Organization{" "}
                <span className="text-secondary font-normal">(if applicable)</span>
              </label>
              <input
                id="organization"
                type="text"
                placeholder="Organization"
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-navy mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email address"
                className={inputClass}
              />
            </div>

            {/* Country */}
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-navy mb-1"
              >
                Country
              </label>
              <input
                id="country"
                type="text"
                placeholder="Country"
                className={inputClass}
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-navy mb-1"
              >
                Brief Description of Inquiry
              </label>
              <textarea
                id="description"
                rows={5}
                placeholder="Describe your inquiry"
                className={inputClass}
              />
            </div>
          </div>

          <button
            onClick={() => setSubmitted(true)}
            className="mt-8 bg-navy text-white px-6 py-3 rounded-md text-sm font-medium hover:opacity-90"
          >
            Submit Inquiry
          </button>

          {submitted && (
            <p className="mt-4 text-sm text-secondary">
              Inquiry submission functionality will be connected in a later phase.
            </p>
          )}
        </div>

        <hr className="border-divider" />

        {/* Consent to Contact */}
        <div>
          <h2 className="text-[28px]">Consent to Contact</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              By submitting this form, you consent to being contacted by RunPayway&trade;
              regarding your inquiry.
            </p>
            <p>Contact will be made using the information provided.</p>
            <p>
              Information submitted through this form will be used solely to respond to the
              inquiry and will be processed in accordance with the{" "}
              <strong className="text-navy">Privacy Policy</strong>.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* Security Notice */}
        <div>
          <h2 className="text-[28px]">Security Notice</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              Do not submit sensitive personal information through this form, including:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>financial account numbers</li>
              <li>government identification numbers</li>
              <li>payment card information</li>
            </ul>
            <p>
              RunPayway&trade; will never request payment card details through this contact
              channel.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* Submission Controls */}
        <div>
          <h2 className="text-[28px]">Submission Controls</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>Automated, bulk, or scripted submissions are prohibited.</p>
            <p>
              RunPayway&trade; reserves the right to restrict or decline submissions that
              appear abusive, automated, or inconsistent with platform policies.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* Inquiry Review Process */}
        <div>
          <h2 className="text-[28px]">Inquiry Review Process</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              Inquiries are reviewed and responded to in accordance with internal review
              procedures.
            </p>
            <p>
              Typical response time is{" "}
              <strong className="text-navy">1&ndash;3 business days</strong>, though response
              timing may vary depending on inquiry type and operational volume.
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        {/* Advisory Notice */}
        <div>
          <h2 className="text-[28px]">Advisory Notice</h2>
          <div className="mt-4 text-sm text-secondary space-y-3">
            <p>
              RunPayway&trade; does not provide financial, legal, or tax advice.
            </p>
            <p>
              This communication channel is limited to{" "}
              <strong className="text-navy">
                platform-related, operational, and enterprise inquiries
              </strong>
              .
            </p>
          </div>
        </div>

        <hr className="border-divider" />

        <p className="text-sm text-secondary pb-24">Model RP-1.0 | Version 1.0</p>
      </section>
    </div>
  );
}
