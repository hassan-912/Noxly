import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";

export const fontSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const fontArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  // No metric-adjusted Arial fallback: it covers Latin, so it would win over Geist for Latin
  // text on Arabic pages. With it off, `var(--font-arabic), var(--font-sans)` renders Arabic
  // in Plex and Latin (tech names, numbers) in Geist.
  adjustFontFallback: false,
});

export const fontVariables = `${fontSans.variable} ${fontMono.variable} ${fontArabic.variable}`;
