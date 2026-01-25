"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Youtube, Phone, Mail, MessageCircle } from "lucide-react";

// TikTok icon is missing from some Lucide versions, adding a custom SVG
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

const navigation = [
    { name: "Trang chủ", href: "/" },
    { name: "Về chúng tôi", href: "/about-us" },
    { name: "Chương trình học", href: "/courses" },
    { name: "Góc học viên", href: "/student-corner" },
    { name: "Blog", href: "/blog" },
    { name: "Liên hệ", href: "/contact" },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === "/";

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isMenuOpen]);

    const isTransparent = isHome && !isScrolled && !isMenuOpen;

    return (
        <>
            {/* Top Bar */}
            <div className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 border-b border-white/10 ${isScrolled || isMenuOpen ? "hidden" : "bg-slate-900/80 backdrop-blur-md hidden md:block"}`}>
                <div className="container mx-auto px-6 h-10 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-slate-100">
                    <div className="flex items-center space-x-6">
                        <a href="tel:0902508290" className="flex items-center hover:text-white transition-colors">
                            <Phone size={12} className="mr-2 text-primary" />
                            0902 508 290
                        </a>
                        <a href="mailto:info@ptelc.edu.vn" className="flex items-center hover:text-white transition-colors">
                            <Mail size={12} className="mr-2 text-primary" />
                            info@ptelc.edu.vn
                        </a>
                    </div>
                    <div className="flex items-center space-x-5">
                        <span className="text-slate-500 mr-2">Follow us:</span>
                        <a href="#" className="hover:text-primary transition-all hover:scale-110"><Facebook size={14} /></a>
                        <a href="#" className="hover:text-primary transition-all hover:scale-110"><Instagram size={14} /></a>
                        <a href="#" className="hover:text-primary transition-all hover:scale-110"><Youtube size={14} /></a>
                        <a href="#" className="hover:text-primary transition-all hover:scale-110"><TikTokIcon size={14} /></a>
                    </div>
                </div>
            </div>

            <header className={`fixed ${isScrolled ? "top-0" : "top-0 md:top-10"} left-0 right-0 z-[70] transition-all duration-300 ${isMenuOpen ? "bg-white py-4" : isScrolled ? "bg-white/95 backdrop-blur-md shadow-md py-4" : isTransparent ? "bg-transparent py-6" : "bg-white/70 backdrop-blur-sm py-6"}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <Link href="/" className="flex flex-col group w-fit" onClick={() => setIsMenuOpen(false)}>
                        <span className="text-2xl font-heading font-extrabold tracking-tight">
                            <span className="text-primary uppercase">PTN</span>
                            <span className={`uppercase transition-colors ${isTransparent ? "text-white" : "text-[#1e293b]"} group-hover:text-primary`}> English</span>
                        </span>
                        <div className={`flex justify-between w-full mt-1 transition-colors ${isTransparent ? "text-white/70" : "text-[#095e7c]"}`}>
                            {"PARTNER TO NAVIGATE".split("").map((char, index) => (
                                <span key={index} className="text-[9px] font-bold uppercase leading-none tracking-[0.05em]">
                                    {char === " " ? "\u00A0" : char}
                                </span>
                            ))}
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`text-sm font-semibold uppercase tracking-wider transition-colors hover:text-primary ${isTransparent ? "text-white hover:text-white/70" : "text-accent"}`}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            href="/contact"
                            className="bg-primary hover:bg-red-700 text-white px-6 py-2.5 rounded-none font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-red-500/20"
                        >
                            Đăng ký ngay
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`md:hidden transition-colors ${isTransparent ? "text-white" : "text-accent"} hover:text-primary`}
                    >
                        {isMenuOpen ? (
                            <div className="p-1">
                                <span className="text-xs font-black uppercase tracking-widest text-[#1e293b] mr-2">Đóng</span>
                                <svg className="w-8 h-8 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        ) : (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[65] bg-white flex flex-col pt-32 pb-10 px-6 md:hidden"
                    >
                        <div className="flex-1 flex flex-col gap-8 text-center justify-center">
                            {navigation.map((item, idx) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`text-2xl font-heading font-black uppercase tracking-tighter ${pathname === item.href ? "text-primary text-4xl" : "text-accent opacity-60 hover:opacity-100 hover:text-primary"}`}
                                    >
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-10 pt-10 border-t border-slate-100 flex flex-col gap-6">
                            <Link
                                href="/contact"
                                onClick={() => setIsMenuOpen(false)}
                                className="w-full bg-primary py-5 text-white font-black uppercase tracking-widest text-center shadow-xl shadow-red-500/20"
                            >
                                Đăng ký tư vấn
                            </Link>

                            <div className="flex justify-center gap-8 text-slate-400">
                                <a href="#" className="hover:text-primary"><Facebook size={24} /></a>
                                <a href="#" className="hover:text-primary"><Instagram size={24} /></a>
                                <a href="#" className="hover:text-primary"><Youtube size={24} /></a>
                                <a href="#" className="hover:text-primary"><TikTokIcon size={24} /></a>
                            </div>

                            <p className="text-[10px] text-center text-slate-400 uppercase font-bold tracking-widest">
                                Partner To Navigate · PTN English
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
