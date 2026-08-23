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
        // Primary brand palette — warm rose/blush/cream tones
        rose: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
          950: "#4c0519",
        },
        blush: {
          50: "#fdf4f5",
          100: "#fce8eb",
          200: "#f9d4d9",
          300: "#f4adb7",
          400: "#ed7f8e",
          500: "#e05369",
          600: "#ca334e",
          700: "#aa2540",
          800: "#8e2239",
          900: "#7a2035",
          950: "#430d1a",
        },
        cream: {
          50: "#fdfaf6",
          100: "#faf4ec",
          200: "#f4e6d4",
          300: "#ebd0b4",
          400: "#dfb48d",
          500: "#d49a6e",
          600: "#c6825c",
          700: "#a66a4e",
          800: "#865646",
          900: "#6d493c",
          950: "#3a231e",
        },
        champagne: {
          50: "#fefaf0",
          100: "#fdf3d8",
          200: "#fae5b2",
          300: "#f6d27e",
          400: "#f1ba49",
          500: "#eda322",
          600: "#d98517",
          700: "#b46416",
          800: "#924e18",
          900: "#784118",
          950: "#44210a",
        },
        ivory: {
          DEFAULT: "#f9f6f0",
          50: "#fdfcf9",
          100: "#f9f6f0",
          200: "#f2ece0",
          300: "#e8dece",
          400: "#d9c9b3",
          500: "#c9b494",
          600: "#b89a75",
          700: "#a0825e",
          800: "#856b4f",
          900: "#6d5843",
          950: "#3a2e23",
        },
        // Semantic aliases for the boutique brand
        brand: {
          primary: "#e11d48",    // rose-600 — primary CTA, badges
          secondary: "#ca334e",  // blush-600 — secondary accents
          accent: "#f9f6f0",     // ivory — background accents
          muted: "#f4e6d4",      // cream-200 — subtle backgrounds
          text: {
            primary: "#1c1917",  // neutral near-black for body text
            secondary: "#57534e", // stone-600 for secondary text
            light: "#a8a29e",    // stone-400 for placeholders
          },
        },
      },
      fontFamily: {
        // Serif for headings — elegant, feminine
        serif: [
          "Playfair Display",
          "Cormorant Garamond",
          "Georgia",
          "Cambria",
          '"Times New Roman"',
          "Times",
          "serif",
        ],
        // Sans-serif for body — clean, modern complement
        sans: [
          "Raleway",
          "Lato",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "sans-serif",
        ],
      },
      fontSize: {
        // Type scale tuned for elegance
        "display-xl": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg": ["3rem", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        "display-md": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "display-sm": ["1.875rem", { lineHeight: "1.25", letterSpacing: "-0.005em" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "88": "22rem",
        "112": "28rem",
        "128": "32rem",
      },
      maxWidth: {
        "screen-2xl": "1440px",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        "card": "0 2px 8px 0 rgba(28, 25, 23, 0.08)",
        "card-hover": "0 8px 24px 0 rgba(28, 25, 23, 0.12)",
        "modal": "0 20px 60px 0 rgba(28, 25, 23, 0.18)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-overlay": "linear-gradient(to bottom, rgba(28, 25, 23, 0.15), rgba(28, 25, 23, 0.45))",
      },
      transitionDuration: {
        "250": "250ms",
        "350": "350ms",
        "450": "450ms",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { transform: "translateY(1rem)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "slide-in-right": "slide-in-right 0.35s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
