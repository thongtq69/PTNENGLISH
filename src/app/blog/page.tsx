"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, Clock, Calendar, User, ChevronRight } from "lucide-react";

const CATEGORIES = ["Tất cả", "IELTS Expert", "Học thuật (Teens)", "Lộ trình du học", "Kinh nghiệm học tập"];

const POSTS = [
    {
        id: 1,
        title: "5 Bí Quyết Chinh Phục IELTS Writing Task 2 Từ Chuyên Gia MA.TESOL",
        excerpt: "Học cách xây dựng luận điểm logic và sử dụng từ vựng học thuật chuẩn Châu Âu để nâng band điểm Writing nhanh chóng.",
        category: "IELTS Expert",
        author: "Thầy Đặng Trần Phong",
        date: "20 Jan 2026",
        readTime: "8 phút",
        image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 2,
        title: "Active Learning: Tại Sao Học Sinh Teens Cần Phương Pháp Này?",
        excerpt: "Khám phá cách phương pháp học chủ động giúp học viên tại PTELC phát triển tư duy phản biện vượt trội.",
        category: "Học thuật (Teens)",
        author: "Cô Nguyễn Lê Quỳnh Trâm",
        date: "18 Jan 2026",
        readTime: "6 phút",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 3,
        title: "Lộ Trình Du Học Châu Âu: Chuẩn Bị Tiếng Anh Thế Nào Cho Đúng?",
        excerpt: "Những điều cần biết về chứng chỉ học thuật và kỹ năng mềm khi định hướng du học tại Phần Lan, Đức, Hà Lan.",
        category: "Lộ trình du học",
        author: "Thầy Nguyễn Trí Nhân",
        date: "15 Jan 2026",
        readTime: "10 phút",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
    }
];

export default function BlogPage() {
    const [activeTab, setActiveTab] = useState("Tất cả");

    const filteredPosts = activeTab === "Tất cả"
        ? POSTS
        : POSTS.filter(post => post.category === activeTab);

    return (
        <main className="min-h-screen bg-background text-center">
            <Header />

            {/* Hero Section */}
            <section className="pt-48 pb-32 bg-white border-b border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/4 h-full bg-secondary/5 -skew-x-12 translate-x-1/2"></div>
                <div className="container mx-auto px-6 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-block px-4 py-1.5 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-widest mb-8">
                            Knowledge Navigator & Editorial
                        </div>
                        <h1 className="text-5xl md:text-7xl font-heading font-semibold text-accent mb-10 leading-tight">
                            Góc Tri Thức <br />
                            Academic Insights
                        </h1>
                        <p className="text-slate-500 text-xl font-body leading-relaxed mx-auto max-w-3xl">
                            Chia sẻ những kinh nghiệm, phương pháp và lộ trình học thuật quý báu từ đội ngũ chuyên gia MA.TESOL của <span className="text-primary font-bold">PTN</span> <span className="text-accent font-bold">English</span>.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Categories & Search */}
            <section className="sticky top-20 z-30 bg-white/90 backdrop-blur-lg border-b border-slate-50 py-8">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-center items-center gap-12">
                    <div className="flex bg-slate-50 p-2 rounded-3xl w-full md:w-auto overflow-x-auto no-scrollbar border border-slate-100">
                        {CATEGORIES.map((cat) => (
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
                            placeholder="Tìm bài viết..."
                            className="w-full pl-14 pr-6 py-4 rounded-3xl bg-slate-100 border-none focus:ring-4 focus:ring-accent/10 outline-none transition-all text-sm font-semibold"
                        />
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-32">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        <AnimatePresence mode="popLayout">
                            {filteredPosts.map((post, idx) => (
                                <motion.article
                                    layout
                                    key={post.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white rounded-[3rem] overflow-hidden group border border-slate-50 shadow-sm hover:shadow-2xl transition-all flex flex-col text-center"
                                >
                                    <div className="h-72 overflow-hidden relative">
                                        <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors"></div>
                                        <div className="absolute top-6 left-6 bg-accent text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                                            {post.category}
                                        </div>
                                    </div>

                                    <div className="p-10 flex-grow flex flex-col">
                                        <div className="flex items-center justify-center space-x-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                                            <span className="flex items-center"><Calendar size={12} className="mr-2 text-primary" /> {post.date}</span>
                                            <span className="text-slate-200">|</span>
                                            <span className="flex items-center"><Clock size={12} className="mr-2 text-accent" /> {post.readTime} đọc</span>
                                        </div>

                                        <h2 className="text-2xl font-heading font-bold text-accent mb-6 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>

                                        <p className="text-slate-500 font-body text-sm leading-relaxed mb-10 line-clamp-3">
                                            "{post.excerpt}"
                                        </p>

                                        <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                                            <div className="flex items-center space-x-3 text-left">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <User size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tác giả</p>
                                                    <p className="text-xs font-bold text-slate-700">{post.author}</p>
                                                </div>
                                            </div>
                                            <button className="p-3 rounded-2xl bg-slate-50 text-accent hover:bg-accent hover:text-white transition-all shadow-inner">
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </AnimatePresence>
                    </div>

                    {filteredPosts.length === 0 && (
                        <div className="py-40 text-center">
                            <BookOpen size={64} className="mx-auto text-slate-200 mb-8" />
                            <h3 className="text-3xl font-heading font-bold text-slate-900 mb-4">Chưa có bài viết trong danh mục này</h3>
                            <p className="text-slate-500 font-body">Mời bạn quay lại sau để cập nhật những kiến thức mới nhất.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-32 bg-accent relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-1/2"></div>
                <div className="container mx-auto px-6 relative z-10 max-w-4xl">
                    <h2 className="text-white text-4xl md:text-5xl font-heading font-semibold mb-10 leading-tight">Đăng ký nhận Academic Insights định kỳ</h2>
                    <p className="text-blue-100 mb-12 text-lg font-body leading-relaxed">
                        Cập nhật những thay đổi mới nhất về đề thi IELTS và các chương trình học bổng du học Châu Âu ngay hôm nay.
                    </p>
                    <div className="flex flex-col md:flex-row gap-6 justify-center">
                        <input type="email" placeholder="example@email.com" className="w-full md:w-96 px-10 py-5 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-blue-200 outline-none focus:ring-4 focus:ring-white/10 transition-all font-body" />
                        <button className="bg-primary text-white hover:bg-red-700 px-12 py-5 rounded-full font-bold text-xl shadow-2xl transition-all transform hover:scale-105 whitespace-nowrap">
                            Đăng Ký Ngay
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
