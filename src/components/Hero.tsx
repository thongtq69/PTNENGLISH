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

    if (!settings) return <div className="h-screen bg-slate-900" />;

    const displayTitle = language === "en" ? t.home.hero.title : settings.title;
    const displaySubtitle = language === "en" ? t.home.hero.subtitle : settings.subtitle;
    const displayPrimaryText = language === "en" ? t.home.hero.primaryCTA : settings.primaryCTA.text;
    const displaySecondaryText = language === "en" ? t.home.hero.secondaryCTA : settings.secondaryCTA.text;

    return (
        <section className="relative w-full aspect-video min-h-[280px] md:h-screen md:min-h-0 overflow-hidden flex items-center justify-center bg-slate-950">
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
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-slate-900/30 via-slate-900/5 to-transparent"></div>

            {/* Content */}
            <div className="container mx-auto px-4 relative z-10 text-center">
                <div className="max-w-4xl mx-auto pt-12 md:pt-24 text-center px-4">
                    <h1 className="text-white text-xl md:text-6xl font-heading font-bold tracking-tight leading-tight md:leading-[1.1] mb-4 md:mb-8 animate-fade-in-up max-w-3xl mx-auto [text-wrap:balance]">
                        {(() => {
                            const title = displayTitle;

                            // Support manual <br /> tags
                            if (title.includes('<br />') || title.includes('<br/>')) {
                                return <div dangerouslySetInnerHTML={{ __html: title }} />;
                            }

                            if (title.includes('|')) {
                                const parts = title.split('|');
                                return (
                                    <div className="flex flex-col items-center">
                                        <span className="block mb-1 md:mb-2">{parts[0].trim()}</span>
                                        <span className="text-primary font-bold">{parts[1].trim()}</span>
                                    </div>
                                );
                            }
                            const words = title.split(' ');
                            if (words.length <= 1) return title;

                            const firstPart = words.slice(0, -2).join(' ');
                            const lastPart = words.slice(-2).join(' ');

                            return (
                                <div className="flex flex-wrap justify-center items-baseline gap-x-3 md:gap-x-4">
                                    {firstPart && <span>{firstPart}</span>}
                                    <span className="text-primary whitespace-nowrap inline-block">
                                        {lastPart}
                                    </span>
                                </div>
                            );
                        })()}
                    </h1>
                    <p className="text-white text-[10px] md:text-xl mb-4 md:mb-12 max-w-xl mx-auto leading-relaxed opacity-90 animate-fade-in-up delay-100 font-body">
                        {displaySubtitle}
                    </p>
                    <div className="flex flex-row justify-center gap-2 md:gap-6 animate-fade-in-up delay-200">
                        <Link href={settings.primaryCTA.link} className="bg-primary hover:bg-black text-white px-4 py-2.5 md:px-10 md:py-5 rounded-full font-bold text-[9px] md:text-lg transition-all transform hover:scale-105 shadow-xl shadow-primary/30 flex items-center justify-center flex-1 md:flex-none max-w-[130px] md:max-w-none uppercase">
                            {displayPrimaryText}
                        </Link>
                        <Link href={settings.secondaryCTA.link} className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md px-4 py-2.5 md:px-10 md:py-5 rounded-full font-bold text-[9px] md:text-lg transition-all flex items-center justify-center flex-1 md:flex-none max-w-[130px] md:max-w-none uppercase">
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
