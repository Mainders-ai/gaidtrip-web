import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#037E8C",
          light: "#2AA3B0",
          dark: "#025669",
        },
        accent: {
          DEFAULT: "#FF6B6B",
          light: "#FF9999",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#1E1E1E",
        },
        background: {
          light: "#F8F9FA",
          dark: "#121212",
        },
        "text-primary": {
          light: "#212529",
          dark: "#FFFFFF",
        },
        "text-secondary": {
          light: "#6C757D",
          dark: "#B0B0B0",
        },
        success: "#51CF66",
        warning: "#FFB347",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
    },
  },
  plugins: [],
};

export default config;
