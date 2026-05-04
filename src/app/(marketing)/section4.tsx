"use client";

export default function Section4() {
  return (
    <section style={{
      padding: "96px 24px",
      backgroundColor: "#FFFFFF",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* DESKTOP */}
      <div className="hidden lg:block">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Header */}
          <h2 style={{
            fontSize: "44px",
            fontWeight: 700,
            lineHeight: 1.2,
            color: "#0F172A",
            textAlign: "center",
            margin: "0 0 12px 0"
          }}>
            Your current result is incomplete.
          </h2>
          <p style={{
            fontSize: "18px",
            color: "#6B7280",
            textAlign: "center",
            margin: "0 0 48px 0",
            fontWeight: 400
          }}>
            Full verification defines your income stability.
          </p>

          {/* Card Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            alignItems: "stretch",
            position: "relative",
            marginBottom: "40px"
          }}>
            {/* LEFT CARD - FREE */}
            <div style={{
              backgroundColor: "#FAFAFA",
              border: "1px solid #E5E7EB",
              borderRadius: "16px",
              padding: "32px",
              display: "flex",
              flexDirection: "column"
            }}>
              {/* Label Pill */}
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0",
                padding: "6px 12px",
                borderRadius: "999px",
                backgroundColor: "#F3F4F6",
                color: "#6B7280",
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                width: "fit-content",
                marginBottom: "16px"
              }}>
                Initial Output
              </div>

              {/* Price */}
              <div style={{
                fontSize: "36px",
                fontWeight: 700,
                color: "#111827",
                marginBottom: "24px"
              }}>
                FREE
              </div>

              {/* Divider */}
              <div style={{
                height: "1px",
                backgroundColor: "#E5E7EB",
                marginBottom: "24px"
              }}></div>

              {/* Features */}
              <div style={{ flex: 1 }}>
                {/* Feature Row 1 */}
                <div style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                  marginBottom: "20px"
                }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <div style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#111827",
                      marginBottom: "4px"
                    }}>
                      Stability classification
                    </div>
                    <div style={{
                      fontSize: "14px",
                      color: "#6B7280"
                    }}>
                      Your current stability class (band)
                    </div>
                  </div>
                </div>

                {/* Feature Row 2 */}
                <div style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                  marginBottom: "24px"
                }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </div>
                  <div>
                    <div style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#111827",
                      marginBottom: "4px"
                    }}>
                      Primary structural constraint
                    </div>
                    <div style={{
                      fontSize: "14px",
                      color: "#6B7280"
                    }}>
                      The main factor limiting your stability
                    </div>
                  </div>
                </div>
              </div>

              {/* Lock row */}
              <div style={{
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                paddingTop: "24px",
                borderTop: "1px solid #E5E7EB"
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <div style={{
                  fontSize: "14px",
                  color: "#6B7280"
                }}>
                  Not sufficient for full decision verification.
                </div>
              </div>
            </div>

            {/* RIGHT CARD - $69 */}
            <div style={{
              backgroundColor: "#FFFFFF",
              border: "2px solid #0F766E",
              borderRadius: "16px",
              padding: "32px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column"
            }}>
              {/* Label Pill */}
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0",
                padding: "6px 12px",
                borderRadius: "999px",
                backgroundColor: "rgba(15,118,110,0.1)",
                color: "#0F766E",
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                width: "fit-content",
                marginBottom: "16px"
              }}>
                Full Verification
              </div>

              {/* Price */}
              <div style={{
                fontSize: "44px",
                fontWeight: 700,
                color: "#0F766E",
                marginBottom: "24px"
              }}>
                $69
              </div>

              {/* Divider */}
              <div style={{
                height: "1px",
                backgroundColor: "#E5E7EB",
                marginBottom: "24px"
              }}></div>

              {/* Features */}
              <div style={{ flex: 1 }}>
                {/* Feature Row 1 */}
                <div style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                  marginBottom: "20px"
                }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "rgba(15,118,110,0.08)",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm-1-13h2v6h-2V7zm1 8a1 1 0 110-2 1 1 0 010 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <div style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#111827",
                      marginBottom: "4px"
                    }}>
                      Income Stability Score™
                    </div>
                    <div style={{
                      fontSize: "14px",
                      color: "#6B7280"
                    }}>
                      Your overall stability score on a 0–100 scale
                    </div>
                  </div>
                </div>

                {/* Feature Row 2 */}
                <div style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                  marginBottom: "20px"
                }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "rgba(15,118,110,0.08)",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="1"></circle>
                      <path d="M12 8a4 4 0 0 1 4 4M12 8a4 4 0 0 0-4 4M12 8V4M8 16a4 4 0 0 0 4 4v0a4 4 0 0 0 4-4"></path>
                    </svg>
                  </div>
                  <div>
                    <div style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#111827",
                      marginBottom: "4px"
                    }}>
                      Full structural breakdown
                    </div>
                    <div style={{
                      fontSize: "14px",
                      color: "#6B7280"
                    }}>
                      Complete view across all 6 structural inputs
                    </div>
                  </div>
                </div>

                {/* Feature Row 3 */}
                <div style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                  marginBottom: "20px"
                }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "rgba(15,118,110,0.08)",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9"></circle>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                  </div>
                  <div>
                    <div style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#111827",
                      marginBottom: "4px"
                    }}>
                      Decision definition
                    </div>
                    <div style={{
                      fontSize: "14px",
                      color: "#6B7280"
                    }}>
                      What to change, how it impacts your score
                    </div>
                  </div>
                </div>
              </div>

              {/* Complete output row */}
              <div style={{
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                paddingTop: "20px",
                borderTop: "1px solid #E5E7EB",
                marginBottom: "20px"
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11.414l2.121-2.122a1 1 0 011.414 1.415l-3.536 3.535a1 1 0 01-1.414 0L9.05 11.88a1 1 0 011.414-1.414L11 12.586z"></path>
                </svg>
                <div style={{
                  fontSize: "14px",
                  color: "#0F766E",
                  fontWeight: 600
                }}>
                  Complete output
                </div>
              </div>

              {/* CTA Button */}
              <button style={{
                width: "100%",
                height: "56px",
                background: "linear-gradient(135deg, #0F172A 0%, #0F766E 100%)",
                color: "#FFFFFF",
                fontSize: "16px",
                fontWeight: 600,
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              }}>
                Complete Verification
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>

            {/* CONNECTOR - VS */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none"
            }}>
              {/* Dashed Line */}
              <div style={{
                position: "absolute",
                width: "100%",
                height: "1px",
                borderTop: "1px dashed #D1D5DB"
              }}></div>

              {/* Circle Badge */}
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "999px",
                backgroundColor: "#0F766E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: "16px",
                fontWeight: 700,
                zIndex: 10
              }}>
                VS
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{
            backgroundColor: "#F3F4F6",
            borderRadius: "12px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span style={{
              fontSize: "14px",
              color: "#374151",
              fontWeight: 600
            }}>
              Model RP-2.0
            </span>
            <span style={{
              fontSize: "14px",
              color: "#374151"
            }}>
              |
            </span>
            <span style={{
              fontSize: "14px",
              color: "#374151"
            }}>
              Same inputs produce same result
            </span>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden" style={{ padding: "64px 16px" }}>
        {/* Header */}
        <h2 style={{
          fontSize: "32px",
          fontWeight: 700,
          lineHeight: 1.2,
          color: "#0F172A",
          textAlign: "center",
          margin: "0 0 12px 0"
        }}>
          Your current result is incomplete.
        </h2>
        <p style={{
          fontSize: "16px",
          color: "#6B7280",
          textAlign: "center",
          margin: "0 0 24px 0",
          fontWeight: 400
        }}>
          Full verification defines your income stability.
        </p>

        {/* LEFT CARD - FREE */}
        <div style={{
          backgroundColor: "#FAFAFA",
          border: "1px solid #E5E7EB",
          borderRadius: "14px",
          padding: "24px",
          marginBottom: "24px"
        }}>
          {/* Label Pill */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0",
            padding: "6px 12px",
            borderRadius: "999px",
            backgroundColor: "#F3F4F6",
            color: "#6B7280",
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "14px"
          }}>
            Initial Output
          </div>

          {/* Price */}
          <div style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "18px"
          }}>
            FREE
          </div>

          {/* Divider */}
          <div style={{
            height: "1px",
            backgroundColor: "#E5E7EB",
            marginBottom: "18px"
          }}></div>

          {/* Features */}
          {/* Feature Row 1 */}
          <div style={{
            display: "flex",
            gap: "12px",
            alignItems: "flex-start",
            marginBottom: "16px"
          }}>
            <div style={{
              width: "36px",
              height: "36px",
              backgroundColor: "#F3F4F6",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </div>
            <div>
              <div style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#111827",
                marginBottom: "3px"
              }}>
                Stability classification
              </div>
              <div style={{
                fontSize: "13px",
                color: "#6B7280"
              }}>
                Your current stability class (band)
              </div>
            </div>
          </div>

          {/* Feature Row 2 */}
          <div style={{
            display: "flex",
            gap: "12px",
            alignItems: "flex-start",
            marginBottom: "18px"
          }}>
            <div style={{
              width: "36px",
              height: "36px",
              backgroundColor: "#F3F4F6",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div>
              <div style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#111827",
                marginBottom: "3px"
              }}>
                Primary structural constraint
              </div>
              <div style={{
                fontSize: "13px",
                color: "#6B7280"
              }}>
                The main factor limiting your stability
              </div>
            </div>
          </div>

          {/* Lock row */}
          <div style={{
            display: "flex",
            gap: "10px",
            alignItems: "flex-start",
            paddingTop: "18px",
            borderTop: "1px solid #E5E7EB"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <div style={{
              fontSize: "13px",
              color: "#6B7280"
            }}>
              Not sufficient for full decision verification.
            </div>
          </div>
        </div>

        {/* CONNECTOR - VS */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px",
          position: "relative",
          height: "40px"
        }}>
          <div style={{
            position: "absolute",
            width: "100%",
            height: "1px",
            borderTop: "1px dashed #D1D5DB"
          }}></div>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "999px",
            backgroundColor: "#0F766E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            fontSize: "14px",
            fontWeight: 700,
            zIndex: 10
          }}>
            VS
          </div>
        </div>

        {/* RIGHT CARD - $69 */}
        <div style={{
          backgroundColor: "#FFFFFF",
          border: "2px solid #0F766E",
          borderRadius: "14px",
          padding: "24px",
          marginBottom: "24px"
        }}>
          {/* Label Pill */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0",
            padding: "6px 12px",
            borderRadius: "999px",
            backgroundColor: "rgba(15,118,110,0.1)",
            color: "#0F766E",
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "14px"
          }}>
            Full Verification
          </div>

          {/* Price */}
          <div style={{
            fontSize: "36px",
            fontWeight: 700,
            color: "#0F766E",
            marginBottom: "18px"
          }}>
            $69
          </div>

          {/* Divider */}
          <div style={{
            height: "1px",
            backgroundColor: "#E5E7EB",
            marginBottom: "18px"
          }}></div>

          {/* Features */}
          {/* Feature Row 1 */}
          <div style={{
            display: "flex",
            gap: "12px",
            alignItems: "flex-start",
            marginBottom: "16px"
          }}>
            <div style={{
              width: "36px",
              height: "36px",
              backgroundColor: "rgba(15,118,110,0.08)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm-1-13h2v6h-2V7zm1 8a1 1 0 110-2 1 1 0 010 2z"></path>
              </svg>
            </div>
            <div>
              <div style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#111827",
                marginBottom: "3px"
              }}>
                Income Stability Score™
              </div>
              <div style={{
                fontSize: "13px",
                color: "#6B7280"
              }}>
                Your overall stability score on a 0–100 scale
              </div>
            </div>
          </div>

          {/* Feature Row 2 */}
          <div style={{
            display: "flex",
            gap: "12px",
            alignItems: "flex-start",
            marginBottom: "16px"
          }}>
            <div style={{
              width: "36px",
              height: "36px",
              backgroundColor: "rgba(15,118,110,0.08)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <path d="M12 8a4 4 0 0 1 4 4M12 8a4 4 0 0 0-4 4M12 8V4M8 16a4 4 0 0 0 4 4v0a4 4 0 0 0 4-4"></path>
              </svg>
            </div>
            <div>
              <div style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#111827",
                marginBottom: "3px"
              }}>
                Full structural breakdown
              </div>
              <div style={{
                fontSize: "13px",
                color: "#6B7280"
              }}>
                Complete view across all 6 structural inputs
              </div>
            </div>
          </div>

          {/* Feature Row 3 */}
          <div style={{
            display: "flex",
            gap: "12px",
            alignItems: "flex-start",
            marginBottom: "18px"
          }}>
            <div style={{
              width: "36px",
              height: "36px",
              backgroundColor: "rgba(15,118,110,0.08)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </div>
            <div>
              <div style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#111827",
                marginBottom: "3px"
              }}>
                Decision definition
              </div>
              <div style={{
                fontSize: "13px",
                color: "#6B7280"
              }}>
                What to change, how it impacts your score
              </div>
            </div>
          </div>

          {/* Complete output row */}
          <div style={{
            display: "flex",
            gap: "10px",
            alignItems: "flex-start",
            paddingTop: "18px",
            borderTop: "1px solid #E5E7EB",
            marginBottom: "16px"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11.414l2.121-2.122a1 1 0 011.414 1.415l-3.536 3.535a1 1 0 01-1.414 0L9.05 11.88a1 1 0 011.414-1.414L11 12.586z"></path>
            </svg>
            <div style={{
              fontSize: "13px",
              color: "#0F766E",
              fontWeight: 600
            }}>
              Complete output
            </div>
          </div>

          {/* CTA Button */}
          <button style={{
            width: "100%",
            height: "56px",
            background: "linear-gradient(135deg, #0F172A 0%, #0F766E 100%)",
            color: "#FFFFFF",
            fontSize: "15px",
            fontWeight: 600,
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}>
            Complete Verification
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>

        {/* Bottom Bar */}
        <div style={{
          backgroundColor: "#F3F4F6",
          borderRadius: "12px",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap"
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span style={{
            fontSize: "12px",
            color: "#374151",
            fontWeight: 600
          }}>
            Model RP-2.0
          </span>
          <span style={{
            fontSize: "12px",
            color: "#374151"
          }}>
            |
          </span>
          <span style={{
            fontSize: "12px",
            color: "#374151"
          }}>
            Same inputs produce same result
          </span>
        </div>
      </div>
    </section>
  );
}
