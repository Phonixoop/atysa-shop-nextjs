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
        mobile: "500px",
        // => @media (min-width: 640px) { ... }

        laptop: "1024px",
        // => @media (min-width: 1024px) { ... }

        desktop: "1280px",
        // => @media (min-width: 1280px) { ... }
      },
      colors: {
        atysa: {
          primary: "#F2F6FC",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
