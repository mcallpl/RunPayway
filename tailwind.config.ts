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
        serif: [
          "Crimson Text",
          "Georgia",
          "serif",
        ],
      },
      colors: {
        rp: {
          navy: "#0E2A7B",
          navy2: "#183C96",
          textNavy: "#1B2B52",
          teal: "#0D6E67",
          blue: "#0E2A7B",
          page: "#F8FAFD",
          white: "#FFFFFF",
          border: "#E6EAF2",
          divider: "#E6EAF2",
          softGray: "#D8DCE5",
          text: "#1B2B52",
          muted: "#6B7280",
          soft: "#D8DCE5",
          green: "#0D6E67",
          red: "#E5484D",
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
