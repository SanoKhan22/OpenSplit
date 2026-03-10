import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand colors
        brand: {
          yellow: "#FFD400",
          purple: "#7c3bed",
        },
        // Semantic colors
        success: "#10b981",
        danger: "#ef4444",
        warning: "#f59e0b",
        // Dark theme backgrounds
        bg: {
          primary: "#0a0a0a",
          secondary: "#141414",
          tertiary: "#1f1f1f",
        },
        // Borders & text
        border: {
          DEFAULT: "#2a2a2a",
        },
        text: {
          primary: "#ffffff",
          secondary: "#a3a3a3",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "12px",
      },
      minWidth: {
        touch: "48px",
      },
      minHeight: {
        touch: "48px",
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
