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
        natural: "#3F4A3A",
        care: "#C9A097",
        quality: "#B8925F",
        trust: "#4A3322",
        light: "#EDE2D1",
        "light-50": "#F7F3EE",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #EDE2D1 0%, #C9A097 50%, #B8925F 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
