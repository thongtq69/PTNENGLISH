export const dynamic = "force-dynamic";
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Trash2,
    Save,
    Image as ImageIcon,
    Calendar,
    User,
    Clock,
    CheckCircle2,
    Search,
    ChevronRight,
    Tag
} from "lucide-react";

export default function BlogManagementPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch("/api/posts")
            .then(res => res.json())
            .then(data => {
                setPosts(data);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(posts)
            });
            if (res.ok) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-slate-400">Loading posts...</div>;

    const addPost = () => {
        setPosts([...posts, {
            id: Date.now(),
            title: "Tiêu đề bài viết mới",
            excerpt: "Mô tả ngắn về bài viết...",
            category: "IELTS Expert",
            author: "Admin",
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            readTime: "5 phút",
            image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800"
        }]);
    };

    const filteredPosts = posts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-40 bg-[#0F172A]/80 backdrop-blur-md py-4">
                <div>
                    <h2 className="text-2xl font-bold font-heading">Quản lý bài viết (Blog)</h2>
                    <p className="text-slate-400">Đăng tải kiến thức, kinh nghiệm and lộ trình học thuật.</p>
                </div>
                <div className="flex items-center gap-3">
                    {showSuccess && (
                        <motion.span
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-green-400 text-sm font-bold flex items-center gap-2"
                        >
                            <CheckCircle2 size={16} /> Saved Successfully
                        </motion.span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : <><Save size={18} /> Lưu thay đổi</>}
                    </button>
                </div>
            </header>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-primary"
                        placeholder="Tìm kiếm bài viết..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={addPost}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold border border-slate-700 transition-all"
                >
                    <Plus size={18} /> Thêm bài viết
                </button>
            </div>

            <div className="space-y-6">
                {filteredPosts.map((post, idx) => (
                    <div key={post.id} className="bg-[#1E293B]/30 border border-slate-800 rounded-3xl p-8 flex flex-col xl:flex-row gap-8">
                        <div className="w-full xl:w-64 h-48 bg-slate-800 rounded-2xl overflow-hidden shrink-0 border border-slate-700">
                            <img src={post.image} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2 w-full">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary mb-1">
                                        <Tag size={12} />
                                        <input
                                            className="bg-transparent border-none p-0 outline-none w-32 focus:text-white"
                                            value={post.category}
                                            onChange={(e) => {
                                                const np = [...posts];
                                                const pidx = posts.findIndex(item => item.id === post.id);
                                                np[pidx].category = e.target.value;
                                                setPosts(np);
                                            }}
                                        />
                                    </div>
                                    <input
                                        className="bg-transparent border-none text-2xl font-bold p-0 w-full outline-none focus:text-primary transition-colors font-heading"
                                        value={post.title}
                                        onChange={(e) => {
                                            const np = [...posts];
                                            const pidx = posts.findIndex(item => item.id === post.id);
                                            np[pidx].title = e.target.value;
                                            setPosts(np);
                                        }}
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        const np = posts.filter(item => item.id !== post.id);
                                        setPosts(np);
                                    }}
                                    className="text-slate-600 hover:text-red-400 p-2"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                            <textarea
                                className="bg-slate-800/30 border border-slate-800 rounded-xl p-4 w-full text-sm text-slate-400 outline-none focus:border-primary min-h-[80px]"
                                value={post.excerpt}
                                onChange={(e) => {
                                    const np = [...posts];
                                    const pidx = posts.findIndex(item => item.id === post.id);
                                    np[pidx].excerpt = e.target.value;
                                    setPosts(np);
                                }}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase text-slate-500 block">Tác giả</label>
                                    <div className="relative">
                                        <User size={12} className="absolute left-3 top-3 text-slate-500" />
                                        <input
                                            className="w-full bg-slate-800/30 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-[11px] outline-none"
                                            value={post.author}
                                            onChange={(e) => {
                                                const np = [...posts];
                                                const pidx = posts.findIndex(item => item.id === post.id);
                                                np[pidx].author = e.target.value;
                                                setPosts(np);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase text-slate-500 block">Ngày đăng</label>
                                    <div className="relative">
                                        <Calendar size={12} className="absolute left-3 top-3 text-slate-500" />
                                        <input
                                            className="w-full bg-slate-800/30 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-[11px] outline-none"
                                            value={post.date}
                                            onChange={(e) => {
                                                const np = [...posts];
                                                const pidx = posts.findIndex(item => item.id === post.id);
                                                np[pidx].date = e.target.value;
                                                setPosts(np);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase text-slate-500 block">Thời gian đọc</label>
                                    <div className="relative">
                                        <Clock size={12} className="absolute left-3 top-3 text-slate-500" />
                                        <input
                                            className="w-full bg-slate-800/30 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-[11px] outline-none"
                                            value={post.readTime}
                                            onChange={(e) => {
                                                const np = [...posts];
                                                const pidx = posts.findIndex(item => item.id === post.id);
                                                np[pidx].readTime = e.target.value;
                                                setPosts(np);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase text-slate-500 block">Image URL</label>
                                    <div className="relative">
                                        <ImageIcon size={12} className="absolute left-3 top-3 text-slate-500" />
                                        <input
                                            className="w-full bg-slate-800/30 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-[11px] outline-none"
                                            value={post.image}
                                            onChange={(e) => {
                                                const np = [...posts];
                                                const pidx = posts.findIndex(item => item.id === post.id);
                                                np[pidx].image = e.target.value;
                                                setPosts(np);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
