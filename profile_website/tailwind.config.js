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
      // colors: {
      //   primary: '#F3E9F5',
      //   secondary: '#936B9E',
      //   accent: '#9E8056',
      //   inverse: '#D4AF37',
      // },
      fontFamily: {
        sans: ['Inter', 'Futura PT', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
