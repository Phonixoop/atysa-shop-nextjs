module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{jsx, js}",
    "./src/features/**/*.{jsx, js}",
    "./src/ui/**/*.{jsx, js}",
  ],
  important: true,
  theme: {
    extend: {
      fontFamily: {
        iransans: "Iransans",
      },
      screens: {
        mobile: { max: "500px" },
        // => @media (min-width: 640px) { ... }

        laptop: { max: "1279px" },
        // => @media (min-width: 1024px) { ... }

        desktop: { min: "1280px" },
        // => @media (min-width: 1280px) { ... }
      },
      colors: {
        atysa: {
          primary: "#F2F6FC",
          secondry: "#2196F3",
          "secondry-200": "#2196f31a",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("tailwind-scrollbar")],
};
