/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#eef1f7',
          100: '#d5dceb',
          200: '#abb8d5',
          300: '#7f91bd',
          400: '#536ba7',
          500: '#33487f',
          600: '#1e2c5c',
          700: '#172147',
          800: '#101836',
          900: '#080c1f',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        kana: ['Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      animation: {
        'bounce-once': 'bounce 0.3s ease-in-out 1',
        'pulse-once':  'pulse 0.25s ease-in-out 1',
        'fade-in':     'fadeIn 0.2s ease-out',
        'slide-up':    'slideUp 0.25s ease-out',
        'pop':         'pop 0.28s cubic-bezier(0.34,1.56,0.64,1)',
        'shake':       'shake 0.38s ease-in-out',
        'float-up':    'floatUp 0.9s ease-out forwards',
        'drawer-up':   'drawerUp 0.2s cubic-bezier(0.22,1,0.36,1)',
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
        drawerUp: {
          from: { transform: 'translateY(100%)' },
          to:   { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
