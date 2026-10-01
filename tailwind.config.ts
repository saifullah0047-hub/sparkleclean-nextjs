import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Preflight is disabled so Bootstrap's reboot/base styles keep the
  // original template rendering intact. Tailwind is used as an additional
  // utility layer for component scaffolding.
  corePlugins: {
    preflight: false,
    visibility: false,
  },
  theme: {
    extend: {
      colors: {
        primary: "#0E7C6B",
        "primary-dark": "#095E52",
        "primary-deep": "#053B33",
        accent: "#F5A623",
        "accent-dark": "#D98A08",
        ink: "#0B1B25",
        body: "#42525C",
        muted: "#7A8B95",
      },
      fontFamily: {
        heading: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        sm: "12px",
        DEFAULT: "18px",
        lg: "28px",
        pill: "999px",
      },
      boxShadow: {
        sm: "0 2px 8px rgba(11, 27, 37, .06)",
        DEFAULT: "0 10px 30px rgba(11, 27, 37, .08)",
        lg: "0 24px 60px rgba(11, 27, 37, .12)",
        primary: "0 12px 28px rgba(14, 124, 107, .28)",
      },
    },
  },
  plugins: [],
};

export default config;