/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,vue}',
    './src/components/**/*.{js,ts,jsx,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0078d4',
        secondary: '#106ebe',
        accent: '#ffaa44',
      },
    },
  },
  plugins: [],
};
