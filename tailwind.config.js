/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        'peach': '#E8B4A0',
        'dark': '#1E1E1E',
        'dark-light': '#2a2a2a',
      },
    },
  },
  plugins: [],
}

