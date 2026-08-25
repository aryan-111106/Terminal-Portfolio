/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Fira Code"', '"JetBrains Mono"', '"Cascadia Code"', 'Consolas', 'Courier New', 'monospace'],
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'crt-scan': 'scan 8s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scan: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100%' },
        }
      }
    },
  },
  plugins: [],
}
