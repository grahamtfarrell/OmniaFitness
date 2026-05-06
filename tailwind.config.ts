import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          primary: "#fbccf2",
        },
      },
      fontFamily: {
        mono: ['"GT Pressura Mono"', "monospace"],
        display: ["var(--font-gruppo)", "sans-serif"],
      },
      fontWeight: {
        light: "300",
        normal: "400",
        bold: "700",
      },
      borderRadius: {
        button: "38px",
        card: "67px",
      },
    },
  },
  plugins: [],
};
export default config;
