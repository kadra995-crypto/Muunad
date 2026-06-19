import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Muunad brand palette (Brand Guidelines 2026 — V1)
        terracotta: "#953414",
        cream: "#FBEBD5",
        sienna: "#6E2410",
        gold: "#C0894A",
        blush: "#E7C0A8",
        sand: "#D9BD98",
        oat: "#EFDCC2",
        // Semantic tokens mapped onto the brand palette
        natural: "#953414", // terracotta — primary
        care: "#E7C0A8", // blush
        quality: "#C0894A", // antique gold
        trust: "#6E2410", // sienna — body text
        light: "#EFDCC2", // oat
        "light-50": "#FBEBD5", // cream — base
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        wordmark: ["Quicksand", "sans-serif"],
        sans: ["Jost", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #FBEBD5 0%, #E7C0A8 50%, #C0894A 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
