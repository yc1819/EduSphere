/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Use the 'dark' class to toggle dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Optional: define custom colors for light & dark modes
        primary: {
          light: '#1E3A8A', // blue-800
          dark: '#93C5FD',   // blue-300
        },
        background: {
          light: '#FFFFFF',
          dark: '#1F2937', // gray-800
        },
        text: {
          light: '#1F2937', // gray-800
          dark: '#F3F4F6',  // gray-100
        },
      },
    },
  },
  plugins: [],
};
