"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "rp_a11y_prefs";
const COOKIE_KEY = "rp_cookie_consent";

interface A11yState {
  profile: string | null;
  fontSize: number;       // -2 to +3 (0 = default)
  lineHeight: string;     // default | compact | relaxed | spacious
  letterSpacing: string;  // default | tight | wide
  contentScale: number;   // 90 | 100 | 110 | 120
  colorMode: string;      // default | dark | saturated | mono
  textColor: string;      // default | light | dark | blue
}

const DEFAULT_STATE: A11yState = {
  profile: null,
  fontSize: 0,
  lineHeight: "default",
  letterSpacing: "default",
  contentScale: 100,
  colorMode: "default",
  textColor: "default",
};

const PROFILES = [
  { id: "seizure-safe", label: "Seizure Safe", desc: "Stops animations, reduces contrast extremes", icon: "⚡" },
  { id: "vision-impaired", label: "Vision Impaired", desc: "High contrast, bold links, larger text", icon: "👁" },
  { id: "adhd", label: "ADHD Friendly", desc: "Minimal motion, muted colors", icon: "🎯" },
  { id: "cognitive", label: "Cognitive Disability", desc: "Larger text, wider spacing, reading guide", icon: "🧠" },
  { id: "keyboard", label: "Keyboard Navigation", desc: "Enhanced focus indicators", icon: "⌨" },
  { id: "screenreader", label: "Screen Reader", desc: "Optimized for assistive technology", icon: "📖" },
  { id: "older", label: "Older Adults", desc: "Larger text, bigger touch targets", icon: "👤" },
];

const FONT_STEPS = [
  { value: -2, label: "A-" },
  { value: -1, label: "A" },
  { value: 0, label: "A", isDefault: true },
  { value: 1, label: "A+" },
  { value: 2, label: "A++" },
  { value: 3, label: "A+++" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function loadState(): A11yState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch { /* silent */ }
  return { ...DEFAULT_STATE };
}

function saveState(state: A11yState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* silent */ }
}

function applyToDOM(state: A11yState) {
  const html = document.documentElement;

  // Preserve non-a11y classes
  const existing = html.className.split(" ").filter(c => c && !c.startsWith("a11y-"));
  const a11y: string[] = [];

  if (state.profile) a11y.push(`a11y-profile-${state.profile}`);
  if (state.lineHeight !== "default") a11y.push(`a11y-lh-${state.lineHeight}`);
  if (state.letterSpacing !== "default") a11y.push(`a11y-ls-${state.letterSpacing}`);
  if (state.colorMode !== "default") a11y.push(`a11y-color-${state.colorMode}`);
  if (state.textColor !== "default") a11y.push(`a11y-text-${state.textColor}`);

  html.className = [...existing, ...a11y].join(" ");

  // Compound zoom (font size + content scale)
  const fontZoomMap: Record<number, number> = { [-2]: 0.85, [-1]: 0.92, 0: 1, 1: 1.1, 2: 1.2, 3: 1.35 };
  const fontZoom = fontZoomMap[state.fontSize] || 1;
  const scaleZoom = state.contentScale / 100;
  const combined = fontZoom * scaleZoom;

  let styleEl = document.getElementById("a11y-zoom-style");
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "a11y-zoom-style";
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = combined !== 1
    ? `body { zoom: ${combined} !important; } [data-a11y-widget] { zoom: ${1 / combined} !important; }`
    : "";
}

/* ------------------------------------------------------------------ */
/*  Styling constants                                                  */
/* ------------------------------------------------------------------ */

