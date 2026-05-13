"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Calendar, MessageSquare, Clock,
    BookOpen, Check, ChevronRight, ChevronLeft, Sparkles,
    type LucideIcon
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

interface AdItem {
    icon: string;
    text: string;
    link: string;
}

interface Advertisement {
    _id: string;
    name?: string;
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
    displayOrder?: number;
}

const ICON_MAP: Record<string, LucideIcon> = {
    Calendar: Calendar,
    MessageSquare: MessageSquare,
    Clock: Clock,
    BookOpen: BookOpen,
    Check: Check
};

type ViewState = 'hidden' | 'open' | 'minimized';

const DISMISS_KEY = 'ptn_ad_dismissed';
const VIEW_STATE_KEY = 'ptn_ad_view_state';

export default function AdModal() {
    const { t } = useLanguage();
    const pathname = usePathname();
    const [ads, setAds] = useState<Advertisement[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [viewState, setViewState] = useState<ViewState>('hidden');

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await fetch('/api/advertisements/active');
                const data = await res.json();
                const list: Advertisement[] = Array.isArray(data) ? data : (data ? [data] : []);
                const valid = list.filter(a => a && a.isActive);

                if (valid.length === 0) return;

                // Fallback ordering when admin hasn't set displayOrder: prefer Summer-themed ads first.
                const isSummer = (a: Advertisement) =>
                    /summer/i.test(`${a.name ?? ''} ${a.leftHeading ?? ''} ${a.leftLabel ?? ''} ${a.rightTitle ?? ''}`);
                valid.sort((a, b) => {
                    const orderDiff = (b.displayOrder ?? 0) - (a.displayOrder ?? 0);
                    if (orderDiff !== 0) return orderDiff;
                    return Number(isSummer(b)) - Number(isSummer(a));
                });

                setAds(valid);

                // Always keep ads loaded for external triggers (UniPrep card etc.).
                // Only auto-open / restore minimized view if user hasn't dismissed.
                if (sessionStorage.getItem(DISMISS_KEY)) return;

                const saved = sessionStorage.getItem(VIEW_STATE_KEY);
                if (saved === 'minimized') {
                    setViewState('minimized');
                } else {
                    setTimeout(() => {
                        if (sessionStorage.getItem(DISMISS_KEY)) return;
                        setViewState('open');
                    }, 2000);
                }
            } catch (e) {
                console.error('Ad fetch error', e);
            }
        };
        fetchAds();
    }, []);

    // Listen for external requests to re-open a specific ad by name (e.g. UniPrep card on home page).
    useEffect(() => {
        const handler = (e: Event) => {
            const detail = ((e as CustomEvent).detail || '').toString().toLowerCase().trim();
            if (!detail || ads.length === 0) return;
            const idx = ads.findIndex(a =>
                (a.name || '').toLowerCase().includes(detail) ||
                (a.leftHeading || '').toLowerCase().includes(detail) ||
                (a.rightTitle || '').toLowerCase().includes(detail)
            );
            if (idx >= 0) {
                setCurrentIdx(idx);
                setViewState('open');
                sessionStorage.removeItem(DISMISS_KEY);
                sessionStorage.setItem(VIEW_STATE_KEY, 'open');
            }
        };
        window.addEventListener('open-ad-by-name', handler);
        return () => window.removeEventListener('open-ad-by-name', handler);
    }, [ads]);

    const minimize = () => {
        setViewState('minimized');
        sessionStorage.setItem(VIEW_STATE_KEY, 'minimized');
    };

    const reopen = () => {
        setViewState('open');
        sessionStorage.setItem(VIEW_STATE_KEY, 'open');
    };

    const dismiss = () => {
        setViewState('hidden');
        sessionStorage.setItem(DISMISS_KEY, 'true');
        sessionStorage.removeItem(VIEW_STATE_KEY);
    };

    if (ads.length === 0 || !pathname || pathname.startsWith('/admin') || pathname.startsWith('/test')) return null;

    const ad = ads[currentIdx];
    const total = ads.length;
    const next = () => setCurrentIdx(i => (i + 1) % total);
    const prev = () => setCurrentIdx(i => (i - 1 + total) % total);

    // Close behavior: advance to next ad if more remain, otherwise minimize.
    const closeOrAdvance = () => {
        if (currentIdx < total - 1) {
            setCurrentIdx(currentIdx + 1);
        } else {
            minimize();
        }
    };

    const openAt = (idx: number) => {
        setCurrentIdx(idx);
        reopen();
    };

    // Up to 2 minimized banners stacked side-by-side at bottom-left. Order honors displayOrder + Summer-priority sort.
    const minimizedAds = ads.slice(0, 2);

    return (
        <>
            {/* Minimized floating widgets — both anchored to the LEFT, side-by-side */}
            <AnimatePresence>
                {viewState === 'minimized' && minimizedAds.length > 0 && (
                    <motion.div
                        key="left-stack"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        className="fixed bottom-4 md:bottom-6 left-3 md:left-6 z-[998] flex items-end gap-3 md:gap-4"
                    >
                        <button
                            onClick={dismiss}
                            aria-label="Dismiss"
                            className="absolute -top-3 -right-3 z-30 w-8 h-8 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-red-500 hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>
                        {minimizedAds.map((adItem, idx) => (
                            <motion.button
                                key={adItem._id || idx}
                                initial={{ opacity: 0, scale: 0.5, y: 40 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.5, y: 40 }}
                                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: idx * 0.08 }}
                                onClick={() => openAt(idx)}
                                aria-label={t.adModal.viewPromo}
                                className="group relative w-36 md:w-48 aspect-[9/16] rounded-3xl bg-accent shadow-2xl shadow-primary/50 overflow-hidden hover:scale-[1.04] transition-transform active:scale-95 ring-4 ring-white/60 hover:ring-primary/60"
                            >
                                {adItem.leftImage ? (
                                    <img src={adItem.leftImage} alt={adItem.leftLabel || t.adModal.promoLabel} className="absolute inset-0 w-full h-full object-cover" />
                                ) : (
                                    <Sparkles size={48} className="absolute inset-0 m-auto text-white" />
                                )}
                                <div className="absolute top-2 left-2 z-10 bg-primary text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 md:px-2.5 md:py-1 rounded-full shadow-lg animate-pulse">
                                    {t.adModal.promoLabel}
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-accent via-accent/80 to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 p-2.5 flex flex-col items-center">
                                    <span className="text-white text-[11px] md:text-xs font-black uppercase tracking-wide leading-tight text-center line-clamp-2 mb-0.5">
                                        {adItem.name || adItem.leftHeading}
                                    </span>
                                    <span className="text-white/80 text-[8px] md:text-[9px] font-bold uppercase tracking-widest group-hover:text-primary transition-colors">
                                        {t.adModal.viewPromo} →
                                    </span>
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Full modal */}
            <AnimatePresence>
                {viewState === 'open' && (
                    <div className="fixed inset-0 z-[999] flex items-end justify-center md:items-center p-0 md:p-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeOrAdvance}
                            className="absolute inset-0 bg-accent/80 backdrop-blur-sm"
                        />

                        <motion.div
                            key={ad._id}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full sm:w-[90%] max-w-5xl bg-white rounded-[2rem] md:rounded-none overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:h-[min(90vh,720px)] border border-slate-200 md:border-white/10"
                        >
                            {/* Close/Advance Button */}
                            <button
                                onClick={closeOrAdvance}
                                aria-label={currentIdx < total - 1 ? t.adModal.nextAd : t.adModal.minimize}
                                className="absolute top-4 right-4 md:top-0 md:right-0 z-50 bg-accent/5 md:bg-accent text-accent md:text-white p-3 md:p-6 hover:bg-primary hover:text-white transition-colors active:scale-95 rounded-full md:rounded-none"
                            >
                                <X size={20} className="md:w-6 md:h-6" />
                            </button>

                            {/* Ad counter */}
                            {total > 1 && (
                                <div className="absolute top-4 left-4 md:top-6 md:left-6 z-50 bg-black/60 text-white text-[10px] font-black px-3 py-1.5 rounded-full tracking-widest">
                                    {currentIdx + 1} / {total}
                                </div>
                            )}

                            {/* Left Side: 9:16 poster — displayed in full, never cropped */}
                            <div className="relative bg-accent shrink-0 mx-auto my-4 md:my-0 md:mx-0 aspect-[9/16] w-[min(55vw,260px)] md:w-auto md:h-full overflow-hidden">
                                {ad.leftImage ? (
                                    <img
                                        src={ad.leftImage}
                                        alt={ad.leftLabel || ad.leftHeading || t.adModal.promoLabel}
                                        className="absolute inset-0 w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                                        <div className="text-white">
                                            {ad.leftLabel && (
                                                <span className="inline-block bg-primary text-white text-[10px] font-black px-3 py-1.5 mb-4 tracking-[0.3em]">
                                                    {ad.leftLabel}
                                                </span>
                                            )}
                                            {ad.leftHeading && (
                                                <h2 className="text-2xl md:text-4xl font-heading font-black leading-tight mb-4 uppercase">
                                                    {ad.leftHeading}
                                                </h2>
                                            )}
                                            {ad.leftSubheading && (
                                                <p className="text-slate-300 text-xs md:text-sm font-medium leading-relaxed max-w-xs mx-auto border-l-2 border-primary pl-4 text-left">
                                                    {ad.leftSubheading}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Side: Content & Features */}
                            <div className="flex-1 bg-white p-5 md:p-16 flex flex-col overflow-y-auto custom-scrollbar h-full text-left">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="mb-6 md:mb-12 shrink-0"
                                >
                                    <h3 className="text-2xl md:text-5xl font-heading font-black text-slate-900 leading-tight mb-2 md:mb-4 tracking-tighter">
                                        {ad.rightTitle}
                                    </h3>
                                    <p className="text-slate-400 text-[10px] md:text-sm font-bold uppercase tracking-widest leading-none mb-4">
                                        {ad.rightSubtitle}
                                    </p>
                                    <div className="w-12 md:w-20 h-1 bg-slate-100 rounded-none mb-4 md:mb-6" />
                                    <p className="text-primary font-serif italic text-sm md:text-lg leading-none">
                                        {ad.rightSlogan}
                                    </p>
                                </motion.div>

                                <div className="space-y-3 md:space-y-4 mb-6 md:mb-12">
                                    {ad.items.map((item, i) => {
                                        const Icon = ICON_MAP[item.icon] || Check;
                                        let finalLink = item.link;
                                        const text = item.text.toLowerCase();

                                        if (finalLink === '#' || finalLink === '') {
                                            if (text.includes('đăng ký thi') || text.includes('exam')) finalLink = '/contact?course=exam#registration-form';
                                            else if (text.includes('ielts') || text.includes('pte')) finalLink = '/contact?course=ielts#registration-form';
                                            else if (text.includes('teens') || text.includes('thiếu niên') || text.includes('eft')) finalLink = '/contact?course=eft#registration-form';
                                            else if (text.includes('general') || text.includes('giao tiếp') || text.includes('tổng quát')) finalLink = '/contact?course=ge#registration-form';
                                            else finalLink = '/contact#registration-form';
                                        } else if (finalLink.startsWith('/courses') || finalLink === 'https://ptelc.edu.vn/courses' || finalLink.startsWith('https://ptelc.edu.vn/courses')) {
                                            // Text is the source of truth — even if DB has wrong hash, force correct tab.
                                            if (text.includes('ielts')) finalLink = '/courses#ie';
                                            else if (text.includes('teens') || text.includes('thiếu niên') || text.includes('eft')) finalLink = '/courses#eft';
                                            else if (text.includes('general') || text.includes('giao tiếp')) finalLink = '/courses#ge';
                                        }

                                        return (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.6 + (i * 0.1) }}
                                            >
                                                <Link
                                                    href={finalLink}
                                                    onClick={minimize}
                                                    className="group flex items-center justify-between p-4 md:p-6 bg-slate-50 hover:bg-primary rounded-xl md:rounded-none transition-all hover:scale-[1.02] border border-slate-100"
                                                >
                                                    <div className="flex items-center gap-4 md:gap-6">
                                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-none bg-white shadow-sm flex items-center justify-center text-primary group-hover:text-primary transition-colors">
                                                            <Icon size={20} className="md:w-6 md:h-6" />
                                                        </div>
                                                        <span className="font-heading font-black text-slate-700 group-hover:text-white uppercase tracking-tight text-sm md:text-lg">
                                                            {item.text}
                                                        </span>
                                                    </div>
                                                    <ChevronRight size={18} className="text-slate-300 group-hover:text-white transition-colors" />
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    className="py-4 md:py-12 text-center"
                                >
                                    <button
                                        onClick={closeOrAdvance}
                                        className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors underline underline-offset-8"
                                    >
                                        {t.adModal.maybeLater}
                                    </button>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Carousel navigation */}
                        {total > 1 && (
                            <>
                                <button
                                    onClick={prev}
                                    aria-label={t.adModal.prevAd}
                                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-50 bg-white/95 hover:bg-primary hover:text-white text-accent p-2.5 md:p-3 rounded-full shadow-xl transition-all active:scale-95"
                                >
                                    <ChevronLeft size={22} />
                                </button>
                                <button
                                    onClick={next}
                                    aria-label={t.adModal.nextAd}
                                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-50 bg-white/95 hover:bg-primary hover:text-white text-accent p-2.5 md:p-3 rounded-full shadow-xl transition-all active:scale-95"
                                >
                                    <ChevronRight size={22} />
                                </button>
                                <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-black/40 backdrop-blur px-4 py-2 rounded-full">
                                    {ads.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentIdx(i)}
                                            aria-label={`${t.adModal.adIndex} ${i + 1}`}
                                            className={`h-2 rounded-full transition-all ${i === currentIdx ? 'w-8 bg-primary' : 'w-2 bg-white/70 hover:bg-white'}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}

                        <style jsx>{`
                            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                            .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                        `}</style>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
