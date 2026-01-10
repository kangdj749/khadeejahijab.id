import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],

  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
    },

    extend: {
      /* =========================
         COLOR SYSTEM (SEMANTIC)
      ========================= */
      colors: {
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",

        card: "rgb(var(--card))",
        border: "rgb(var(--border))",
        muted: "rgb(var(--muted))",

        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))",
          soft: "rgb(var(--primary-soft))",
        },

        /* OPTIONAL BUSINESS PALETTE */
        accent: {
          500: "#0ea5a3",
          600: "#0a7f7e",
        },
        leaf: {
          500: "#16a34a",
          600: "#12843c",
        },
      },

      /* =========================
         TYPOGRAPHY
      ========================= */
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },

      /* =========================
         EFFECTS
      ========================= */
      boxShadow: {
        soft: "0 10px 30px rgba(2, 6, 23, 0.08)",
        card: "0 6px 20px rgba(2, 6, 23, 0.06)",
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },

  plugins: [],
};

export default config;
