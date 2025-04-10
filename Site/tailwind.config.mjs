/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        "deep-navy": "#15273F",
        "navy-light": "#1E3859",
        "soft-blue": "#DFE9F6",
        "medium-blue": "#ADC9E9",
        "bright-blue": "#6093D4",
        "neutral-gray": "#AEAEAE",
      },
      fontFamily: {
        avenir: ["Avenir", "sans-serif"],
      },
    },
  },
  plugins: [],
};
