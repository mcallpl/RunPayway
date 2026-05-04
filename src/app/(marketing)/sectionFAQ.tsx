"use client";

import { useState } from "react";

export default function SectionFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const NavyColor = "#0E1A2B";
  const TealColor = "#1F6D7A";

  const faqs = [
    {
      q: "How long does the 2-minute assessment actually take?",
      a: "The assessment asks about your income sources, how predictable each is, and how many clients or revenue streams you have. Most people complete it in 90 seconds to 2 minutes, depending on how complex their income structure is. There are no long-form questions—just straightforward answers about your income."
    },
    {
      q: "What exactly counts as 'income' in this assessment?",
      a: "Income includes any money you earn: client payments, project work, retainer fees, contract income, self-employment earnings, passive income (rental, products, investments), and any other revenue source. The assessment doesn't care about the amount—it cares about structure: how many sources you have, how stable each is, and how much you rely on actively working."
    },
    {
      q: "What do the 6 factors actually measure?",
      a: "They measure: (1) Concentration—relying on too few sources, (2) Diversity—how many revenue streams you have, (3) Forward Visibility—how much future income is already locked in, (4) Stability Pattern—whether your income is consistent month-to-month, (5) Continuity—can you earn without actively working, (6) Dependency—how much depends on your effort vs. automatic revenue. Together, they paint a complete picture of your income structure."
    },
    {
      q: "What does my score actually mean? Is 72 good?",
      a: "Your score ranges 0-100. A score of 50+ indicates a reasonably stable income structure. A score of 72 (like the example) means your income structure is established and stable, but there are specific areas to improve. A score of 25 would indicate high vulnerability. Think of it like a health score—higher is better, but even high scores show where you're most at risk."
    },
    {
      q: "What if my income is mostly from one client? Can I still get a good score?",
      a: "Your score will reflect your actual structure. If 80% of your income comes from one client, that's a real vulnerability, and your score will show it. That's the point—RunPayway™ helps you see what's actually risky so you know what to improve. The action plan will show you specific ways to reduce that concentration risk."
    },
    {
      q: "What if my income changed since I took the assessment?",
      a: "Your score is a snapshot from the date you took it. If you gained a major new client, lost a revenue source, or shifted to more passive income, your structure changed and so would your score. You can retake the assessment anytime to see your updated rating. Many people reassess every 6-12 months to track their progress."
    },
    {
      q: "Is my data private? What happens to my information?",
      a: "Your data is encrypted and never shared, sold, or used for marketing. Your results belong to you. Your assessment is timestamped and stored securely so you can access it anytime. We don't monetize your data or share it with third parties. See our privacy policy for complete details."
    },
    {
      q: "Do advisors and professionals use this with their clients?",
      a: "Yes. Financial advisors, accountants, and business consultants use RunPayway™ to help their clients understand income stability and identify structural risks. The assessment provides objective, rules-based data that professionals can confidently use in their advisory work. It's designed to be professional-grade while remaining accessible and easy to use. Learn more about professional use at /advisors."
    },
    {
      q: "Can this be integrated into our platform or workflow?",
      a: "RunPayway™ is built for integration. Advisors and organizations can embed the assessment into their client workflows, advisory processes, or platforms. For information about professional licensing, integration, and bulk usage, visit /advisors or /organizations to explore options for your firm."
    },
    {
      q: "Is there a professional or white-label version?",
      a: "We work with advisors and organizations who want to offer income stability analysis to their clients. White-label, integration, and bulk licensing options are available for advisors, brokers, accountants, and wealth management firms. Visit /advisors for advisory firm solutions or /organizations for enterprise options."
    }
  ];

  return (
    <section style={{
      backgroundColor: "#FFFFFF",
      padding: "96px 24px",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <h2 style={{
            fontSize: "48px",
            fontWeight: 700,
            lineHeight: "1.2",
            letterSpacing: "-0.020em",
            color: NavyColor,
            margin: "0 0 20px 0"
          }}>
            Frequently Asked Questions
          </h2>
          <p style={{
            fontSize: "20px",
            fontWeight: 500,
            lineHeight: "1.6",
            color: "#5E6873",
            margin: "0"
          }}>
            Clarity on how your assessment works and how to use it
          </p>
        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              overflow: "hidden"
            }}>
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                style={{
                  width: "100%",
                  padding: "20px 24px",
                  backgroundColor: openIndex === idx ? "rgba(31, 109, 122, 0.04)" : "#FFFFFF",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 200ms ease"
                }}
                onMouseEnter={(e) => {
                  if (openIndex !== idx) {
                    e.currentTarget.style.backgroundColor = "#F9FAFB";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = openIndex === idx ? "rgba(31, 109, 122, 0.04)" : "#FFFFFF";
                }}
              >
                <span style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: NavyColor,
                  textAlign: "left"
                }}>
                  {faq.q}
                </span>
                <span style={{
                  fontSize: "20px",
                  color: TealColor,
                  marginLeft: "16px",
                  flexShrink: 0,
                  transform: openIndex === idx ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 200ms ease"
                }}>
                  ▼
                </span>
              </button>

              {openIndex === idx && (
                <div style={{
                  padding: "16px 24px 24px",
                  backgroundColor: "rgba(31, 109, 122, 0.02)",
                  borderTop: "1px solid #E5E7EB"
                }}>
                  <p style={{
                    fontSize: "15px",
                    fontWeight: 400,
                    lineHeight: "1.8",
                    color: "#5E6873",
                    margin: "0"
                  }}>
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{
          textAlign: "center",
          marginTop: "64px",
          padding: "32px 40px",
          backgroundColor: "#F9FAFB",
          borderRadius: "12px"
        }}>
          <p style={{
            fontSize: "15px",
            fontWeight: 500,
            lineHeight: "1.7",
            color: "#5E6873",
            margin: "0"
          }}>
            Ready to understand your income stability? <strong style={{ color: NavyColor }}>Your 2-minute assessment is completely private</strong>, and you'll get your result instantly. No documents needed, no sign-up hassle.
          </p>
        </div>
      </div>
    </section>
  );
}
