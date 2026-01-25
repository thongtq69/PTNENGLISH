"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Target, ArrowRight } from "lucide-react";

export default function CoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch("/api/courses")
            .then(res => res.json())
            .then(data => {
                setCourses(data);
                setLoading(false);
            });
    }, []);

    const filteredCourses = courses.filter(course => {
        const matchesFilter = filter === "All" || course.goal === filter;
        const matchesSearch = course.name.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <main className="min-h-screen bg-background">
            <Header />

            {/* Banner Section */}
            <section className="relative pt-48 pb-32 bg-accent overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-1/4 h-full bg-white/5 -skew-x-12 translate-x-1/2"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest mb-8 border border-white/20">
                            The Academic Navigation Roadmap
                        </div>
                        <h1 className="text-white text-5xl md:text-8xl font-heading font-semibold mb-10 leading-tight">
                            Lộ Trình Chuyên Biệt <br />
                            Kiến Tạo Bản Lĩnh
                        </h1>
                        <p className="text-white/80 text-xl font-body leading-relaxed max-w-3xl mx-auto">
                            Khám phá các khóa học được thiết kế chuẩn Châu Âu, giúp bạn nắm bắt cơ hội học tập toàn cầu.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filter & Search Bar */}
            <section className="sticky top-20 z-30 bg-white/90 backdrop-blur-lg border-b border-slate-100 py-6">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-center items-center gap-10">
                    <div className="flex bg-slate-100 p-1.5 rounded-3xl w-full md:w-auto overflow-x-auto no-scrollbar">
                        {["All", "EfT", "IELTS", "GE"].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-8 py-3 rounded-2xl font-bold transition-all whitespace-nowrap text-sm ${filter === cat ? "bg-accent text-white shadow-xl" : "text-slate-500 hover:text-accent"}`}
                            >
                                {cat === "All" ? "Tất cả" : cat === "EfT" ? "Học thuật (Teens)" : cat === "GE" ? "Giao tiếp (GE)" : cat}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-accent transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm khóa học..."
                            className="w-full pl-14 pr-6 py-4 rounded-3xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-accent/10 transition-all text-sm font-semibold"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Course Grid */}
            <section className="py-32">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <AnimatePresence mode="popLayout">
                            {filteredCourses.map((course) => (
                                <motion.div
                                    layout
                                    key={course.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white rounded-[3rem] overflow-hidden border border-slate-50 shadow-sm hover:shadow-2xl transition-all group flex flex-col md:flex-row h-full"
                                >
                                    {/* Visual Left Side */}
                                    <div className="w-full md:w-56 bg-slate-900 p-8 flex flex-col justify-between items-center text-center relative overflow-hidden shrink-0">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                                        <div className="z-10 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                                            {course.tag}
                                        </div>
                                        <div className="z-10">
                                            <div className="text-white opacity-60 mb-2 text-xs font-bold uppercase tracking-widest">Type</div>
                                            <div className="text-white text-3xl font-heading font-black">{course.goal}</div>
                                        </div>
                                        <div className="z-10 mt-auto pt-6 border-t border-white/5 w-full text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                                            {course.duration}
                                        </div>
                                    </div>

                                    {/* Content Right Side */}
                                    <div className="flex-1 p-10 md:p-12 flex flex-col">
                                        <div className="mb-6">
                                            <h3 className="text-3xl font-heading font-bold text-accent group-hover:text-primary transition-colors leading-[1.2] mb-4">{course.name}</h3>
                                            <div className="flex items-center gap-4">
                                                <div className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                                                    {course.level}
                                                </div>
                                                <span className="text-slate-300">|</span>
                                                <span className="text-accent font-black text-sm uppercase tracking-widest">{course.price}</span>
                                            </div>
                                        </div>

                                        <p className="text-slate-500 font-body text-sm leading-relaxed mb-10 line-clamp-3">
                                            {course.description}
                                        </p>

                                        {/* Path Visualizer */}
                                        <div className="mb-12">
                                            <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                                                <Target size={14} className="mr-3 text-secondary" /> Academic Milestones
                                            </div>
                                            <div className="flex items-center justify-between relative mt-8">
                                                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-50 -translate-y-1/2"></div>
                                                <div className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 transition-all duration-1000 w-1/3 group-hover:w-full"></div>
                                                {course.path.map((step: string, idx: number) => (
                                                    <div key={idx} className="relative z-10 group/step">
                                                        <div className="w-5 h-5 rounded-full bg-white border-2 border-slate-100 group-hover:border-primary group-hover:bg-primary transition-all duration-500 flex items-center justify-center">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-white transition-colors"></div>
                                                        </div>
                                                        <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 text-[10px] font-bold text-primary bg-white shadow-xl border border-slate-50 p-2 rounded-lg pointer-events-none z-20">
                                                            {step}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <button className="mt-auto w-full bg-slate-900 group-hover:bg-primary text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center transition-all shadow-xl shadow-slate-200 group-hover:shadow-red-500/20 border-b-4 border-slate-950 group-hover:border-red-900">
                                            Chi Tiết Khóa Học <ArrowRight size={16} className="ml-3 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-32 bg-slate-900 overflow-hidden relative text-center">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(199,0,43,0.1),transparent)]"></div>
                <div className="container mx-auto px-6 relative z-10 max-w-4xl">
                    <h2 className="text-white text-4xl md:text-6xl font-heading font-semibold mb-10 leading-tight">Bản đồ học thuật của bạn đang chờ</h2>
                    <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto leading-relaxed font-body">
                        "Navigation Partner" sẽ giúp bạn định vị chính xác trình độ và vẽ lại con đường ngắn nhất đến mục tiêu học thuật quốc tế.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <button className="bg-primary hover:bg-red-700 text-white px-10 py-5 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl shadow-red-500/20">
                            Yêu cầu tư vấn 1-1
                        </button>
                        <button className="bg-white/5 hover:bg-white/10 text-white border border-white/20 backdrop-blur-md px-10 py-5 rounded-full font-bold transition-all">
                            Xem lịch khai giảng mới nhất
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
