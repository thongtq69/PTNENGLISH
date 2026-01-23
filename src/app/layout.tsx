import type { Metadata } from "next";
import { Inter, Playfair_Display, Crimson_Text, Lora } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "PTN English | Partner To Navigate",
  description: "Trung tâm Tiếng Anh uy tín mang đến lộ trình cá nhân hóa và đội ngũ chuyên gia hàng đầu. Đồng hành cùng bạn trên con đường kiến tạo tương lai.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${playfair.variable} ${crimsonText.variable} ${inter.variable} ${lora.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  );
}
