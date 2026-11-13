import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hassan Azab",
  description: "Portfolio of Hassan Azab",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontVariables} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
