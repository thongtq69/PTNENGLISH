"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Hero({ initialData }: { initialData?: any }) {
    const [settings, setSettings] = useState<any>(initialData || null);

    useEffect(() => {
        if (!initialData) {
            fetch("/api/site-settings", { cache: 'no-store' })
                .then(res => res.json())
                .then(data => setSettings(data.hero));
        }
    }, [initialData]);

    if (!settings) return <div className="h-screen bg-slate-900" />;

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
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent"></div>

            {/* Content */}
            <div className="container mx-auto px-4 relative z-10 text-center">
                <div className="max-w-4xl mx-auto pt-20 md:pt-24 text-center">
                    <h1 className="text-white text-sm md:text-6xl font-heading font-normal tracking-tight leading-tight md:leading-[1.05] mb-2 md:mb-8 animate-fade-in-up max-w-2xl mx-auto whitespace-pre-line text-center">
                        {settings.title}
                    </h1>
                    <p className="text-white text-[10px] md:text-xl mb-4 md:mb-12 max-w-xl mx-auto leading-relaxed opacity-90 animate-fade-in-up delay-100 font-body">
                        {settings.subtitle}
                    </p>
                    <div className="flex flex-row justify-center gap-3 md:gap-6 animate-fade-in-up delay-200">
                        <Link href={settings.primaryCTA.link} className="bg-primary hover:bg-red-700 text-white px-4 py-2 md:px-10 md:py-5 rounded-full font-bold text-[10px] md:text-lg transition-all transform hover:scale-105 shadow-xl shadow-red-500/30 flex items-center justify-center flex-1 md:flex-none max-w-[140px] md:max-w-none">
                            {settings.primaryCTA.text}
                        </Link>
                        <Link href={settings.secondaryCTA.link} className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md px-4 py-2 md:px-10 md:py-5 rounded-full font-bold text-[10px] md:text-lg transition-all flex items-center justify-center flex-1 md:flex-none max-w-[140px] md:max-w-none">
                            {settings.secondaryCTA.text}
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
