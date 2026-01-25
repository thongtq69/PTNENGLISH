"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Hero() {
    const [settings, setSettings] = useState<any>(null);
    const [showFullVideo, setShowFullVideo] = useState(false);

    useEffect(() => {
        fetch("/api/site-settings")
            .then(res => res.json())
            .then(data => setSettings(data.hero));
    }, []);

    if (!settings) return <div className="h-screen bg-slate-900" />;

    return (
        <>
            <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
                {/* Video Background */}
                <video
                    key={settings.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover scale-105"
                    style={{ objectPosition: 'center 20%' }}
                >
                    <source src={settings.videoUrl} type="video/mp4" />
                </video>

                {/* Overlay */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent"></div>

                {/* Content */}
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto pt-16 md:pt-24 text-center">
                        {/* Play Full Video Button for Mobile/Desktop */}
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => setShowFullVideo(true)}
                            className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-8 hover:bg-white/20 transition-all group"
                        >
                            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play size={14} fill="white" className="ml-0.5" />
                            </span>
                            Xem Full Video
                        </motion.button>

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
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
                    <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* FULL VIDEO MODAL */}
            <AnimatePresence>
                {showFullVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center p-4 md:p-10"
                    >
                        <button
                            onClick={() => setShowFullVideo(false)}
                            className="absolute top-6 right-6 text-white/50 hover:text-white z-[110] p-2 bg-white/5 rounded-full"
                        >
                            <X size={32} />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-6xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative"
                        >
                            <video
                                src={settings.videoUrl}
                                autoPlay
                                controls
                                playsInline
                                className="w-full h-full object-contain"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