const navy = "#0E1A2B";
const purple = "#4B3FAE";
const teal = "#1F6D7A";
const muted = "#7B848E";
const border = "rgba(14,26,43,0.08)";
const sans = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function ToggleRow({ label, options, value, onChange }: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: muted, marginBottom: 8, textTransform: "uppercase" as const }}>{label}</div>
      <div style={{ display: "flex", gap: 4 }}>
        {options.map(opt => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              aria-pressed={active}
              style={{
                flex: 1, height: 36, borderRadius: 8,
                border: active ? `1.5px solid ${purple}` : `1px solid ${border}`,
                background: active ? `${purple}10` : "#fff",
                color: active ? purple : navy,
                fontSize: 12, fontWeight: active ? 700 : 500,
                cursor: "pointer", fontFamily: sans,
                transition: "all 150ms ease",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function AccessibilityWidget() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [tab, setTab] = useState<"profiles" | "adjust">("profiles");
  const [state, setState] = useState<A11yState>(DEFAULT_STATE);
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Client mount + load persisted state
  useEffect(() => {
    setMounted(true);
    const loaded = loadState();
    setState(loaded);
    applyToDOM(loaded);

    // Check if cookie banner is showing
    try {
      const consent = localStorage.getItem(COOKIE_KEY);
      setCookieBannerVisible(!consent);
    } catch { setCookieBannerVisible(false); }
  }, []);

  // Apply DOM changes on state update
  useEffect(() => {
    if (!mounted) return;
    applyToDOM(state);
    saveState(state);
  }, [state, mounted]);

  // Global keyboard shortcut: Alt+A
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        if (hidden) {
          setHidden(false);
        } else {
          setOpen(prev => !prev);
        }
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, hidden]);

  // Focus trap
  useEffect(() => {
    if (!open || !panelRef.current) return;
    const panel = panelRef.current;
    const focusable = panel.querySelectorAll<HTMLElement>("button, [tabindex]");
    if (focusable.length > 0) focusable[0].focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    panel.addEventListener("keydown", trap);
    return () => panel.removeEventListener("keydown", trap);
  }, [open]);

  // Listen for cookie banner dismissal
  useEffect(() => {
    if (!cookieBannerVisible) return;
    const check = () => {
      try {
        if (localStorage.getItem(COOKIE_KEY)) setCookieBannerVisible(false);
      } catch { /* silent */ }
    };
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, [cookieBannerVisible]);

  const update = useCallback((partial: Partial<A11yState>) => {
    setState(prev => {
      // If changing a granular control, deactivate profile
      const isGranular = !("profile" in partial);
      return { ...prev, ...partial, ...(isGranular ? { profile: null } : {}) };
    });
  }, []);

  const setProfile = useCallback((id: string) => {
    setState(prev => ({
      ...DEFAULT_STATE,
      profile: prev.profile === id ? null : id,
    }));
  }, []);

  const resetAll = useCallback(() => {
    setState({ ...DEFAULT_STATE });
  }, []);

  if (!mounted || hidden) return null;

  const triggerBottom = cookieBannerVisible ? 90 : 24;

  const widget = (
    <div data-a11y-widget style={{ fontFamily: sans }}>
      {/* Screen reader live region */}
      <div aria-live="polite" aria-atomic="true" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
        {state.profile ? `Accessibility profile active: ${PROFILES.find(p => p.id === state.profile)?.label}` : ""}
      </div>

      {/* Trigger button */}
      <button
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        aria-label="Accessibility settings"
        aria-expanded={open}
        style={{
          position: "fixed",
          bottom: triggerBottom,
          left: 24,
          zIndex: 9998,
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "none",
          background: state.profile ? purple : navy,
          color: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(14,26,43,0.20), 0 2px 6px rgba(14,26,43,0.12)",
          transition: "bottom 400ms cubic-bezier(0.22, 1, 0.36, 1), background 200ms ease, transform 200ms ease",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="4.5" r="2.5" />
          <path d="M12 7v5m-4 3l2-3h4l2 3M8.5 21l1.5-6m4 6l1.5-6" />
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Accessibility settings"
          aria-modal="true"
          style={{
            position: "fixed",
            bottom: triggerBottom + 56,
            left: 24,
            zIndex: 9998,
            width: 340,
            maxWidth: "calc(100vw - 48px)",
            maxHeight: "70vh",
            borderRadius: 20,
            background: "#fff",
            border: `1px solid ${border}`,
            boxShadow: "0 20px 60px rgba(14,26,43,0.16), 0 8px 24px rgba(14,26,43,0.08)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column" as const,
            animation: "fadeInUp 240ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
          }}
        >
          {/* Header */}
          <div style={{ padding: "18px 20px 14px", borderBottom: `1px solid ${border}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: `${purple}10`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={purple} strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="4.5" r="2.5" />
                    <path d="M12 7v5m-4 3l2-3h4l2 3M8.5 21l1.5-6m4 6l1.5-6" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: navy }}>Accessibility</div>
                  <div style={{ fontSize: 11, color: muted }}>WCAG 2.1 AA Compliant</div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close accessibility panel"
                style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "rgba(14,26,43,0.04)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: muted }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 1l12 12M13 1L1 13" /></svg>
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, background: "rgba(14,26,43,0.04)", borderRadius: 10, padding: 3 }}>
              {(["profiles", "adjust"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  aria-pressed={tab === t}
                  style={{
                    flex: 1, height: 32, borderRadius: 8, border: "none",
                    background: tab === t ? "#fff" : "transparent",
                    boxShadow: tab === t ? "0 1px 3px rgba(14,26,43,0.08)" : "none",
                    color: tab === t ? navy : muted,
                    fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: sans,
                    transition: "all 150ms ease",
                  }}
                >
                  {t === "profiles" ? "Profiles" : "Adjustments"}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 20px" }}>
            {tab === "profiles" ? (
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                {PROFILES.map(p => {
                  const active = state.profile === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setProfile(p.id)}
                      aria-pressed={active}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "12px 14px", borderRadius: 14,
                        border: active ? `1.5px solid ${purple}` : `1px solid ${border}`,
                        background: active ? `${purple}08` : "#fff",
                        cursor: "pointer", textAlign: "left" as const,
                        transition: "all 150ms ease",
                        width: "100%",
                      }}
                    >
                      <span style={{ fontSize: 20, flexShrink: 0, width: 32, textAlign: "center" }}>{p.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: active ? purple : navy }}>{p.label}</div>
                        <div style={{ fontSize: 11, color: muted, lineHeight: 1.4, marginTop: 2 }}>{p.desc}</div>
                      </div>
                      {active && (
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: purple, flexShrink: 0 }} />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div>
                {/* Font Size */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: muted, marginBottom: 8, textTransform: "uppercase" as const }}>Font Size</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {FONT_STEPS.map(step => {
                      const active = state.fontSize === step.value;
                      return (
                        <button
                          key={step.value}
                          onClick={() => update({ fontSize: step.value })}
                          aria-label={`Font size ${step.label}`}
                          aria-pressed={active}
                          style={{
                            flex: 1, height: 36, borderRadius: 8,
                            border: active ? `1.5px solid ${purple}` : `1px solid ${border}`,
                            background: active ? `${purple}10` : "#fff",
                            color: active ? purple : navy,
                            fontSize: step.value <= 0 ? 11 : 11 + step.value,
                            fontWeight: active ? 700 : 500,
                            cursor: "pointer", fontFamily: sans,
                          }}
                        >
                          {step.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <ToggleRow
                  label="Line Height"
                  value={state.lineHeight}
                  onChange={v => update({ lineHeight: v })}
                  options={[
                    { value: "compact", label: "Compact" },
                    { value: "default", label: "Default" },
                    { value: "relaxed", label: "Relaxed" },
                    { value: "spacious", label: "Spacious" },
                  ]}
                />

                <ToggleRow
                  label="Letter Spacing"
                  value={state.letterSpacing}
                  onChange={v => update({ letterSpacing: v })}
                  options={[
                    { value: "tight", label: "Tight" },
                    { value: "default", label: "Default" },
                    { value: "wide", label: "Wide" },
                  ]}
                />

                <ToggleRow
                  label="Content Scale"
                  value={String(state.contentScale)}
                  onChange={v => update({ contentScale: Number(v) })}
                  options={[
                    { value: "90", label: "90%" },
                    { value: "100", label: "100%" },
                    { value: "110", label: "110%" },
                    { value: "120", label: "120%" },
                  ]}
                />

                <ToggleRow
                  label="Color Mode"
                  value={state.colorMode}
                  onChange={v => update({ colorMode: v })}
                  options={[
                    { value: "default", label: "Default" },
                    { value: "dark", label: "Dark" },
                    { value: "saturated", label: "Vivid" },
                    { value: "mono", label: "Mono" },
                  ]}
                />

                <ToggleRow
                  label="Text Color"
                  value={state.textColor}
                  onChange={v => update({ textColor: v })}
                  options={[
                    { value: "default", label: "Default" },
                    { value: "light", label: "Light" },
                    { value: "dark", label: "Dark" },
                    { value: "blue", label: "Blue" },
                  ]}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: "12px 20px 16px", borderTop: `1px solid ${border}`, display: "flex", gap: 8 }}>
            <button
              onClick={resetAll}
              style={{
                flex: 1, height: 40, borderRadius: 10,
                border: `1px solid ${border}`, background: "#fff",
                color: navy, fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: sans,
                transition: "background 150ms ease",
              }}
            >
              Reset All
            </button>
            <button
              onClick={() => { setOpen(false); setHidden(true); }}
              aria-label="Hide accessibility widget. Press Alt+A to restore."
              style={{
                flex: 1, height: 40, borderRadius: 10,
                border: "none", background: "rgba(14,26,43,0.04)",
                color: muted, fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: sans,
              }}
            >
              Hide Widget
            </button>
          </div>

          {/* Keyboard shortcut hint */}
          <div style={{ padding: "0 20px 12px", textAlign: "center" }}>
            <span style={{ fontSize: 10, color: "rgba(14,26,43,0.30)" }}>Press Alt+A to toggle this panel</span>
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(widget, document.body);
}
