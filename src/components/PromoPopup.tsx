"use client";

import { useState, useEffect } from "react";
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
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-5xl bg-white rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row pointer-events-auto max-h-[85vh] border border-slate-100"
                    >
                        {/* Image Section */}
                        <div className="md:w-1/2 relative min-h-[300px] md:min-h-full bg-slate-100">
                            <img
                                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200"
                                alt="Academic Master Promotion"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-accent/90 via-accent/20 to-transparent flex flex-col justify-end p-12">
                                <div className="text-white">
                                    <div className="inline-block px-3 py-1 rounded-full bg-primary text-[10px] font-bold uppercase tracking-[0.4em] mb-4">
                                        Admission 2025
                                    </div>
                                    <h4 className="text-3xl md:text-5xl font-heading font-black leading-tight mb-4">
                                        CHIÊU SINH <br />
                                        <span className="text-primary font-bold">Tháng 11 & 12</span>
                                    </h4>
                                    <p className="text-sm font-body text-slate-300 max-w-xs">
                                        Đồng hành cùng đội ngũ chuyên gia MA.TESOL hàng đầu tại <span className="text-primary font-bold">PTN</span> <span className="text-accent font-bold">English</span>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="md:w-1/2 p-10 md:p-16 overflow-y-auto bg-white flex flex-col">
                            <button
                                onClick={closePopup}
                                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center hover:bg-primary hover:text-white transition-all group z-10 shadow-sm border border-slate-100"
                            >
                                <X size={24} className="group-hover:rotate-90 transition-transform" />
                            </button>

                            <div className="mb-10">
                                <h3 className="text-4xl font-heading font-medium text-accent mb-4 decoration-primary decoration-4">Lịch Khai Giảng</h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-body">
                                    Lộ trình cá nhân hóa, chú trọng nền tảng học thuật vững chắc cho mục tiêu dài hạn.
                                </p>
                            </div>

                            <div className="space-y-6 flex-grow">
                                {[
                                    { title: "LUYỆN THI IELTS", detail: "Standard (4.5) - ELITE (7.5)", schedule: "Thứ 2 - 4 - 6 | 18:30 - 20:30", icon: <Calendar size={18} /> },
                                    { title: "ENGLISH FOR TEENS", detail: "Starter – Booster (A2 - C1)", schedule: "Thứ 7 - CN | Sáng & Chiều", icon: <MessageSquare size={18} /> },
                                    { title: "GENERAL ENGLISH", detail: "Sơ cấp – Trung cấp (A1 - B2)", schedule: "Thứ 3 - 5 - 7 | 19:00 - 21:00", icon: <Clock size={18} /> },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-6 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer">
                                        <div className="shrink-0 w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h5 className="font-heading font-bold text-slate-900 text-md">{item.title}</h5>
                                            <p className="text-[10px] text-primary font-bold uppercase mb-1 tracking-widest">{item.detail}</p>
                                            <p className="text-xs text-slate-500 font-body">{item.schedule}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 flex flex-col gap-4">
                                <Link
                                    href="/contact"
                                    onClick={closePopup}
                                    className="w-full bg-primary hover:bg-red-700 text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs text-center shadow-2xl shadow-red-500/30 transition-all active:scale-95"
                                >
                                    Đăng ký tư vấn ngay
                                </Link>
                                <p className="text-[10px] text-slate-400 text-center font-body">
                                    * Ưu đãi đặc biệt cho học viên đăng ký sớm trong tháng 11.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
