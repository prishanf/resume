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
        // #627A5B keeps the olive look while meeting WCAG AA for white-on-primary buttons
        // and primary-on-white small labels (4.5:1). Decorative gold stays on accent.
        primary: {
          DEFAULT: '#627A5B',
          ink: '#3F5539'
        },
        secondary: '#EAE3CB',
        accent: {
          DEFAULT: '#E8C16D',
          ink: '#7A5F14'
        },
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
