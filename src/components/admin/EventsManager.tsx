"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    Plus, Trash2, Calendar, MapPin, Edit, ExternalLink,
    Search, Image as ImageIcon, X, Sparkles, Link as LinkIcon,
    Upload, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RichTitleEditor from './shared/RichTitleEditor';
import FileUpload from './shared/FileUpload';
import AdvancedEditor from './shared/AdvancedEditor';
import Link from "next/link";

interface EventData {
    _id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    date: string;
    eventDate?: string;
    location?: string;
    readTime?: string;
    image?: string;
    originalImage?: string;
    gallery?: string[];
    tags?: string[];
    sourceUrl?: string;
    showInBlog?: boolean;
    featured?: boolean;
    createdAt?: string;
}

const EMPTY_EVENT: EventData = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Sự kiện',
    author: 'PTN English',
    date: new Date().toLocaleDateString('vi-VN'),
    eventDate: '',
    location: '',
    readTime: '5 phút',
    image: '',
    originalImage: '',
    gallery: [],
    tags: [],
    sourceUrl: '',
    showInBlog: true,
    featured: false
};

const CATEGORY_PRESETS = ['Sự kiện', 'Cuộc thi', 'Hội thảo', 'Hoạt động cộng đồng', 'Tin nội bộ'];

export default function EventsManager() {
    const [events, setEvents] = useState<EventData[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');

    const [editing, setEditing] = useState<EventData | null>(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [isUploadingGallery, setIsUploadingGallery] = useState(false);
    const [galleryInput, setGalleryInput] = useState('');
    const [tagInput, setTagInput] = useState('');
    const galleryFileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch('/api/events', { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                setEvents(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const generateSlug = (title: string) => {
        const plain = title.replace(/<[^>]*>?/gm, '');
        return plain
            .toLowerCase()
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .replace(/[đĐ]/g, "d")
            .replace(/([^0-9a-z-\s])/g, "")
            .replace(/(\s+)/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const openEditor = (event: EventData | null = null) => {
        if (event) {
            setEditing({
                ...event,
                gallery: event.gallery || [],
                tags: event.tags || [],
                originalImage: event.originalImage || event.image || '',
                showInBlog: event.showInBlog !== false
            });
        } else {
            setEditing({ ...EMPTY_EVENT });
        }
        setGalleryInput('');
        setTagInput('');
        setIsEditorOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Xoá sự kiện này?")) return;
        const newList = events.filter(e => e._id !== id);
        setEvents(newList);
        await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newList)
        });
        const updated = await fetch('/api/events', { cache: 'no-store' }).then(r => r.json());
        setEvents(updated);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing) return;
        setSaving(true);

        let newList: EventData[];
        if (editing._id) {
            newList = events.map(ev => ev._id === editing._id ? editing : ev);
        } else {
            const newEv = { ...editing, _id: Date.now().toString(), createdAt: new Date().toISOString() };
            newList = [newEv, ...events];
        }

        try {
            await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newList)
            });
            const updated = await fetch('/api/events', { cache: 'no-store' }).then(r => r.json());
            setEvents(updated);
            setIsEditorOpen(false);
            setEditing(null);
        } catch {
            alert("Không thể lưu sự kiện. Vui lòng thử lại.");
        } finally {
            setSaving(false);
        }
    };

    const addGalleryUrl = () => {
        if (!editing || !galleryInput.trim()) return;
        const urls = galleryInput.split(/\s+/).map(u => u.trim()).filter(Boolean);
        setEditing({ ...editing, gallery: [...(editing.gallery || []), ...urls] });
        setGalleryInput('');
    };

    const removeGalleryUrl = (idx: number) => {
        if (!editing) return;
        setEditing({ ...editing, gallery: (editing.gallery || []).filter((_, i) => i !== idx) });
    };

    const uploadSingleFile = async (file: File): Promise<string | null> => {
        const maxSizeMB = 25;
        if (file.size / (1024 * 1024) > maxSizeMB) {
            alert(`Ảnh "${file.name}" quá lớn (tối đa ${maxSizeMB}MB).`);
            return null;
        }
        if (!file.type.startsWith('image/')) {
            alert(`Tệp "${file.name}" không phải ảnh.`);
            return null;
        }
        try {
            const timestamp = Math.round(Date.now() / 1000);
            const folderPath = `ptn_english/events/gallery`;
            const signRes = await fetch('/api/upload/sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paramsToSign: { timestamp, folder: folderPath } }),
            });
            const { signature, error: signError } = await signRes.json();
            if (signError) throw new Error(signError);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', '798193785297581');
            formData.append('timestamp', timestamp.toString());
            formData.append('signature', signature);
            formData.append('folder', folderPath);

            const res = await fetch(`https://api.cloudinary.com/v1_1/dtzegtrxb/auto/upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.secure_url) return data.secure_url as string;
            throw new Error(data.error?.message || 'Cloudinary upload failed');
        } catch (err: any) {
            console.error('[Gallery upload]', err);
            alert(err.message || 'Lỗi khi tải ảnh lên.');
            return null;
        }
    };

    const handleGalleryFiles = async (files: FileList | null) => {
        if (!files || files.length === 0 || !editing) return;
        setIsUploadingGallery(true);
        const newUrls: string[] = [];
        for (const file of Array.from(files)) {
            const url = await uploadSingleFile(file);
            if (url) newUrls.push(url);
        }
        if (newUrls.length > 0) {
            setEditing(prev => prev ? { ...prev, gallery: [...(prev.gallery || []), ...newUrls] } : prev);
        }
        setIsUploadingGallery(false);
        if (galleryFileInputRef.current) galleryFileInputRef.current.value = '';
    };

    const addTag = () => {
        if (!editing || !tagInput.trim()) return;
        const tags = tagInput.split(/[\s,]+/).map(t => t.replace(/^#/, '').trim()).filter(Boolean);
        setEditing({ ...editing, tags: [...(editing.tags || []), ...tags] });
        setTagInput('');
    };

    const removeTag = (idx: number) => {
        if (!editing) return;
        setEditing({ ...editing, tags: (editing.tags || []).filter((_, i) => i !== idx) });
    };

    const filtered = events.filter(ev =>
        !search || ev.title?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="p-20 text-center text-slate-500 animate-pulse">Loading events...</div>;

    return (
        <div className="space-y-8 pb-40">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-slate-900 p-8 rounded-[2rem] border border-white/5">
                <div>
                    <div className="flex items-center gap-3 text-primary mb-3">
                        <Sparkles size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">PTN Events Hub</span>
                    </div>
                    <h1 className="text-3xl font-heading font-black text-white tracking-tight">Sự kiện & Hoạt động</h1>
                    <p className="text-slate-400 mt-2">Tạo trang sự kiện mới, quản lý thư viện ảnh và đồng bộ nội dung lên trang Tin tức & Học thuật.</p>
                </div>
                <button
                    onClick={() => openEditor()}
                    className="bg-primary hover:bg-black text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-primary/20 whitespace-nowrap"
                >
                    <Plus size={20} /> Thêm sự kiện mới
                </button>
            </div>

            {/* Search */}
            <div className="flex gap-4 items-center bg-slate-900/50 p-6 rounded-[2rem] border border-white/5">
                <div className="relative flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        placeholder="Tìm kiếm sự kiện theo tiêu đề..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-14 pr-6 py-3.5 text-white outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
            </div>

            {/* List */}
            {filtered.length === 0 ? (
                <div className="py-32 text-center text-slate-500 bg-slate-900/50 rounded-[2rem] border border-white/5">
                    <Calendar size={48} className="mx-auto text-slate-700 mb-6" />
                    <h3 className="text-xl font-black text-white mb-2">Chưa có sự kiện nào</h3>
                    <p className="text-sm">Bấm "Thêm sự kiện mới" để tạo trang sự kiện đầu tiên.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filtered.map((ev) => (
                        <motion.div
                            key={ev._id}
                            layout
                            className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-primary/30 transition-all flex flex-col shadow-sm hover:shadow-2xl"
                        >
                            <div className="h-48 relative overflow-hidden bg-slate-800">
                                {ev.image ? (
                                    <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-700">
                                        <ImageIcon size={48} />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-xl">
                                        {ev.category}
                                    </span>
                                    {ev.featured && (
                                        <span className="bg-yellow-400 text-slate-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-xl">
                                            Featured
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex-wrap">
                                    {ev.eventDate && (
                                        <span className="flex items-center gap-1.5">
                                            <Calendar size={12} className="text-primary" /> {ev.eventDate}
                                        </span>
                                    )}
                                    {ev.location && (
                                        <span className="flex items-center gap-1.5">
                                            <MapPin size={12} className="text-primary" /> {ev.location}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-4 line-clamp-2 leading-tight group-hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: ev.title }} />
                                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-8 italic">{ev.excerpt}</p>
                                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditor(ev)}
                                            className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(ev._id!)}
                                            className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:text-white hover:bg-red-500 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <Link href={`/events/${ev.slug || ev._id}`} target="_blank" className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-primary hover:text-white transition-all">
                                        <ExternalLink size={16} />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Editor Modal */}
            <AnimatePresence>
                {isEditorOpen && editing && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 border border-white/10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] p-8 md:p-12 shadow-2xl custom-scrollbar"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-heading font-black text-white">
                                        {editing._id ? 'Chỉnh sửa sự kiện' : 'Sự kiện mới'}
                                    </h2>
                                    <p className="text-slate-500 mt-2">Chia sẻ các hoạt động nổi bật của PTN English.</p>
                                </div>
                                <button onClick={() => setIsEditorOpen(false)} className="text-slate-500 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4 md:col-span-2">
                                        <RichTitleEditor
                                            label="Tiêu đề sự kiện"
                                            value={editing.title}
                                            onChange={val => setEditing({
                                                ...editing,
                                                title: val,
                                                slug: editing._id ? editing.slug : generateSlug(val)
                                            })}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Slug</label>
                                        <input
                                            required
                                            value={editing.slug}
                                            onChange={e => setEditing({ ...editing, slug: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-primary font-bold"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Danh mục</label>
                                        <input
                                            list="event-categories"
                                            value={editing.category}
                                            onChange={e => setEditing({ ...editing, category: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold"
                                        />
                                        <datalist id="event-categories">
                                            {CATEGORY_PRESETS.map(c => <option key={c} value={c} />)}
                                        </datalist>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ngày diễn ra</label>
                                        <input
                                            placeholder="VD: 15/04/2026"
                                            value={editing.eventDate || ''}
                                            onChange={e => setEditing({ ...editing, eventDate: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Địa điểm</label>
                                        <input
                                            placeholder="VD: TPHCM"
                                            value={editing.location || ''}
                                            onChange={e => setEditing({ ...editing, location: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ngày đăng</label>
                                        <input
                                            value={editing.date}
                                            onChange={e => setEditing({ ...editing, date: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Người đăng</label>
                                        <input
                                            value={editing.author}
                                            onChange={e => setEditing({ ...editing, author: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold"
                                        />
                                    </div>

                                    <div className="space-y-4 md:col-span-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <LinkIcon size={12} /> Link bài gốc (tuỳ chọn)
                                        </label>
                                        <input
                                            placeholder="https://www.facebook.com/PTNEnglish/posts/..."
                                            value={editing.sourceUrl || ''}
                                            onChange={e => setEditing({ ...editing, sourceUrl: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-slate-300"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <FileUpload
                                            label="Ảnh đại diện (sẽ hiển thị trên trang danh sách)"
                                            value={editing.image || ''}
                                            originalValue={editing.originalImage}
                                            onChange={(url, meta) => {
                                                setEditing((prev) => {
                                                    if (!prev) return prev;
                                                    if (meta?.isCropped) {
                                                        return { ...prev, image: url };
                                                    }
                                                    return { ...prev, image: url, originalImage: url };
                                                });
                                            }}
                                            onUploading={setIsUploadingImage}
                                            folder="events"
                                            aspect={16 / 9}
                                        />
                                    </div>
                                </div>

                                {/* Gallery */}
                                <div className="space-y-4 p-6 rounded-2xl bg-slate-950/50 border border-white/5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            Thư viện hình ảnh ({editing.gallery?.length || 0})
                                        </label>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            type="button"
                                            onClick={() => galleryFileInputRef.current?.click()}
                                            disabled={isUploadingGallery}
                                            className="flex items-center gap-2 bg-primary hover:bg-red-600 text-white px-5 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                                        >
                                            {isUploadingGallery ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                            {isUploadingGallery ? 'Đang tải...' : 'Chọn ảnh (có thể chọn nhiều)'}
                                        </button>
                                        <input
                                            ref={galleryFileInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => handleGalleryFiles(e.target.files)}
                                            className="hidden"
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="flex gap-2">
                                            <input
                                                placeholder="Hoặc dán URL ảnh (phân tách bằng khoảng trắng/xuống dòng)"
                                                value={galleryInput}
                                                onChange={e => setGalleryInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        addGalleryUrl();
                                                    }
                                                }}
                                                className="flex-1 bg-slate-900 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white"
                                            />
                                            <button
                                                type="button"
                                                onClick={addGalleryUrl}
                                                className="bg-white/5 hover:bg-white/10 text-white px-5 rounded-xl font-bold text-sm transition-colors"
                                            >
                                                Thêm URL
                                            </button>
                                        </div>
                                    </div>

                                    {editing.gallery && editing.gallery.length > 0 && (
                                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-2">
                                            {editing.gallery.map((url, idx) => (
                                                <div key={`${url}-${idx}`} className="relative group aspect-square rounded-xl overflow-hidden bg-slate-800 border border-white/5">
                                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeGalleryUrl(idx)}
                                                        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-90 hover:scale-110 transition-transform"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Tags */}
                                <div className="space-y-4 p-6 rounded-2xl bg-slate-950/50 border border-white/5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Hashtags
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            placeholder="PTNEnglish, YoungLionsVietnam..."
                                            value={tagInput}
                                            onChange={e => setTagInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addTag();
                                                }
                                            }}
                                            className="flex-1 bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={addTag}
                                            className="bg-primary text-white px-6 rounded-xl font-bold text-sm hover:scale-105 transition-transform"
                                        >
                                            Thêm
                                        </button>
                                    </div>
                                    {editing.tags && editing.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {editing.tags.map((tag, idx) => (
                                                <span key={idx} className="px-3 py-1.5 bg-slate-800 rounded-full text-xs font-bold text-white flex items-center gap-2">
                                                    #{tag}
                                                    <button type="button" onClick={() => removeTag(idx)} className="text-slate-400 hover:text-red-400">
                                                        <X size={12} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mô tả ngắn</label>
                                    <textarea
                                        rows={3}
                                        value={editing.excerpt}
                                        onChange={e => setEditing({ ...editing, excerpt: e.target.value })}
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-slate-400"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <AdvancedEditor
                                        label="Nội dung chi tiết"
                                        value={editing.content}
                                        onChange={(val: string) => setEditing({ ...editing, content: val })}
                                        placeholder="Dán nội dung bài viết từ Facebook hoặc viết mới..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-2xl bg-slate-950/50 border border-white/5">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={editing.featured || false}
                                            onChange={e => setEditing({ ...editing, featured: e.target.checked })}
                                            className="w-5 h-5 accent-primary"
                                        />
                                        <div>
                                            <div className="text-sm font-bold text-white">Đặt làm sự kiện nổi bật</div>
                                            <div className="text-[10px] text-slate-500">Hiển thị lớn ở đầu trang Sự kiện.</div>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={editing.showInBlog !== false}
                                            onChange={e => setEditing({ ...editing, showInBlog: e.target.checked })}
                                            className="w-5 h-5 accent-primary"
                                        />
                                        <div>
                                            <div className="text-sm font-bold text-white">Hiển thị trong Tin tức & Học thuật</div>
                                            <div className="text-[10px] text-slate-500">Sự kiện cũng xuất hiện trên trang /blog.</div>
                                        </div>
                                    </label>
                                </div>

                                <div className="flex justify-end gap-4 pt-10 border-t border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditorOpen(false)}
                                        className="px-10 py-4 text-slate-500 font-bold"
                                    >
                                        Huỷ
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving || isUploadingImage}
                                        className={`bg-primary text-white px-12 py-4 rounded-xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2 ${(saving || isUploadingImage) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                                    >
                                        {saving ? "Đang lưu..." : isUploadingImage ? "Đang tải ảnh..." : "Đăng sự kiện"}
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
