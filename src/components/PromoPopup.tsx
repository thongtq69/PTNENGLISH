"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, MapPin, Phone, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function PromoPopup() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Show on every page load as requested ("như quảng cáo khi vừa vào trang")
        const timer = setTimeout(() => setIsOpen(true), 1200);
        return () => clearTimeout(timer);
    }, []);

    const closePopup = () => {
        setIsOpen(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto"
                        onClick={closePopup}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 1, y: 0 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1, y: 10 }}
                        className="relative w-full max-w-5xl bg-white rounded-none shadow-[0_60px_120px_-20px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col md:flex-row pointer-events-auto max-h-[90vh] border-4 border-accent"
                    >
                        {/* Image Section - Brutal Selection */}
                        <div className="md:w-5/12 relative min-h-[220px] md:min-h-full bg-accent shrink-0">
                            <img
                                src="/promo-hero.png"
                                alt="Academic Master Promotion"
                                className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] contrast-[1.1]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-accent via-accent/20 to-transparent flex flex-col justify-end p-8 md:p-12">
                                <div className="text-white relative z-10">
                                    <div className="inline-block px-3 py-1 bg-primary text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] mb-4 md:mb-6 rounded-none">
                                        Admission 2025
                                    </div>
                                    <h4 className="text-3xl md:text-6xl font-heading font-black leading-none mb-4 md:mb-6 uppercase tracking-tighter">
                                        CHIÊU SINH <br />
                                        <span className="text-white bg-primary px-2 py-0.5 md:px-3 md:py-1">THÁNG 11 & 12</span>
                                    </h4>
                                    <p className="text-[11px] md:text-sm font-body text-slate-300 max-w-[240px] md:max-w-xs leading-relaxed border-l-2 border-primary pl-4 hidden sm:block">
                                        Đồng hành cùng đội ngũ chuyên gia <span className="text-white font-bold">MA.TESOL</span> hàng đầu.
                                    </p>
                                </div>
                            </div>
                            {/* Decorative architectural line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                        </div>

                        {/* Content Section - Swiss Modern Structure */}
                        <div className="md:w-7/12 p-10 md:p-16 overflow-y-auto bg-white flex flex-col relative">
                            <button
                                onClick={closePopup}
                                className="absolute top-0 right-0 w-16 h-16 bg-accent text-white flex items-center justify-center hover:bg-primary transition-all group z-20"
                            >
                                <X size={32} className="group-hover:rotate-180 transition-transform duration-500" />
                            </button>

                            <div className="mb-12 border-b-4 border-slate-100 pb-10">
                                <h3 className="text-5xl font-heading font-black text-accent mb-4 uppercase tracking-tighter leading-none">Lịch Khai Giảng</h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-body max-w-md">
                                    Hệ thống đào tạo học thuật chuyên sâu. <br />
                                    <span className="font-bold text-primary italic">"Quality over speed, mastery over tricks."</span>
                                </p>
                            </div>

                            <div className="space-y-4 flex-grow">
                                {[
                                    { title: "LUYỆN THI IELTS", detail: "Standard (4.5) - ELITE (7.5)", schedule: "Thứ 2 - 4 - 6 | 18:30 - 20:30", icon: <Calendar size={20} /> },
                                    { title: "ENGLISH FOR TEENS", detail: "Starter – Booster (A2 - C1)", schedule: "Thứ 7 - CN | Sáng & Chiều", icon: <MessageSquare size={20} /> },
                                    { title: "GENERAL ENGLISH", detail: "Sơ cấp – Trung cấp (A1 - B2)", schedule: "Thứ 3 - 5 - 7 | 19:00 - 21:00", icon: <Clock size={20} /> },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4 md:gap-8 p-5 md:p-8 border-2 border-slate-50 hover:border-accent hover:bg-slate-50 transition-all cursor-pointer group rounded-none relative">
                                        <div className="shrink-0 w-10 h-10 md:w-14 md:h-14 bg-slate-100 flex items-center justify-center text-accent transition-all group-hover:bg-primary group-hover:text-white rounded-none">
                                            {React.cloneElement(item.icon as React.ReactElement<any>, { size: 18 })}
                                        </div>
                                        <div>
                                            <h5 className="font-heading font-black text-accent text-sm md:text-lg uppercase tracking-tight mb-1">{item.title}</h5>
                                            <p className="text-[9px] md:text-[11px] text-primary font-black uppercase mb-1 tracking-[0.2em]">{item.detail}</p>
                                            <p className="text-[10px] md:text-xs text-slate-400 font-bold font-mono">{item.schedule}</p>
                                        </div>
                                        {/* Corner accent for active item feel */}
                                        <div className="absolute top-0 right-0 w-2 h-2 bg-primary opacity-0 group-hover:opacity-100"></div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-14 flex flex-col gap-6">
                                <Link
                                    href="/contact"
                                    onClick={closePopup}
                                    className="w-full bg-accent hover:bg-primary text-white py-6 font-black uppercase tracking-[0.4em] text-xs text-center shadow-2xl transition-all active:scale-95 rounded-none"
                                >
                                    Đăng ký tư vấn ngay
                                </Link>
                                <div className="flex items-center justify-center gap-4 text-slate-300">
                                    <div className="h-px w-8 bg-slate-200"></div>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                                        Limited spots for 2025
                                    </p>
                                    <div className="h-px w-8 bg-slate-200"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
