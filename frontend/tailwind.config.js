/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060a12',
          900: '#0b1120',
          850: '#0f172a',
          800: '#141e33',
          750: '#1a2640',
          700: '#223254',
        },
        burgundy: {
          950: '#4c0519',
          900: '#881337',
          800: '#9f1239',
          700: '#be123c',
          600: '#e11d48',
          500: '#f43f5e',
          400: '#fb7185',
          300: '#fda4af',
          100: '#ffe4e6',
        },
        crimson: {
          DEFAULT: '#991b1b',
          light: '#dc2626',
          dark: '#7f1d1d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}

