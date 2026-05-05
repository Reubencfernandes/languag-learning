import type { Metadata } from "next";
import { Almarai, Instrument_Serif } from "next/font/google";
import "./globals.css";

const almarai = Almarai({
  variable: "--font-almarai",
  subsets: ["latin"],
  weight: ["300", "400", "700", "800"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  style: "italic",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DialogueDock",
  description: "Where language meets real life. AI-powered dialogues that teach you to think in a new language — not just translate it.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${almarai.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black">{children}</body>
    </html>
  );
}
