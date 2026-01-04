import type { Config } from "tailwindcss";

const config: Config = {
  
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palet selaras logo (biru/teal/hijau)
        primary: {
          50: "#edf3ff",
          100: "#d8e6ff",
          200: "#b0caff",
          300: "#88aeff",
          400: "#5e92ff",
          500: "#2563eb", // blue-600 feel
          600: "#1e50c4",
          700: "#183e9b",
          800: "#112c72",
          900: "#0a1a49"
        },
        accent: {
          500: "#0ea5a3", // teal
          600: "#0a7f7e"
        },
        leaf: {
          500: "#16a34a", // green
          600: "#12843c"
        }
      },
      container: {
        center: true,
        padding: "1rem"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(2, 6, 23, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
