import type { Metadata } from "next";
import { Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ALBOVSKY | Portfolio",
  description: "Visual Storytelling & Digital Artistry",
};

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${playfair.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
