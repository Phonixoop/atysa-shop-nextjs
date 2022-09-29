module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{jsx, js}",
    "./src/features/**/*.{jsx, js}",
    "./src/ui/**/*.{jsx, js}",
  ],
  important: true,
  theme: {
    fontFamily: {
      sans: ["Iransans"],
    },
    extend: {
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
