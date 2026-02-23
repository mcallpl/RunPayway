import Link from "next/link";

export default function BlueBar() {
  return (
    <Link
      href="/standard"
      className="group block cursor-pointer"
    >
      <div
        className="flex items-center justify-center transition-colors duration-150 ease-in-out group-hover:bg-[#24798A]"
        style={{
          backgroundColor: "#1F6D7A",
          height: "clamp(44px, 5vw, 48px)",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#FFFFFF",
          }}
        >
          Explore the Structural Standard &rarr;
        </p>
      </div>
    </Link>
  );
}
