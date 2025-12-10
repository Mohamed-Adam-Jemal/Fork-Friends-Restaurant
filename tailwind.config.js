const {heroui} = require('@heroui/theme');
module.exports = {
  plugins: [heroui()],
  content: [
    "./node_modules/@heroui/theme/dist/components/(slider|popover).js"
],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Merriweather Sans"', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
      },
    },
  },
}