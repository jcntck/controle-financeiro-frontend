// src/theme.ts
"use client";

import "@fontsource/audiowide";

import { createTheme } from "@mui/material/styles";
import { Audiowide, Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const audioWide = Audiowide({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

declare module "@mui/material/styles" {
  interface TypographyVariants {
    logo: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    logo?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    logo: true;
  }
}

const theme = createTheme({
  typography: {
    logo: {
      fontFamily: audioWide.style.fontFamily,
      fontWeight: 500,
      fontSize: 24,
    },
    fontFamily: roboto.style.fontFamily,
  },
});

export default theme;
