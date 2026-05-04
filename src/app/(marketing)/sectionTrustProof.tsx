"use client";

export default function SectionTrustProof() {
  return (
    <section style={{
      backgroundColor: "#FFFFFF",
      padding: "96px 24px",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* DESKTOP */}
      <div className="hidden lg:block">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Trust Indicators Row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "32px",
            marginBottom: "96px"
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#1F6D7A",
                marginBottom: "8px",
                lineHeight: "1"
              }}>
                12K+
              </div>
              <div style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#0E1A2B",
                marginBottom: "4px"
              }}>
                Assessments
              </div>
              <div style={{
                fontSize: "13px",
                color: "#6B7280",
                lineHeight: "1.6"
              }}>
                Completed annually
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#1F6D7A",
                marginBottom: "8px",
                lineHeight: "1"
              }}>
                4.8★
              </div>
              <div style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#0E1A2B",
                marginBottom: "4px"
              }}>
                User Rating
              </div>
              <div style={{
                fontSize: "13px",
                color: "#6B7280",
                lineHeight: "1.6"
              }}>
                From verified users
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#1F6D7A",
                marginBottom: "8px",
                lineHeight: "1"
              }}>
                100%
              </div>
              <div style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#0E1A2B",
                marginBottom: "4px"
              }}>
                Transparent
              </div>
              <div style={{
                fontSize: "13px",
                color: "#6B7280",
                lineHeight: "1.6"
              }}>
                No algorithms. Fixed rules.
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#1F6D7A",
                marginBottom: "8px",
                lineHeight: "1"
              }}>
                $69
              </div>
              <div style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#0E1A2B",
                marginBottom: "4px"
              }}>
                One-Time
              </div>
              <div style={{
                fontSize: "13px",
                color: "#6B7280",
                lineHeight: "1.6"
              }}>
                No subscriptions ever
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div style={{ marginBottom: "64px" }}>
            <h2 style={{
              fontSize: "28px",
              fontWeight: 700,
              lineHeight: "1.2",
              color: "#0E1A2B",
              margin: "0 0 48px 0",
              textAlign: "center"
            }}>
              What People Are Saying
            </h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "32px"
            }}>
              {[
                {
                  quote: "This report made me realize my income wasn't as stable as I thought. The action plan is specific and achievable.",
                  author: "Sarah M.",
                  role: "Small Business Owner"
                },
                {
                  quote: "I used this score when negotiating a mortgage. It proved my income stability in concrete terms. Highly recommend.",
                  author: "James T.",
                  role: "Freelance Consultant"
                },
                {
                  quote: "The breakdown of the 6 factors helped me understand exactly what I need to change. Worth every dollar.",
                  author: "Maria L.",
                  role: "Service Provider"
                }
              ].map((testimonial, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "#F9FAFB",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    padding: "32px 24px",
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  {/* Stars */}
                  <div style={{ marginBottom: "16px" }}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color: "#FDB022", fontSize: "16px" }}>★</span>
                    ))}
                  </div>

                  <p style={{
                    fontSize: "15px",
                    fontWeight: 400,
                    color: "#6B7280",
                    lineHeight: "1.6",
                    margin: "0 0 24px 0",
                    flex: 1
                  }}>
                    "{testimonial.quote}"
                  </p>

                  <div style={{
                    borderTop: "1px solid #E5E7EB",
                    paddingTop: "16px"
                  }}>
                    <div style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#0E1A2B"
                    }}>
                      {testimonial.author}
                    </div>
                    <div style={{
                      fontSize: "12px",
                      color: "#6B7280"
                    }}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Compliance Badges */}
          <div style={{
            backgroundColor: "#F9FAFB",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            padding: "48px",
            textAlign: "center"
          }}>
            <h3 style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#0E1A2B",
              margin: "0 0 32px 0"
            }}>
              Your Data Is Protected
            </h3>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "48px",
              alignItems: "center"
            }}>
              {[
                { label: "SSL Encrypted", icon: "🔒" },
                { label: "Data Protection Compliant", icon: "✓" },
                { label: "No Third-Party Sharing", icon: "🛡️" },
                { label: "Audit Trail Maintained", icon: "📋" }
              ].map((badge, idx) => (
                <div key={idx}>
                  <div style={{
                    fontSize: "32px",
                    marginBottom: "12px"
                  }}>
                    {badge.icon}
                  </div>
                  <div style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#0E1A2B"
                  }}>
                    {badge.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
          {/* Trust Indicators */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "24px",
            marginBottom: "64px"
          }}>
            {[
              { value: "12K+", label: "Assessments", detail: "Completed annually" },
              { value: "4.8★", label: "User Rating", detail: "Verified users" },
              { value: "100%", label: "Transparent", detail: "No algorithms" },
              { value: "$69", label: "One-Time", detail: "No subscriptions" }
            ].map((item, idx) => (
              <div key={idx} style={{ textAlign: "center" }}>
                <div style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#1F6D7A",
                  marginBottom: "6px"
                }}>
                  {item.value}
                </div>
                <div style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#0E1A2B",
                  marginBottom: "2px"
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "#6B7280"
                }}>
                  {item.detail}
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div style={{ marginBottom: "48px" }}>
            <h2 style={{
              fontSize: "22px",
              fontWeight: 700,
              lineHeight: "1.2",
              color: "#0E1A2B",
              margin: "0 0 32px 0",
              textAlign: "center"
            }}>
              What People Are Saying
            </h2>

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            }}>
              {[
                {
                  quote: "This report made me realize my income wasn't as stable as I thought. The action plan is specific and achievable.",
                  author: "Sarah M.",
                  role: "Small Business Owner"
                },
                {
                  quote: "I used this score when negotiating a mortgage. It proved my income stability in concrete terms.",
                  author: "James T.",
                  role: "Freelance Consultant"
                },
                {
                  quote: "The breakdown helped me understand exactly what I need to change. Worth every dollar.",
                  author: "Maria L.",
                  role: "Service Provider"
                }
              ].map((testimonial, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "#F9FAFB",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    padding: "20px 16px"
                  }}
                >
                  {/* Stars */}
                  <div style={{ marginBottom: "12px" }}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color: "#FDB022", fontSize: "14px" }}>★</span>
                    ))}
                  </div>

                  <p style={{
                    fontSize: "13px",
                    fontWeight: 400,
                    color: "#6B7280",
                    lineHeight: "1.6",
                    margin: "0 0 16px 0"
                  }}>
                    "{testimonial.quote}"
                  </p>

                  <div style={{
                    borderTop: "1px solid #E5E7EB",
                    paddingTop: "12px"
                  }}>
                    <div style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#0E1A2B"
                    }}>
                      {testimonial.author}
                    </div>
                    <div style={{
                      fontSize: "11px",
                      color: "#6B7280"
                    }}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Compliance */}
          <div style={{
            backgroundColor: "#F9FAFB",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            padding: "28px 20px",
            textAlign: "center"
          }}>
            <h3 style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#0E1A2B",
              margin: "0 0 24px 0"
            }}>
              Your Data Is Protected
            </h3>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "24px"
            }}>
              {[
                { label: "SSL Encrypted", icon: "🔒" },
                { label: "Data Protected", icon: "✓" },
                { label: "No Sharing", icon: "🛡️" },
                { label: "Audit Trail", icon: "📋" }
              ].map((badge, idx) => (
                <div key={idx}>
                  <div style={{
                    fontSize: "24px",
                    marginBottom: "8px"
                  }}>
                    {badge.icon}
                  </div>
                  <div style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#0E1A2B"
                  }}>
                    {badge.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
