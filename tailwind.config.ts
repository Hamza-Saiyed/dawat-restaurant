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
        background: "var(--primary-bg)",
        foreground: "var(--text-primary)",
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E2C068',
          dark: '#A07830'
        },
        dark: {
          DEFAULT: '#0A0A0A',
          card: '#1A1A1A',
          secondary: '#111111'
        }
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        cormorant: ['var(--font-cormorant)', 'serif'],
        jost: ['var(--font-jost)', 'sans-serif']
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-gold': {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 5px rgba(201,168,76,0.5))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 15px rgba(201,168,76,0.8))' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
