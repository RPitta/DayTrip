/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.{ejs, html}'],
  theme: {
    extend: {
      boxShadow: {
        'custom': '0 0 0 200px rgba(0, 0, 0, 0.9) inset',
      }
    },
  },
  plugins: [],
}
