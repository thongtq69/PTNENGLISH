"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Users, Compass, ShieldCheck, FileText, Lock, UserCheck, GraduationCap, Heart, MessageSquare, Laptop, Globe, ClipboardCheck, ArrowRight } from "lucide-react";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const TEACHER_IMAGES = [
    "https://ptelc.edu.vn/wp-content/uploads/2022/07/gv-1-1-203x203.png",
    "https://ptelc.edu.vn/wp-content/uploads/2022/07/gv2-1-1-203x203.png",
    "http://ptelc.edu.vn/wp-content/uploads/2024/10/Thầy-Nhân-website-1-164x203.jpg",
    "http://ptelc.edu.vn/wp-content/uploads/2025/06/Ms.-Quyên-1-199x203.jpg"
];

const ICON_MAP: Record<string, any> = {
    BookOpen, Users, Compass, ShieldCheck, FileText, Lock, UserCheck, GraduationCap, Heart, MessageSquare, Laptop, Globe, ClipboardCheck, ArrowRight
};

const DIFFERENCE_ICONS = [
    UserCheck,
    GraduationCap,
    Heart,
    MessageSquare,
    Users,
    Laptop,
    Globe,
    Compass,
    ClipboardCheck
];

export default function AboutUsContent({ pageData }: { pageData: any }) {
    const { t, language } = useLanguage();

    const sections = pageData?.sections || [];

    // Get differences data from DB if available, otherwise fallback to translations
    const differencesFromDB = sections.find((s: any) => s.type === 'about-differences')?.content?.items;

    const differencesData = useMemo(() => {
        if (differencesFromDB && differencesFromDB.length > 0) {
            return differencesFromDB.map((item: any, idx: number) => ({
                id: item.id || idx + 1,
                title: item.title,
                fullTitle: item.fullTitle,
                desc: item.desc,
                Icon: ICON_MAP[item.icon] || ArrowRight
            }));
        }

        return t.home.about.differences.items.map((item: any, idx: number) => ({
            id: idx + 1,
            title: item.title || item.fullTitle,
            fullTitle: item.fullTitle,
            desc: item.desc,
            Icon: DIFFERENCE_ICONS[idx] || ArrowRight
        }));
    }, [t, differencesFromDB]);

    // Get teachers data based on language
    const teachersData = useMemo(() => {
        const items = t.home.about.teachers.items;
        return items.map((teacher: any, idx: number) => ({
            ...teacher,
            image: TEACHER_IMAGES[idx] || teacher.image
        }));
    }, [t]);




    const PHILOSOPHY = [
        {
            title: t.home.about.philosophy.academic.title,
            desc: t.home.about.philosophy.academic.desc,
            icon: <BookOpen className="w-8 h-8" />
        },
        {
            title: t.home.about.philosophy.humane.title,
            desc: t.home.about.philosophy.humane.desc,
            icon: <Users className="w-8 h-8" />
        },
        {
            title: t.home.about.philosophy.partner.title,
            desc: t.home.about.philosophy.partner.desc,
            icon: <Compass className="w-8 h-8" />
        }
    ];

    const POLICIES = [
        { title: t.home.about.policies.items.transparent, icon: <ShieldCheck className="w-5 h-5 text-primary" /> },
        { title: t.home.about.policies.items.terms, icon: <FileText className="w-5 h-5 text-primary" /> },
        { title: t.home.about.policies.items.privacy, icon: <Lock className="w-5 h-5 text-primary" /> },
        { title: t.home.about.policies.items.regulations, icon: <UserCheck className="w-5 h-5 text-primary" /> }
    ];

    const VALUES = [
        { title: t.home.about.values.dedication.title, desc: t.home.about.values.dedication.desc },
        { title: t.home.about.values.professionalism.title, desc: t.home.about.values.professionalism.desc },
        { title: t.home.about.values.transparency.title, desc: t.home.about.values.transparency.desc },
        { title: t.home.about.values.innovation.title, desc: t.home.about.values.innovation.desc }
    ];


    const storyData = sections.find((s: any) => s.type === 'about-story')?.content || {};
    const teacherFromDB = sections.find((s: any) => s.type === 'about-teachers')?.content?.items;
    const teachersToDisplay = (teacherFromDB && teacherFromDB.length > 0) ? teacherFromDB : teachersData;

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section - Fixed overlap and adjusted padding */}
            <section className="pt-48 pb-16 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl"
                    >
                        <h1 className="text-primary font-heading font-bold text-sm uppercase tracking-[0.4em] mb-4">
                            {t.home.about.hero.badge}
                        </h1>
                        <h2 className="text-2xl md:text-6xl font-heading font-medium text-accent mb-4 leading-tight">
                            {t.home.about.hero.title.split('\n')[0]} <br /> {t.home.about.hero.title.split('\n')[1]} <span className="text-primary font-bold">PTN</span> <span className="text-accent font-bold">English</span>
                        </h2>
                        <p className="text-sm md:text-xl text-slate-600 font-serif leading-relaxed max-w-2xl not-italic border-l-2 md:border-l-4 border-primary pl-4 md:pl-6 py-0.5">
                            &ldquo;{t.home.about.hero.desc}&rdquo;
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Story Section - Compacted */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex flex-col h-full justify-center"
                        >
                            <h3 className="text-lg md:text-3xl font-heading font-black text-accent mb-4 flex items-center justify-center lg:justify-start gap-4">
                                <span className="w-6 h-0.5 bg-primary" />
                                {storyData.subtitle || t.home.about.story.subtitle}
                                <span className="w-6 h-0.5 bg-primary lg:hidden" />
                            </h3>
                            <div className="space-y-4 text-sm md:text-lg text-slate-700 font-body leading-relaxed text-center lg:text-left">
                                <p className="text-xl leading-snug">
                                    <span className="text-primary font-bold">PTN</span> <span className="text-accent font-bold">English</span> {storyData.p1 || t.home.about.story.p1} <br />
                                    <span className="font-black text-accent border-b-2 border-primary/20">{storyData.teachers || t.home.about.story.teachers}</span>.
                                </p>
                                <p>
                                    {storyData.p2 || t.home.about.story.p2}
                                </p>
                                <div className="bg-primary/5 p-8 border-l-[6px] border-primary rounded-r-2xl text-base shadow-sm">
                                    <p className="mb-3"><strong>PTN</strong> {storyData.ptnAcronym || t.home.about.story.ptnAcronym}</p>
                                    <p><strong>PTN</strong> {storyData.ptnSpirit || t.home.about.story.ptnSpirit}</p>
                                </div>
                                <p className="text-accent font-medium italic">
                                    &ldquo;{storyData.quote || t.home.about.story.quote}&rdquo;
                                </p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-xl">
                                <img
                                    src={storyData?.image || "https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-6/592696975_798019503192696_5381097215126223627_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=y7qZy0WgaVAQ7kNvwHVmX2S&_nc_oc=Adn0UnxILVl60OrEolmTkLzH8Mz93_7A2My7jQn7Ug6yVBkJwSxXoGxc8tNZvOUb5sA&_nc_zt=23&_nc_ht=scontent.fsgn2-6.fna&_nc_gid=HOFT5BaX3DDhVoFuNh3deQ&oh=00_AfrLYWdG1RSv7hkuK8s7RAlVQe-oJ3NdxoD9iS0RLdltPA&oe=69793819"}
                                    alt="Founder Story"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-[1.5rem] shadow-lg border border-slate-100 hidden md:block">
                                <p className="text-3xl font-heading font-black text-primary mb-0.5">{storyData.expValue || "25+"}</p>
                                <p className="uppercase tracking-widest text-[10px] font-bold text-accent">{storyData.expBadge || t.home.about.story.expBadge}</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Differences Hub Section - More Contrast, Compact */}
            <section className="py-20 bg-slate-100 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-accent rounded-full" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-primary font-heading font-black text-sm uppercase tracking-[0.3em] mb-4">{t.home.about.differences.badge}</h2>
                        <h3 className="text-xl md:text-4xl font-heading font-extrabold mb-2 text-accent leading-tight">
                            {t.home.about.differences.title} <span className="text-primary">PTN</span> <span className="text-accent">English</span>?
                        </h3>
                        <p className="text-slate-600 font-body text-base">{t.home.about.differences.subtitle}</p>
                    </div>

                    <DifferencesHub differencesData={differencesData} />
                </div>
            </section>

            {/* Combined Philosophy & Core Values Section - Improved Contrast */}
            <section className="py-20 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="bg-slate-100 rounded-[2.5rem] p-8 md:p-12 border border-slate-200 flex flex-col lg:grid lg:grid-cols-12 gap-10 items-stretch">

                        {/* Left: Philosophy */}
                        <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-center">
                            <div className="mb-8 lg:mb-0">
                                <h2 className="text-primary font-heading font-black text-xs uppercase tracking-[0.4em] mb-3 text-center lg:text-left">{t.home.about.philosophy.badge}</h2>
                                <h3 className="text-2xl md:text-3xl font-heading font-black text-accent mb-6 italic text-center lg:text-left">{t.home.about.philosophy.title}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-1 gap-4">
                                    {PHILOSOPHY.map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex gap-4 p-4 rounded-2xl bg-white/50 border border-slate-200 group hover:bg-white transition-all shadow-sm"
                                        >
                                            <div className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                {React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-5 h-5" })}
                                            </div>
                                            <div>
                                                <h4 className="font-heading font-bold text-accent text-base mb-0.5">{item.title}</h4>
                                                <p className="text-slate-600 text-[13px] leading-relaxed">{item.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: Core Values */}
                        <div className="lg:col-span-12 xl:col-span-7 flex flex-col justify-center">
                            <h2 className="text-primary font-heading font-black text-xs uppercase tracking-[0.4em] mb-3 text-center lg:text-left">{t.home.about.values.badge}</h2>
                            <h3 className="text-2xl md:text-3xl font-heading font-black text-accent mb-6 italic text-center lg:text-left">{t.home.about.values.title}</h3>
                            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-2 gap-3">
                                {VALUES.map((val, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ y: -3 }}
                                        className="p-4 md:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all group"
                                    >
                                        <div className="text-[10px] font-black text-primary/40 group-hover:text-primary transition-colors mb-1">0{idx + 1}</div>
                                        <h4 className="text-accent font-heading font-black mb-1 text-sm md:text-base uppercase tracking-tight">{val.title}</h4>
                                        <p className="text-slate-600 text-[11px] md:text-[12px] leading-snug font-medium">{val.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Teachers Section - Hierarchical Layout */}
            <section id="teachers" className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-primary font-heading font-bold text-xs uppercase tracking-[0.4em] mb-4">{t.home.about.teachers.badge}</h2>
                        <h3 className="text-xl md:text-5xl font-heading font-extrabold text-accent leading-tight">
                            {t.home.about.teachers.title} <br /> {t.home.about.teachers.subtitle}
                        </h3>
                    </div>

                    {/* PTN Founders (First 3) - Centered Flex */}
                    <div className="flex flex-wrap justify-center gap-4 md:flex md:flex-wrap md:justify-center md:gap-10 mb-12 md:mb-24">
                        {teachersToDisplay.slice(0, 3).map((teacher: any, idx: number) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group w-[45%] md:w-[320px] lg:w-[380px]"
                            >
                                <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl bg-white border border-slate-100">
                                    <img
                                        src={teacher.image}
                                        alt={teacher.name}
                                        className="w-full h-full object-cover transition-all duration-700 scale-105 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-accent via-accent/20 to-transparent opacity-0 group-hover:opacity-95 transition-all duration-500" />

                                    <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="w-12 h-1 bg-primary mb-6" />
                                        <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-3">{t.home.about.teachers.qualifications}</p>
                                        <p className="text-white text-sm leading-relaxed mb-6 font-medium whitespace-pre-line">{teacher.certs}</p>
                                        <p className="text-white/70 text-xs leading-relaxed italic border-l-2 border-primary/50 pl-4 whitespace-pre-line">{teacher.desc}</p>
                                    </div>
                                    <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 text-white text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all shadow-xl">
                                        {t.home.about.teachers.founderBadge}
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-8 text-center group-hover:text-primary transition-colors">
                                    <h4 className="font-heading font-bold text-sm md:text-2xl text-accent group-hover:text-primary transition-colors duration-300 line-clamp-1">{teacher.name}</h4>
                                    <div className="flex items-center justify-center gap-2 md:gap-4 mt-1 md:mt-3 opacity-60">
                                        <span className="hidden md:block h-px w-8 bg-slate-400" />
                                        <p className="text-[8px] md:text-[11px] text-accent font-black uppercase tracking-widest">{teacher.exp}</p>
                                        <span className="hidden md:block h-px w-8 bg-slate-400" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Academic Faculty (Others) */}
                    {teachersToDisplay.length > 3 && (
                        <div>
                            <div className="flex items-center gap-8 mb-16">
                                <div className="h-px flex-1 bg-slate-200" />
                                <h3 className="text-sm md:text-2xl font-heading font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                                    {t.home.about.teachers.facultyTitle}
                                </h3>
                                <div className="h-px flex-1 bg-slate-200" />
                            </div>

                            <div className="flex flex-wrap justify-center gap-3 md:flex md:flex-wrap md:justify-center md:gap-8">
                                {teachersToDisplay.slice(3).map((teacher: any, idx: number) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        className="group w-[46%] md:w-[260px] lg:w-[280px]"
                                    >
                                        <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-lg bg-white border border-slate-100 transition-all duration-500">
                                            <img
                                                src={teacher.image}
                                                alt={teacher.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-accent/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <p className="text-white text-[10px] font-bold leading-tight line-clamp-3 whitespace-pre-line">
                                                    {teacher.certs}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-6 text-center">
                                            <h4 className="font-heading font-bold text-lg text-accent group-hover:text-primary transition-colors">{teacher.name}</h4>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 opacity-70 group-hover:opacity-100 transition-opacity">{teacher.exp}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Policies Section - Compacted */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="bg-slate-100 rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-200">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-2xl font-heading font-bold text-accent mb-4">{t.home.about.policies.title} <span className="text-primary font-bold">PTN</span> <span className="text-accent font-bold">English</span></h3>
                                <p className="text-slate-600 font-body mb-8 leading-relaxed text-base">
                                    {t.home.about.policies.subtitle}
                                </p>
                                <div className="grid grid-cols-2 gap-2 md:gap-3">
                                    {POLICIES.map((p, idx) => (
                                        <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 hover:border-primary/30 cursor-pointer transition-all shadow-sm">
                                            {React.cloneElement(p.icon as React.ReactElement<any>, { className: "w-4 h-4 text-primary" })}
                                            <span className="text-[10px] font-bold text-slate-700 whitespace-nowrap">{p.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white rounded-[2rem] p-8 shadow-md border border-slate-200 ring-1 ring-primary/5">
                                <h4 className="text-primary font-heading font-black text-xl mb-4 text-center">{t.home.about.policies.ctaTitle}</h4>
                                <Link href="/test" className="block w-full bg-primary hover:bg-black text-white py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 transform text-center uppercase">
                                    {t.home.about.policies.ctaButton}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main >
    );
}

// Difference titles are static English short names
const DIFFERENCE_TITLES = [
    "Teacher‑led",
    "Academic Focus",
    "Local Insight",
    "Personal Feedback",
    "Small Classes",
    "Blended Learning",
    "Global Connect",
    "Partner To Navigate",
    "Academic Advising"
];

interface DifferenceItem {
    id: number;
    title: string;
    fullTitle: string;
    desc: string;
    Icon: React.ComponentType<{ className?: string }>;
}

function DifferencesHub({ differencesData }: { differencesData: DifferenceItem[] }) {
    const [hovered, setHovered] = useState<number | null>(null);
    const { language } = useLanguage();

    const exploreText = language === 'en' ? 'Explore our core values' : 'Khám phá giá trị cốt lõi';
    const clickText = language === 'en' ? 'Click icons to explore differences' : 'Nhấn vào biểu tượng để khám phá';

    return (
        <div className="relative min-h-[550px] flex items-center justify-center scale-100 md:scale-110">
            {/* Desktop Radial Layout */}
            <div className="hidden lg:block relative w-[750px] h-[750px]">
                {/* Connecting Lines and decorative rings */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                        <radialGradient id="lineGradient" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.05" />
                        </radialGradient>
                    </defs>
                    {/* Decorative circles removed as per request */}
                    {differencesData.map((_, idx) => {
                        const angle = (idx * 360) / differencesData.length;
                        const x2 = 375 + Math.cos((angle - 90) * (Math.PI / 180)) * 280;
                        const y2 = 375 + Math.sin((angle - 90) * (Math.PI / 180)) * 280;
                        return (
                            <motion.line
                                key={idx}
                                x1="375" y1="375" x2={x2} y2={y2}
                                stroke="url(#lineGradient)"
                                strokeWidth={hovered === differencesData[idx].id ? "2" : "1"}
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: hovered === differencesData[idx].id ? 0.8 : 0.2 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        );
                    })}
                </svg>

                {/* Center Content Area */}
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <div className="relative w-80 h-80 flex items-center justify-center pointer-events-auto">
                        <AnimatePresence mode="wait">
                            {hovered !== null ? (
                                <motion.div
                                    key={`detail-${hovered}`}
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 1.1, y: -10 }}
                                    transition={{ type: "spring", damping: 25, stiffness: 350 }}
                                    className="text-center p-10 bg-white rounded-full w-[440px] h-[440px] flex flex-col items-center justify-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] border border-slate-100/80 z-30"
                                >
                                    <motion.div
                                        initial={{ scale: 0.5 }}
                                        animate={{ scale: 1 }}
                                        className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner"
                                    >
                                        {(() => {
                                            const Icon = differencesData.find(d => d.id === hovered)?.Icon;
                                            return Icon ? <Icon className="w-8 h-8" /> : null;
                                        })()}
                                    </motion.div>
                                    <h4 className="text-xl font-heading font-black mb-4 text-accent leading-tight max-w-[300px]">
                                        {differencesData.find(d => d.id === hovered)?.fullTitle}
                                    </h4>
                                    <p className="text-slate-500 font-body text-[13px] leading-relaxed max-w-[340px] whitespace-pre-line text-left px-6">
                                        {differencesData.find(d => d.id === hovered)?.desc}
                                    </p>
                                    <div className="mt-8 flex gap-1.5">
                                        {[...Array(3)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ opacity: [0.3, 1, 0.3] }}
                                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                                className="w-1.5 h-1.5 rounded-full bg-primary"
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="logo-center"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    className="flex flex-col items-center"
                                >
                                    {/* OFFICIAL PTN LOGO FORMAT */}
                                    <div className="flex flex-col items-center group">
                                        <span className="text-5xl font-heading font-extrabold tracking-tight">
                                            <span className="text-primary uppercase">PTN</span>
                                            <span className="text-accent uppercase"> English</span>
                                        </span>
                                        <div className="flex justify-between w-full mt-3 border-t border-slate-200 pt-3 text-accent/60">
                                            {"PARTNER TO NAVIGATE".split("").map((char, index) => (
                                                <span key={index} className="text-[11px] font-bold uppercase leading-none tracking-[0.1em]">
                                                    {char === " " ? "\u00A0" : char}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <motion.div
                                        animate={{ y: [0, 8, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                        className="mt-16 flex flex-col items-center"
                                    >
                                        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-400 mb-3">{exploreText}</span>
                                        <div className="w-px h-16 bg-gradient-to-b from-primary/60 to-transparent"></div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Orbiting Items */}
                {differencesData.map((item, idx) => {
                    const angle = (idx * 360) / differencesData.length;
                    const radius = 280;
                    const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius;
                    const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius;
                    const Icon = item.Icon;

                    return (
                        <motion.div
                            key={item.id}
                            className="absolute top-1/2 left-1/2 z-30 cursor-pointer"
                            initial={false}
                            animate={{
                                x: `calc(${x}px - 50%)`,
                                y: `calc(${y}px - 50%)`,
                                scale: hovered === item.id ? 1.2 : 1,
                                opacity: hovered === null || hovered === item.id ? 1 : 0.5
                            }}
                            onMouseEnter={() => setHovered(item.id)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <div className="relative flex flex-col items-center group w-44">
                                {/* The Icon Button - Glassmorphism Style */}
                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 backdrop-blur-md ${hovered === item.id ? "bg-primary border-2 border-primary shadow-[0_0_40px_8px_rgba(199,0,43,0.4)] text-white" : "bg-accent border-2 border-white/10 text-white shadow-[0_12px_40px_-8px_rgba(0,0,0,0.3)] group-hover:border-primary/50 group-hover:shadow-[0_12px_40px_-4px_rgba(199,0,43,0.2)]"}`}>
                                    <Icon className="w-9 h-9" />
                                </div>

                                {/* Always Visible Label */}
                                <div className={`mt-5 text-center px-2 transition-all duration-300 ${hovered === item.id ? "opacity-100 scale-105" : "opacity-90"}`}>
                                    <p className={`text-[12px] font-black uppercase tracking-wider leading-tight transition-colors ${hovered === item.id ? "text-primary" : "text-accent"}`}>
                                        {item.title}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

            </div>

            {/* Mobile Optimized Layout (Interactive Grid) */}
            <div className="lg:hidden w-full flex flex-col gap-6">
                {/* Icon Grid (Fixed, compressed & centered) */}
                <div className="flex flex-wrap justify-center gap-3">
                    {differencesData.map((item) => {
                        const Icon = item.Icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setHovered(item.id)}
                                className={`w-[22%] aspect-square rounded-xl flex items-center justify-center transition-all backdrop-blur-md ${hovered === item.id || (hovered === null && item.id === 1) ? "bg-primary border-2 border-primary text-white shadow-[0_0_20px_4px_rgba(199,0,43,0.3)]" : "bg-accent border-2 border-white/10 text-white shadow-[0_8px_32px_-4px_rgba(0,0,0,0.25)]"}`}
                            >
                                <Icon className="w-6 h-6" />
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="bg-white border-2 border-slate-100 p-6 rounded-[2rem] shadow-xl relative min-h-[250px]">
                    <AnimatePresence mode="wait">
                        {(() => {
                            const activeItem = differencesData.find(d => d.id === (hovered || 1));
                            const ActiveIcon = activeItem?.Icon;
                            return (
                                <motion.div
                                    key={activeItem?.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-col"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            {ActiveIcon && <ActiveIcon className="w-5 h-5" />}
                                        </div>
                                        <h4 className="text-lg font-heading font-black text-accent uppercase leading-tight tracking-tighter">
                                            {activeItem?.title}
                                        </h4>
                                    </div>
                                    <h5 className="text-[11px] font-bold text-primary mb-2 uppercase tracking-widest leading-none">{activeItem?.fullTitle}</h5>
                                    <p className="text-slate-600 font-body text-xs md:text-sm leading-[1.6] whitespace-pre-line">
                                        {activeItem?.desc}
                                    </p>
                                </motion.div>
                            );
                        })()}
                    </AnimatePresence>
                    {/* Architectural accent */}
                    <div className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-bl-2xl"></div>
                </div>

                <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-[0.3em]">
                    {clickText}
                </p>
            </div>
        </div>
    );
}
