export default function LandingPage() {
  return (
    <div className="w-full">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB]" style={{ height: 72 }}>
        <div className="max-w-[1100px] mx-auto px-10 h-full flex items-center justify-between">
          <div className="text-[#0E1A2B] font-bold text-xl">RunPayway™</div>
          <nav className="flex gap-8 flex-1 ml-16">
            <a href="#" className="text-14 text-[#0E1A2B]">How It Works</a>
            <a href="#" className="text-14 text-[#0E1A2B]">Methodology</a>
            <a href="#" className="text-14 text-[#0E1A2B]">Use Cases</a>
            <div className="relative group">
              <button className="text-14 text-[#0E1A2B]">Solutions ▾</button>
              <div className="absolute top-full left-0 mt-0 w-[360px] bg-white border border-[#E5E7EB] rounded-[10px] shadow-sm p-6 hidden group-hover:block">
                <div className="text-12 font-semibold text-[#0E1A2B] mb-4">Solutions</div>
                <div className="space-y-4">
                  <div><div className="text-14 font-semibold text-[#0E1A2B]">For Individuals</div><div className="text-13 text-[#6B7280]">Check how your income is structured before commitment</div></div>
                  <div><div className="text-14 font-semibold text-[#0E1A2B]">For Advisors</div><div className="text-13 text-[#6B7280]">Validate client income structure before decisions</div></div>
                  <div><div className="text-14 font-semibold text-[#0E1A2B]">For Organizations</div><div className="text-13 text-[#6B7280]">Standardize income structure verification</div></div>
                </div>
              </div>
            </div>
            <a href="#" className="text-14 text-[#0E1A2B]">Plans</a>
            <a href="#" className="text-14 text-[#0E1A2B]">Learn</a>
            <a href="#" className="text-14 text-[#0E1A2B]">About</a>
          </nav>
          <div className="flex gap-6 ml-auto">
            <a href="#" className="text-14 text-[#0E1A2B]">Sign In</a>
            <button className="bg-[#0E1A2B] text-white px-[18px] h-[42px] rounded-[8px] text-14 font-semibold">Start Verification</button>
          </div>
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <section className="bg-white" style={{ padding: "96px 40px" }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-7">
              <h1 className="text-[56px] font-semibold leading-tight text-[#0E1A2B] mb-10">Income structure determines whether decisions survive.</h1>
              <p className="text-[18px] font-semibold text-[#5E6873] mb-6">Applied before financial commitment, where income stability must hold.</p>
              <p className="text-[16px] text-[#7B848E] mb-10">If income structure fails, the decision fails.</p>
              <button className="bg-[#0E1A2B] text-white px-8 py-4 rounded-[8px] text-16 font-semibold mb-6">Start Verification</button>
              <p className="text-[13px] text-[#7B848E]">Takes less than a minute · No documents required · Private</p>
            </div>
            <div className="col-span-5">
              <div className="bg-[#0E1A2B] text-[#F4F1EA] rounded-[20px] p-8" style={{ boxShadow: "0 12px 32px rgba(14,26,43,0.16)" }}>
                <div className="text-12 font-semibold text-[#1F6D7A] mb-6 tracking-widest">INCOME STABILITY SCORE™</div>
                <div className="text-[64px] font-bold mb-2" style={{ fontFamily: "SF Mono, monospace" }}>72</div>
                <div className="text-16 font-semibold mb-6">/ 100</div>
                <div className="text-14 font-semibold text-[#1F6D7A] inline-block bg-[rgba(31,109,122,0.15)] px-4 py-2 rounded-[10px] mb-6">Established Stability</div>
                <div className="flex gap-2 mb-6" style={{ height: 10 }}>
                  <div className="flex-[0.4] bg-[#1F6D7A]" style={{ borderRadius: "999px" }}></div>
                  <div className="flex-[0.35] bg-[#D0A23A]" style={{ borderRadius: "999px" }}></div>
                  <div className="flex-[0.25] bg-[#C62828]" style={{ borderRadius: "999px" }}></div>
                </div>
                <div className="flex justify-between text-12 font-semibold mb-6 text-[#1F6D7A]">
                  <span>Protected</span>
                  <span>Recurring</span>
                  <span>At Risk</span>
                </div>
                <div className="border-t border-[rgba(255,255,255,0.1)] pt-4">
                  <p className="text-13 text-[rgba(244,241,234,0.4)] m-0">Model RP-2.0 · Same inputs produce same result</p>
                </div>
              </div>
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

      {/* SECTION 3: INPUT DEFINITIONS */}
      <section className="bg-white" style={{ padding: "96px 40px" }}>
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[36px] font-semibold text-[#0E1A2B] mb-4">Six structural inputs</h2>
          <p className="text-16 font-semibold text-[#0E1A2B] mb-12">Income classification is determined by these 6 factors.</p>
          <div className="grid grid-cols-3 gap-12 mb-10">
            <div className="bg-[#F8F6F1] p-6 rounded-[12px] border border-[#D9D6CF]">
              <div className="text-12 font-semibold text-[#1F6D7A] mb-3 tracking-widest">INPUT 1</div>
              <p className="text-18 font-semibold text-[#0E1A2B] mb-3 m-0">Concentration</p>
              <p className="text-14 text-[#5E6873] leading-relaxed m-0">Reliance on primary income</p>
            </div>
            <div className="bg-[#F8F6F1] p-6 rounded-[12px] border border-[#D9D6CF]">
              <div className="text-12 font-semibold text-[#1F6D7A] mb-3 tracking-widest">INPUT 2</div>
              <p className="text-18 font-semibold text-[#0E1A2B] mb-3 m-0">Source Diversity</p>
              <p className="text-14 text-[#5E6873] leading-relaxed m-0">Distribution across sources</p>
            </div>
            <div className="bg-[#F8F6F1] p-6 rounded-[12px] border border-[#D9D6CF]">
              <div className="text-12 font-semibold text-[#1F6D7A] mb-3 tracking-widest">INPUT 3</div>
              <p className="text-18 font-semibold text-[#0E1A2B] mb-3 m-0">Forward Visibility</p>
              <p className="text-14 text-[#5E6873] leading-relaxed m-0">Income already secured</p>
            </div>
            <div className="bg-[#F8F6F1] p-6 rounded-[12px] border border-[#D9D6CF]">
              <div className="text-12 font-semibold text-[#1F6D7A] mb-3 tracking-widest">INPUT 4</div>
              <p className="text-18 font-semibold text-[#0E1A2B] mb-3 m-0">Stability Pattern</p>
              <p className="text-14 text-[#5E6873] leading-relaxed m-0">Consistency over time</p>
            </div>
            <div className="bg-[#F8F6F1] p-6 rounded-[12px] border border-[#D9D6CF]">
              <div className="text-12 font-semibold text-[#1F6D7A] mb-3 tracking-widest">INPUT 5</div>
              <p className="text-18 font-semibold text-[#0E1A2B] mb-3 m-0">Continuity</p>
              <p className="text-14 text-[#5E6873] leading-relaxed m-0">Income without activity</p>
            </div>
            <div className="bg-[#F8F6F1] p-6 rounded-[12px] border border-[#D9D6CF]">
              <div className="text-12 font-semibold text-[#1F6D7A] mb-3 tracking-widest">INPUT 6</div>
              <p className="text-18 font-semibold text-[#0E1A2B] mb-3 m-0">Dependency</p>
              <p className="text-14 text-[#5E6873] leading-relaxed m-0">Reliance on effort</p>
            </div>
          </div>
          <div className="bg-[#0E1A2B] rounded-[12px] p-6">
            <p className="text-13 text-[#F4F1EA] m-0 leading-relaxed">Model RP-2.0 · Fixed rules · Same inputs produce same result</p>
          </div>
        </div>
      </section>

      {/* SECTION 4: LIVE PREVIEW */}
      <section className="bg-[#F8F6F1]" style={{ padding: "96px 40px" }}>
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[36px] font-semibold text-[#0E1A2B] mb-4">See how structure affects stability.</h2>
          <p className="text-16 font-semibold text-[#5E6873] mb-12">Adjust the profile below. This preview shows directional movement only.</p>
          <div className="grid grid-cols-2 gap-12 mb-10">
            <div className="bg-white rounded-[12px] p-8 border border-[#D9D6CF]">
              <div className="space-y-6">
                <div>
                  <div className="text-12 font-semibold text-[#1F6D7A] mb-2 tracking-widest">CONCENTRATION</div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 px-3 bg-[#0E1A2B] text-white rounded-[8px] text-13 font-semibold">Lower</button>
                    <button className="flex-1 py-2 px-3 bg-[#F8F6F1] text-[#0E1A2B] border border-[#D9D6CF] rounded-[8px] text-13 font-semibold">Moderate</button>
                    <button className="flex-1 py-2 px-3 bg-[#F8F6F1] text-[#0E1A2B] border border-[#D9D6CF] rounded-[8px] text-13 font-semibold">Strong</button>
                  </div>
                </div>
                <div>
                  <div className="text-12 font-semibold text-[#1F6D7A] mb-2 tracking-widest">SOURCES</div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 px-3 bg-[#0E1A2B] text-white rounded-[8px] text-13 font-semibold">Lower</button>
                    <button className="flex-1 py-2 px-3 bg-[#F8F6F1] text-[#0E1A2B] border border-[#D9D6CF] rounded-[8px] text-13 font-semibold">Moderate</button>
                    <button className="flex-1 py-2 px-3 bg-[#F8F6F1] text-[#0E1A2B] border border-[#D9D6CF] rounded-[8px] text-13 font-semibold">Strong</button>
                  </div>
                </div>
                <div>
                  <div className="text-12 font-semibold text-[#1F6D7A] mb-2 tracking-widest">FORWARD VISIBILITY</div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 px-3 bg-[#0E1A2B] text-white rounded-[8px] text-13 font-semibold">Lower</button>
                    <button className="flex-1 py-2 px-3 bg-[#F8F6F1] text-[#0E1A2B] border border-[#D9D6CF] rounded-[8px] text-13 font-semibold">Moderate</button>
                    <button className="flex-1 py-2 px-3 bg-[#F8F6F1] text-[#0E1A2B] border border-[#D9D6CF] rounded-[8px] text-13 font-semibold">Strong</button>
                  </div>
                </div>
                <div>
                  <div className="text-12 font-semibold text-[#1F6D7A] mb-2 tracking-widest">STABILITY PATTERN</div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 px-3 bg-[#0E1A2B] text-white rounded-[8px] text-13 font-semibold">Lower</button>
                    <button className="flex-1 py-2 px-3 bg-[#F8F6F1] text-[#0E1A2B] border border-[#D9D6CF] rounded-[8px] text-13 font-semibold">Moderate</button>
                    <button className="flex-1 py-2 px-3 bg-[#F8F6F1] text-[#0E1A2B] border border-[#D9D6CF] rounded-[8px] text-13 font-semibold">Strong</button>
                  </div>
                </div>
                <div>
                  <div className="text-12 font-semibold text-[#1F6D7A] mb-2 tracking-widest">CONTINUITY</div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 px-3 bg-[#0E1A2B] text-white rounded-[8px] text-13 font-semibold">Lower</button>
                    <button className="flex-1 py-2 px-3 bg-[#F8F6F1] text-[#0E1A2B] border border-[#D9D6CF] rounded-[8px] text-13 font-semibold">Moderate</button>
                    <button className="flex-1 py-2 px-3 bg-[#F8F6F1] text-[#0E1A2B] border border-[#D9D6CF] rounded-[8px] text-13 font-semibold">Strong</button>
                  </div>
                </div>
                <div>
                  <div className="text-12 font-semibold text-[#1F6D7A] mb-2 tracking-widest">ACTIVITY DEPENDENCY</div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 px-3 bg-[#0E1A2B] text-white rounded-[8px] text-13 font-semibold">Lower</button>
                    <button className="flex-1 py-2 px-3 bg-[#F8F6F1] text-[#0E1A2B] border border-[#D9D6CF] rounded-[8px] text-13 font-semibold">Moderate</button>
                    <button className="flex-1 py-2 px-3 bg-[#F8F6F1] text-[#0E1A2B] border border-[#D9D6CF] rounded-[8px] text-13 font-semibold">Strong</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#0E1A2B] text-[#F4F1EA] rounded-[16px] p-8" style={{ boxShadow: "0 12px 32px rgba(14,26,43,0.16)" }}>
              <div className="text-12 font-semibold text-[#1F6D7A] mb-6 tracking-widest">PREVIEW RESULT</div>
              <div className="text-[56px] font-bold mb-2" style={{ fontFamily: "SF Mono, monospace" }}>72</div>
              <div className="text-16 font-semibold mb-6">Established Stability</div>
              <div className="text-12 font-semibold text-[#2E7D32] mb-4">Improving</div>
              <div className="text-12 font-semibold text-[#1F6D7A] mb-2 tracking-widest">PRIMARY STRUCTURAL CONSTRAINT</div>
              <p className="text-13 text-[rgba(244,241,234,0.70)] leading-relaxed mb-6">Income concentration limits diversification</p>
              <div className="border-t border-[rgba(255,255,255,0.1)] pt-4">
                <p className="text-12 text-[rgba(244,241,234,0.40)] m-0 leading-relaxed">Preview only. Verified results are calculated inside the locked RunPayway™ model.</p>
              </div>
            </div>
          </div>
          <div className="text-center">
            <button className="bg-[#0E1A2B] text-white px-8 py-4 rounded-[8px] text-16 font-semibold mb-4">Generate My Verified Result</button>
            <p className="text-13 text-[#7B848E]">Preview updates instantly. Verified results are timestamped and record-locked.</p>
          </div>
        </div>
      </section>

      {/* SECTION 5: STRUCTURAL PROOF */}
      <section className="bg-white" style={{ padding: "96px 40px" }}>
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[36px] font-semibold text-[#0E1A2B] mb-12">Structure determines outcome</h2>
          <div className="grid grid-cols-2 gap-12">
            <div className="bg-[#F8F6F1] rounded-[20px] p-10 border border-[#D9D6CF] text-center" style={{ boxShadow: "0 12px 32px rgba(14,26,43,0.16)" }}>
              <div className="text-[64px] font-bold text-[#C62828] mb-3" style={{ fontFamily: "SF Mono, monospace" }}>31</div>
              <div className="text-20 font-semibold text-[#C62828] mb-4">Limited Stability</div>
              <p className="text-15 text-[#5E6873] m-0">One income source</p>
            </div>
            <div className="bg-[#F8F6F1] rounded-[20px] p-10 border border-[#D9D6CF] text-center" style={{ boxShadow: "0 12px 32px rgba(14,26,43,0.16)" }}>
              <div className="text-[64px] font-bold text-[#2E7D32] mb-3" style={{ fontFamily: "SF Mono, monospace" }}>74</div>
              <div className="text-20 font-semibold text-[#2E7D32] mb-4">Established Stability</div>
              <p className="text-15 text-[#5E6873] m-0">Multiple income sources</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: TRIGGER STRIP */}
      <section className="bg-[#0E1A2B] text-[#F4F1EA] text-center" style={{ padding: "96px 40px" }}>
        <div className="max-w-[1200px] mx-auto">
          <p className="text-24 font-semibold leading-relaxed mb-4">Most users discover a structural weakness they didn't know existed.</p>
          <p className="text-18 text-[rgba(244,241,234,0.70)] leading-relaxed m-0">Verification reveals the constraint before the decision is made.</p>
        </div>
      </section>

      {/* SECTION 7: PRICING */}
      <section className="bg-white" style={{ padding: "96px 40px" }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 gap-12 mb-10">
            <div className="bg-[#F8F6F1] p-10 rounded-[12px] border border-[#D9D6CF]">
              <div className="text-12 font-semibold text-[#1F6D7A] mb-4 tracking-widest">FREE</div>
              <ul className="text-15 text-[#5E6873] leading-loose mb-6 pl-5 list-disc">
                <li>Stability classification</li>
                <li>Primary constraint</li>
              </ul>
              <p className="text-13 text-[#7B848E] italic m-0">Not sufficient for full decision verification</p>
            </div>
            <div className="bg-white p-10 rounded-[12px] border-2 border-[#1F6D7A]" style={{ boxShadow: "0 12px 32px rgba(14,26,43,0.16)" }}>
              <div className="text-12 font-semibold text-[#1F6D7A] mb-4 tracking-widest">$69 — FULL VERIFICATION</div>
              <ul className="text-15 text-[#5E6873] leading-loose mb-6 pl-5 list-disc">
                <li>Income Stability Score™ (exact value)</li>
                <li>Full structural breakdown</li>
                <li>Decision alignment (PASS / FAIL)</li>
                <li>Permanent Record ID</li>
                <li>Timestamped output</li>
                <li>Complete report</li>
              </ul>
              <button className="w-full bg-[#0E1A2B] text-white py-4 rounded-[8px] text-16 font-semibold mb-6">Complete Verification</button>
              <div className="bg-[#F8F6F1] p-5 rounded-[8px] border border-[#D9D6CF]">
                <p className="text-12 font-semibold text-[#0E1A2B] mb-2 m-0">Record ID: RP-2026-004921</p>
                <p className="text-12 font-semibold text-[#0E1A2B] mb-2 m-0">Timestamp: 2026-05-03 21:04 UTC</p>
                <p className="text-12 font-semibold text-[#2E7D32] m-0">Decision: Mortgage → Supported</p>
              </div>
            </div>
          </div>
          <div className="bg-[#0E1A2B] text-[#F4F1EA] rounded-[12px] p-6 text-center">
            <p className="text-13 m-0 leading-relaxed">Applied before financial commitment, where income stability must hold.</p>
          </div>
        </div>
      </section>

      {/* SECTION 8: SYSTEM INTEGRITY */}
      <section className="bg-[#F8F6F1]" style={{ padding: "96px 40px" }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 gap-12 mb-10">
            <div>
              <h3 className="text-20 font-semibold text-[#0E1A2B] mb-6">Fixed rules applied</h3>
              <ul className="text-15 text-[#5E6873] leading-loose pl-5 list-disc">
                <li>No discretion</li>
                <li>Same inputs produce same result</li>
                <li>Rules apply uniformly</li>
              </ul>
            </div>
            <div>
              <h3 className="text-20 font-semibold text-[#0E1A2B] mb-6">Permanence & Auditability</h3>
              <ul className="text-15 text-[#5E6873] leading-loose pl-5 list-disc">
                <li>Timestamped result</li>
                <li>Permanent record ID</li>
                <li>Results are not modified</li>
              </ul>
            </div>
          </div>
          <div className="bg-[#0E1A2B] text-[#F4F1EA] rounded-[12px] p-6 text-center">
            <p className="text-13 m-0">Model RP-2.0 · Version locked</p>
          </div>
        </div>
      </section>

      {/* SECTION 9: FINAL CTA */}
      <section className="bg-[#0E1A2B] text-[#F4F1EA] text-center" style={{ padding: "96px 40px" }}>
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[36px] font-semibold leading-tight mb-6">Verify your income structure before you commit.</h2>
          <p className="text-18 text-[rgba(244,241,234,0.70)] leading-relaxed mb-10">Once the decision is made, it's too late to fix the structure.</p>
          <button className="bg-[#1F6D7A] text-[#0E1A2B] px-8 py-4 rounded-[8px] text-16 font-semibold mb-4">Start Verification</button>
          <p className="text-13 text-[rgba(244,241,234,0.60)]">Free · Private · Immediate result</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#F4F1EA]" style={{ paddingTop: "96px" }}>
        {/* CTA BLOCK */}
        <div style={{ padding: "0 24px 64px", textAlign: "center" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <h2 className="text-[32px] font-semibold text-[#0E1A2B] mb-4">Verification precedes commitment.</h2>
            <p className="text-16 text-[#6B7280] leading-relaxed mb-8">See how your income holds before your next decision.</p>
            <button className="bg-[#0E1A2B] text-white px-7 py-4 rounded-[8px] text-15 font-semibold mb-6">Start Verification →</button>
            <div className="text-13 text-[#6B7280] flex justify-center gap-3">
              <span>Under 2 minutes</span>
              <span>·</span>
              <span>No documents</span>
              <span>·</span>
              <span>Private</span>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div style={{ height: 1, backgroundColor: "#E5E7EB", margin: "40px 0" }}></div>

        {/* NAV GRID - DESKTOP */}
        <div style={{ padding: "0 24px 64px" }} className="hidden md:block">
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div className="grid grid-cols-4 gap-12">
              <div>
                <div className="text-12 font-semibold text-[#0E1A2B] mb-4 tracking-widest">INDIVIDUALS</div>
                <div className="space-y-3">
                  <a href="#" className="text-15 text-[#6B7280] block">Get My Stability Class</a>
                  <a href="#" className="text-15 text-[#6B7280] block">Full Report ($69)</a>
                  <a href="#" className="text-15 text-[#6B7280] block">How It Works</a>
                  <a href="#" className="text-15 text-[#6B7280] block">What Your Score Means</a>
                </div>
              </div>
              <div>
                <div className="text-12 font-semibold text-[#0E1A2B] mb-4 tracking-widest">PROFESSIONALS</div>
                <div className="space-y-3">
                  <a href="#" className="text-15 text-[#6B7280] block">For Advisors</a>
                  <a href="#" className="text-15 text-[#6B7280] block">For Organizations</a>
                  <a href="#" className="text-15 text-[#6B7280] block">Use Cases</a>
                  <a href="#" className="text-15 text-[#6B7280] block">Industries</a>
                </div>
              </div>
              <div>
                <div className="text-12 font-semibold text-[#0E1A2B] mb-4 tracking-widest">SYSTEM</div>
                <div className="space-y-3">
                  <a href="#" className="text-15 text-[#6B7280] block">Methodology</a>
                  <a href="#" className="text-15 text-[#6B7280] block">Model Integrity</a>
                  <a href="#" className="text-15 text-[#6B7280] block">Learn</a>
                  <a href="#" className="text-15 text-[#6B7280] block">Definitions</a>
                </div>
              </div>
              <div>
                <div className="text-12 font-semibold text-[#0E1A2B] mb-4 tracking-widest">COMPANY</div>
                <div className="space-y-3">
                  <a href="#" className="text-15 text-[#6B7280] block">About</a>
                  <a href="#" className="text-15 text-[#6B7280] block">Contact</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NAV ACCORDION - MOBILE */}
        <div style={{ padding: "0 0 40px" }} className="md:hidden">
          <div style={{ borderBottom: "1px solid #E5E7EB" }}>
            <button style={{ width: "100%", padding: "16px 24px", textAlign: "left", fontSize: 15, fontWeight: 600, color: "#0E1A2B", display: "flex", justifyContent: "space-between", border: "none", background: "none", cursor: "pointer" }}>
              INDIVIDUALS <span>▼</span>
            </button>
          </div>
          <div style={{ borderBottom: "1px solid #E5E7EB" }}>
            <button style={{ width: "100%", padding: "16px 24px", textAlign: "left", fontSize: 15, fontWeight: 600, color: "#0E1A2B", display: "flex", justifyContent: "space-between", border: "none", background: "none", cursor: "pointer" }}>
              PROFESSIONALS <span>▼</span>
            </button>
          </div>
          <div style={{ borderBottom: "1px solid #E5E7EB" }}>
            <button style={{ width: "100%", padding: "16px 24px", textAlign: "left", fontSize: 15, fontWeight: 600, color: "#0E1A2B", display: "flex", justifyContent: "space-between", border: "none", background: "none", cursor: "pointer" }}>
              SYSTEM <span>▼</span>
            </button>
          </div>
          <div style={{ borderBottom: "1px solid #E5E7EB" }}>
            <button style={{ width: "100%", padding: "16px 24px", textAlign: "left", fontSize: 15, fontWeight: 600, color: "#0E1A2B", display: "flex", justifyContent: "space-between", border: "none", background: "none", cursor: "pointer" }}>
              COMPANY <span>▼</span>
            </button>
          </div>
        </div>

        {/* LEGAL ROW */}
        <div style={{ padding: "40px 24px", textAlign: "center", borderTop: "1px solid #E5E7EB" }}>
          <div className="text-13 text-[#6B7280] flex justify-center gap-3 flex-wrap">
            <a href="#" className="text-[#6B7280]">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="text-[#6B7280]">Terms of Use</a>
            <span>·</span>
            <a href="#" className="text-[#6B7280]">Security Practices</a>
            <span>·</span>
            <a href="#" className="text-[#6B7280]">Accessibility (WCAG 2.1 AA)</a>
          </div>
        </div>

        {/* AUTHORITY BLOCK */}
        <div style={{ padding: "40px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div className="bg-white p-5 rounded-[8px] border border-[#E5E7EB] text-center">
              <p className="text-14 font-semibold text-[#0E1A2B] mb-2 m-0">RunPayway™ — Income Stability Score™</p>
              <p className="text-13 text-[#6B7280] mb-2 m-0">Structural Stability Model RP-2.0</p>
              <p className="text-13 text-[#6B7280] m-0">Same inputs produce the same result.</p>
            </div>
          </div>
        </div>

        {/* FINAL LINE */}
        <div style={{ padding: "24px", textAlign: "center", backgroundColor: "#F8F6F1", borderTop: "1px solid #E5E7EB" }}>
          <p className="text-13 text-[#6B7280] m-0">© 2026 RunPayway™ · PeopleStar Enterprises, LLC · Orange County, CA, USA</p>
        </div>
      </footer>
    </div>
  );
}
