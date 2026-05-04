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
            fontSize: "36px",
            fontWeight: 700,
            lineHeight: 1.2,
            color: "#0E1A2B",
            textAlign: "center",
            margin: "0 0 24px 0"
          }}>
            Your current result is incomplete.
          </h2>
          <p style={{
            fontSize: "16px",
            color: "#6B7280",
            textAlign: "center",
            margin: "0 0 48px 0",
            fontWeight: 400,
            lineHeight: 1.5
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
            marginBottom: "48px"
          }}>
            {/* LEFT CARD - FREE */}
            <div style={{
              backgroundColor: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "16px",
              padding: "40px 32px",
              display: "flex",
              flexDirection: "column"
            }}>
              {/* Card Label */}
              <div style={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#1F6D7A",
                textTransform: "uppercase",
                marginBottom: "20px"
              }}>
                Initial Output
              </div>

              {/* Price */}
              <div style={{
                fontSize: "36px",
                fontWeight: 700,
                color: "#111827",
                marginBottom: "32px"
              }}>
                FREE
              </div>

              {/* Features */}
              <div style={{ flex: 1, marginBottom: "32px" }}>
                {/* Feature Row 1 */}
                <div style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                  marginBottom: "24px"
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" style={{ flexShrink: 0, marginTop: "2px" }}>
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <polyline points="19 12 12 19 5 12"></polyline>
                  </svg>
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
                      fontWeight: 400,
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
                  alignItems: "flex-start"
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" style={{ flexShrink: 0, marginTop: "2px" }}>
                    <path d="M12 2L2 20h20Z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
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
                      fontWeight: 400,
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
                paddingTop: "20px",
                borderTop: "1px solid #E5E7EB"
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" style={{ flexShrink: 0, marginTop: "2px" }}>
                  <rect x="3" y="11" width="18" height="11" rx="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <div style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#6B7280"
                }}>
                  Not sufficient for full decision verification.
                </div>
              </div>
            </div>

            {/* RIGHT CARD - $69 */}
            <div style={{
              backgroundColor: "#FFFFFF",
              border: "2px solid #1F6D7A",
              borderRadius: "16px",
              padding: "40px 32px",
              display: "flex",
              flexDirection: "column"
            }}>
              {/* Card Label */}
              <div style={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#1F6D7A",
                textTransform: "uppercase",
                marginBottom: "20px"
              }}>
                Full Verification
              </div>

              {/* Price */}
              <div style={{
                fontSize: "36px",
                fontWeight: 700,
                color: "#1F6D7A",
                marginBottom: "32px"
              }}>
                $69
              </div>

              {/* Features */}
              <div style={{ flex: 1, marginBottom: "32px" }}>
                {/* Feature Row 1 */}
                <div style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                  marginBottom: "24px"
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1F6D7A" strokeWidth="2" style={{ flexShrink: 0, marginTop: "2px" }}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
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
                      fontWeight: 400,
                      color: "#6B7280"
                    }}>
                      Your overall stability score on a 0-100 scale
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
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1F6D7A" strokeWidth="2" style={{ flexShrink: 0, marginTop: "2px" }}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
                  </svg>
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
                      fontWeight: 400,
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
                  alignItems: "flex-start"
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1F6D7A" strokeWidth="2" style={{ flexShrink: 0, marginTop: "2px" }}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
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
                      fontWeight: 400,
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
                gap: "8px",
                alignItems: "center",
                paddingTop: "20px",
                borderTop: "1px solid #E5E7EB",
                marginBottom: "16px"
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1F6D7A" strokeWidth="2" style={{ flexShrink: 0 }}>
                  <rect x="3" y="11" width="18" height="11" rx="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <div style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "#1F6D7A",
                  textTransform: "uppercase"
                }}>
                  Complete output
                </div>
              </div>

              {/* CTA Button */}
              <button style={{
                width: "100%",
                height: "52px",
                backgroundColor: "#1F6D7A",
                color: "#FFFFFF",
                fontSize: "16px",
                fontWeight: 600,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              }}>
                Complete Verification
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>

            {/* CONNECTOR - VS */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "0",
              right: "0",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none"
            }}>
              {/* Horizontal Dashed Line */}
              <div style={{
                position: "absolute",
                width: "100%",
                height: "1px",
                borderTop: "1px dashed #D1D5DB"
              }}></div>

              {/* Center Circle with VS */}
              <div style={{
                position: "absolute",
                width: "88px",
                height: "88px",
                borderRadius: "999px",
                backgroundColor: "#1F6D7A",
                border: "1px solid #1F6D7A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10
              }}>
                <p style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  margin: 0,
                  textAlign: "center"
                }}>
                  VS
                </p>
              </div>
            </div>
          </div>

          {/* Authority Bar */}
          <div style={{
            padding: "20px 32px",
            backgroundColor: "#F9FAFB",
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "16px"
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" style={{ flexShrink: 0 }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <div style={{
              fontSize: "14px",
              color: "#6B7280",
              fontWeight: 400
            }}>
              <span style={{ fontWeight: 600, color: "#111827" }}>Model RP-2.0</span> | Same inputs produce same result
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden" style={{ padding: "64px 16px" }}>
        {/* Header */}
        <h2 style={{
          fontSize: "28px",
          fontWeight: 700,
          lineHeight: 1.2,
          color: "#0E1A2B",
          textAlign: "center",
          margin: "0 0 16px 0"
        }}>
          Your current result is incomplete.
        </h2>
        <p style={{
          fontSize: "14px",
          color: "#6B7280",
          textAlign: "center",
          margin: "0 0 32px 0",
          fontWeight: 400,
          lineHeight: 1.5
        }}>
          Full verification defines your income stability.
        </p>

        {/* LEFT CARD - FREE */}
        <div style={{
          backgroundColor: "#F9FAFB",
          border: "1px solid #E5E7EB",
          borderRadius: "12px",
          padding: "28px",
          marginBottom: "20px"
        }}>
          {/* Card Label */}
          <div style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "#1F6D7A",
            textTransform: "uppercase",
            marginBottom: "12px"
          }}>
            Initial Output
          </div>

          {/* Price */}
          <div style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "20px"
          }}>
            FREE
          </div>

          {/* Features */}
          <div style={{ marginBottom: "20px" }}>
            {/* Feature Row 1 */}
            <div style={{
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
              marginBottom: "16px"
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" style={{ flexShrink: 0, marginTop: "2px" }}>
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
              <div>
                <div style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#111827",
                  marginBottom: "2px"
                }}>
                  Stability classification
                </div>
                <div style={{
                  fontSize: "12px",
                  fontWeight: 400,
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
              alignItems: "flex-start"
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" style={{ flexShrink: 0, marginTop: "2px" }}>
                <path d="M12 2L2 20h20Z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <div>
                <div style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#111827",
                  marginBottom: "2px"
                }}>
                  Primary structural constraint
                </div>
                <div style={{
                  fontSize: "12px",
                  fontWeight: 400,
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
            gap: "8px",
            alignItems: "flex-start",
            paddingTop: "16px",
            borderTop: "1px solid #E5E7EB"
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" style={{ flexShrink: 0, marginTop: "2px" }}>
              <rect x="3" y="11" width="18" height="11" rx="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <div style={{
              fontSize: "12px",
              fontWeight: 400,
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
          marginBottom: "20px",
          position: "relative",
          height: "60px"
        }}>
          <div style={{
            position: "absolute",
            width: "100%",
            height: "1px",
            borderTop: "1px dashed #D1D5DB"
          }}></div>
          <div style={{
            width: "72px",
            height: "72px",
            borderRadius: "999px",
            backgroundColor: "#1F6D7A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            fontSize: "18px",
            fontWeight: 700,
            zIndex: 10
          }}>
            VS
          </div>
        </div>

        {/* RIGHT CARD - $69 */}
        <div style={{
          backgroundColor: "#FFFFFF",
          border: "2px solid #1F6D7A",
          borderRadius: "12px",
          padding: "28px",
          marginBottom: "20px"
        }}>
          {/* Card Label */}
          <div style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "#1F6D7A",
            textTransform: "uppercase",
            marginBottom: "12px"
          }}>
            Full Verification
          </div>

          {/* Price */}
          <div style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#1F6D7A",
            marginBottom: "20px"
          }}>
            $69
          </div>

          {/* Features */}
          <div style={{ marginBottom: "20px" }}>
            {/* Feature Row 1 */}
            <div style={{
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
              marginBottom: "16px"
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F6D7A" strokeWidth="2" style={{ flexShrink: 0, marginTop: "2px" }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <div>
                <div style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#111827",
                  marginBottom: "2px"
                }}>
                  Income Stability Score™
                </div>
                <div style={{
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "#6B7280"
                }}>
                  Your overall stability score on a 0-100 scale
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F6D7A" strokeWidth="2" style={{ flexShrink: 0, marginTop: "2px" }}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
              </svg>
              <div>
                <div style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#111827",
                  marginBottom: "2px"
                }}>
                  Full structural breakdown
                </div>
                <div style={{
                  fontSize: "12px",
                  fontWeight: 400,
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
              alignItems: "flex-start"
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F6D7A" strokeWidth="2" style={{ flexShrink: 0, marginTop: "2px" }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div>
                <div style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#111827",
                  marginBottom: "2px"
                }}>
                  Decision definition
                </div>
                <div style={{
                  fontSize: "12px",
                  fontWeight: 400,
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
            gap: "6px",
            alignItems: "center",
            paddingTop: "16px",
            borderTop: "1px solid #E5E7EB",
            marginBottom: "12px"
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1F6D7A" strokeWidth="2" style={{ flexShrink: 0 }}>
              <rect x="3" y="11" width="18" height="11" rx="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <div style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "#1F6D7A",
              textTransform: "uppercase"
            }}>
              Complete output
            </div>
          </div>

          {/* CTA Button */}
          <button style={{
            width: "100%",
            height: "48px",
            backgroundColor: "#1F6D7A",
            color: "#FFFFFF",
            fontSize: "16px",
            fontWeight: 600,
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}>
            Complete Verification
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>

        {/* Authority Bar */}
        <div style={{
          padding: "16px 12px",
          backgroundColor: "#F9FAFB",
          border: "1px solid #E5E7EB",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" style={{ flexShrink: 0 }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <div style={{
            fontSize: "12px",
            color: "#6B7280",
            fontWeight: 400,
            lineHeight: 1.4
          }}>
            <span style={{ fontWeight: 600, color: "#111827" }}>Model RP-2.0</span> | Same inputs produce same result
          </div>
        </div>
      </div>
    </section>
  );
}
