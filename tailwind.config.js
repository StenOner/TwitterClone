/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  media: false, // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        xs: '475px',
      },
    },
    fontFamily: {
      body: ['Montserrat', 'sans-serif'],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
