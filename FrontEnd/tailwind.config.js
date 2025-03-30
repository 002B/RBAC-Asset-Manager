/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#FD6E28',
        'secondary': '#473366',
        'light': '#F2F2E6',
        'gray': '#B3B4AD',
        'green-crop': '#748D8C',
        'pink': '#E8CFCD',
      }
    },
  },
  plugins: [],
}