/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1', // индиго
          light: '#818CF8',
          dark: '#4F46E5',
        },
        accent: '#A855F7', // фиолетовый акцент
      },
      boxShadow: {
        neon: '0 0 10px rgba(99,102,241,0.6)',
      },
    },
  },
  plugins: [],
};
