"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Award, ChevronLeft, ChevronRight } from "lucide-react";

export default function HallOfFame() {
    const [achievements, setAchievements] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        fetch("/api/achievements")
            .then(res => res.json())
            .then(data => setAchievements(data));

        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9
        })
    };

    const next = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % achievements.length);
    };

    const prev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + achievements.length) % achievements.length);
    };

    if (achievements.length === 0) return null;

    // Determine how many cards to show
    const itemsToShow = isMobile ? 1 : 3;
    const activeAchievements = [];
    for (let i = 0; i < itemsToShow; i++) {
        activeAchievements.push(achievements[(currentIndex + i) % achievements.length]);
    }

    return (
        <section className="py-12 md:py-24 bg-slate-950 overflow-hidden relative min-h-[700px]">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex justify-center items-center gap-3 mb-6"
                    >
                        <Trophy className="text-primary animate-pulse" size={20} />
                        <h2 className="text-primary font-heading font-black text-[10px] md:text-xs uppercase tracking-[0.5em]">Hall of Fame</h2>
                        <Star className="text-primary animate-pulse" size={20} />
                    </motion.div>

                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-6xl font-heading font-black text-white mb-8 leading-tight uppercase tracking-tight"
                    >
                        Tôn vinh <span className="text-primary">thành tích</span> rực rỡ
                    </motion.h3>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 text-sm md:text-xl font-body max-w-2xl mx-auto"
                    >
                        Hành trình chinh phục đỉnh cao ngôn ngữ của những chiến binh <strong className="text-white">PTN English</strong> tài năng.
                    </motion.p>
                </div>

                {/* Slider Container */}
                <div className="relative group px-4 md:px-12">
                    <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                        <AnimatePresence mode="popLayout" custom={direction}>
                            {activeAchievements.map((item: any, idx: number) => (
                                <motion.div
                                    key={`${item._id || idx}-${currentIndex}`}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                    className="w-full md:w-1/3 group/card relative"
                                >
                                    <div className="bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-primary/50 transition-all duration-500 shadow-2xl relative">
                                        <div className="relative aspect-square">
                                            <img
                                                src={item.url}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
                                            />
                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover/card:opacity-90 transition-opacity"></div>
                                        </div>

                                        <div className="absolute inset-x-0 bottom-0 p-8 transform transition-transform duration-500 group-hover/card:-translate-y-2">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Award size={18} className="text-primary" />
                                                <span className="text-primary font-black uppercase tracking-widest text-[10px]">{item.title}</span>
                                            </div>
                                            <h4 className="text-white font-heading font-black text-2xl md:text-3xl mb-1 tracking-tight">
                                                Band {item.score}
                                            </h4>
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">{item.student}</p>
                                        </div>

                                        {/* Corner Accent */}
                                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/20 blur-[40px] rounded-full pointer-events-none group-hover/card:bg-primary/40 transition-all"></div>
                                    </div>

                                    {/* Decorative badge */}
                                    <div className="absolute -top-3 -right-3 w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-white shadow-2xl rotate-12 group-hover/card:rotate-0 transition-all duration-500 border-2 border-slate-900 flex-col z-20">
                                        <span className="text-[10px] font-black leading-none uppercase">STAR</span>
                                        <Star size={12} fill="white" className="my-0.5" />
                                        <span className="text-[8px] font-bold leading-none uppercase">PRO</span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex md:block">
                        <button
                            onClick={prev}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 p-4 rounded-2xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:bg-primary hover:border-primary transition-all shadow-2xl z-30 group/btn"
                            aria-label="Previous"
                        >
                            <ChevronLeft size={28} className="group-hover/btn:-translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 p-4 rounded-2xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:bg-primary hover:border-primary transition-all shadow-2xl z-30 group/btn"
                            aria-label="Next"
                        >
                            <ChevronRight size={28} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-3 mt-16">
                    {achievements.map((_: any, i: number) => (
                        <button
                            key={i}
                            onClick={() => {
                                setDirection(i > currentIndex ? 1 : -1);
                                setCurrentIndex(i);
                            }}
                            className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex
                                    ? "w-10 bg-primary shadow-lg shadow-primary/40"
                                    : "w-2 bg-slate-800 hover:bg-slate-700"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
