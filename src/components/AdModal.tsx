"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Calendar, MessageSquare, Clock,
    BookOpen, Check, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdItem {
    icon: string;
    text: string;
    link: string;
}

interface Advertisement {
    _id: string;
    isActive: boolean;
    leftImage: string;
    leftLabel: string;
    leftHeading: string;
    leftSubheading: string;
    rightTitle: string;
    rightSubtitle: string;
    rightSlogan: string;
    items: AdItem[];
    showOnce: boolean;
}

const ICON_MAP: Record<string, any> = {
    Calendar: Calendar,
    MessageSquare: MessageSquare,
    Clock: Clock,
    BookOpen: BookOpen,
    Check: Check
};

export default function AdModal() {
    const pathname = usePathname();
    const [ad, setAd] = useState<Advertisement | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Global session check - if any ad was closed, don't show anything
        if (sessionStorage.getItem('ptn_global_ad_dismissed')) return;

        const fetchAd = async () => {
            try {
                const res = await fetch('/api/advertisements/active');
                const data = await res.json();

                if (data && data.isActive) {
                    const sessionKey = `ptn_ad_shown_${data._id}`;
                    // Extra security check for the specific ad ID
                    if (sessionStorage.getItem(sessionKey)) return;

                    setAd(data);
                    // Show after 2 seconds
                    setTimeout(() => {
                        // Final check before opening - double safety
                        if (sessionStorage.getItem('ptn_global_ad_dismissed')) return;
                        setIsOpen(true);
                    }, 2000);
                }
            } catch (e) {
                console.error("Ad fetch error", e);
            }
        };
        fetchAd();
    }, []); // Only run ONCE on initial site load

    const closeAd = () => {
        setIsOpen(false);
        sessionStorage.setItem('ptn_global_ad_dismissed', 'true');
        if (ad?._id) {
            sessionStorage.setItem(`ptn_ad_shown_${ad._id}`, 'true');
        }
    };

    if (!ad || !pathname || pathname.startsWith('/admin')) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeAd}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-5xl bg-white rounded-none overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px] md:h-[650px] border border-white/10"
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeAd}
                            className="absolute top-0 right-0 z-50 bg-slate-900 text-white p-4 md:p-6 hover:bg-primary transition-colors active:scale-95 rounded-none"
                        >
                            <X size={24} />
                        </button>

                        {/* Left Side: Image & Branding */}
                        <div className="md:w-[45%] relative overflow-hidden group shrink-0">
                            {ad.leftImage ? (
                                <img
                                    src={ad.leftImage}
                                    alt="Promo"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-slate-900" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                                <motion.span
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-primary text-white text-[10px] font-black px-4 py-2 rounded-none w-fit mb-6 tracking-[0.3em]"
                                >
                                    {ad.leftLabel}
                                </motion.span>

                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <h2 className="text-4xl md:text-5xl font-heading font-black text-white leading-tight mb-8 uppercase">
                                        <span className="block mb-2">{ad.leftHeading.split(' ').slice(0, 2).join(' ')}</span>
                                        <span className="inline-block bg-primary px-4 py-2 text-3xl md:text-5xl rounded-none">
                                            {ad.leftHeading.split(' ').slice(2).join(' ')}
                                        </span>
                                    </h2>
                                    <p className="text-slate-300 text-sm font-medium leading-relaxed max-w-xs border-l-2 border-primary pl-4">
                                        {ad.leftSubheading}
                                    </p>
                                </motion.div>
                            </div>
                        </div>

                        {/* Right Side: Content & Features */}
                        <div className="flex-1 bg-white p-8 md:p-16 flex flex-col overflow-y-auto custom-scrollbar h-full">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mb-12 shrink-0"
                            >
                                <h3 className="text-4xl md:text-5xl font-heading font-black text-slate-900 leading-tight mb-4 tracking-tighter">
                                    {ad.rightTitle}
                                </h3>
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest leading-none mb-4">
                                    {ad.rightSubtitle}
                                </p>
                                <div className="w-20 h-1 bg-slate-100 rounded-none mb-6" />
                                <p className="text-primary font-serif italic text-lg leading-none">
                                    {ad.rightSlogan}
                                </p>
                            </motion.div>

                            <div className="space-y-4 mb-12">
                                {ad.items.map((item, i) => {
                                    const Icon = ICON_MAP[item.icon] || Check;
                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 + (i * 0.1) }}
                                        >
                                            <Link
                                                href={item.link}
                                                onClick={closeAd}
                                                className="group flex items-center justify-between p-6 bg-slate-50 hover:bg-primary rounded-none transition-all hover:scale-[1.02] border border-slate-100"
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 rounded-none bg-white shadow-sm flex items-center justify-center text-primary group-hover:text-primary transition-colors">
                                                        <Icon size={24} />
                                                    </div>
                                                    <span className="font-heading font-black text-slate-700 group-hover:text-white uppercase tracking-tight text-lg">
                                                        {item.text}
                                                    </span>
                                                </div>
                                                <ChevronRight className="text-slate-300 group-hover:text-white transition-colors" />
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="mt-auto py-12 text-center"
                            >
                                <button
                                    onClick={closeAd}
                                    className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors underline underline-offset-8"
                                >
                                    Maybe later
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                    <style jsx>{`
                        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                    `}</style>
                </div>
            )}
        </AnimatePresence>
    );
}
