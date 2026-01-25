"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, User, Tag, Edit, ExternalLink, Search, Filter, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BlogManager() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch('/api/posts')
            .then(res => res.json())
            .then(data => {
                setPosts(data);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const newList = posts.filter(p => p._id !== id);
        setPosts(newList);
        // Sync with DB
        await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newList)
        });
    };

    const filteredPosts = posts.filter(p => {
        const matchesFilter = filter === 'All' || p.category === filter;
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-12 pb-32">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-heading font-black text-white tracking-tight">Blog & Academic Insights</h1>
                    <p className="text-slate-400 mt-2">Create and manage articles to drive knowledge and SEO growth.</p>
                </div>
                <button className="bg-primary text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20">
                    <Plus size={20} /> Write New Article
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center bg-slate-900/50 p-6 rounded-[2rem] border border-white/5">
                <div className="relative flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        placeholder="Search articles by title..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-14 pr-6 py-3.5 text-white outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
                <select
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    className="bg-slate-950 border border-white/5 rounded-2xl px-6 py-3.5 text-slate-300 outline-none min-w-[200px]"
                >
                    <option value="All">All Categories</option>
                    <option value="IELTS Expert">IELTS Expert</option>
                    <option value="Học thuật (Teens)">Học thuật (Teens)</option>
                    <option value="Lộ trình du học">Lộ trình du học</option>
                    <option value="Kinh nghiệm học tập">Kinh nghiệm học tập</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <AnimatePresence>
                    {filteredPosts.map((post, idx) => (
                        <motion.div
                            key={post._id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-primary/30 transition-all flex flex-col shadow-sm hover:shadow-2xl"
                        >
                            <div className="h-48 relative overflow-hidden">
                                {post.image ? (
                                    <img src={post.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-700"><ImageIcon size={48} /></div>
                                )}
                                <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                    {post.category}
                                </div>
                            </div>
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
                                    <span className="flex items-center gap-1.5"><Calendar size={12} className="text-primary" /> {post.date}</span>
                                    <span className="flex items-center gap-1.5"><User size={12} className="text-primary" /> {post.author}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-4 line-clamp-2 leading-tight group-hover:text-primary transition-colors">{post.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-8 italic">"{post.excerpt}"</p>

                                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <button className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post._id)}
                                            className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:text-white hover:bg-red-500 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <button className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-primary hover:text-white transition-all">
                                        <ExternalLink size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredPosts.length === 0 && (
                <div className="py-20 text-center bg-slate-900 border border-dashed border-white/10 rounded-[3rem]">
                    <p className="text-slate-500 font-bold">No articles found matching your criteria.</p>
                </div>
            )}
        </div>
    );
}
