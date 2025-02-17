const colors = require('tailwindcss/colors');
module.exports = {
  purge: ['./app/**/*.{js,jsx,ts,tsx}'],
  // purge: [],
  darkMode: false, // or 'media' or 'class'
  // prefix: 'tw-',
  theme: {

    screens: {
      sm: '320px',
      md: '480px',
      lg: '680px',
      // or maybe name them after devices for `tablet:flex-row`
      tablet: '1024px',
    },
    extend: {},
  },
  variants: {},
  plugins: [],
};
