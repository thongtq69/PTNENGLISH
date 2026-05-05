"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface Schedule {
    title: string;
    time?: string;
    date?: string;
    imageUrl?: string;
    link?: string;
}

interface ScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ScheduleModal({ isOpen, onClose }: ScheduleModalProps) {
    const { t } = useLanguage();
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);

    useEffect(() => {
        if (!isOpen) return;
        fetch('/api/schedules')
            .then(r => r.ok ? r.json() : [])
            .then(data => setSchedules(Array.isArray(data) ? data : []))
            .catch(() => setSchedules([]));
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-accent/60 backdrop-blur-md"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-4xl bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col items-center"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-10 h-10 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition-colors z-[120]"
                        >
                            <X size={20} className="text-white" />
                        </button>

                        <div className="w-full relative aspect-[4/3] md:aspect-video bg-slate-100 flex items-center justify-center overflow-hidden">
                            {schedules.length > 0 ? (
                                <>
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentIdx}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="absolute inset-0"
                                        >
                                            <img
                                                src={schedules[currentIdx].imageUrl || "https://images.unsplash.com/photo-1506784919141-935049938096?q=80&w=2000&auto=format&fit=crop"}
                                                alt={schedules[currentIdx].title}
                                                className="w-full h-full object-contain"
                                            />
                                        </motion.div>
                                    </AnimatePresence>

                                    {schedules.length > 1 && (
                                        <>
                                            <button
                                                onClick={() => setCurrentIdx((prev) => (prev - 1 + schedules.length) % schedules.length)}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white/40 text-black rounded-full flex items-center justify-center transition-all z-20"
                                            >
                                                <ChevronRight className="rotate-180" size={24} />
                                            </button>
                                            <button
                                                onClick={() => setCurrentIdx((prev) => (prev + 1) % schedules.length)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white/40 text-black rounded-full flex items-center justify-center transition-all z-20"
                                            >
                                                <ChevronRight size={24} />
                                            </button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="text-slate-400 font-bold flex flex-col items-center gap-4">
                                    <Calendar size={48} className="opacity-20" />
                                    <p>{t.coursesPage.noSchedules}</p>
                                </div>
                            )}
                        </div>

                        {schedules.length > 0 && (
                            <div className="p-6 md:p-8 w-full bg-white flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="text-center md:text-left">
                                    <h4 className="text-2xl font-heading font-black text-accent mb-1">
                                        {schedules[currentIdx].title}
                                    </h4>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-500 font-bold">
                                        <span className="flex items-center gap-1.5"><Clock size={16} className="text-primary" /> {schedules[currentIdx].time}</span>
                                        <span className="flex items-center gap-1.5"><Calendar size={16} className="text-primary" /> {schedules[currentIdx].date}</span>
                                    </div>
                                </div>
                                <Link
                                    href={schedules[currentIdx].link || "/contact#registration-form"}
                                    className="w-full md:w-auto bg-primary hover:bg-black text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-sm text-center transition-all shadow-xl shadow-primary/20"
                                    onClick={onClose}
                                >
                                    {t.nav.register}
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
