import Link from "next/link";
import logo from "../../../public/runpayway-logo.png";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FAFAFA" }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: "#E5E7EB", backgroundColor: "#ffffff" }}>
        <div className="max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
              alt="RunPayway™"
              style={{ height: 28, width: "auto" }}
            />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/pricing" className="text-[13px] font-medium hover:opacity-70 transition-opacity" style={{ color: "#6B7280" }}>
              Score
            </Link>
            <Link href="/pricing" className="text-[13px] font-medium hover:opacity-70 transition-opacity" style={{ color: "#6B7280" }}>
              Pricing
            </Link>
            <Link href="/methodology" className="text-[13px] font-medium hover:opacity-70 transition-opacity" style={{ color: "#6B7280" }}>
              Methodology
            </Link>
            <Link href="/verify" className="text-[13px] font-medium hover:opacity-70 transition-opacity" style={{ color: "#6B7280" }}>
              Registry
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-[13px] font-medium cursor-default" style={{ color: "#6B7280" }}>
              Sign In
            </span>
            <Link
              href="/pricing"
              className="text-[13px] font-medium px-4 py-2 rounded transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#0E1A2B", color: "#ffffff" }}
            >
              Get Score
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: "#E5E7EB", backgroundColor: "#ffffff" }}>
        <div className="max-w-[1100px] mx-auto px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Product */}
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-4" style={{ color: "#0E1A2B" }}>
                Product
              </div>
              <div className="space-y-2.5">
                {[
                  ["/pricing", "Get Score"],
                  ["/pricing", "Pricing"],
                  ["/methodology", "Methodology"],
                ].map(([href, label]) => (
                  <Link key={label} href={href} className="block text-[13px] hover:opacity-70 transition-opacity" style={{ color: "#6B7280" }}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Methodology */}
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-4" style={{ color: "#0E1A2B" }}>
                Methodology
              </div>
              <div className="space-y-2.5">
                {["Governance", "Version Control", "Data Retention", "Security Practices"].map((label) => (
                  <span key={label} className="block text-[13px] cursor-default" style={{ color: "#9CA3AF" }}>
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-4" style={{ color: "#0E1A2B" }}>
                Legal
              </div>
              <div className="space-y-2.5">
                {[
                  ["/terms", "Terms"],
                  ["/privacy", "Privacy"],
                ].map(([href, label]) => (
                  <Link key={label} href={href} className="block text-[13px] hover:opacity-70 transition-opacity" style={{ color: "#6B7280" }}>
                    {label}
                  </Link>
                ))}
                {["Disclaimer", "Acceptable Use"].map((label) => (
                  <span key={label} className="block text-[13px] cursor-default" style={{ color: "#9CA3AF" }}>
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Institutional */}
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-4" style={{ color: "#0E1A2B" }}>
                Institutional
              </div>
              <div className="space-y-2.5">
                {[
                  ["/verify", "Registry"],
                  ["/contact", "Contact"],
                ].map(([href, label]) => (
                  <Link key={label} href={href} className="block text-[13px] hover:opacity-70 transition-opacity" style={{ color: "#6B7280" }}>
                    {label}
                  </Link>
                ))}
                <span className="block text-[13px] cursor-default" style={{ color: "#9CA3AF" }}>
                  Accessibility
                </span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t" style={{ borderColor: "#E5E7EB" }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-xs" style={{ color: "#9CA3AF" }}>
                &copy; RunPayway™
              </span>
              <span className="text-xs" style={{ color: "#9CA3AF" }}>
                Model RP-1.0 | Version 1.0
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
