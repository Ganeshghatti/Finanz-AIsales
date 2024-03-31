/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      white: "#FFF",
      black: "#000",
      black1:"#262626",
      black2:"#161616",
      black3:"#383942",
      blue:"#B8B1FF",
      darkblue:"#531DE4",
      gray: "#878787",
      gray2: "#656565",
    },
    extend: {
      screens: {
        sm: { max: "639px" },
        md: { max: "866px" },
        lg: { min: "867px", max: "1100px" },
        xl: { min: "1100px", max: "1279px" },
        "2xl": { min: "1280px", max: "1335px" },
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
