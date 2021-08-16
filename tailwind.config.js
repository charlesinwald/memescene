module.exports = {
  purge: ["./src/**/*.{ts,tsx}", "./dist/*.html"],
  // purge: {
  //   mode: "layers",
  //   content: ["./dist/**/*.html"], //https://youtu.be/To2LiO-IxqU?t=348
  // },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
