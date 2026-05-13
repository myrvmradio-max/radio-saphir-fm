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
        background: "var(--background)",
        foreground: "var(--foreground)",
        saphir: {
          navy: "#0D1B4C",
          royal: "#1E3A8A",
          electric: "#6A7CFF",
          black: "#111827",
          white: "#F2F4F7",
        },
      },
    },
  },
  plugins: [],
};
export default config;
