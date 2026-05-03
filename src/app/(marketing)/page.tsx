export default function LandingPage() {
  return (
    <div className="w-full">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB]" style={{ height: 72 }}>
        <div className="max-w-[1400px] mx-auto px-12 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#0E1A2B] font-bold text-[22px]">RUNPAYWAY</span>
            <span className="w-4 h-3 bg-[#0275D8]" style={{ clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)" }}></span>
          </div>
          <nav className="flex gap-8 flex-1 ml-20">
            <a href="#" className="text-[14px] text-[#0E1A2B] font-medium">How It Works</a>
            <div className="relative group">
              <button className="text-[14px] text-[#0E1A2B] font-medium flex items-center gap-1">
                Solutions
                <span className="text-[12px]">▼</span>
              </button>
              <div className="absolute top-full left-0 mt-0 w-[280px] bg-white border border-[#E5E7EB] rounded-[8px] shadow-lg p-4 hidden group-hover:block">
                <div className="space-y-3">
                  <a href="#" className="block text-[14px] font-medium text-[#0E1A2B]">For Advisors</a>
                  <a href="#" className="block text-[14px] font-medium text-[#0E1A2B]">For Organizations</a>
                </div>
              </div>
            </div>
            <div className="relative group">
              <button className="text-[14px] text-[#0E1A2B] font-medium flex items-center gap-1">
                Resources
                <span className="text-[12px]">▼</span>
              </button>
            </div>
            <a href="#" className="text-[14px] text-[#0E1A2B] font-medium">About</a>
          </nav>
          <div className="flex gap-6 ml-auto items-center">
            <a href="#" className="text-[14px] text-[#0E1A2B] font-medium">Sign In</a>
            <button className="bg-[#0E1A2B] text-white px-6 py-2.5 rounded-[8px] text-[14px] font-semibold h-[42px]">Start Verification</button>
          </div>
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <section className="bg-white" style={{ padding: "80px 40px" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-[14px] font-semibold text-[#0275D8] mb-4 tracking-wide">STRUCTURAL STABILITY MODEL RP-2.0</div>
              <h1 className="text-[52px] font-bold leading-tight text-[#0E1A2B] mb-6">Major financial decisions require income verification.</h1>
              <p className="text-[18px] font-semibold text-[#0E1A2B] mb-4">
                <span className="text-[#0275D8]">RunPayway™</span> defines whether income stability holds before commitment.
              </p>
              <p className="text-[16px] text-[#5E6873] mb-8">Without verification, income risk remains undefined.</p>
              <button className="bg-[#0E1A2B] text-white px-8 py-3.5 rounded-[8px] text-[16px] font-semibold mb-6 w-full max-w-[340px] flex items-center justify-center gap-2">
                Start Verification
                <span>→</span>
              </button>
              <p className="text-[13px] text-[#6B7280]">Before financial commitment · Answer 6 inputs · Immediate result</p>
            </div>
            <div className="bg-white rounded-[16px] p-10 border border-[#E5E7EB]">
              <div className="text-[12px] font-semibold text-[#0275D8] mb-6 tracking-widest">INCOME STABILITY SCORE™</div>
              <div className="text-[88px] font-bold text-[#0E1A2B] mb-1" style={{ fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: "1" }}>72</div>
              <div className="text-[16px] text-[#6B7280] mb-6">/ 100</div>
              <div className="text-[16px] font-semibold text-[#0275D8] mb-6">Established Stability</div>
              <p className="text-[14px] text-[#6B7280] mb-6">Determines whether income holds under disruption.</p>
              <div className="flex gap-2 mb-3" style={{ height: 12 }}>
                <div className="flex-[0.4] bg-[#0275D8]" style={{ borderRadius: "999px" }}></div>
                <div className="flex-[0.3] bg-[#D0A23A]" style={{ borderRadius: "999px" }}></div>
                <div className="flex-[0.3] bg-[#C62828]" style={{ borderRadius: "999px" }}></div>
              </div>
              <div className="flex justify-between text-[12px] font-semibold text-[#0275D8] mb-6">
                <span>Protected</span>
                <span>Recurring</span>
                <span>At Risk</span>
              </div>
              <div className="border-t border-[#E5E7EB] pt-4">
                <p className="text-[12px] text-[#6B7280] m-0">Model RP-2.0 · Same inputs produce same result</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="bg-white border-t border-[#E5E7EB]" style={{ padding: "64px 40px" }}>
        <div className="max-w-[1400px] mx-auto">
          <p className="text-[16px] text-[#6B7280] text-center mb-12">Trusted by organizations and professionals for verified income stability.</p>
          <div className="grid grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#E8F4F7] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0275D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[14px] font-semibold text-[#0E1A2B]">Independent verification</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#E8F4F7] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0275D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-[14px] font-semibold text-[#0E1A2B]">No documents required</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#E8F4F7] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0275D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-[14px] font-semibold text-[#0E1A2B]">Instant results</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CONSEQUENCE */}
      <section className="bg-[#F8F6F1]" style={{ padding: "96px 40px" }}>
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[36px] font-semibold text-[#0E1A2B] mb-10">Decisions made without structural verification fail under stress.</h2>
          <div className="grid grid-cols-3 gap-12">
            <div className="bg-white p-6 rounded-[12px] border border-[#D9D6CF]" style={{ boxShadow: "0 4px 16px rgba(14,26,43,0.08)" }}>
              <p className="text-15 font-semibold text-[#0E1A2B] leading-relaxed m-0">You are approved → then denied during final underwriting</p>
            </div>
            <div className="bg-white p-6 rounded-[12px] border border-[#D9D6CF]" style={{ boxShadow: "0 4px 16px rgba(14,26,43,0.08)" }}>
              <p className="text-15 font-semibold text-[#0E1A2B] leading-relaxed m-0">Income appears strong → but fails under disruption</p>
            </div>
            <div className="bg-white p-6 rounded-[12px] border border-[#D9D6CF]" style={{ boxShadow: "0 4px 16px rgba(14,26,43,0.08)" }}>
              <p className="text-15 font-semibold text-[#0E1A2B] leading-relaxed m-0">You commit → then discover instability too late</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: WHAT THE MODEL EVALUATES */}
      <section className="bg-white" style={{ padding: "80px 40px" }}>
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-[42px] font-bold text-[#0E1A2B] mb-6">What the model evaluates</h2>
          <p className="text-[16px] text-[#6B7280] mb-12">A fixed set of inputs determines the result.</p>
          <div className="grid grid-cols-3 gap-10 mb-8">
            <div className="bg-white p-8 rounded-[12px] border border-[#E5E7EB]">
              <h3 className="text-[18px] font-bold text-[#0E1A2B] mb-3">Concentration</h3>
              <p className="text-[14px] text-[#6B7280]">Reliance on primary income</p>
            </div>
            <div className="bg-white p-8 rounded-[12px] border border-[#E5E7EB]">
              <h3 className="text-[18px] font-bold text-[#0E1A2B] mb-3">Source Diversity</h3>
              <p className="text-[14px] text-[#6B7280]">Distribution across sources</p>
            </div>
            <div className="bg-white p-8 rounded-[12px] border border-[#E5E7EB]">
              <h3 className="text-[18px] font-bold text-[#0E1A2B] mb-3">Forward Visibility</h3>
              <p className="text-[14px] text-[#6B7280]">Income already secured</p>
            </div>
            <div className="bg-white p-8 rounded-[12px] border border-[#E5E7EB]">
              <h3 className="text-[18px] font-bold text-[#0E1A2B] mb-3">Stability Pattern</h3>
              <p className="text-[14px] text-[#6B7280]">Consistency over time</p>
            </div>
            <div className="bg-white p-8 rounded-[12px] border border-[#E5E7EB]">
              <h3 className="text-[18px] font-bold text-[#0E1A2B] mb-3">Continuity</h3>
              <p className="text-[14px] text-[#6B7280]">Income without activity</p>
            </div>
            <div className="bg-white p-8 rounded-[12px] border border-[#E5E7EB]">
              <h3 className="text-[18px] font-bold text-[#0E1A2B] mb-3">Dependency</h3>
              <p className="text-[14px] text-[#6B7280]">Dependence on effort</p>
            </div>
          </div>
          <div className="bg-[#F3F4F6] rounded-[12px] p-6 flex items-center gap-3">
            <svg className="w-5 h-5 text-[#0275D8] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-[13px] text-[#6B7280] m-0"><span className="font-semibold text-[#0E1A2B]">Model RP-2.0</span> · Fixed rules · Same inputs produce same result</p>
          </div>
        </div>
      </section>

      {/* SAME INCOME, DIFFERENT OUTCOME */}
      <section className="bg-white" style={{ padding: "80px 40px" }}>
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-[42px] font-bold text-[#0E1A2B] mb-6">Same income. Different outcome.</h2>
          <p className="text-[16px] text-[#6B7280] mb-12">Income level does not determine stability. Structure does.</p>

          <div className="mb-8">
            <div className="bg-[#F9F5F0] rounded-[8px] px-6 py-3 inline-flex items-center gap-3 mb-12">
              <span className="text-[20px]">💵</span>
              <span className="text-[14px] font-semibold text-[#0E1A2B]">Both examples: $150K annual income</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 items-start mb-12">
            <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-10">
              <div className="text-[12px] font-semibold text-[#C62828] mb-4 tracking-widest">1 INCOME SOURCE</div>
              <div className="text-[72px] font-bold text-[#C62828] mb-2" style={{ lineHeight: "1" }}>31</div>
              <div className="text-[18px] font-bold text-[#C62828] mb-8">Limited Stability</div>
              <div className="border-b border-[#E5E7EB] pb-6 mb-6">
                <p className="text-[14px] text-[#6B7280] m-0">Income depends on <span className="font-semibold">one source.</span></p>
              </div>
            </div>

            <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-10">
              <div className="text-[12px] font-semibold text-[#2E7D32] mb-4 tracking-widest">MULTIPLE INCOME SOURCES</div>
              <div className="text-[72px] font-bold text-[#2E7D32] mb-2" style={{ lineHeight: "1" }}>74</div>
              <div className="text-[18px] font-bold text-[#2E7D32] mb-8">Established Stability</div>
              <div className="border-b border-[#E5E7EB] pb-6 mb-6">
                <p className="text-[14px] text-[#6B7280] m-0">Income is <span className="font-semibold">distributed.</span></p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-12">
            <svg className="w-6 h-6 text-[#0275D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>

          <p className="text-center text-[16px] text-[#6B7280] mb-8">Structure determines outcome</p>
        </div>
      </section>

      {/* YOUR CURRENT RESULT IS INCOMPLETE */}
      <section className="bg-white" style={{ padding: "80px 40px" }}>
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-[42px] font-bold text-[#0E1A2B] mb-6">Your current result is incomplete.</h2>
          <p className="text-[16px] text-[#6B7280] mb-12">Full verification defines your income stability.</p>

          <div className="grid grid-cols-2 gap-12 items-center">
            <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-10">
              <div className="text-[12px] font-semibold text-[#6B7280] uppercase mb-6">Initial Output</div>
              <h3 className="text-[32px] font-bold text-[#0E1A2B] mb-8">FREE</h3>

              <div className="space-y-6">
                <div className="flex gap-4 items-start pb-6 border-b border-[#E5E7EB]">
                  <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#6B7280]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#0E1A2B] m-0">Stability classification</p>
                    <p className="text-[13px] text-[#6B7280] m-0 mt-1">Your current stability class (band)</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start pb-6 border-b border-[#E5E7EB]">
                  <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#6B7280]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#0E1A2B] m-0">Primary structural constraint</p>
                    <p className="text-[13px] text-[#6B7280] m-0 mt-1">The main factor limiting your stability</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#6B7280]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#0E1A2B] m-0">Not sufficient for full decision verification.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[12px] border-2 border-[#0275D8] p-10">
              <div className="text-[12px] font-semibold text-[#0275D8] uppercase mb-6">Full Verification</div>
              <h3 className="text-[42px] font-bold text-[#0275D8] mb-8">$69</h3>

              <div className="space-y-6 mb-8">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-[#E8F4F7] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#0275D8]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 3.062v6.718a3.066 3.066 0 01-3.062 3.062H9.391A3.066 3.066 0 016.329 19.5V9.517a3.066 3.066 0 012.938-3.062zm7.381 5.930a1 1 0 00-1.414-1.414L9 12.586 7.707 11.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#0E1A2B] m-0">Income Stability Score™</p>
                    <p className="text-[13px] text-[#6B7280] m-0 mt-1">Your overall stability score on a 0–100 scale</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-[#E8F4F7] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#0275D8]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7.5 3a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#0E1A2B] m-0">Full structural breakdown</p>
                    <p className="text-[13px] text-[#6B7280] m-0 mt-1">Complete view across all 6 structural inputs</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-[#E8F4F7] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#0275D8]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#0E1A2B] m-0">Decision definition</p>
                    <p className="text-[13px] text-[#6B7280] m-0 mt-1">What to change, how it impacts your score</p>
                  </div>
                </div>
              </div>

              <button className="w-full bg-[#0E1A2B] text-white py-3 rounded-[8px] text-[16px] font-semibold mb-6 flex items-center justify-center gap-2">
                Complete Verification
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SYSTEM INTEGRITY */}
      <section className="bg-white" style={{ padding: "80px 40px" }}>
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-[42px] font-bold text-[#0E1A2B] mb-6">System integrity</h2>
          <p className="text-[18px] font-semibold text-[#0275D8] mb-12">Fixed rules. Consistent results.</p>

          <div className="grid grid-cols-2 gap-12">
            <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-10">
              <h3 className="text-[24px] font-bold text-[#0E1A2B] mb-8 pb-6 border-b border-[#E5E7EB]">Model</h3>
              <div className="space-y-6">
                <div className="pb-6 border-b border-[#E5E7EB]">
                  <h4 className="text-[16px] font-bold text-[#0E1A2B] mb-2">Fixed rules applied</h4>
                  <p className="text-[14px] text-[#6B7280] m-0">Rules are locked for all results.</p>
                </div>
                <div className="pb-6 border-b border-[#E5E7EB]">
                  <h4 className="text-[16px] font-bold text-[#0E1A2B] mb-2">No discretion</h4>
                  <p className="text-[14px] text-[#6B7280] m-0">Rules are identical for all users.</p>
                </div>
                <div>
                  <h4 className="text-[16px] font-bold text-[#0E1A2B] mb-2">Same inputs produce same result</h4>
                  <p className="text-[14px] text-[#6B7280] m-0">Consistency is guaranteed.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-10">
              <h3 className="text-[24px] font-bold text-[#0E1A2B] mb-8 pb-6 border-b border-[#E5E7EB]">Record</h3>
              <div className="space-y-6">
                <div className="pb-6 border-b border-[#E5E7EB]">
                  <h4 className="text-[16px] font-bold text-[#0E1A2B] mb-2">Timestamped result</h4>
                  <p className="text-[14px] text-[#6B7280] m-0">Every result is timestamped to the second.</p>
                </div>
                <div className="pb-6 border-b border-[#E5E7EB]">
                  <h4 className="text-[16px] font-bold text-[#0E1A2B] mb-2">Permanent record ID</h4>
                  <p className="text-[14px] text-[#6B7280] m-0">Unique ID assigned for permanent retrieval.</p>
                </div>
                <div>
                  <h4 className="text-[16px] font-bold text-[#0E1A2B] mb-2">Results are not modified</h4>
                  <p className="text-[14px] text-[#6B7280] m-0">Prior results never modified or deleted.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-[#F3F4F6] rounded-[12px] p-6 flex items-center gap-4">
            <span className="text-[18px]">✓</span>
            <p className="text-[13px] text-[#6B7280] m-0">
              <span className="font-semibold text-[#0E1A2B]">Model RP-2.0</span> ·
              <span className="mx-2">Version locked</span> ·
              <span className="font-semibold text-[#0275D8]">Same inputs produce same result</span>
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#F3F4F6]" style={{ padding: "80px 40px" }}>
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="text-[42px] font-bold text-[#0E1A2B] mb-6">Check how your income is structured before you move forward.</h2>
          <p className="text-[16px] text-[#6B7280] mb-8">Takes less than a minute · No documents required · Instant result</p>
          <button className="bg-[#0E1A2B] text-white px-8 py-3 rounded-[8px] text-[16px] font-semibold mb-6 inline-flex items-center gap-2">
            Start Verification
            <span>→</span>
          </button>

          <div className="mt-10 flex justify-center gap-8 text-[14px]">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#0275D8]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 3.062v6.718a3.066 3.066 0 01-3.062 3.062H9.391A3.066 3.066 0 016.329 19.5V9.517a3.066 3.066 0 012.938-3.062zm7.381 5.93a1 1 0 00-1.414-1.414L9 12.586 7.707 11.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-[#6B7280]">Free</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#0275D8]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-[#6B7280]">Private</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#0275D8]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 17v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd" />
              </svg>
              <span className="text-[#6B7280]">Immediate result</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white" style={{ paddingTop: "80px" }}>
        {/* TOP CTA */}
        <div style={{ padding: "0 40px 64px", borderBottom: "1px solid #E5E7EB" }}>
          <div className="max-w-[800px] mx-auto text-center">
            <div className="mb-8 flex items-center justify-center gap-3">
              <svg className="w-5 h-5 text-[#0275D8]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 17v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd" />
              </svg>
              <span className="text-[12px] font-semibold text-[#0275D8] tracking-widest">METHODOLOGY</span>
            </div>
            <p className="text-[16px] text-[#6B7280] mb-6">Structural Stability Model RP-2.0. Fixed methodology. Version-locked. Auditable results.</p>
            <hr className="border-[#E5E7EB] mb-6" />
          </div>
        </div>

        {/* THREE COLUMN INFO */}
        <div style={{ padding: "64px 40px" }} className="hidden md:block border-b border-[#E5E7EB]">
          <div className="max-w-[1400px] mx-auto grid grid-cols-3 gap-16">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-5 h-5 text-[#0275D8]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                <h3 className="text-[12px] font-semibold text-[#0E1A2B] tracking-widest">DEVELOPER</h3>
              </div>
              <p className="text-[14px] text-[#6B7280]">PeopleStar Enterprises, LLC.<br/>Orange County, California, USA.</p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-5 h-5 text-[#0275D8]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 3.062v6.718a3.066 3.066 0 01-3.062 3.062H9.391A3.066 3.066 0 016.329 19.5V9.517a3.066 3.066 0 012.938-3.062zm7.381 5.93a1 1 0 00-1.414-1.414L9 12.586 7.707 11.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h3 className="text-[12px] font-semibold text-[#0E1A2B] tracking-widest">COMPLIANCE</h3>
              </div>
              <p className="text-[14px] text-[#6B7280]">Designed for financial decision support. FCRA-aligned. GDPR/CCPA compatible.</p>
            </div>

            <div>
              <h3 className="text-[12px] font-semibold text-[#0E1A2B] tracking-widest mb-4">STAY INFORMED</h3>
              <div className="flex gap-2">
                <input type="email" placeholder="Email address" className="flex-1 px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-[6px] text-[14px]" />
                <button className="bg-[#0275D8] text-white px-4 py-2.5 rounded-[6px]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER NAV - DESKTOP */}
        <div style={{ padding: "64px 40px" }} className="hidden md:block border-b border-[#E5E7EB]">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-5 gap-12">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-[#0E1A2B] font-bold text-[18px]">RUNPAYWAY</span>
                  <span className="w-3 h-2 bg-[#0275D8]" style={{ clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)" }}></span>
                </div>
                <p className="text-[13px] text-[#6B7280]">Income Stability Score™<br/>Income Structure Verification Standard</p>
                <p className="text-[13px] text-[#6B7280] mt-4">Independent income verification based on fixed rules and structural analysis.</p>
              </div>

              <div>
                <h4 className="text-[12px] font-semibold text-[#0E1A2B] tracking-widest mb-4">PRODUCT</h4>
                <div className="space-y-3">
                  <a href="#" className="text-[14px] text-[#6B7280] block hover:text-[#0E1A2B]">How It Works</a>
                  <a href="#" className="text-[14px] text-[#6B7280] block hover:text-[#0E1A2B]">Pricing</a>
                  <a href="#" className="text-[14px] text-[#6B7280] block hover:text-[#0E1A2B]">Sample Report</a>
                  <a href="#" className="text-[14px] text-[#6B7280] block hover:text-[#0E1A2B]">Methodology</a>
                  <a href="#" className="text-[14px] text-[#6B7280] block hover:text-[#0E1A2B]">For Advisors</a>
                  <a href="#" className="text-[14px] text-[#6B7280] block hover:text-[#0E1A2B]">For Organizations</a>
                  <a href="#" className="text-[14px] text-[#6B7280] block hover:text-[#0E1A2B]">Industries</a>
                </div>
              </div>

              <div>
                <h4 className="text-[12px] font-semibold text-[#0E1A2B] tracking-widest mb-4">COMPANY</h4>
                <div className="space-y-3">
                  <a href="#" className="text-[14px] text-[#6B7280] block hover:text-[#0E1A2B]">About</a>
                  <a href="#" className="text-[14px] text-[#6B7280] block hover:text-[#0E1A2B]">Blog</a>
                  <a href="#" className="text-[14px] text-[#6B7280] block hover:text-[#0E1A2B]">FAQ</a>
                  <a href="#" className="text-[14px] text-[#6B7280] block hover:text-[#0E1A2B]">What's New</a>
                  <a href="#" className="text-[14px] text-[#6B7280] block hover:text-[#0E1A2B]">Contact</a>
                </div>
              </div>

              <div>
                <h4 className="text-[12px] font-semibold text-[#0E1A2B] tracking-widest mb-4">RESOURCES</h4>
                <div className="space-y-3">
                  <a href="#" className="text-[14px] text-[#6B7280] block hover:text-[#0E1A2B]">Documentation</a>
                  <a href="#" className="text-[14px] text-[#6B7280] block hover:text-[#0E1A2B]">Methodology</a>
                  <a href="#" className="text-[14px] text-[#6B7280] block hover:text-[#0E1A2B]">Use Cases</a>
                  <a href="#" className="text-[14px] text-[#6B7280] block hover:text-[#0E1A2B]">Security</a>
                </div>
              </div>

              <div>
                <h4 className="text-[12px] font-semibold text-[#0E1A2B] tracking-widest mb-4">LEGAL</h4>
                <div className="space-y-3">
                  <a href="#" className="text-[14px] text-[#6B7280] block hover:text-[#0E1A2B]">Privacy Policy</a>
                  <a href="#" className="text-[14px] text-[#6B7280] block hover:text-[#0E1A2B]">Terms of Use</a>
                  <a href="#" className="text-[14px] text-[#6B7280] block hover:text-[#0E1A2B]">Accessibility</a>
                  <a href="#" className="text-[14px] text-[#6B7280] block hover:text-[#0E1A2B]">Security Practices</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER MOBILE */}
        <div style={{ padding: "40px 24px" }} className="md:hidden">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-[#0E1A2B] font-bold text-[16px]">RUNPAYWAY</span>
            <span className="w-2 h-1.5 bg-[#0275D8]" style={{ clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)" }}></span>
          </div>
          <p className="text-[12px] text-[#6B7280] mb-8">Income Stability Score™<br/>Income Structure Verification Standard</p>

          <div className="space-y-6 border-t border-[#E5E7EB] pt-6">
            <div>
              <h4 className="text-[12px] font-semibold text-[#0E1A2B] tracking-widest mb-3">PRODUCT</h4>
              <div className="space-y-2">
                <a href="#" className="text-[13px] text-[#6B7280] block">How It Works</a>
                <a href="#" className="text-[13px] text-[#6B7280] block">Pricing</a>
                <a href="#" className="text-[13px] text-[#6B7280] block">Methodology</a>
                <a href="#" className="text-[13px] text-[#6B7280] block">For Advisors</a>
              </div>
            </div>

            <div>
              <h4 className="text-[12px] font-semibold text-[#0E1A2B] tracking-widest mb-3">COMPANY</h4>
              <div className="space-y-2">
                <a href="#" className="text-[13px] text-[#6B7280] block">About</a>
                <a href="#" className="text-[13px] text-[#6B7280] block">Blog</a>
                <a href="#" className="text-[13px] text-[#6B7280] block">Contact</a>
              </div>
            </div>

            <div>
              <h4 className="text-[12px] font-semibold text-[#0E1A2B] tracking-widest mb-3">LEGAL</h4>
              <div className="space-y-2">
                <a href="#" className="text-[13px] text-[#6B7280] block">Privacy Policy</a>
                <a href="#" className="text-[13px] text-[#6B7280] block">Terms of Use</a>
                <a href="#" className="text-[13px] text-[#6B7280] block">Accessibility</a>
              </div>
            </div>

            <div className="border-t border-[#E5E7EB] pt-6">
              <label className="text-[12px] font-semibold text-[#0E1A2B] block mb-2">Stay informed</label>
              <div className="flex gap-2">
                <input type="email" placeholder="Email" className="flex-1 px-3 py-2 bg-white border border-[#E5E7EB] rounded-[6px] text-[12px]" />
                <button className="bg-[#0275D8] text-white px-3 py-2 rounded-[6px]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div style={{ padding: "24px 40px", backgroundColor: "#F9FAFB", borderTop: "1px solid #E5E7EB", textAlign: "center" }}>
          <p className="text-[12px] text-[#6B7280] m-0">© 2026 RunPayway™. All rights reserved. · RunPayway™ is a product of PeopleStar Enterprises, LLC. · Orange County, California, USA. · Structural Stability Model RP-2.0.</p>
        </div>
      </footer>
    </div>
  );
}
