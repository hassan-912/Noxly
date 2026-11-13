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
});

export const fontVariables = `${fontSans.variable} ${fontMono.variable} ${fontArabic.variable}`;
