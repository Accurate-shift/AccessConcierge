import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        access: {
          black: "#0B0B0C",
          surface: "#121214",
          border: "#27272A",
          accent: "#D4AF37",
          accentSoft: "#F5E7B8",
        },
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(212, 175, 55, 0.35)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
