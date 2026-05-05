"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import ScheduleModal from "@/components/ScheduleModal";

export default function Hero({ initialData }: { initialData?: any }) {
    const { t } = useLanguage();
    const [settings, setSettings] = useState<any>(initialData || null);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);

    // Sync state with props if they change
    useEffect(() => {
        if (initialData) {
            setSettings(initialData);
        }
    }, [initialData]);

    useEffect(() => {
        if (!initialData) {
            fetch("/api/site-settings", { cache: 'no-store' })
                .then(res => res.json())
                .then(data => setSettings(data.hero));
        }
    }, [initialData]);

    if (!settings) return <div className="h-screen bg-accent" />;

    const displayTitle = t.home.hero.title;
    const displaySubtitle = t.home.hero.subtitle;
    const displayPrimaryText = t.home.hero.primaryCTA;
    const displaySecondaryText = t.home.hero.secondaryCTA;

    return (
        <section className="relative w-full bg-accent md:h-screen md:min-h-[620px] md:overflow-hidden md:flex md:items-center md:justify-center">
            {/* Mobile-only spacer so fixed header sits above the video */}
            <div className="h-16 md:hidden" aria-hidden="true" />

            {/* Video — in-flow 16:9 on mobile (full video visible, no cropping), absolute cover on desktop */}
            <div className="relative w-full aspect-video md:absolute md:inset-0 md:aspect-auto overflow-hidden bg-accent">
                <video
                    key={settings.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover md:scale-105"
                >
                    <source src={settings.videoUrl} type="video/mp4" />
                </video>
            </div>

            {/* Content — below the video on mobile, overlay-centered on desktop */}
            <div className="container mx-auto px-4 relative z-10 text-center py-8 md:py-0">
                <div className="max-w-4xl mx-auto md:pt-24 text-center px-4">
                    <h1 className="text-white text-2xl md:text-6xl font-body font-bold tracking-tight leading-tight md:leading-[1.1] mb-4 md:mb-8 animate-fade-in-up max-w-4xl mx-auto" style={{ fontSize: 'var(--fs-home-heroTitle)' }}>
                        <span dangerouslySetInnerHTML={{ __html: displayTitle }} />
                    </h1>
                    <p className="text-white text-sm md:text-xl mb-4 md:mb-12 max-w-4xl mx-auto leading-relaxed opacity-90 animate-fade-in-up delay-100 font-body whitespace-pre-line" style={{ fontSize: 'var(--fs-home-heroSubtitle)' }}>
                        {displaySubtitle}
                    </p>
                    <div className="flex flex-row justify-center gap-3 md:gap-6 animate-fade-in-up delay-200">
                        <Link href={settings.primaryCTA.link} className="bg-primary hover:bg-black text-white px-5 py-3 md:px-10 md:py-5 rounded-full font-heading font-semibold text-xs md:text-lg transition-all transform hover:scale-105 shadow-xl shadow-primary/30 flex items-center justify-center flex-1 md:flex-none max-w-[160px] md:max-w-none md:min-w-[340px] uppercase" style={{ fontSize: 'var(--fs-home-heroCTA)' }}>
                            {displayPrimaryText}
                        </Link>
                        <Link href={settings.secondaryCTA.link} className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md px-5 py-3 md:px-10 md:py-5 rounded-full font-heading font-semibold text-xs md:text-lg transition-all flex items-center justify-center flex-1 md:flex-none max-w-[160px] md:max-w-none md:min-w-[340px] uppercase" style={{ fontSize: 'var(--fs-home-heroCTA)' }}>
                            {displaySecondaryText}
                        </Link>
                    </div>
                    <div className="flex justify-center mt-3 md:mt-5 animate-fade-in-up delay-300">
                        <button
                            onClick={() => setIsScheduleOpen(true)}
                            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/15 text-white border border-white/20 backdrop-blur-md px-5 py-2.5 md:px-8 md:py-3 rounded-full font-heading font-semibold text-[11px] md:text-sm transition-all uppercase tracking-wider"
                        >
                            <Calendar size={14} className="md:w-4 md:h-4 text-primary" />
                            {t.courses.bottomCta.cta2}
                        </button>
                    </div>
                </div>
            </div>

            <ScheduleModal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} />

            {/* Scroll indicator — desktop only (doesn't fit the stacked mobile layout) */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
                <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
}
