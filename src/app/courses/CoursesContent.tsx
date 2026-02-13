"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Target, ArrowRight, GraduationCap, Clock,
    BookOpen, Layers, CheckCircle2, ChevronRight, X,
    Maximize2, Zap, Trophy, MessageCircle, Calendar,
    UserCheck, FileText, Globe
} from "lucide-react";
import Link from "next/link";

// Helper function to merge data with fallback
const mergeWithFallback = (dbData: any, fallback: any): any => {
    if (!dbData) return fallback;
    if (typeof fallback !== 'object' || fallback === null) return dbData ?? fallback;
    if (Array.isArray(fallback)) return dbData ?? fallback;

    const result: any = { ...fallback };
    for (const key of Object.keys(fallback)) {
        if (dbData[key] !== undefined) {
            result[key] = mergeWithFallback(dbData[key], fallback[key]);
        }
    }
    return result;
};

export default function CoursesContent({ pageData: initialPageData }: { pageData: any }) {
    const { t, language } = useLanguage();
    const [activeTab, setActiveTab] = useState<"ie" | "eft" | "ge">("ie");
    const [selectedLevel, setSelectedLevel] = useState<any>(null);
    const [dbData, setDbData] = useState<any>(initialPageData?.content || null);

    // Fetch dynamic content when language changes
    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch(`/api/courses-page?lang=${language}`);
                const data = await res.json();
                if (data) setDbData(data);
            } catch (err) {
                console.error("Failed to fetch language-specific content", err);
            }
        };
        fetchContent();
    }, [language]);

    // Get content from database or fallback to translations
    const content = useMemo(() => {
        const translationContent = t.courses;

        if (!dbData) {
            return translationContent;
        }

        // Merge database content with translations as fallback
        return mergeWithFallback(dbData, translationContent);
    }, [dbData, t.courses]);

    // Read hash from URL and set active tab accordingly
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '').toLowerCase();
            if (hash === 'ie' || hash === 'eft' || hash === 'ge') {
                setActiveTab(hash as "ie" | "eft" | "ge");
                // Scroll to pathway section after a short delay to allow tab content to render
                setTimeout(() => {
                    const pathwaySection = document.getElementById('pathway');
                    if (pathwaySection) {
                        pathwaySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 300);
            }
        };

        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const getLevelData = (pathway: string, level: string) => {
        const levels = content.levels as any;
        return levels?.[pathway]?.[level] || {};
    };

    const PATHWAY_DATA = {
        ie: {
            id: "ie",
            name: content.pathway?.ie?.name || t.courses.pathway.ie.name,
            subtitle: content.pathway?.ie?.subtitle || t.courses.pathway.ie.subtitle,
            color: "primary",
            theme: "from-primary to-accent",
            bgLight: "bg-primary/5",
            description: content.pathway?.ie?.desc || t.courses.pathway.ie.desc,
            levels: [
                {
                    id: "ie-foundation",
                    name: "Foundation",
                    cefr: "A1 / Pre-A1",
                    exit: "Ready for IELTS",
                    ...getLevelData('ie', 'foundation')
                },
                {
                    id: "ie-starter",
                    name: "IELTS Starter",
                    cefr: "A2",
                    exit: "IELTS 4.0",
                    ...getLevelData('ie', 'starter')
                },
                {
                    id: "ie-standard",
                    name: "IELTS Standard",
                    cefr: "B1",
                    exit: "IELTS 5.0",
                    ...getLevelData('ie', 'standard')
                },
                {
                    id: "ie-booster",
                    name: "IELTS Booster",
                    cefr: "B2",
                    exit: "IELTS 6.0",
                    ...getLevelData('ie', 'booster')
                },
                {
                    id: "ie-master",
                    name: "IELTS Master",
                    cefr: "C1",
                    exit: "IELTS 7.0+",
                    ...getLevelData('ie', 'master')
                },
                {
                    id: "ie-elite",
                    name: "IELTS Elite",
                    cefr: "C2",
                    exit: "IELTS 8.0+",
                    ...getLevelData('ie', 'elite')
                }
            ]
        },
        eft: {
            id: "eft",
            name: content.pathway?.eft?.name || t.courses.pathway.eft.name,
            subtitle: content.pathway?.eft?.subtitle || t.courses.pathway.eft.subtitle,
            color: "primary",
            theme: "from-primary to-secondary",
            bgLight: "bg-primary/5",
            description: content.pathway?.eft?.desc || t.courses.pathway.eft.desc,
            levels: [
                {
                    id: "eft-foundation",
                    name: "EfT Foundation",
                    cefr: "A1",
                    exit: "Ready for Teens",
                    ...getLevelData('eft', 'foundation')
                },
                {
                    id: "eft-starter",
                    name: "EfT Starter",
                    cefr: "A2",
                    exit: "Starter Pro",
                    ...getLevelData('eft', 'starter')
                },
                {
                    id: "eft-standard",
                    name: "EfT Standard",
                    cefr: "B1",
                    exit: "Academic Ready",
                    ...getLevelData('eft', 'standard')
                },
                {
                    id: "eft-booster",
                    name: "EfT Booster",
                    cefr: "B2",
                    exit: "IELTS Path",
                    ...getLevelData('eft', 'booster')
                },
                {
                    id: "eft-master",
                    name: "EfT Master",
                    cefr: "C1",
                    exit: "Fluent Scholar",
                    ...getLevelData('eft', 'master')
                },
                {
                    id: "eft-elite",
                    name: "EfT Elite",
                    cefr: "C2",
                    exit: "Elite Academic",
                    ...getLevelData('eft', 'elite')
                }
            ]
        },
        ge: {
            id: "ge",
            name: content.pathway?.ge?.name || t.courses.pathway.ge.name,
            subtitle: content.pathway?.ge?.subtitle || t.courses.pathway.ge.subtitle,
            color: "primary",
            theme: "from-accent to-primary",
            bgLight: "bg-primary/5",
            description: content.pathway?.ge?.desc || t.courses.pathway.ge.desc,
            levels: [
                {
                    id: "ge-foundation",
                    name: "GE Foundation",
                    cefr: "A1",
                    exit: "Everyday Basic",
                    ...getLevelData('ge', 'foundation')
                },
                {
                    id: "ge-starter",
                    name: "Everyday English",
                    cefr: "A2",
                    exit: "Social Basic",
                    ...getLevelData('ge', 'starter')
                },
                {
                    id: "ge-standard",
                    name: "Confident Communicator",
                    cefr: "B1",
                    exit: "Effective Speaker",
                    ...getLevelData('ge', 'standard')
                },
                {
                    id: "ge-booster",
                    name: "Fluent Transitions",
                    cefr: "B2",
                    exit: "Fluent Speaker",
                    ...getLevelData('ge', 'booster')
                },
                {
                    id: "ge-master",
                    name: "English for Real Life",
                    cefr: "C1",
                    exit: "Proficient User",
                    ...getLevelData('ge', 'master')
                },
                {
                    id: "ge-elite",
                    name: "Proficient English Skills",
                    cefr: "C2",
                    exit: "Native-like Skills",
                    ...getLevelData('ge', 'elite')
                }
            ]
        }
    };

    const COMMON_INFO = [
        {
            icon: <Clock size={24} />,
            title: content.specs?.hours?.title || t.courses.specs.hours.title,
            desc: content.specs?.hours?.desc || t.courses.specs.hours.desc
        },
        {
            icon: <Calendar size={24} />,
            title: content.specs?.schedule?.title || t.courses.specs.schedule.title,
            desc: content.specs?.schedule?.desc || t.courses.specs.schedule.desc
        },
        {
            icon: <BookOpen size={24} />,
            title: content.specs?.materials?.title || t.courses.specs.materials.title,
            desc: content.specs?.materials?.desc || t.courses.specs.materials.desc
        },
        {
            icon: <Zap size={24} />,
            title: content.specs?.transfer?.title || t.courses.specs.transfer.title,
            desc: content.specs?.transfer?.desc || t.courses.specs.transfer.desc
        }
    ];

    const SCHEDULES = [
        {
            label: content.schedules?.morning?.label || t.courses.schedules.morning.label,
            time: content.schedules?.morning?.time || t.courses.schedules.morning.time,
            duration: content.schedules?.morning?.duration || t.courses.schedules.morning.duration
        },
        {
            label: content.schedules?.evening?.label || t.courses.schedules.evening.label,
            time: content.schedules?.evening?.time || t.courses.schedules.evening.time,
            duration: content.schedules?.evening?.duration || t.courses.schedules.evening.duration
        },
        {
            label: content.schedules?.weekend?.label || t.courses.schedules.weekend.label,
            time: content.schedules?.weekend?.time || t.courses.schedules.weekend.time,
            duration: content.schedules?.weekend?.duration || t.courses.schedules.weekend.duration
        },
    ];

    const currentPathway = PATHWAY_DATA[activeTab];

    // Helper to get target audience groups
    const getTargetGroup = (key: string) => {
        const groups = content.targetAudience?.groups;
        const fallbackGroups = t.courses.targetAudience.groups as any;
        return {
            title: groups?.[key]?.title || fallbackGroups[key]?.title,
            sub: groups?.[key]?.sub || fallbackGroups[key]?.sub
        };
    };

    return (
        <main className="min-h-screen bg-slate-50">
            <Header />

            {/* HERO SECTION */}
            <section className="relative pt-24 pb-12 bg-accent overflow-hidden">
                {/* Visual Background Elements */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 -skew-x-12 translate-x-1/2 blur-3xl opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-500/10 skew-x-12 -translate-x-1/2 blur-[120px] opacity-20"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
                        >
                            <Target size={14} className="text-primary" />
                            {content.hero?.badge || t.courses.hero.badge}
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-white text-3xl md:text-8xl font-heading font-semibold mb-4 md:mb-10 leading-[1.1] [text-wrap:balance] max-w-5xl mx-auto"
                        >
                            {(() => {
                                const title = content.hero?.title || t.courses.hero.title;
                                if (title.includes('<br />') || title.includes('<br/>') || title.includes('<span')) {
                                    return <div dangerouslySetInnerHTML={{ __html: title }} />;
                                }

                                if (title.includes('|')) {
                                    const parts = title.split('|');
                                    return (
                                        <div className="flex flex-col items-center">
                                            <span className="mb-2">{parts[0].trim()}</span>
                                            <span className="text-primary font-black whitespace-nowrap">{parts[1].trim()}</span>
                                        </div>
                                    );
                                }

                                const words = title.split(' ');
                                if (words.length <= 1) {
                                    return <span className="text-primary font-black">{title}</span>;
                                }

                                const firstPart = words.slice(0, -2).join(' ');
                                const lastPart = words.slice(-2).join(' ');

                                return (
                                    <div className="flex flex-wrap justify-center items-baseline gap-x-3 md:gap-x-5">
                                        {firstPart && <span>{firstPart}</span>}
                                        <span className="text-primary font-black whitespace-nowrap">
                                            {lastPart}
                                        </span>
                                    </div>
                                );
                            })()}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-400 text-xs md:text-2xl font-body leading-relaxed max-w-3xl mx-auto mb-8 md:mb-12 text-center [text-wrap:balance]"
                        >
                            {content.hero?.subtitle || t.courses.hero.subtitle}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap justify-center gap-4"
                        >
                            <Link href="/test" className="bg-primary hover:bg-black text-white px-10 py-5 rounded-full font-bold shadow-2xl shadow-primary/20 transition-all transform hover:-translate-y-1 uppercase">
                                {content.hero?.cta1 || t.courses.hero.cta1}
                            </Link>
                            <a href="#pathway" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-md px-10 py-5 rounded-full font-bold transition-all uppercase">
                                {content.hero?.cta2 || t.courses.hero.cta2}
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* SHARED INFO & TARGET AUDIENCE */}
            <section className="py-8 md:py-16 bg-white border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
                        {/* Target Audience */}
                        <div className="space-y-10">
                            <div>
                                <h2 className="text-accent font-heading text-xl md:text-4xl font-black mb-4 md:mb-6 text-center lg:text-left">
                                    {content.targetAudience?.title || t.courses.targetAudience.title}
                                </h2>
                                <p className="text-slate-500 text-[10px] md:text-lg max-w-lg mb-6 md:mb-8 text-center lg:text-left mx-auto lg:mx-0">
                                    {content.targetAudience?.subtitle || t.courses.targetAudience.subtitle}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                {['students', 'teens', 'graduates', 'communicators'].map((key, i) => {
                                    const group = getTargetGroup(key);
                                    return (
                                        <div key={i} className="p-3 md:p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all group">
                                            <CheckCircle2 size={18} className="text-primary mb-2 md:mb-4 opacity-50 group-hover:opacity-100 md:w-6 md:h-6" />
                                            <h4 className="font-heading font-black text-slate-800 text-[10px] md:text-base mb-1">{group.title}</h4>
                                            <p className="text-[8px] md:text-xs text-slate-400 font-bold uppercase tracking-wider">{group.sub}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Common Specs Table-like cards */}
                        <div className="bg-accent rounded-[3rem] p-8 md:p-10 relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                            <h3 className="text-white font-heading text-2xl font-bold mb-10 flex items-center gap-4">
                                <Zap className="text-primary" /> {content.specs?.title || t.courses.specs.title}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {COMMON_INFO.map((info, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                                            {info.icon}
                                        </div>
                                        <div>
                                            <h5 className="text-white font-bold mb-1">{info.title}</h5>
                                            <p className="text-slate-400 text-sm">{info.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 pt-10 border-t border-white/5 space-y-4">
                                {SCHEDULES.map((s, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400 font-bold">{s.label}</span>
                                        <span className="text-white opacity-80">{s.time}</span>
                                        <span className="text-primary font-black text-[10px] uppercase tracking-widest">{s.duration}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PATHWAY SECTION */}
            <section id="pathway" className="py-12 relative overflow-hidden scroll-mt-24 md:scroll-mt-32">
                <div className="container mx-auto px-6">
                    {/* Tab Navigation */}
                    <div className="flex flex-col items-center mb-12">
                        <h2 className="text-accent font-heading text-3xl md:text-5xl font-black mb-8 text-center">
                            {content.pathway?.title || t.courses.pathway.title}
                        </h2>
                        <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-wrap justify-center gap-2">
                            {(Object.values(PATHWAY_DATA)).map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`
                                        px-8 md:px-12 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all
                                        ${activeTab === tab.id
                                            ? `bg-accent text-white shadow-xl`
                                            : `text-slate-400 hover:bg-slate-50`}
                                    `}
                                >
                                    {tab.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active Pathway Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="relative"
                        >
                            {/* Short Summary */}
                            <div className="mb-16 text-center max-w-3xl mx-auto">
                                <p className={`text-sm font-black uppercase tracking-[0.4em] mb-4 text-primary`}>
                                    {currentPathway.subtitle}
                                </p>
                                <p className="text-slate-500 text-lg leading-relaxed">
                                    {currentPathway.description}
                                </p>
                            </div>

                            {/* Pathway Map - Proportional Grid that scales without scrolling */}
                            <div className="relative pb-8 pt-4 md:pt-10">
                                <div className="relative w-full">
                                    {/* The Connection Line - Precise horizontal placement */}
                                    <div className="absolute bg-slate-200 rounded-full h-1.5 md:h-2 top-[134px] left-[8%] right-[8%] hidden md:block">
                                        <motion.div
                                            className="absolute bg-accent rounded-full w-full h-full"
                                            initial={{ scaleX: 0 }}
                                            whileInView={{ scaleX: 1 }}
                                            transition={{ duration: 1.5 }}
                                            style={{ originX: 0 }}
                                        />
                                    </div>

                                    {/* Pathway Elements Container */}
                                    <div className="grid grid-cols-1 md:flex md:flex-row md:justify-between gap-6 md:gap-4 relative px-4">
                                        {currentPathway.levels.map((level, i) => (
                                            <motion.div
                                                key={level.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: i * 0.05 }}
                                                className="flex flex-col items-center group cursor-pointer md:flex-1"
                                                onClick={() => setSelectedLevel(level)}
                                            >
                                                {/* Level Header - Compact & Responsive */}
                                                <div className="mb-2 md:mb-12 h-auto md:h-16 flex flex-col justify-end text-center">
                                                    <div className="text-[10px] md:text-[0.65vw] lg:text-xs font-black text-slate-400 uppercase tracking-widest mb-1">CEFR {level.cefr}</div>
                                                    <div className="text-slate-800 font-heading font-black text-sm md:text-[1vw] lg:text-lg leading-tight">
                                                        {level.name}
                                                    </div>
                                                </div>

                                                {/* Milestone Node */}
                                                <div className="relative mb-4 md:mb-10 z-10 flex items-center justify-center">
                                                    <div className={`
                                                        w-7 h-7 md:w-[4vw] md:h-[4vw] max-w-[64px] max-h-[64px] rounded-full bg-white border-[3px] md:border-[0.5vw] lg:border-8 border-slate-200 
                                                        flex items-center justify-center transition-all group-hover:border-accent group-hover:bg-accent group-hover:scale-110
                                                        shadow-md md:shadow-lg
                                                    `}>
                                                        <div className="w-1 md:w-4 h-1 md:h-4 rounded-full bg-slate-200 md:bg-slate-400 group-hover:bg-white" />
                                                    </div>
                                                    <div className="absolute -top-1 -right-1 bg-primary text-white text-[6px] md:text-[0.6vw] lg:text-[8px] font-bold px-1 rounded shadow-sm opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                        L{i + 1}
                                                    </div>
                                                </div>

                                                {/* Summary Card - Square-ish Proportional Design */}
                                                <div className="bg-white p-3 md:p-[1.5vw] rounded-2xl shadow-md lg:shadow-xl border border-slate-100 w-full hover:shadow-2xl hover:border-accent/10 transition-all text-center aspect-square md:aspect-[1/1] flex flex-col justify-between items-center group-hover:ring-2 ring-primary/5">
                                                    <div className="w-full flex flex-col items-center justify-center flex-grow py-2">
                                                        <div className="bg-slate-50 text-[9px] md:text-[0.7vw] lg:text-xs font-black text-slate-500 px-2 py-1 md:px-[0.8vw] md:py-[0.4vw] rounded-lg mb-2 md:mb-[1vw] uppercase tracking-wider shrink-0 border border-slate-100">
                                                            {level.exit}
                                                        </div>
                                                        <p className="text-[12px] md:text-[0.85vw] lg:text-base leading-relaxed text-slate-500 font-medium group-hover:text-slate-800 transition-colors line-clamp-3 md:line-clamp-4">
                                                            {level.target}
                                                        </p>
                                                    </div>
                                                    <div className="text-accent flex items-center justify-center gap-1 text-[8px] md:text-[0.65vw] lg:text-xs font-bold uppercase md:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                        {content.levelModal?.badge || t.courses.levelModal.badge} <ArrowRight size={12} className="w-2 h-2 md:w-[0.8vw] md:h-[0.8vw]" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            {/* PLACEMENT TEST - THE DIFFERENCE */}
            <section className="py-12 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="bg-white rounded-[4rem] p-8 md:p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1 space-y-8">
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
                                <Trophy size={16} /> {content.placement?.badge || t.courses.placement.badge}
                            </div>
                            <h2 className="text-xl md:text-6xl font-heading font-black text-accent leading-tight text-center lg:text-left">
                                {(content.placement?.title || t.courses.placement.title).split(' ').slice(0, 4).join(' ')} <br /> <span className="text-primary">{(content.placement?.title || t.courses.placement.title).split(' ').slice(4).join(' ')}</span>
                            </h2>
                            <p className="text-slate-500 text-[10px] md:text-lg leading-relaxed text-center lg:text-left mx-auto lg:mx-0">
                                {content.placement?.desc || t.courses.placement.desc}
                            </p>

                            <div className="grid grid-cols-2 gap-4 md:gap-6">
                                <div className="space-y-3 md:space-y-4">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent text-white flex items-center justify-center font-black text-xs md:text-base">1</div>
                                    <h4 className="font-heading font-black text-slate-800 text-xs md:text-base">
                                        {content.placement?.step1?.title || t.courses.placement.step1.title}
                                    </h4>
                                    <p className="text-[10px] md:text-sm text-slate-400 leading-tight">
                                        {content.placement?.step1?.desc || t.courses.placement.step1.desc}
                                    </p>
                                </div>
                                <div className="space-y-3 md:space-y-4">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary text-white flex items-center justify-center font-black text-xs md:text-base">2</div>
                                    <h4 className="font-heading font-black text-slate-800 text-xs md:text-base">
                                        {content.placement?.step2?.title || t.courses.placement.step2.title}
                                    </h4>
                                    <p className="text-[10px] md:text-sm text-slate-400 leading-tight">
                                        {content.placement?.step2?.desc || t.courses.placement.step2.desc}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-center lg:justify-start">
                                <Link href="/test" className="w-full sm:w-auto bg-accent hover:bg-black text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-bold transition-all shadow-xl text-sm md:text-base text-center uppercase">
                                    {content.placement?.cta || t.courses.placement.cta}
                                </Link>
                            </div>
                        </div>

                        <div className="w-full md:w-80 h-[500px] bg-accent rounded-[3rem] relative overflow-hidden shrink-0 shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2670&auto=format&fit=crop"
                                className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
                                alt="IELTS Testing Environment"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-accent via-transparent to-transparent" />
                            <div className="absolute bottom-10 left-10 right-10">
                                <div className="text-white text-4xl font-black font-heading mb-2">3.5h</div>
                                <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">Standardized Proctored Test</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* LEVEL DETAILS MODAL */}
            <AnimatePresence>
                {selectedLevel && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-accent/80 backdrop-blur-md p-4"
                        onClick={() => setSelectedLevel(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: "100%" }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="bg-white max-w-2xl w-full rounded-2xl md:rounded-[3rem] shadow-2xl relative overflow-hidden my-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header Grid */}
                            <div className={`p-5 md:p-10 pb-8 md:pb-20 bg-accent relative text-white border-b-4 border-primary`}>
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    {/* Handle for Mobile */}
                                    <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4 md:hidden"></div>

                                    <button
                                        onClick={() => setSelectedLevel(null)}
                                        className="absolute top-0 right-0 p-2 text-white/50 hover:text-white transition-colors"
                                    >
                                        <X size={18} className="md:w-6 md:h-6" />
                                    </button>

                                    <div className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-2 md:mb-4 opacity-70">
                                        {content.levelModal?.badge || t.courses.levelModal.badge}
                                    </div>
                                    <h3 className="text-2xl md:text-5xl font-heading font-black mb-3 md:mb-6 leading-tight">{selectedLevel.name}</h3>

                                    <div className="flex gap-2 md:gap-4 justify-center">
                                        <div className="bg-white/10 backdrop-blur-md px-2.5 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-xs font-bold border border-white/20 flex flex-col">
                                            <span className="opacity-60 text-[6px] md:text-[8px] uppercase">
                                                {content.levelModal?.cefr || t.courses.levelModal.cefr}
                                            </span>
                                            {selectedLevel.cefr}
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-md px-2.5 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-xs font-bold border border-white/20 flex flex-col">
                                            <span className="opacity-60 text-[6px] md:text-[8px] uppercase">
                                                {content.levelModal?.exit || t.courses.levelModal.exit}
                                            </span>
                                            {selectedLevel.exit}
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute bottom-0 right-5 md:right-10 translate-y-1/2 w-14 h-14 md:w-24 md:h-24 bg-white rounded-full shadow-xl flex items-center justify-center text-primary z-20 transition-all">
                                    <Trophy className="w-6 h-6 md:w-10 md:h-10" />
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-5 md:p-10 pt-10 md:pt-16 max-h-[65vh] overflow-y-auto">
                                <div className="mb-6 md:mb-10">
                                    <h5 className="text-accent font-heading font-black text-base md:text-xl mb-2 md:mb-4">
                                        {content.levelModal?.description || t.courses.levelModal.description}
                                    </h5>
                                    <p className="text-slate-500 leading-relaxed text-xs md:text-base">{selectedLevel.fullDesc}</p>
                                </div>

                                <div className="mb-6">
                                    <h5 className="text-accent font-heading font-black text-sm md:text-lg mb-2 md:mb-4 flex items-center gap-2">
                                        <Trophy size={14} className="text-primary md:w-[18px] md:h-[18px]" />
                                        {content.levelModal?.benefits || t.courses.levelModal.benefits}
                                    </h5>
                                    <div className="grid grid-cols-1 gap-2 md:gap-3">
                                        {selectedLevel.benefits?.map((b: string, i: number) => (
                                            <div key={i} className="flex gap-2 md:gap-3 items-start p-2 md:p-3 bg-slate-50 rounded-lg md:rounded-xl">
                                                <CheckCircle2 size={12} className="text-primary mt-0.5 shrink-0 md:w-4 md:h-4" />
                                                <span className="text-[10px] md:text-sm text-slate-600 font-medium">{b}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-8 md:mt-12 flex flex-col md:flex-row gap-2.5 md:gap-4">
                                    <Link href="/contact#registration-form" className="w-full md:flex-1 bg-accent text-white py-3.5 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] text-center hover:bg-black transition-all">
                                        {content.levelModal?.register || t.courses.levelModal.register}
                                    </Link>
                                    <button
                                        onClick={() => setSelectedLevel(null)}
                                        className="w-full md:w-auto px-6 py-3.5 md:py-0 border border-slate-200 rounded-xl md:rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all text-[9px] uppercase tracking-widest"
                                    >
                                        {content.levelModal?.close || t.courses.levelModal.close}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom CTA */}
            <section className="py-20 bg-accent overflow-hidden relative text-center">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(199,0,43,0.1),transparent)]"></div>
                <div className="container mx-auto px-6 relative z-10 max-w-4xl">
                    <h2 className="text-white text-3xl md:text-5xl font-heading font-semibold mb-8 leading-tight">
                        {content.bottomCta?.title || t.courses.bottomCta.title}
                    </h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed font-body">
                        {content.bottomCta?.desc || t.courses.bottomCta.desc}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link href="/contact#registration-form" className="bg-primary hover:bg-black text-white px-10 py-5 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl shadow-primary/20 uppercase">
                            {content.bottomCta?.cta1 || t.courses.bottomCta.cta1}
                        </Link>
                        <button className="bg-white/5 hover:bg-white/10 text-white border border-white/20 backdrop-blur-md px-10 py-5 rounded-full font-bold transition-all uppercase">
                            {content.bottomCta?.cta2 || t.courses.bottomCta.cta2}
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
