module.exports = {
  purge: ["./src/**/*.tsx"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      body: ["IBM Plex Sans"],
    },
    extend: {
      colors: {
        blue: {
          100: "#cce4f6",
          200: "#99c9ed",
          300: "#66afe5",
          400: "#3394dc",
          500: "#0079d3",
          600: "#0061a9",
          700: "#00497f",
          800: "#003054",
          900: "#00182a",
        },
        red: {
          100: "#fcdada",
          200: "#f9b4b4",
          300: "#f58f8f",
          400: "#f26969",
          500: "#ef4444",
          600: "#bf3636",
          700: "#8f2929",
          800: "#601b1b",
          900: "#300e0e",
        },
        yellow: {
          100: "#fdecce",
          200: "#fbd89d",
          300: "#f9c56d",
          400: "#f7b13c",
          500: "#f59e0b",
          600: "#c47e09",
          700: "#935f07",
          800: "#623f04",
          900: "#312002",
        },
        pink: {
          100: "#fbdaeb",
          200: "#f7b6d6",
          300: "#f491c2",
          400: "#f06dad",
          500: "#ec4899",
          600: "#bd3a7a",
          700: "#8e2b5c",
          800: "#5e1d3d",
          900: "#2f0e1f",
        },
        green: {
          100: "#cff1e6",
          200: "#9fe3cd",
          300: "#70d5b3",
          400: "#40c79a",
          500: "#10b981",
          600: "#0d9467",
          700: "#0a6f4d",
          800: "#064a34",
          900: "#03251a",
        },
      },
      spacing: {
        70: "17.5rem",
        160: "40rem",
      },
      container: false,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".container": {
          width: "100%",
          marginLeft: "auto",
          marginRight: "auto",
          "@screen sm": { maxWidth: "640px" },
          "@screen md": { maxWidth: "768px" },
          "@screen lg": { maxWidth: "975px" },
        },
      });
    },
  ],
};
