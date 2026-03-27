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
        brown: "#3D2314",
        caramel: "#C8813A",
        "caramel-lt": "#E8A55A",
        cream: "#FDF6EC",
        sage: "#7A9E7E",
        "sage-lt": "#D4EAD6",
        purple: "#9B7EC8",
        "purple-lt": "#EDE6F7",
        "text-dark": "#2A1A0E",
        "text-mid": "#6B4F3A",
        "text-light": "#A08070",
        border: "#E0CFC0",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        serif: ["var(--font-playfair)", "Playfair Display", "serif"],
      },
      borderRadius: {
        xl: "12px",
        lg: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
