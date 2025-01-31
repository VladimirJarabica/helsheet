import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testingTheme = {
  // Background of the app
  // bgDefault: "#e0dac8",
  bgDefault: "#fff",
  // Background of the "push" columns
  // bgEmphasis: "#dfd5b7",
  bgEmphasis: "#6d3c52",
  textEmphasis: "#fadcd5",
  // Hover of column
  bgHover: "#765D67",
  textHover: "#fadcd5",
  // Active column
  bgActive: "#4b2138",
  textActive: "#fadcd5",
  // Text color
  // textColor: "",
  // Button background
  // bgButton: "",
  // Button text
  // fgButton: "",
};

export default {
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
        hel: {
          bgDefault: "var(--bgDefault)",
          bgEmphasis: "var(--bgEmphasis)",
          bgHover: "var(--bgHover)",
          textHover: "var(--textHover)",
          bgActive: "var(--bgActive)",
          textActive: "var(--textActive)",
          bgButton: "var(--bgButton)",
          fgButton: "var(--fgButton)",
          textPrimary: colors.gray[900],
          textSubtle: colors.gray[500],
          buttonPrimary: colors.sky[600],
          buttonPrimaryHover: colors.sky[500],
          buttonPrimaryColor: colors.white,
          buttonSecondary: colors.white,
          buttonSecondaryHover: colors.gray[50],
          buttonSecondaryColor: colors.gray[600],
          buttonDanger: colors.red[600],
          buttonDangerHover: colors.red[500],
          buttonDangerColor: colors.white,
          buttonLinkColor: colors.gray[800],
          buttonLinkHoverColor: colors.gray[950],
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
