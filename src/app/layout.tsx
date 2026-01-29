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
  let settings = {
    site: {
      title: "PTN English - Hệ thống đào tạo Tiếng Anh học thuật",
      description: "PTN English chuyên đào tạo IELTS, PTE và Tiếng Anh giao tiếp với lộ trình cá nhân hóa, cam kết đầu ra."
    }
  };

  if (fs.existsSync(filePath)) {
    try {
      settings = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (e) {
      console.error("Error parsing global settings", e);
    }
  }

  return {
    title: {
      default: settings.site.title,
      template: `%s | ${settings.site.title}`,
    },
    description: settings.site.description,
    keywords: ["IELTS", "PTE", "Tiếng Anh giao tiếp", "PTN English", "Học tiếng anh", "Luyện thi IELTS"],
    authors: [{ name: "PTN English" }],
    creator: "PTN English",
    publisher: "PTN English",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL("https://ptnenglish.edu.vn"),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: settings.site.title,
      description: settings.site.description,
      url: "https://ptnenglish.edu.vn",
      siteName: settings.site.title,
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.site.title,
      description: settings.site.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: "your-google-verification-code", // User can replace this later
    }
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
