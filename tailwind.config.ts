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
      padding: "1rem",
    },

    extend: {
      colors: {
        /* THEME CORE */
        primary: "rgb(var(--color-primary))",
        primarySoft: "rgb(var(--color-primary-soft))",
        text: "rgb(var(--color-text))",
        bg: "rgb(var(--color-bg))",

        /* OPTIONAL PALETTE (UMKM FRIENDLY) */
        accent: {
          500: "#0ea5a3", // teal
          600: "#0a7f7e",
        },
        leaf: {
          500: "#16a34a", // green
          600: "#12843c",
        },
      },

      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },

      boxShadow: {
        soft: "0 10px 30px rgba(2, 6, 23, 0.08)",
      },
    },
  },

  plugins: [],
};

export default config;
