module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{jsx, js, tsx ,ts}",
    "./src/features/**/*.{jsx, js, tsx ,ts}",
    "./src/layouts/**/*.{jsx, js, tsx ,ts}",
    "./src/ui/**/*.{jsx, js, tsx ,ts}",
  ],
  important: true,
  theme: {
    extend: {
      fontFamily: {
        iransans: "Iransans",
      },
      screens: {
        mobileMax: { max: "500px" },
        // => @media (min-width: 640px) { ... }

        laptopMax: { max: "1279px" },
        // => @media (min-width: 1024px) { ... }

        desktopMax: { max: "1280px" },
        // => @media (min-width: 1280px) { ... }

        // --------------------Min--------------------------

        mobileMin: { min: "500px" },
        // => @media (min-width: 640px) { ... }

        laptopMin: { min: "1279px" },
        // => @media (min-width: 1024px) { ... }

        desktopMin: { min: "1280px" },
        // => @media (min-width: 1280px) { ... }
      },
      colors: {
        atysa: {
          primary: "#F2F6FC",
          secondry: "#2196F3",
          main: "#09A1A7",
          25: "#F0F8FF",
          50: "#CFE8FC",
          100: "#BCDFFB",
          200: "#95CDF9",
          300: "#6EBBF7",
          400: "#48A8F5",
          500: "#2196F3",
          600: "#0B79D1",
          700: "#085A9B",
          800: "#063B66",
          900: "#031C31",
        },
      },
      boxShadow: {
        light:
          "rgb(58 61 66 / 6%) 0px 1px 0px, rgb(0 0 0 / 5%) 0px 2px 8px -2px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwind-scrollbar"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
