/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        kana: ['Noto Sans JP', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
      },
      animation: {
        'bounce-once': 'bounce 0.3s ease-in-out 1',
        'pulse-once': 'pulse 0.25s ease-in-out 1',
        'fade-in':    'fadeIn 0.2s ease-out',
        'slide-up':   'slideUp 0.25s ease-out',
        'pop':        'pop 0.28s ease-out',
        'shake':      'shake 0.38s ease-in-out',
        'float-up':   'floatUp 0.9s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%':   { opacity: '0', transform: 'scale(0.88)' },
          '65%':  { transform: 'scale(1.04)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '18%':     { transform: 'translateX(-6px)' },
          '36%':     { transform: 'translateX(6px)' },
          '54%':     { transform: 'translateX(-4px)' },
          '72%':     { transform: 'translateX(4px)' },
          '88%':     { transform: 'translateX(-2px)' },
        },
        floatUp: {
          '0%':   { opacity: '1',   transform: 'translateY(0)' },
          '70%':  { opacity: '0.8', transform: 'translateY(-28px)' },
          '100%': { opacity: '0',   transform: 'translateY(-40px)' },
        },
      },
    },
  },
  plugins: [],
}
