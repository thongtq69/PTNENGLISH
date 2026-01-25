"use client";

import React, { useState, useEffect } from 'react';
import {
    Plus, Trash2, Calendar, User, Tag, Edit, ExternalLink,
    Search, Filter, Image as ImageIcon, Layout, Mail,
    List, Save, Clock, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RichTitleEditor from './shared/RichTitleEditor';
import FileUpload from './shared/FileUpload';
import RichEditor from './shared/RichEditor';
import Link from "next/link";

const TABS = [
    { id: 'posts', name: 'Articles', icon: <List size={18} /> },
    { id: 'hero', name: 'Hero Banner', icon: <Layout size={18} /> },
    { id: 'config', name: 'Categories & Newsletter', icon: <Mail size={18} /> },
];

export default function BlogManager() {
    const [posts, setPosts] = useState<any[]>([]);
    const [pageData, setPageData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('posts');
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');

    // Editor State
    const [editingPost, setEditingPost] = useState<any>(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch('/api/posts', { cache: 'no-store' }).then(res => res.json()),
            fetch('/api/pages/blog', { cache: 'no-store' }).then(res => res.json())
        ]).then(([postsData, pageData]) => {
            setPosts(postsData);

            // Normalize page data
            const normalized = {
                hero: pageData.sections?.find((s: any) => s.type === 'blog-hero')?.content || { title: '', subtitle: '', description: '' },
                newsletter: pageData.sections?.find((s: any) => s.type === 'blog-newsletter')?.content || { title: '', description: '', buttonText: '' },
                categories: pageData.sections?.find((s: any) => s.type === 'blog-categories')?.content?.items || []
            };
            setPageData(normalized);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, []);

    const handleSavePage = async () => {
        if (!pageData) return;
        setSaving(true);
        try {
            const sections = [
                { id: 'blog-hero', type: 'blog-hero', content: pageData.hero, order: 1, isVisible: true },
                { id: 'blog-categories', type: 'blog-categories', content: { items: pageData.categories }, order: 2, isVisible: true },
                { id: 'blog-newsletter', type: 'blog-newsletter', content: pageData.newsletter, order: 3, isVisible: true },
            ];

            await fetch('/api/pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slug: 'blog',
                    title: 'Góc Tri Thức',
                    sections: sections
                })
            });
            alert("Page settings saved successfully!");
        } catch (e) {
            alert("Error saving page settings");
        } finally {
            setSaving(false);
        }
    };

    const handleDeletePost = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const newList = posts.filter(p => p._id !== id);
        setPosts(newList);
        await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newList)
        });
        const updatedPosts = await fetch('/api/posts', { cache: 'no-store' }).then(res => res.json());
        setPosts(updatedPosts);
    };

    const handleSavePost = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        let newList;
        if (editingPost._id) {
            // Edit existing
            newList = posts.map(p => p._id === editingPost._id ? editingPost : p);
        } else {
            // New Post
            const newPost = { ...editingPost, _id: Date.now().toString(), createdAt: new Date().toISOString() };
            newList = [newPost, ...posts];
        }

        try {
            await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newList)
            });
            // Re-fetch to get real DB IDs for new posts
            const updatedPosts = await fetch('/api/posts', { cache: 'no-store' }).then(res => res.json());
            setPosts(updatedPosts);
            setIsEditorOpen(false);
            setEditingPost(null);
        } catch (err) {
            alert("Error saving post");
        } finally {
            setSaving(false);
        }
    };

    const openEditor = (post: any = null) => {
        if (post) {
            setEditingPost(post);
        } else {
            setEditingPost({
                title: '',
                slug: '',
                excerpt: '',
                content: '',
                category: pageData.categories[0] || 'IELTS Expert',
                author: 'Admin PTN',
                date: new Date().toLocaleDateString('vi-VN'),
                readTime: '5 phút',
                image: ''
            });
        }
        setIsEditorOpen(true);
    };

    const generateSlug = (title: string) => {
        // Strip HTML tags first
        const plainTitle = title.replace(/<[^>]*>?/gm, '');

        return plainTitle
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[đĐ]/g, "d")
            .replace(/([^0-9a-z-\s])/g, "")
            .replace(/(\s+)/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const filteredPosts = posts.filter(p => {
        const matchesFilter = filter === 'All' || p.category === filter;
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) return <div className="p-20 text-center text-slate-500 animate-pulse">Loading blog manager...</div>;

    return (
        <div className="space-y-8 pb-40">
            <div className="flex justify-between items-end bg-slate-900 p-8 rounded-[2rem] border border-white/5">
                <div>
                    <h1 className="text-3xl font-heading font-black text-white tracking-tight">Blog & Academic Insights</h1>
                    <p className="text-slate-400 mt-2">Manage articles, page content, and subscription settings.</p>
                </div>
                {activeTab !== 'posts' && (
                    <button
                        onClick={handleSavePage}
                        disabled={saving}
                        className="bg-primary text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20"
                    >
                        <Save size={18} />
                        {saving ? "Saving..." : "Save Page Content"}
                    </button>
                )}
                {activeTab === 'posts' && (
                    <button
                        onClick={() => openEditor()}
                        className="bg-primary hover:bg-black text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-primary/20"
                    >
                        <Plus size={20} /> Write New Article
                    </button>
                )}
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 p-1.5 bg-slate-900 border border-white/5 rounded-2xl overflow-x-auto no-scrollbar">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shrink-0 ${activeTab === tab.id ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:bg-white/5"}`}
                    >
                        {tab.icon}
                        <span className="whitespace-nowrap">{tab.name}</span>
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* ARTICLES TAB */}
                    {activeTab === 'posts' && (
                        <div className="space-y-8">
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
                                    {(pageData?.categories || []).map((cat: string) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {filteredPosts.map((post, idx) => (
                                    <motion.div
                                        key={post._id}
                                        layout
                                        className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-primary/30 transition-all flex flex-col shadow-sm hover:shadow-2xl"
                                    >
                                        <div className="h-48 relative overflow-hidden">
                                            {post.image ? <img src={post.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /> : <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-700"><ImageIcon size={48} /></div>}
                                            <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-xl">{post.category}</div>
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
                                                    <button
                                                        onClick={() => openEditor(post)}
                                                        className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeletePost(post._id)}
                                                        className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:text-white hover:bg-red-500 transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <Link href={`/blog/${post.slug || post._id}`} target="_blank" className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-primary hover:text-white transition-all">
                                                    <ExternalLink size={16} />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* HERO TAB */}
                    {activeTab === 'hero' && (
                        <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <RichTitleEditor
                                        label="Main Headline"
                                        value={pageData.hero.title}
                                        onChange={val => setPageData({ ...pageData, hero: { ...pageData.hero, title: val } })}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Sub Headline / Tag</label>
                                    <input
                                        value={pageData.hero.subtitle}
                                        onChange={e => setPageData({ ...pageData, hero: { ...pageData.hero, subtitle: e.target.value } })}
                                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-slate-300 font-bold outline-none"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-4">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Page Description</label>
                                    <textarea
                                        rows={4}
                                        value={pageData.hero.description}
                                        onChange={e => setPageData({ ...pageData, hero: { ...pageData.hero, description: e.target.value } })}
                                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-slate-400 font-body outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CONFIG TAB */}
                    {activeTab === 'config' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Categories */}
                            <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl h-fit">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-black text-white px-2">Blog Categories</h2>
                                    <button onClick={() => setPageData({ ...pageData, categories: [...pageData.categories, 'New Category'] })} className="text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 bg-primary/5 px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-all">+ Add New</button>
                                </div>
                                <div className="space-y-3">
                                    {pageData.categories.map((cat: string, i: number) => (
                                        <div key={i} className="flex gap-2">
                                            <input
                                                value={cat}
                                                onChange={e => {
                                                    const list = [...pageData.categories];
                                                    list[i] = e.target.value;
                                                    setPageData({ ...pageData, categories: list });
                                                }}
                                                className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-white font-bold text-sm"
                                            />
                                            <button onClick={() => setPageData({ ...pageData, categories: pageData.categories.filter((_: any, j: number) => i !== j) })} className="p-2 text-red-500"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Newsletter */}
                            <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl h-fit">
                                <div className="flex items-center gap-4 text-primary">
                                    <Mail size={24} />
                                    <h2 className="text-xl font-black text-white">Newsletter CTA</h2>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Section Heading</label>
                                        <input value={pageData.newsletter.title} onChange={e => setPageData({ ...pageData, newsletter: { ...pageData.newsletter, title: e.target.value } })} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Description Text</label>
                                        <textarea value={pageData.newsletter.description} onChange={e => setPageData({ ...pageData, newsletter: { ...pageData.newsletter, description: e.target.value } })} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-slate-400 text-sm" rows={3} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Button Text</label>
                                        <input value={pageData.newsletter.buttonText} onChange={e => setPageData({ ...pageData, newsletter: { ...pageData.newsletter, buttonText: e.target.value } })} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-primary font-black uppercase tracking-widest" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
            {/* POST EDITOR MODAL */}
            <AnimatePresence>
                {isEditorOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 border border-white/10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] p-12 shadow-2xl custom-scrollbar"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-3xl font-heading font-black text-white">{editingPost._id ? 'Edit Article' : 'New Article'}</h2>
                                    <p className="text-slate-500 mt-2">Draft your academic insights for the community.</p>
                                </div>
                                <button onClick={() => setIsEditorOpen(false)} className="text-slate-500 hover:text-white">Close Window</button>
                            </div>

                            <form onSubmit={handleSavePost} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Title</label>
                                        <input
                                            required
                                            value={editingPost.title}
                                            onChange={e => {
                                                const title = e.target.value;
                                                setEditingPost({ ...editingPost, title, slug: editingPost._id ? editingPost.slug : generateSlug(title) });
                                            }}
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Slug (Manual override)</label>
                                        <input
                                            required
                                            value={editingPost.slug}
                                            onChange={e => setEditingPost({ ...editingPost, slug: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-primary font-bold"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Category</label>
                                        <select
                                            value={editingPost.category}
                                            onChange={e => setEditingPost({ ...editingPost, category: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-slate-300"
                                        >
                                            {(pageData?.categories || []).map((cat: string) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Author</label>
                                        <input
                                            value={editingPost.author}
                                            onChange={e => setEditingPost({ ...editingPost, author: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Publication Date</label>
                                        <input
                                            value={editingPost.date}
                                            onChange={e => setEditingPost({ ...editingPost, date: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Read Time (e.g. 5 phút)</label>
                                        <input
                                            value={editingPost.readTime}
                                            onChange={e => setEditingPost({ ...editingPost, readTime: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <FileUpload
                                            label="Featured Image"
                                            value={editingPost.image}
                                            onChange={(url) => setEditingPost({ ...editingPost, image: url })}
                                            folder="blog"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Excerpt (Brief Summary)</label>
                                    <textarea
                                        rows={3}
                                        value={editingPost.excerpt}
                                        onChange={e => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-slate-400"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <RichEditor
                                        label="Full Content (Supports Copy-Paste from Word)"
                                        value={editingPost.content}
                                        onChange={val => setEditingPost({ ...editingPost, content: val })}
                                        placeholder="Paste your content from Word or start writing here..."
                                    />
                                </div>

                                <div className="flex justify-end gap-4 pt-10 border-t border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditorOpen(false)}
                                        className="px-10 py-4 text-slate-500 font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-primary text-white px-12 py-4 rounded-xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                                    >
                                        {saving ? "Saving..." : "Publish Article"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
