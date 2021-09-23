// const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        title: ['MedievalSharp', 'Georgia', 'serif'],
        body: ['Georgia', 'serif'],
      },
      colors: {
        muted: '#838383',
        background: '#151515',
        backgrounddark: '#252525',
        gold: '#edb900',
        common: '#838383',
        rare: '#2e82ff',
        legendary: '#f8b73e',
        mythic: '#ff44b7',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
