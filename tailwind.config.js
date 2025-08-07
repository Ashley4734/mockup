/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aurelia-cream': '#F7F5F0',
        'aurelia-sand': '#E6DDD4',
        'aurelia-taupe': '#D4C4B0',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'lora': ['Lora', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}