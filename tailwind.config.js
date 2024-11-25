/** @type {import('tailwindcss').Config} */
import { nextui } from "@nextui-org/react";
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        productSans: ["Product Sans", "sans-serif"],
      },
      colors: {
        brandColor: {
          mainBlue: "#015AFF",
          mainRed: "#FE004F",
          darkenRed: "#DC89A3",
          darkenBlue: "#2f6fe6",
          backgroundColor: "#241185",
          gradationBlue: "#018DFF",
          gradationRed: "#FF6A6F",
          //   complementarybg: "#855511",
        },
      },
    },
  },
  plugins: [
    nextui({
      prefix: "nextui", // prefix for themes variables
      addCommonColors: false, // override common colors (e.g. "blue", "green", "pink").
      defaultTheme: "light", // default theme from the themes object
      defaultExtendTheme: "light", // default theme to extend on custom themes
      layout: {}, // common layout tokens (applied to all themes)
      themes: {
        light: {
          layout: {}, // light theme layout tokens
          colors: {
            primary: "#015AFF", // example custom light theme color
            secondary: "#FE004F",
            background: "#FFFFFF",
            text: "#000000",
          },
        },
        dark: {
          layout: {}, // dark theme layout tokens
          colors: {
            primary: "#2f6fe6", // example custom dark theme color
            secondary: "#DC89A3",
            background: "#1A1A1A",
            text: "#FFFFFF",
          },
        },
      },
    }),
  ],
};
