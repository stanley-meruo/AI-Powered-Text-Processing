/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "selector",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        
      },
      screens: {
        xxs: "370px",
        xs: "480px",
        xxl: "1500px",
      },
    },
  },
  plugins: [],
};

