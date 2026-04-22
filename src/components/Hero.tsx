"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero({ initialData }: { initialData?: any }) {
    const { t, language } = useLanguage();
    const [settings, setSettings] = useState<any>(initialData || null);

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

    // Use DB value only if it contains HTML formatting from RichTitleEditor
    // Otherwise fallback to translations.ts which has the correct formatting
    const hasHtmlFormatting = (text: string | undefined) =>
        text && (text.includes('<span') || text.includes('<br'));

    const displayTitle = language === "en"
        ? (hasHtmlFormatting(settings.titleEn) ? settings.titleEn : t.home.hero.title)
        : (hasHtmlFormatting(settings.title) ? settings.title : t.home.hero.title);

    const displaySubtitle = language === "en"
        ? (settings.subtitleEn || t.home.hero.subtitle)
        : (settings.subtitle || t.home.hero.subtitle);
    const displayPrimaryText = language === "en" ? t.home.hero.primaryCTA : settings.primaryCTA.text;
    const displaySecondaryText = language === "en" ? t.home.hero.secondaryCTA : settings.secondaryCTA.text;

    return (
        <section className="relative w-full h-[85svh] min-h-[560px] md:h-screen md:min-h-0 overflow-hidden flex items-center justify-center bg-accent">
            {/* Video Background */}
            <video
                key={settings.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover md:scale-105"
            >
                <source src={settings.videoUrl} type="video/mp4" />
            </video>

            {/* Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-accent/30 via-accent/5 to-transparent"></div>

            {/* Content */}
            <div className="container mx-auto px-4 relative z-10 text-center">
                <div className="max-w-4xl mx-auto pt-12 md:pt-24 text-center px-4">
                    <h1 className="text-white text-2xl md:text-6xl font-heading font-bold tracking-tight leading-tight md:leading-[1.1] mb-4 md:mb-8 animate-fade-in-up max-w-4xl mx-auto" style={{ fontSize: 'var(--fs-home-heroTitle)' }}>
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
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
}
