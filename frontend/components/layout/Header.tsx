import Link from "next/link";

export default function Header() {
  return (
    <header
      className="bg-white"
      style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
    >
      <div
        className="mx-auto flex items-center"
        style={{
          maxWidth: "1440px",
          height: "clamp(64px, 8vw, 88px)",
          paddingLeft: "clamp(16px, 3vw, 40px)",
          paddingRight: "clamp(16px, 3vw, 40px)",
        }}
      >
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/RunPayway/images/logo.png"
            alt="RunPayway"
            className="h-[22px] sm:h-[26px] md:h-[28px] lg:h-[30px] w-auto"
          />
        </Link>
      </div>
    </header>
  );
}
