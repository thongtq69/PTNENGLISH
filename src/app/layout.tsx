import type { Metadata } from "next";
import { Inter, Lora, Newsreader, Caveat, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

const lora = Lora({
  variable: "--font-heading",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const loraSerif = Lora({
  variable: "--font-serif",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-handwriting",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
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
    icons: {
      icon: [
        { url: "/favicon.png", sizes: "32x32" },
        { url: "/icon.png", sizes: "192x192" },
      ],
      apple: [
        { url: "/apple-icon.png", sizes: "180x180" },
      ],
    },
    manifest: "/manifest.json",
    keywords: [
      "IELTS", "PTE", "Tiếng Anh giao tiếp", "PTN English", "Học tiếng anh", "Luyện thi IELTS",
      "trung tâm tiếng anh quận 1", "học IELTS TP.HCM", "luyện thi PTE", "Anh văn học thuật",
      "PTELC", "Phú Tài Năng", "trung tâm Anh ngữ", "khóa học IELTS", "tiếng Anh cho thiếu niên",
      "thi thử IELTS online", "English for Teens", "Academic English", "lớp IELTS quận 1",
      "trung tâm ngoại ngữ TP.HCM", "học tiếng Anh online", "luyện đề IELTS"
    ],
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
      images: [
        {
          url: "/logo.png",
          width: 800,
          height: 800,
          alt: "PTN English Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.site.title,
      description: settings.site.description,
      images: ["/logo.png"],
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
      google: "ii7ZEmwBHmrUPyhKmLqLgfaxYWA9PBbhAwt_3zQEjl4",
    }
  };
}

import AdModal from "@/components/AdModal";
import ChatBox from "@/components/ChatBox";

import { cookies, headers } from "next/headers";
import { LanguageProvider } from "@/context/LanguageContext";
import { FontSizeProvider } from "@/context/FontSizeContext";
import type { Language } from "@/data/translations";

const resolveInitialLanguage = async (): Promise<Language> => {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get("ptn_lang")?.value;
  if (fromCookie === "vi" || fromCookie === "en") return fromCookie;

  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language") ?? "";
  // Only auto-detect English; everything else (and no header) defaults to vi.
  if (/\ben(?:-|;|,|$)/i.test(acceptLanguage)) return "en";
  return "vi";
};

// JSON-LD Structured Data for SEO
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["EducationalOrganization", "LocalBusiness"],
  "@id": "https://ptnenglish.edu.vn/#organization",
  "name": "PTN English - Trung tâm Ngoại ngữ Phú Tài Năng",
  "alternateName": ["PTN English", "PTELC", "Phú Tài Năng English", "Partner To Navigate"],
  "url": "https://ptnenglish.edu.vn",
  "logo": "https://ptnenglish.edu.vn/logo.png",
  "image": "https://ptnenglish.edu.vn/logo.png",
  "description": "Trung tâm đào tạo Anh văn Học thuật (Academic English), luyện thi IELTS và PTE cho thiếu niên và người lớn. Lộ trình cá nhân hoá, đội ngũ MA.TESOL giàu kinh nghiệm.",
  "telephone": "+84902508290",
  "email": "info@ptelc.edu.vn",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "146 Bis Nguyễn Văn Thủ",
    "addressLocality": "Phường Đa Kao, Quận 1",
    "addressRegion": "Thành phố Hồ Chí Minh",
    "postalCode": "700000",
    "addressCountry": "VN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 10.7871,
    "longitude": 106.6951
  },
  "areaServed": {
    "@type": "City",
    "name": "Hồ Chí Minh"
  },
  "priceRange": "$$",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "08:00",
      "closes": "21:00"
    }
  ],
  "foundingDate": "2000",
  "founder": [
    {
      "@type": "Person",
      "name": "Thầy Đặng Trần Phong",
      "jobTitle": "Lead Portfolio / Founder",
      "alumniOf": "University of Canberra"
    },
    {
      "@type": "Person",
      "name": "Cô Nguyễn Lê Quỳnh Trâm",
      "jobTitle": "Lead Teacher / Advisor",
      "alumniOf": "University of Adelaide"
    }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Chương trình học tại PTN English",
    "itemListElement": [
      {
        "@type": "Course",
        "name": "Luyện thi IELTS",
        "description": "Khóa luyện thi IELTS từ Foundation đến Advanced, cam kết đầu ra",
        "provider": { "@id": "https://ptnenglish.edu.vn/#organization" },
        "educationalLevel": "Intermediate to Advanced"
      },
      {
        "@type": "Course",
        "name": "PTE Academic",
        "description": "Khóa luyện thi PTE Academic chuẩn quốc tế",
        "provider": { "@id": "https://ptnenglish.edu.vn/#organization" }
      },
      {
        "@type": "Course",
        "name": "Tiếng Anh Tổng quát (General English)",
        "description": "Tiếng Anh giao tiếp cho người lớn, lộ trình cá nhân hoá",
        "provider": { "@id": "https://ptnenglish.edu.vn/#organization" }
      },
      {
        "@type": "Course",
        "name": "Tiếng Anh Trung học (English for Teens)",
        "description": "Chương trình Anh văn Học thuật dành cho học sinh Trung học Cơ sở",
        "provider": { "@id": "https://ptnenglish.edu.vn/#organization" },
        "educationalLevel": "Secondary"
      }
    ]
  },
  "sameAs": [
    "https://www.facebook.com/ptelc.edu.vn",
    "https://lms.ptelc.edu.vn"
  ]
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "PTN English",
  "alternateName": "PTELC",
  "url": "https://ptnenglish.edu.vn",
  "publisher": { "@id": "https://ptnenglish.edu.vn/#organization" },
  "inLanguage": ["vi", "en"],
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://ptnenglish.edu.vn/blog?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialLanguage = await resolveInitialLanguage();
  return (
    <html lang={initialLanguage}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MRCJM6N7DN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-MRCJM6N7DN');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${lora.variable} ${loraSerif.variable} ${poppins.variable} ${newsreader.variable} ${inter.variable} ${caveat.variable} font-body antialiased`}>
        <LanguageProvider initialLanguage={initialLanguage}>
          <FontSizeProvider>
            {children}
            <AdModal />
            <ChatBox />
          </FontSizeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
