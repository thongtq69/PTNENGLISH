import type { Metadata } from "next";
import { Inter, Playfair_Display, Crimson_Text, Lora, Newsreader } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const crimsonText = Crimson_Text({
  weight: ["400", "600", "700"],
  variable: "--font-body",
  subsets: ["latin", "vietnamese"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import fs from "fs";
import path from "path";

export async function generateMetadata(): Promise<Metadata> {
  const filePath = path.join(process.cwd(), "data/global-settings.json");
  let settings = { site: { title: "PTN English", description: "Default description" } };

  if (fs.existsSync(filePath)) {
    settings = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }

  return {
    title: settings.site.title,
    description: settings.site.description,
  };
}

import AdModal from "@/components/AdModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${playfair.variable} ${newsreader.variable} ${crimsonText.variable} ${inter.variable} ${lora.variable} font-body antialiased`}>
        {children}
        <AdModal />
      </body>
    </html>
  );
}
