/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#738E6B',
        secondary: '#EAE3CB',
        accent: '#E8C16D',
        inverse: '#F0F0F0',
      },
      fontFamily: {
        sans: ['Inter', 'Futura PT', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
