"use client";

import { useState } from "react";
import { CalibrationProvider } from "@/lib/calibration-context";
import StandardHeader from "./StandardHeader";
import CalibrationRow from "./CalibrationRow";
import StandardSidebar from "./StandardSidebar";
import StandardMain from "./StandardMain";

export default function StandardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <CalibrationProvider>
      <StandardHeader
        onMenuToggle={() => setMenuOpen((prev) => !prev)}
        menuOpen={menuOpen}
      />

      {/* Offset for fixed header */}
      <div className="pt-16">
        <CalibrationRow />

        <div className="flex min-h-[calc(100vh-64px)]">
          <StandardSidebar
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
          />
          <StandardMain>{children}</StandardMain>
        </div>
      </div>
    </CalibrationProvider>
  );
}
