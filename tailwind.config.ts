import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        rp: {
          navy: "#0E1A2B",
          navy2: "#0B2A4A",
          teal: "#1F6D7A",
          blue: "#2F6BFF",
          page: "#F8FAFC",
          white: "#FFFFFF",
          border: "#E6E8EB",
          divider: "#E5E7EB",
          text: "#111827",
          muted: "#6B7280",
          soft: "#9CA3AF",
          green: "#2E7D32",
          red: "#C62828",
        },
      },
      boxShadow: {
        "rp-card": "0px 8px 24px rgba(16, 24, 40, 0.04)",
        "rp-subtle": "0px 2px 8px rgba(0, 0, 0, 0.02)",
      },
      borderRadius: {
        rp: "12px",
        "rp-button": "10px",
      },
      maxWidth: {
        "rp-container": "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
