import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0A1628",
          800: "#111D35",
          700: "#1A2A4A",
          600: "#243B65",
        },
        accent: "#1E40AF",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
};

export default config;
