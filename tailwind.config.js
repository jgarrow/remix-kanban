/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      inter: ["Inter", "sans-serif"],
    },
    extend: {
      colors: {
        red: "#D62617",
        shade: {
          1: "#151515",
          2: "#515151",
          3: "#D1D1D1",
          4: "#EEEEEE",
          5: "#FFFFFF",
        },
        dark: {
          red: "#E75B4F",
          shade: {
            1: "#F2F2F2",
            2: "#B0B0B0",
            3: "#383838",
            4: "#222222",
            5: "#151515",
          },
        },
      },
    },
  },
  plugins: [],
};
