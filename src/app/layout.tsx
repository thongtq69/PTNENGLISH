import type { Metadata } from "next";
import { Inter, Lora, Newsreader, Caveat, Be_Vietnam_Pro } from "next/font/google";
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

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-body",
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
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
      languages: {
        "vi": "https://ptnenglish.edu.vn/",
        "en": "https://ptnenglish.edu.vn/",
        "x-default": "https://ptnenglish.edu.vn/",
      },
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
  // Parse Accept-Language by q-value, pick the highest-priority tag whose
  // primary subtag we support. Defaults to vi when nothing matches.
  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? parseFloat(qParam.split("=")[1]) : 1;
      return { tag: tag.toLowerCase(), q: Number.isFinite(q) ? q : 0 };
    })
    .filter((x) => x.tag)
    .sort((a, b) => b.q - a.q);
  for (const { tag } of ranked) {
    const primary = tag.split("-")[0];
    if (primary === "vi") return "vi";
    if (primary === "en") return "en";
  }
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

const organizationJsonLdEn = {
  "@context": "https://schema.org",
  "@type": ["EducationalOrganization", "LocalBusiness"],
  "@id": "https://ptnenglish.edu.vn/#organization-en",
  "name": "PTN English - Phu Tai Nang Language Center",
  "alternateName": ["PTN English", "PTELC", "Phu Tai Nang English", "Partner To Navigate"],
  "url": "https://ptnenglish.edu.vn",
  "logo": "https://ptnenglish.edu.vn/logo.png",
  "image": "https://ptnenglish.edu.vn/logo.png",
  "inLanguage": "en",
  "description": "An Academic English training center offering IELTS and PTE preparation for teens and adults. Personalized learning pathways guided by an experienced MA.TESOL faculty.",
  "telephone": "+84902508290",
  "email": "info@ptelc.edu.vn",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "146 Bis Nguyen Van Thu",
    "addressLocality": "Da Kao Ward, District 1",
    "addressRegion": "Ho Chi Minh City",
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
    "name": "Ho Chi Minh City"
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
      "name": "Dang Tran Phong",
      "jobTitle": "Lead Portfolio / Founder",
      "alumniOf": "University of Canberra"
    },
    {
      "@type": "Person",
      "name": "Nguyen Le Quynh Tram",
      "jobTitle": "Lead Teacher / Advisor",
      "alumniOf": "University of Adelaide"
    }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "PTN English Programs",
    "itemListElement": [
      {
        "@type": "Course",
        "name": "IELTS Preparation",
        "description": "IELTS preparation from Foundation to Advanced with guaranteed outcomes",
        "provider": { "@id": "https://ptnenglish.edu.vn/#organization" },
        "educationalLevel": "Intermediate to Advanced",
        "inLanguage": "en"
      },
      {
        "@type": "Course",
        "name": "PTE Academic",
        "description": "International-standard PTE Academic preparation course",
        "provider": { "@id": "https://ptnenglish.edu.vn/#organization" },
        "inLanguage": "en"
      },
      {
        "@type": "Course",
        "name": "General English",
        "description": "Communicative English for adults with personalized learning pathways",
        "provider": { "@id": "https://ptnenglish.edu.vn/#organization" },
        "inLanguage": "en"
      },
      {
        "@type": "Course",
        "name": "English for Teens",
        "description": "Academic English program designed for secondary school students",
        "provider": { "@id": "https://ptnenglish.edu.vn/#organization" },
        "educationalLevel": "Secondary",
        "inLanguage": "en"
      }
    ]
  },
  "sameAs": [
    "https://www.facebook.com/ptelc.edu.vn",
    "https://lms.ptelc.edu.vn"
  ]
};

const websiteJsonLdEn = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://ptnenglish.edu.vn/#website-en",
  "name": "PTN English",
  "alternateName": "PTELC",
  "url": "https://ptnenglish.edu.vn",
  "publisher": { "@id": "https://ptnenglish.edu.vn/#organization" },
  "inLanguage": "en",
  "description": "Academic English, IELTS and PTE preparation in Ho Chi Minh City.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://ptnenglish.edu.vn/blog?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
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
    <html lang={initialLanguage} suppressHydrationWarning>
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLdEn) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLdEn) }}
        />
      </head>
      <body className={`${lora.variable} ${loraSerif.variable} ${beVietnamPro.variable} ${newsreader.variable} ${inter.variable} ${caveat.variable} font-body antialiased`}>
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
