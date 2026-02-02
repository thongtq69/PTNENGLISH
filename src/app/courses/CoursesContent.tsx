"use client";

import { useState, useEffect } from "react";
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

export default function CoursesContent({ pageData }: { pageData: any }) {
    const { t, language } = useLanguage();
    const [activeTab, setActiveTab] = useState<"ie" | "eft" | "ge">("ie");
    const [selectedLevel, setSelectedLevel] = useState<any>(null);

    // Read hash from URL and set active tab accordingly
    useEffect(() => {
        const hash = window.location.hash.replace('#', '').toLowerCase();
        if (hash === 'ie' || hash === 'eft' || hash === 'ge') {
            setActiveTab(hash as "ie" | "eft" | "ge");
            // Scroll to pathway section after a short delay
            setTimeout(() => {
                const pathwaySection = document.getElementById('pathway');
                if (pathwaySection) {
                    pathwaySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
        }
    }, []);

    const getLevelData = (pathway: string, level: string) => {
        const levels = t.courses.levels as any;
        return levels?.[pathway]?.[level] || {};
    };

    const PATHWAY_DATA = {
        ie: {
            id: "ie",
            name: t.courses.pathway.ie.name,
            subtitle: t.courses.pathway.ie.subtitle,
            color: "primary",
            theme: "from-primary to-accent",
            bgLight: "bg-primary/5",
            description: t.courses.pathway.ie.desc,
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
            name: t.courses.pathway.eft.name,
            subtitle: t.courses.pathway.eft.subtitle,
            color: "primary",
            theme: "from-primary to-secondary",
            bgLight: "bg-primary/5",
            description: t.courses.pathway.eft.desc,
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
            name: t.courses.pathway.ge.name,
            subtitle: t.courses.pathway.ge.subtitle,
            color: "primary",
            theme: "from-accent to-primary",
            bgLight: "bg-primary/5",
            description: t.courses.pathway.ge.desc,
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
            title: t.courses.specs.hours.title,
            desc: t.courses.specs.hours.desc
        },
        {
            icon: <Calendar size={24} />,
            title: t.courses.specs.schedule.title,
            desc: t.courses.specs.schedule.desc
        },
        {
            icon: <BookOpen size={24} />,
            title: t.courses.specs.materials.title,
            desc: t.courses.specs.materials.desc
        },
        {
            icon: <Zap size={24} />,
            title: t.courses.specs.transfer.title,
            desc: t.courses.specs.transfer.desc
        }
    ];

    const SCHEDULES = [
        { label: t.courses.schedules.morning.label, time: t.courses.schedules.morning.time, duration: t.courses.schedules.morning.duration },
        { label: t.courses.schedules.evening.label, time: t.courses.schedules.evening.time, duration: t.courses.schedules.evening.duration },
        { label: t.courses.schedules.weekend.label, time: t.courses.schedules.weekend.time, duration: t.courses.schedules.weekend.duration },
    ];

    const currentPathway = PATHWAY_DATA[activeTab];

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
                            {t.courses.hero.badge}
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-white text-3xl md:text-8xl font-heading font-semibold mb-4 md:mb-10 leading-[1.1]"
                        >
                            {t.courses.hero.title.split(' ').slice(0, 2).join(' ')} <br />
                            <span className="text-primary font-black">{t.courses.hero.title.split(' ').slice(2).join(' ')}</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-400 text-xs md:text-2xl font-body leading-relaxed max-w-2xl mb-8 md:mb-12"
                        >
                            {t.courses.hero.subtitle}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap justify-center gap-4"
                        >
                            <Link href="/test" className="bg-primary hover:bg-black text-white px-10 py-5 rounded-full font-bold shadow-2xl shadow-primary/20 transition-all transform hover:-translate-y-1">
                                {t.courses.hero.cta1}
                            </Link>
                            <a href="#pathway" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-md px-10 py-5 rounded-full font-bold transition-all">
                                {t.courses.hero.cta2}
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
                                <h2 className="text-accent font-heading text-xl md:text-4xl font-black mb-4 md:mb-6 text-center lg:text-left">{t.courses.targetAudience.title}</h2>
                                <p className="text-slate-500 text-[10px] md:text-lg max-w-lg mb-6 md:mb-8 text-center lg:text-left mx-auto lg:mx-0">{t.courses.targetAudience.subtitle}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                {[
                                    { text: t.courses.targetAudience.groups.students.title, sub: t.courses.targetAudience.groups.students.sub },
                                    { text: t.courses.targetAudience.groups.teens.title, sub: t.courses.targetAudience.groups.teens.sub },
                                    { text: t.courses.targetAudience.groups.graduates.title, sub: t.courses.targetAudience.groups.graduates.sub },
                                    { text: t.courses.targetAudience.groups.communicators.title, sub: t.courses.targetAudience.groups.communicators.sub }
                                ].map((item, i) => (
                                    <div key={i} className="p-3 md:p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all group">
                                        <CheckCircle2 size={18} className="text-primary mb-2 md:mb-4 opacity-50 group-hover:opacity-100 md:w-6 md:h-6" />
                                        <h4 className="font-heading font-black text-slate-800 text-[10px] md:text-base mb-1">{item.text}</h4>
                                        <p className="text-[8px] md:text-xs text-slate-400 font-bold uppercase tracking-wider">{item.sub}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Common Specs Table-like cards */}
                        <div className="bg-accent rounded-[3rem] p-8 md:p-10 relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                            <h3 className="text-white font-heading text-2xl font-bold mb-10 flex items-center gap-4">
                                <Zap className="text-primary" /> {t.courses.specs.title}
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
            <section id="pathway" className="py-12 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    {/* Tab Navigation */}
                    <div className="flex flex-col items-center mb-12">
                        <h2 className="text-accent font-heading text-3xl md:text-5xl font-black mb-8 text-center">{t.courses.pathway.title}</h2>
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

                            {/* Pathway Map - Vertical on Mobile, Horizontal on Desktop */}
                            <div className="relative pb-8 pt-4 md:pt-10 px-4 md:px-10">
                                {/* The Connection Line - Hidden on Mobile, Horizontal on Desktop */}
                                <div className={`
                                    absolute bg-slate-200 rounded-full
                                    left-1/2 -translate-x-1/2 w-1 h-full md:w-full md:h-2 
                                    md:top-[164px] md:left-10 md:right-10 md:translate-x-0
                                    hidden md:block
                                `}>
                                    <motion.div
                                        className={`absolute bg-accent rounded-full w-full h-full md:w-full md:h-full`}
                                        initial={{ scaleY: 0, scaleX: 0 }}
                                        whileInView={{ scaleY: 1, scaleX: 1 }}
                                        transition={{ duration: 1.5 }}
                                        style={{ originY: 0, originX: 0 }}
                                    />
                                </div>

                                {/* Pathway Elements Container */}
                                <div className="grid grid-cols-2 md:flex md:flex-row md:justify-between gap-4 md:gap-6 relative max-w-[340px] mx-auto md:max-w-none px-2 md:px-0">
                                    {currentPathway.levels.map((level, i) => (
                                        <motion.div
                                            key={level.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.05 }}
                                            className="flex flex-col items-center group cursor-pointer"
                                            onClick={() => setSelectedLevel(level)}
                                        >
                                            {/* Level Header */}
                                            <div className="mb-3 md:mb-10 text-center">
                                                <div className="text-[8px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5 md:mb-1">CEFR {level.cefr}</div>
                                                <div className="text-slate-800 font-heading font-black text-[10px] md:text-xl leading-tight">{level.name}</div>
                                            </div>

                                            {/* Milestone Node */}
                                            <div className="relative mb-4 md:mb-8 z-10">
                                                <div className={`
                                                    w-7 h-7 md:w-16 md:h-16 rounded-full bg-white border-[3px] md:border-8 border-slate-200 
                                                    flex items-center justify-center transition-all group-hover:border-accent group-hover:bg-accent group-hover:scale-110
                                                    shadow-md md:shadow-lg
                                                `}>
                                                    <div className="w-1 md:w-4 h-1 md:h-4 rounded-full bg-slate-400 group-hover:bg-white" />
                                                </div>
                                                <div className="absolute -top-1 -right-1 bg-primary text-white text-[6px] md:text-[8px] font-bold px-1 rounded shadow-sm opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    L{i + 1}
                                                </div>
                                            </div>

                                            {/* Summary Card */}
                                            <div className="bg-white p-3 md:p-5 rounded-xl md:rounded-2xl shadow-md md:shadow-lg border border-slate-100 w-full hover:shadow-2xl hover:border-accent/10 transition-all text-center h-full flex flex-col justify-between">
                                                <div>
                                                    <div className="bg-slate-50 text-[8px] md:text-xs font-black text-slate-500 p-1.5 md:p-2.5 rounded-lg mb-2 md:mb-4 uppercase tracking-wider">
                                                        {level.exit}
                                                    </div>
                                                    <p className="text-[11px] md:text-sm leading-relaxed text-slate-400 font-medium group-hover:text-slate-600 transition-colors">
                                                        {level.target}
                                                    </p>
                                                </div>
                                                <div className="text-accent flex items-center justify-center gap-1 text-[8px] md:text-xs font-black uppercase md:opacity-0 group-hover:opacity-100 transition-opacity pt-2">
                                                    {t.courses.levelModal.badge} <ArrowRight size={10} className="md:w-4 md:h-4" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
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
                                <Trophy size={16} /> {t.courses.placement.badge}
                            </div>
                            <h2 className="text-xl md:text-6xl font-heading font-black text-accent leading-tight text-center lg:text-left">
                                {t.courses.placement.title.split(' ').slice(0, 4).join(' ')} <br /> <span className="text-primary">{t.courses.placement.title.split(' ').slice(4).join(' ')}</span>
                            </h2>
                            <p className="text-slate-500 text-[10px] md:text-lg leading-relaxed text-center lg:text-left mx-auto lg:mx-0">
                                {t.courses.placement.desc}
                            </p>

                            <div className="grid grid-cols-2 gap-4 md:gap-6">
                                <div className="space-y-3 md:space-y-4">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent text-white flex items-center justify-center font-black text-xs md:text-base">1</div>
                                    <h4 className="font-heading font-black text-slate-800 text-xs md:text-base">{t.courses.placement.step1.title}</h4>
                                    <p className="text-[10px] md:text-sm text-slate-400 leading-tight">{t.courses.placement.step1.desc}</p>
                                </div>
                                <div className="space-y-3 md:space-y-4">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary text-white flex items-center justify-center font-black text-xs md:text-base">2</div>
                                    <h4 className="font-heading font-black text-slate-800 text-xs md:text-base">{t.courses.placement.step2.title}</h4>
                                    <p className="text-[10px] md:text-sm text-slate-400 leading-tight">{t.courses.placement.step2.desc}</p>
                                </div>
                            </div>

                            <div className="flex justify-center lg:justify-start">
                                <Link href="/test" className="w-full sm:w-auto bg-accent hover:bg-black text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-bold transition-all shadow-xl text-sm md:text-base text-center">
                                    {t.courses.placement.cta}
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

                                    <div className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-2 md:mb-4 opacity-70">{t.courses.levelModal.badge}</div>
                                    <h3 className="text-2xl md:text-5xl font-heading font-black mb-3 md:mb-6 leading-tight">{selectedLevel.name}</h3>

                                    <div className="flex gap-2 md:gap-4 justify-center">
                                        <div className="bg-white/10 backdrop-blur-md px-2.5 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-xs font-bold border border-white/20 flex flex-col">
                                            <span className="opacity-60 text-[6px] md:text-[8px] uppercase">{t.courses.levelModal.cefr}</span>
                                            {selectedLevel.cefr}
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-md px-2.5 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-xs font-bold border border-white/20 flex flex-col">
                                            <span className="opacity-60 text-[6px] md:text-[8px] uppercase">{t.courses.levelModal.exit}</span>
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
                                    <h5 className="text-accent font-heading font-black text-base md:text-xl mb-2 md:mb-4">{t.courses.levelModal.description}</h5>
                                    <p className="text-slate-500 leading-relaxed text-xs md:text-base">{selectedLevel.fullDesc}</p>
                                </div>

                                <div className="mb-6">
                                    <h5 className="text-accent font-heading font-black text-sm md:text-lg mb-2 md:mb-4 flex items-center gap-2">
                                        <Trophy size={14} className="text-primary md:w-[18px] md:h-[18px]" /> {t.courses.levelModal.benefits}
                                    </h5>
                                    <div className="grid grid-cols-1 gap-2 md:gap-3">
                                        {selectedLevel.benefits.map((b: string, i: number) => (
                                            <div key={i} className="flex gap-2 md:gap-3 items-start p-2 md:p-3 bg-slate-50 rounded-lg md:rounded-xl">
                                                <CheckCircle2 size={12} className="text-primary mt-0.5 shrink-0 md:w-4 md:h-4" />
                                                <span className="text-[10px] md:text-sm text-slate-600 font-medium">{b}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-8 md:mt-12 flex flex-col md:flex-row gap-2.5 md:gap-4">
                                    <Link href="/contact#registration-form" className="w-full md:flex-1 bg-accent text-white py-3.5 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] text-center hover:bg-black transition-all">
                                        {t.courses.levelModal.register}
                                    </Link>
                                    <button
                                        onClick={() => setSelectedLevel(null)}
                                        className="w-full md:w-auto px-6 py-3.5 md:py-0 border border-slate-200 rounded-xl md:rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all text-[9px] uppercase tracking-widest"
                                    >
                                        {t.courses.levelModal.close}
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
                    <h2 className="text-white text-3xl md:text-5xl font-heading font-semibold mb-8 leading-tight">{t.courses.bottomCta.title}</h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed font-body">
                        {t.courses.bottomCta.desc}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link href="/contact#registration-form" className="bg-primary hover:bg-black text-white px-10 py-5 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl shadow-primary/20">
                            {t.courses.bottomCta.cta1}
                        </Link>
                        <button className="bg-white/5 hover:bg-white/10 text-white border border-white/20 backdrop-blur-md px-10 py-5 rounded-full font-bold transition-all">
                            {t.courses.bottomCta.cta2}
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
