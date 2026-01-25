"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Hero() {
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        fetch("/api/site-settings")
            .then(res => res.json())
            .then(data => setSettings(data.hero));
    }, []);

    if (!settings) return <div className="h-screen bg-slate-900" />;

    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Video Background */}
            <video
                key={settings.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover scale-105"
            >
                <source src={settings.videoUrl} type="video/mp4" />
            </video>

            {/* Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent"></div>

            {/* Content */}
            <div className="container mx-auto px-4 relative z-10 text-center">
                <div className="max-w-4xl mx-auto pt-16 md:pt-24 text-center">
                    <h1
                        className="text-white text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-heading font-normal tracking-tight leading-[1.1] mb-6 md:mb-10 animate-fade-in-up max-w-2xl mx-auto whitespace-pre-line text-center"
                        dangerouslySetInnerHTML={{ __html: settings.title }}
                    />
                    <p className="text-white text-sm sm:text-base md:text-xl mb-8 md:mb-14 max-w-2xl mx-auto leading-relaxed opacity-90 animate-fade-in-up delay-100 font-body px-4">
                        {settings.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-8 animate-fade-in-up delay-200">
                        <Link
                            href={settings.primaryCTA.link}
                            className="w-full sm:w-auto bg-primary hover:bg-red-700 text-white px-7 py-3.5 md:px-10 md:py-5 rounded-full font-bold text-base md:text-lg transition-all transform hover:scale-105 shadow-xl shadow-red-500/30 flex items-center justify-center"
                        >
                            {settings.primaryCTA.text}
                        </Link>
                        <Link
                            href={settings.secondaryCTA.link}
                            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md px-7 py-3.5 md:px-10 md:py-5 rounded-full font-bold text-base md:text-lg transition-all flex items-center justify-center"
                        >
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
