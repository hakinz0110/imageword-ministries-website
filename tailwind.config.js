/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        display: ['CityDBol', 'Montserrat', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#ffe5e5',
          100: '#ffcccc',
          200: '#ff9999',
          300: '#ff6666',
          400: '#ff3333',
          500: '#CC0000', // Bright Red - Energy, Urgency, Boldness
          600: '#A70000', // Dark Red - Sacrifice, Passion, Redemption
          700: '#8B0000',
          800: '#6B0000',
          900: '#4B0000',
        },
        secondary: {
          50: '#f5f5f5',
          100: '#e8e8e8',
          200: '#d1d1d1',
          300: '#b8b8b8',
          400: '#9c9c9c',
          500: '#808080', // Gray - Balance, Neutrality, Wisdom
          600: '#666666',
          700: '#4d4d4d',
          800: '#333333', // Dark Gray/Almost Black - Authority, Seriousness, Clarity
          900: '#1a1a1a',
        },
      },
    },
  },
  plugins: [],
}
