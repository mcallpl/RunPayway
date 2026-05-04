"use client";

import { useState } from "react";

export default function SectionFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const NavyColor = "#0E1A2B";
  const TealColor = "#1F6D7A";

  const faqs = [
    {
      q: "Will lenders or creditors accept this?",
      a: "Your RunPayway™ report provides a transparent, rules-based analysis of your income stability—exactly what lenders and creditors need to evaluate your financial position. While each lender has their own requirements, many find the structured format and clear risk assessment valuable for decision-making. Share it with your lender to see if it meets their standards."
    },
    {
      q: "Can I show this to my bank or mortgage broker?",
      a: "Yes. Your report is designed to be shareable. It provides professional documentation of your income structure and stability in a format that advisors, brokers, and creditors can understand. The timestamped record proves when you conducted the assessment."
    },
    {
      q: "What if my income changes? Is the score still valid?",
      a: "Your score is a snapshot of your income structure at the time of assessment. If your income changes significantly (new client, lost revenue source, increased passive income), your structure changes and your score would change. You can conduct a new assessment anytime to see your updated stability rating."
    },
    {
      q: "Is this report legally binding or certified?",
      a: "RunPayway™ provides a deterministic analysis based on fixed rules applied to your income data. It's not a legal document or professional certification, but it is a credible, rule-based assessment. Whether lenders or creditors accept it depends on their specific requirements—treat it as evidence of your income structure to support your applications."
    },
    {
      q: "How is my data used and stored?",
      a: "Your data is encrypted and never shared, sold, or monetized. Your assessment results belong to you. The permanent record is stored securely so you can reference it anytime. Read our full privacy policy for complete details on data handling and security."
    },
    {
      q: "Can I update my assessment or get a new one?",
      a: "Yes. You can conduct a new assessment anytime to capture changes in your income structure. Each assessment generates a new timestamped report, giving you a record of your stability over time—useful if you're tracking progress on your action plan."
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
            Have more questions? <strong style={{ color: NavyColor }}>Every assessment is personalized to your income structure</strong>. Your assessment asks specific questions about your situation, ensuring your result is accurate to your circumstances.
          </p>
        </div>
      </div>
    </section>
  );
}
