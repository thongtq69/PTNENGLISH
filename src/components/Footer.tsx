"use client";

import { useEffect, useState } from "react";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Clock } from "lucide-react";

// TikTok icon custom SVG
const TikTokIcon = ({ size = 20 }: { size?: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12.525.01c1.306-.022 2.527.194 3.7.6a8.12 8.12 0 0 1-1.037 3.063c-1.126.311-2.28.324-3.418.331.008 3.582.022 7.164.032 10.745l.004.416c1.115 1.488.583 3.616-.837 4.757-1.42 1.141-3.66.936-4.787-.417-1.428-1.714-1.116-4.473.847-5.594 1.258-.718 2.373-.417 3.254.195.034-4.852.022-9.704.02-14.556 1.15-.013 2.298.423 3.298 1.157 1.15.845 1.574 2.115 1.63 3.447.01.21.007.41-.01.623 1.1-.17 2.2-.14 3.3.09a7.35 7.35 0 0 0-1.85-4.43c-1.44-1.58-3.48-2.31-5.6-.01V.01z" />
    </svg>
);

export default function Footer() {
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        fetch("/api/full-settings")
            .then(res => res.json())
            .then(data => setSettings(data));
    }, []);

    if (!settings) return null;

    return (
        <footer className="bg-slate-900 text-white pt-8 md:pt-12 pb-4 md:pb-6">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-10">
                <div>
                    <div className="mb-4">
                        <div className="flex flex-col w-fit">
                            <span className="text-xl font-heading font-extrabold tracking-tight uppercase">
                                <span className="text-primary">PTN</span>
                                <span className="text-white"> ENGLISH</span>
                            </span>
                            <div className="flex justify-between w-full mt-0.5 text-[#095e7c]">
                                {"PARTNER TO NAVIGATE".split("").map((char, index) => (
                                    <span key={index} className="text-[7px] md:text-[8px] font-bold uppercase leading-none tracking-[0.05em] md:tracking-[0.1em]">
                                        {char === " " ? "\u00A0" : char}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                        {settings.footer.aboutText}
                    </p>
                    <div className="flex space-x-3">
                        <a href={settings.contact.facebook} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-all hover:scale-110">
                            <Facebook size={14} />
                        </a>
                        <a href={settings.contact.instagram} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-all hover:scale-110">
                            <Instagram size={14} />
                        </a>
                        <a href={settings.contact.youtube} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-all hover:scale-110">
                            <Youtube size={14} />
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-black mb-4 text-white uppercase tracking-[0.2em] border-l-2 border-primary pl-3">Quick Links</h4>
                    <ul className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                        {["Về chúng tôi", "Khóa học", "Giáo viên", "Blog", "Thi thử", "Liên hệ"].map((link) => (
                            <li key={link}>
                                <a href={link === "Thi thử" ? "/test" : link === "Khóa học" ? "/courses" : "/"} className="text-slate-400 text-sm hover:text-primary transition-colors inline-block hover:translate-x-0.5 duration-200">
                                    {link}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-black mb-4 text-white uppercase tracking-[0.2em] border-l-2 border-primary pl-3">Khóa Học</h4>
                    <ul className="grid grid-cols-2 md:grid-cols-1 gap-2">
                        {["Academic English (EfT)", "Luyện thi IELTS", "General English (GE)", "Workshop Kỹ năng"].map((course) => (
                            <li key={course}>
                                <a href="/courses" className="text-slate-400 text-[13px] hover:text-primary transition-colors">
                                    {course}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-black mb-4 text-white uppercase tracking-[0.2em] border-l-2 border-primary pl-3">Liên Hệ</h4>
                    <div className="space-y-2.5 text-slate-400 text-sm">
                        <p className="flex items-start">
                            <MapPin className="mr-2 text-primary shrink-0" size={16} />
                            {settings.contact.address}
                        </p>
                        <p className="flex items-center">
                            <Phone className="mr-2 text-primary shrink-0" size={16} />
                            {settings.contact.phone}
                        </p>
                        <p className="flex items-center">
                            <Mail className="mr-2 text-primary shrink-0" size={16} />
                            {settings.contact.email}
                        </p>
                    </div>
                </div>
            </div>

            {/* Google Maps Section - More Compact */}
            <div className="container mx-auto px-6 mb-8">
                <div className="w-full h-48 rounded-[2rem] overflow-hidden border border-slate-800 shadow-xl opacity-80 hover:opacity-100 transition-opacity">
                    <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={settings.contact.mapsUrl}
                    ></iframe>
                </div>
            </div>

            <div className="container mx-auto px-6 pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
                <p>{settings.footer.copyright}</p>
                <div className="flex gap-6 uppercase tracking-widest font-bold">
                    <a href="#" className="hover:text-primary">Terms</a>
                    <a href="#" className="hover:text-primary">Privacy</a>
                </div>
            </div>
        </footer>
    );
}
