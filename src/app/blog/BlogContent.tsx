"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, Clock, Calendar, User, ChevronRight, Image as ImageIcon } from "lucide-react";
import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function BlogContent({ pageData }: { pageData: any }) {
    const { t, language } = useLanguage();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("");
    const [search, setSearch] = useState("");

    // Extract hero data from pageData (from admin) - priority 1
    const heroSection = pageData?.sections?.find((s: any) => s.type === 'blog-hero')?.content;
    const newsletterSection = pageData?.sections?.find((s: any) => s.type === 'blog-newsletter')?.content;

    // Extract dynamic content - Prioritize pageData from admin, then translations
    const hero = {
        title: heroSection?.title || t.blogPage?.hero?.title || (language === "vi" ? "Góc Tri Thức <br /> Academic Insights" : "Knowledge Hub <br /> Academic Insights"),
        subtitle: heroSection?.subtitle || t.blogPage?.hero?.subtitle || "Knowledge Navigator & Editorial",
        description: heroSection?.description || t.blogPage?.hero?.description || (language === "vi"
            ? "Chia sẻ những kinh nghiệm, phương pháp và lộ trình học thuật quý báu từ đội ngũ chuyên gia MA.TESOL của PTN English."
            : "Sharing valuable experiences, methods, and academic pathways from PTN English's MA.TESOL expert team.")
    };

    // Memoize categories to prevent re-render loops - always use translated categories
    const categories = useMemo(() => {
        return language === "vi"
            ? ["Tất cả", "IELTS Expert", "Học thuật (Teens)", "Lộ trình du học", "Kinh nghiệm học tập"]
            : ["All", "IELTS Expert", "Academic (Teens)", "Study Abroad Pathway", "Learning Experience"];
    }, [language]);

    // Initialize activeTab based on language when empty
    useEffect(() => {
        if (!activeTab) {
            setActiveTab(language === "vi" ? "Tất cả" : "All");
        }
    }, [language, activeTab]);
    const newsletter = {
        title: newsletterSection?.title || t.blogPage?.newsletter?.title || (language === "vi" ? "Đăng ký nhận Academic Insights định kỳ" : "Subscribe to Academic Insights"),
        description: newsletterSection?.description || t.blogPage?.newsletter?.description || (language === "vi" ? "Cập nhật những thay đổi mới nhất về đề thi IELTS và các chương trình học bổng du học Châu Âu ngay hôm nay." : "Get the latest updates on IELTS exams and scholarship programs for studying in Europe today."),
        buttonText: newsletterSection?.buttonText || t.blogPage?.newsletter?.buttonText || (language === "vi" ? "Đăng Ký Ngay" : "Subscribe Now")
    };

    useEffect(() => {
        let isMounted = true;
        let timeoutId: NodeJS.Timeout;

        const fetchPosts = async () => {
            setLoading(true);

            // Set a timeout to ensure loading is turned off even if fetch hangs
            timeoutId = setTimeout(() => {
                if (isMounted) {
                    console.warn("Posts fetch timeout - forcing loading off");
                    setLoading(false);
                }
            }, 10000); // 10 second timeout

            try {
                const res = await fetch("/api/posts");
                if (!isMounted) return;

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                if (isMounted) {
                    setPosts(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Failed to fetch posts:", err);
                    setPosts([]); // Set empty array on error
                }
            } finally {
                clearTimeout(timeoutId);
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchPosts();

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, []);


    // Sync activeTab with language change only when necessary
    useEffect(() => {
        const currentIsAll = activeTab === "Tất cả" || activeTab === "All";
        const expectedAll = language === "vi" ? "Tất cả" : "All";
        if (currentIsAll && activeTab !== expectedAll) {
            setActiveTab(expectedAll);
        } else if (!currentIsAll) {
            // Attempt to translate other categories if possible
            const viCats = ["IELTS Expert", "Học thuật (Teens)", "Lộ trình du học", "Kinh nghiệm học tập"];
            const enCats = ["IELTS Expert", "Academic (Teens)", "Study Abroad Pathway", "Learning Experience"];

            if (language === "vi") {
                const idx = enCats.indexOf(activeTab);
                if (idx !== -1) setActiveTab(viCats[idx]);
            } else {
                const idx = viCats.indexOf(activeTab);
                if (idx !== -1) setActiveTab(enCats[idx]);
            }
        }
    }, [language, activeTab]);


    const filteredPosts = posts.filter(post => {
        if (!post) return false;
        const isAllTab = activeTab === "Tất cả" || activeTab === "All";
        const matchesTab = isAllTab || post.category === activeTab;
        const matchesSearch = (post.title?.toLowerCase().includes(search.toLowerCase()) || false) ||
            (post.excerpt?.toLowerCase().includes(search.toLowerCase()) || false);
        return matchesTab && matchesSearch;
    });

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Header />
            <div className="flex-grow">


                {/* Hero Section */}
                <section className="pt-32 pb-16 md:pt-48 md:pb-32 bg-white border-b border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/4 h-full bg-secondary/5 -skew-x-12 translate-x-1/2"></div>
                    <div className="container mx-auto px-6 max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="inline-block px-4 py-1.5 rounded-full bg-accent text-white text-xs md:text-[10px] font-bold uppercase tracking-widest mb-6 md:mb-8">
                                {hero.subtitle}
                            </div>
                            <h1 className="text-3xl md:text-5xl lg:text-7xl font-heading font-semibold text-accent mb-6 md:mb-10 leading-tight" style={{ fontSize: 'var(--fs-blog-pageTitle)' }} dangerouslySetInnerHTML={{ __html: hero.title }} />
                            <p className="text-slate-500 text-base md:text-xl font-body leading-relaxed mx-auto max-w-3xl">
                                {hero.description}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Categories & Search */}
                <section className="sticky top-20 z-30 bg-white/90 backdrop-blur-lg border-b border-slate-50 py-8">
                    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-center items-center gap-12">
                        <div className="flex bg-slate-50 p-2 rounded-3xl w-full md:w-auto overflow-x-auto no-scrollbar border border-slate-100">
                            {categories.map((cat: string) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveTab(cat)}
                                    className={`px-8 py-3 rounded-2xl font-bold transition-all whitespace-nowrap text-sm ${activeTab === cat ? "bg-accent text-white shadow-xl" : "text-slate-500 hover:text-accent"}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-accent transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder={t.blogPage.searchPlaceholder}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 rounded-3xl bg-slate-100 border-none focus:ring-4 focus:ring-accent/10 outline-none transition-all text-sm font-semibold"
                            />
                        </div>
                    </div>
                </section>

                {/* Blog Grid */}
                <section className="py-16 md:py-32">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-16">
                            <AnimatePresence mode="popLayout">
                                {filteredPosts.map((post, idx) => (
                                    <motion.article
                                        layout
                                        key={post._id || post.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white rounded-[3rem] overflow-hidden group border border-slate-50 shadow-sm hover:shadow-2xl transition-all flex flex-col text-center relative"
                                    >
                                        <Link href={`/blog/${post.slug || post._id}`} className="absolute inset-0 z-20" />
                                        <div className="h-72 min-h-[18rem] overflow-hidden relative shrink-0">
                                            {(post.originalImage || post.image) ? (
                                                <div
                                                    className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                                                    style={{
                                                        backgroundImage: `url(${post.image})`,
                                                        backgroundPosition: 'center center'
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                                    <ImageIcon size={48} />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors"></div>
                                            <div className="absolute top-6 left-6 bg-accent text-white text-xs md:text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                                                {post.category}
                                            </div>
                                        </div>

                                        <div className="p-6 md:p-10 flex-grow flex flex-col">
                                            <div className="flex items-center justify-center space-x-4 text-xs md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                                                <span className="flex items-center"><Calendar size={12} className="mr-2 text-primary" /> {post.date}</span>
                                                <span className="text-slate-200">|</span>
                                                <span className="flex items-center"><Clock size={12} className="mr-2 text-accent" /> {post.readTime || '5'} {t.blogPage.readTime}</span>
                                            </div>

                                            <h2
                                                className="text-lg md:text-2xl font-heading font-bold text-accent mb-4 md:mb-6 leading-snug group-hover:text-primary transition-colors line-clamp-2"
                                                style={{ fontSize: 'var(--fs-blog-postTitle)' }}
                                                dangerouslySetInnerHTML={{ __html: post.title }}
                                            />

                                            <p className="text-slate-500 font-body text-sm leading-relaxed mb-10 line-clamp-3">
                                                "{post.excerpt}"
                                            </p>

                                            <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                                                <div className="flex items-center space-x-3 text-left">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                        <User size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.blogPage.author}</p>
                                                        <p className="text-xs font-bold text-slate-700">{post.author}</p>
                                                    </div>
                                                </div>
                                                <div className="p-3 rounded-2xl bg-slate-50 text-accent group-hover:bg-accent group-hover:text-white transition-all shadow-inner">
                                                    <ChevronRight size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.article>
                                ))}
                            </AnimatePresence>
                        </div>

                        {loading ? (
                            <div className="py-40 text-center">
                                <div className="w-16 h-16 mx-auto mb-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <h3 className="text-xl font-heading font-bold text-slate-500">{t.common.loading || "Đang tải..."}</h3>
                            </div>
                        ) : filteredPosts.length === 0 && (
                            <div className="py-40 text-center">
                                <BookOpen size={64} className="mx-auto text-slate-200 mb-8" />
                                <h3 className="text-3xl font-heading font-bold text-slate-900 mb-4">{t.blogPage.emptyState.title}</h3>
                                <p className="text-slate-500 font-body">{t.blogPage.emptyState.desc}</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Newsletter CTA */}
                <section className="py-16 md:py-32 bg-accent relative overflow-hidden text-center">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-1/2"></div>
                    <div className="container mx-auto px-6 relative z-10 max-w-4xl">
                        <h2 className="text-white text-2xl md:text-4xl lg:text-5xl font-heading font-semibold mb-6 md:mb-10 leading-tight" dangerouslySetInnerHTML={{ __html: newsletter.title }} />
                        <p className="text-blue-100 mb-8 md:mb-12 text-base md:text-lg font-body leading-relaxed">
                            {newsletter.description}
                        </p>
                        <div className="flex flex-col md:flex-row gap-6 justify-center">
                            <input type="email" placeholder={t.blogPage.newsletter.emailPlaceholder} className="w-full md:w-96 px-10 py-5 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-blue-200 outline-none focus:ring-4 focus:ring-white/10 transition-all font-body" />
                            <Link href="/contact#registration-form" className="bg-primary text-white hover:bg-red-700 px-12 py-5 rounded-full font-bold text-xl shadow-2xl transition-all transform hover:scale-105 whitespace-nowrap flex items-center justify-center uppercase">
                                {newsletter.buttonText}
                            </Link>
                        </div>
                    </div>
                </section>

            </div>
            <Footer />
        </main>

    );
}
