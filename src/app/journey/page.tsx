"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Compass, Zap, Trophy, Quote, Star, MapPin } from "lucide-react";

const SUCCESS_STORIES = [
    {
        name: "Phuong Thao Nguyen",
        nameEn: "Phuong Thao Nguyen",
        target: "Du học sinh Finland",
        targetEn: "Exchange Student in Finland",
        text: "Trung tâm không chỉ dạy tiếng Anh mà còn hỗ trợ mình rất nhiều trong các bài luận và đồ án ngay cả khi mình đã sang Phần Lan du học. Thầy cô thực sự là những người đồng hành tâm huyết.",
        textEn: "PTN English not only taught me the language but also supported me with essays and projects even after I moved to Finland to study. The teachers are truly dedicated companions on my journey.",
        image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&q=80&w=200",
        stars: 5,
    },
    {
        name: "Thanh Son Nguyen",
        nameEn: "Thanh Son Nguyen",
        target: "Green River College, USA",
        targetEn: "Green River College, USA",
        text: "Mình cực kỳ thích cách dạy truyền cảm hứng tại PTELC. Phương pháp Active Learning giúp mình tự tin hơn hẳn khi bước chân vào môi trường đại học tại Mỹ.",
        textEn: "I genuinely loved the inspiring teaching style at PTELC. The Active Learning approach gave me the confidence I needed to thrive in a U.S. university environment.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
        stars: 5,
    },
    {
        name: "Anh Vy Tran",
        nameEn: "Anh Vy Tran",
        target: "Melbourne, Australia",
        targetEn: "Melbourne, Australia",
        text: "Thầy cô tại đây như những người thắp lửa (fire-bringers). Mình luôn cảm thấy được hỗ trợ tuyệt đối trong suốt hành trình chinh phục IELTS.",
        textEn: "The teachers here are true fire-bringers. I always felt fully supported throughout my journey to conquer the IELTS exam.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
        stars: 5,
    }
];

export default function JourneyPage() {
    const { t, language } = useLanguage();
    const pick = <T,>(vi: T, en?: T): T => (language === "en" && en ? en : vi);

    const STEPS = [
        {
            title: t.journey.steps.analysis.title,
            desc: t.journey.steps.analysis.desc,
            icon: <Compass className="text-accent" />,
            color: "bg-accent/10",
        },
        {
            title: t.journey.steps.strategy.title,
            desc: t.journey.steps.strategy.desc,
            icon: <MapPin className="text-primary" />,
            color: "bg-primary/10",
        },
        {
            title: t.journey.steps.learning.title,
            desc: t.journey.steps.learning.desc,
            icon: <Zap className="text-secondary" />,
            color: "bg-secondary/10",
        },
        {
            title: t.journey.steps.excellence.title,
            desc: t.journey.steps.excellence.desc,
            icon: <Trophy className="text-primary" />,
            color: "bg-primary/10",
        },
    ];

    return (
        <main className="min-h-screen bg-background">
            <Header />

            {/* Hero */}
            <section className="pt-48 pb-32 bg-white border-b border-slate-100 text-center">
                <div className="container mx-auto px-6 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="inline-block px-4 py-1.5 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-widest mb-8">
                            {t.journey.hero.badge}
                        </div>
                        <h1
                            className="text-5xl md:text-7xl font-heading font-semibold text-accent mb-10 leading-tight"
                            dangerouslySetInnerHTML={{ __html: t.journey.hero.title }}
                        />
                        <p className="text-slate-500 text-xl font-body leading-relaxed max-w-3xl mx-auto">
                            {t.journey.hero.desc}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Centered Success Timeline */}
            <section className="py-32 overflow-hidden bg-background">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="relative">
                        {/* Center Line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2 hidden md:block"></div>

                        <div className="space-y-32 relative">
                            {STEPS.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    className={`flex flex-col md:flex-row items-center ${idx % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                >
                                    {/* Content */}
                                    <div className="w-full md:w-1/2 px-10 text-center md:text-left">
                                        <div className={`inline-flex w-16 h-16 ${step.color} rounded-3xl items-center justify-center mb-10 shadow-inner`}>
                                            {step.icon}
                                        </div>
                                        <h3 className="text-3xl font-heading font-bold mb-6 text-slate-900">{step.title}</h3>
                                        <p className="text-slate-500 font-body text-lg leading-relaxed">{step.desc}</p>
                                    </div>

                                    {/* Circle on line */}
                                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white bg-accent shadow-[0_0_15px_rgba(30,10,60,0.4)] z-10 hidden md:block"></div>

                                    <div className="w-full md:w-1/2"></div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Success Wall - Centered Layout */}
            <section className="py-32 bg-accent overflow-hidden relative text-center">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(199,0,43,0.1),transparent)]"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-primary font-heading font-bold text-lg uppercase tracking-[0.3em] mb-16 underline decoration-white/20 decoration-2 underline-offset-8">
                        {t.journey.successWall.title}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
                        {SUCCESS_STORIES.map((story, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white/5 backdrop-blur-lg border border-white/10 p-12 rounded-[4rem] text-center group hover:bg-white/10 transition-all"
                            >
                                <Quote className="text-primary w-12 h-12 mx-auto mb-8 opacity-40" />
                                <img src={story.image} alt={pick(story.name, story.nameEn)} className="w-24 h-24 rounded-full mx-auto mb-8 object-cover ring-4 ring-white/10 group-hover:ring-primary/50 transition-all" />
                                <div className="space-y-4 mb-8">
                                    <p className="text-white font-heading font-bold text-xl">{pick(story.name, story.nameEn)}</p>
                                    <p className="text-primary text-[10px] font-bold uppercase tracking-widest">{pick(story.target, story.targetEn)}</p>
                                </div>
                                <p className="text-slate-400 font-body text-sm leading-relaxed mb-8">
                                    "{pick(story.text, story.textEn)}"
                                </p>
                                <div className="flex justify-center space-x-1 text-primary">
                                    {[...Array(story.stars)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 bg-background border-t border-slate-100 text-center">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-accent text-4xl md:text-6xl font-heading font-semibold mb-10 leading-tight">
                        {t.journey.cta.title}
                    </h2>
                    <p className="text-slate-500 text-lg mb-12 max-w-2xl mx-auto font-body leading-relaxed">
                        {t.journey.cta.desc}
                    </p>
                    <button className="bg-primary hover:bg-red-700 text-white px-12 py-6 rounded-full font-bold text-xl shadow-2xl shadow-red-500/20 transition-all transform hover:scale-105">
                        {t.journey.cta.button}
                    </button>
                </div>
            </section>

            <Footer />
        </main>
    );
}
