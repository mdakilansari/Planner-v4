/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Defined in v3 and used in v4
        primary: '#F472B6', // Pink
        accent: '#C084FC',  // Purple
      },
    },
  },
  plugins: [],
}
