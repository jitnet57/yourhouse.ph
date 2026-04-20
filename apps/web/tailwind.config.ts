import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "navy": "#001F3F",
        "electric-blue": "#0074D9",
        "soft-gold": "#FFD700",
        "slate": {
          "50": "#F8FAFC",
          "100": "#E2E8F0",
        },
      },
      fontFamily: {
        inter: ["var(--font-inter)"],
      },
    },
  },
  plugins: [],
};
export default config;
