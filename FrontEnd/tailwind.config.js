/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1F2A44',
        'secondary': '#68A4D4',
        'accent': '#3BAA75',
        'light': '#F2F2E6',
        'gray': '#B3B4AD',
        'green-crop': '#748D8C',
        'pink': '#E8CFCD',
        'bg': '#F9FAFB',
        'ndText': '#6B7280',
        'highlight': '#F4A261',
        'error': '#DD7A61',
        'nonHighlight': '#E5E5E5'
      }
    },
  },
  plugins: [],
}