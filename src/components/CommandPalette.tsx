"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const B = {
  navy: "#1C1635",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  muted: "rgba(14,26,43,0.52)",
  taupe: "rgba(14,26,43,0.36)",
  border: "rgba(14,26,43,0.08)",
};

const COMMANDS = [
  { id: "dashboard", label: "Command Center", desc: "Your income stability command center", href: "/dashboard", shortcut: "1" },
  { id: "report", label: "View Report", desc: "Your full assessment report", href: "/review", shortcut: "2" },
  { id: "pricing", label: "Pricing", desc: "Get a new assessment", href: "/pricing", shortcut: "3" },
  { id: "home", label: "RunPayway Home", desc: "Main website", href: "/", shortcut: "4" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = query
    ? COMMANDS.filter(c => c.label.toLowerCase().includes(query.toLowerCase()) || c.desc.toLowerCase().includes(query.toLowerCase()))
    : COMMANDS;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(prev => !prev);
        setQuery("");
        setSelected(0);
        return;
      }
      // Escape to close
      if (e.key === "Escape" && open) {
        setOpen(false);
        return;
      }
      // Number shortcuts (1-4) when not in input
      if (!open && e.target === document.body && ["1", "2", "3", "4"].includes(e.key)) {
        const cmd = COMMANDS.find(c => c.shortcut === e.key);
        if (cmd) { e.preventDefault(); router.push(cmd.href); }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, router]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSelect = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const handleInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => Math.min(filtered.length - 1, s + 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSelected(s => Math.max(0, s - 1)); }
    if (e.key === "Enter" && filtered[selected]) { handleSelect(filtered[selected].href); }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(14,26,43,0.30)", backdropFilter: "blur(4px)", zIndex: 9998 }} />

      {/* Palette */}
      <div style={{
        position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 520, zIndex: 9999,
        backgroundColor: "#FFFFFF", borderRadius: 12,
        border: `1px solid ${B.border}`,
        boxShadow: "0 16px 48px rgba(14,26,43,0.15), 0 4px 12px rgba(14,26,43,0.08)",
        overflow: "hidden",
        animation: "cmdIn 150ms ease-out",
      }}>
        <style>{`@keyframes cmdIn { from { opacity: 0; transform: translateX(-50%) scale(0.97) translateY(-8px); } to { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); } }`}</style>

        {/* Search input */}
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${B.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={B.taupe} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
            onKeyDown={handleInputKey}
            placeholder="Search or jump to..."
            style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: B.navy, fontFamily: "'Inter', system-ui, sans-serif" }}
          />
          <kbd style={{ fontSize: 10, color: B.taupe, padding: "2px 6px", borderRadius: 4, border: `1px solid ${B.border}`, backgroundColor: "#FAFAFA" }}>esc</kbd>
        </div>

        {/* Results */}
        <div style={{ padding: "6px 0", maxHeight: 320, overflowY: "auto" }}>
          {filtered.map((cmd, i) => (
            <div
              key={cmd.id}
              onClick={() => handleSelect(cmd.href)}
              onMouseEnter={() => setSelected(i)}
              style={{
                padding: "10px 18px", cursor: "pointer",
                backgroundColor: selected === i ? "rgba(75,63,174,0.04)" : "transparent",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                transition: "background-color 100ms",
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: B.navy }}>{cmd.label}</div>
                <div style={{ fontSize: 11, color: B.taupe }}>{cmd.desc}</div>
              </div>
              {cmd.shortcut && <kbd style={{ fontSize: 10, color: B.taupe, padding: "2px 8px", borderRadius: 4, border: `1px solid ${B.border}`, backgroundColor: "#FAFAFA" }}>{cmd.shortcut}</kbd>}
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: "20px 18px", textAlign: "center", fontSize: 13, color: B.taupe }}>No results</div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "8px 18px", borderTop: `1px solid ${B.border}`, display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 10, color: B.taupe }}>Navigate</span>
          <kbd style={{ fontSize: 9, color: B.taupe, padding: "1px 4px", borderRadius: 3, border: `1px solid ${B.border}` }}>&uarr;&darr;</kbd>
          <span style={{ fontSize: 10, color: B.taupe }}>Select</span>
          <kbd style={{ fontSize: 9, color: B.taupe, padding: "1px 4px", borderRadius: 3, border: `1px solid ${B.border}` }}>&crarr;</kbd>
          <span style={{ fontSize: 10, color: B.taupe, marginLeft: "auto" }}>RunPayway&#8482; Command Center</span>
        </div>
      </div>
    </>
  );
}
