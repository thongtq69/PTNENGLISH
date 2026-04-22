"use client";

import { useEffect, useState } from "react";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// TikTok icon custom SVG
const TikTokIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
    <svg
        width={size}
        height={size}
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12.525.01c1.306-.022 2.527.194 3.7.6a8.12 8.12 0 0 1-1.037 3.063c-1.126.311-2.28.324-3.418.331.008 3.582.022 7.164.032 10.745l.004.416c1.115 1.488.583 3.616-.837 4.757-1.42 1.141-3.66.936-4.787-.417-1.428-1.714-1.116-4.473.847-5.594 1.258-.718 2.373-.417 3.254.195.034-4.852.022-9.704.02-14.556 1.15-.013 2.298.423 3.298 1.157 1.15.845 1.574 2.115 1.63 3.447.01.21.007.41-.01.623 1.1-.17 2.2-.14 3.3.09a7.35 7.35 0 0 0-1.85-4.43c-1.44-1.58-3.48-2.31-5.6-.01V.01z" />
    </svg>
);

export default function Footer() {
    const { t, language } = useLanguage();
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        fetch("/api/full-settings")
            .then(res => res.json())
            .then(data => setSettings(data))
            .catch(() => { });
    }, []);

    const footerData = {
        aboutText: t.footer?.about || (language === "en" ? "Shaping a brilliant future through mastering the global language. Committed to providing the best quality education." : "Kiến tạo tương lai rực rỡ thông qua việc làm chủ ngôn ngữ toàn cầu. Cam kết mang đến chất lượng giáo dục tốt nhất."),
        copyright: t.footer?.copyright || (language === "en" ? "© 2026 Partner To Navigate. All rights reserved." : "© 2026 Partner To Navigate. Bảo lưu mọi quyền.")
    };



    const contactData = settings?.contact || {
        phone: "0902 508 290",
        email: "info@ptelc.edu.vn",
        address: language === "en" ? "146 Bis Nguyen Van Thu, Da Kao Ward, District 1, HCMC" : "146 Bis Nguyễn Văn Thủ, P. Đa Kao, Q.1, TP.HCM",
        mapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4225417961395!2d106.69176567461865!3d10.780506059028596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f385570472f%3A0x2a3c3e387c5a2d8b!2s146%20Bis%20Nguy%E1%BB%85n%20V%C4%83n%20Th%E1%BB%A7%2C%20%C4%90a%20Kao%2C%20Qu%E1%BA%ADn%201%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh%2C%20Vi%E1%BB%87t%20Nam!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
    };

    const quickLinks = [
        { name: t.nav.about, href: "/about-us" },
        { name: t.nav.courses, href: "/courses" },
        { name: t.nav.studentCorner, href: "/student-corner" },
        { name: t.nav.blog, href: "/blog" },
        { name: t.nav.lms, href: "https://lms.ptelc.edu.vn/", target: "_blank" },
        { name: t.home.campus.testBtn, href: "/test" },
        { name: t.topbar.contact, href: "/contact" }
    ];

    return (
        <footer className="bg-white text-slate-700 pt-6 md:pt-12 pb-3 md:pb-6 border-t border-slate-200">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-4 md:mb-10">
                <div>
                    <div className="mb-3 md:mb-4">
                        <img
                            src="/desktop-main-logo.svg"
                            alt="PTN English — Partner To Navigate"
                            className="!h-9 md:!h-10 !w-auto"
                        />
                    </div>
                    <p className="font-body font-normal text-sm md:text-base mb-4 md:mb-6 leading-relaxed" style={{ fontSize: 'var(--fs-global-footerText)', color: '#1E0A3C' }}>
                        {footerData.aboutText}
                    </p>
                    <div className="flex space-x-3">
                        <a href={contactData.facebook || "#"} target="_blank" rel="noopener noreferrer" className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-primary hover:text-white transition-all hover:scale-110">
                            <Facebook size={12} className="md:w-3.5 md:h-3.5" />
                        </a>
                        <a href={contactData.instagram || "#"} target="_blank" rel="noopener noreferrer" className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-primary hover:text-white transition-all hover:scale-110">
                            <Instagram size={12} className="md:w-3.5 md:h-3.5" />
                        </a>
                        <a href={contactData.youtube || "#"} target="_blank" rel="noopener noreferrer" className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-primary hover:text-white transition-all hover:scale-110">
                            <Youtube size={12} className="md:w-3.5 md:h-3.5" />
                        </a>
                        <a href={contactData.tiktok || "#"} target="_blank" rel="noopener noreferrer" className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-primary hover:text-white transition-all hover:scale-110">
                            <TikTokIcon size={12} className="md:w-3.5 md:h-3.5" />
                        </a>
                    </div>
                </div>

                <div className="hidden sm:block">
                    <h4 className="font-heading font-bold text-[13px] md:text-lg mb-3 md:mb-4 text-primary uppercase tracking-[0.2em] border-l-2 border-primary pl-3" style={{ WebkitTextStroke: '0.5px currentColor' }}>{t.footer.quickLinks}</h4>
                    <ul className="grid grid-cols-2 lg:grid-cols-1 gap-1 md:gap-2">
                        {quickLinks.map((link) => (
                            <li key={link.name}>
                                <a
                                    href={link.href}
                                    target={link.target}
                                    rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
                                    className="font-body font-normal text-[13px] md:text-base hover:text-primary transition-colors inline-block hover:translate-x-0.5 duration-200"
                                    style={{ fontSize: 'var(--fs-global-footerLinks)', color: '#1E0A3C' }}
                                >
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="font-heading font-bold text-[13px] md:text-lg mb-3 md:mb-4 text-primary uppercase tracking-[0.2em] border-l-2 border-primary pl-3" style={{ WebkitTextStroke: '0.5px currentColor' }}>{t.footer.courses}</h4>
                    <ul className="grid grid-cols-1 gap-1 md:gap-2">
                        {[
                            { name: t.courses?.pathway?.ie?.name || (language === "en" ? "IELTS Preparation (IE)" : "Luyện thi IELTS (IE)"), href: "/courses#ie" },
                            { name: t.courses?.pathway?.eft?.name || (language === "en" ? "Academic English (EfT)" : "Học thuật Thiếu niên (EfT)"), href: "/courses#eft" },
                            { name: t.courses?.pathway?.ge?.name || (language === "en" ? "General English (GE)" : "Tiếng Anh Giao tiếp (GE)"), href: "/courses#ge" }
                        ].map((course) => (
                            <li key={course.name}>
                                <a href={course.href} className="font-body font-normal text-[13px] md:text-base hover:text-primary transition-colors" style={{ color: '#1E0A3C' }}>
                                    {course.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="font-heading font-bold text-[13px] md:text-lg mb-3 md:mb-4 text-primary uppercase tracking-[0.2em] border-l-2 border-primary pl-3" style={{ WebkitTextStroke: '0.5px currentColor' }}>{t.footer.contact}</h4>
                    <div className="font-body font-normal space-y-2 text-[13px] md:text-base" style={{ color: '#1E0A3C' }}>
                        <p className="flex items-start">
                            <MapPin className="mr-2 text-primary shrink-0" size={16} />
                            {contactData.address}
                        </p>
                        <p className="flex items-center">
                            <Phone className="mr-2 text-primary shrink-0" size={16} />
                            {contactData.phone}
                        </p>
                        <p className="flex items-center">
                            <Mail className="mr-2 text-primary shrink-0" size={16} />
                            {contactData.email}
                        </p>
                    </div>
                </div>
            </div>

            {/* Google Maps Section */}
            {contactData.mapsUrl && (
                <div className="container mx-auto px-6 mb-4">
                    <div className="w-full h-32 md:h-40 rounded-xl overflow-hidden border border-slate-200">
                        <iframe
                            src={contactData.mapsUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="PTN English Location"
                        />
                    </div>
                </div>
            )}


            <div className="container mx-auto px-6 pt-8 md:pt-10 border-t border-slate-200 flex flex-col items-center gap-6 text-slate-600 text-center">
                <div className="max-w-5xl space-y-3">
                    <p className="text-[10px] md:text-xs font-bold text-slate-700">
                        {settings?.footer?.copyright || "@ Copyright 2026 PTNelc. All rights reserved."}
                    </p>
                    <div className="text-[9px] md:text-[11px] leading-relaxed flex flex-col md:flex-row flex-wrap justify-center gap-x-4 gap-y-1 text-slate-600">
                        <span>{settings?.footer?.companyName || "Công ty TNHH Giáo Dục PTNelc"}</span>
                        <span className="hidden md:inline text-slate-300">|</span>
                        <span>Giấy chứng nhận doanh nghiệp số: {settings?.footer?.taxCode || "0318773989"}</span>
                        <span className="hidden md:inline text-slate-300">|</span>
                        <span>Ngày cấp: {settings?.footer?.licenseDate || "06/12/2024"}</span>
                        <span className="hidden md:inline text-slate-300">|</span>
                        <span>Nơi cấp: {settings?.footer?.licensePlace || "SKHĐT TPHCM"}</span>
                    </div>
                    <div className="text-[9px] md:text-[11px] leading-relaxed text-slate-600 flex flex-col md:flex-row flex-wrap justify-center gap-x-4 gap-y-1">
                        <span className="font-bold text-slate-700">{settings?.footer?.centerName || "Trung tâm Ngoại Ngữ Phú Tài Năng - PTN English"}</span>
                        <span className="hidden md:inline text-slate-300">|</span>
                        <span>Quyết định thành lập số: {settings?.footer?.centerDecision || "1700/QĐ-SGDĐT ngày 19/6/2025"}</span>
                    </div>
                </div>

                <div className="flex gap-8 uppercase tracking-[0.2em] font-black text-[9px] md:text-[10px] text-slate-700">
                    <a href="#" className="hover:text-primary transition-colors">Terms</a>
                    <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                </div>
            </div>
        </footer>
    );
}
