"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Heart, User, Quote, Save, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TestimonialManager() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('/api/testimonials')
            .then(res => res.json())
            .then(d => {
                setData(d);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch('/api/testimonials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            alert("Testimonials saved!");
        } catch (err) {
            alert("Error saving");
        } finally {
            setSaving(false);
        }
    };

    const updateItem = (idx: number, field: string, value: string) => {
        const list = [...data];
        list[idx] = { ...list[idx], [field]: value };
        setData(list);
    };

    if (loading) return <div>Loading Testimonials...</div>;

    return (
        <div className="space-y-12 pb-32">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-heading font-black text-white tracking-tight">Student Success Stories</h1>
                    <p className="text-slate-400 mt-2">Manage student feedback and public testimonials.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setData([{ name: 'Học viên mới', role: 'IELTS Student', content: '', image: '' }, ...data])}
                        className="flex items-center gap-2 px-6 py-4 rounded-xl font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                    >
                        <Plus size={20} /> Add New
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-primary text-white hover:scale-105 transition-all shadow-xl"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.map((item, idx) => (
                    <motion.div
                        key={idx}
                        layout
                        className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] relative group"
                    >
                        <button
                            onClick={() => setData(data.filter((_, i) => i !== idx))}
                            className="absolute top-6 right-6 p-2 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                        >
                            <Trash2 size={16} />
                        </button>
                        <div className="flex gap-6 mb-8">
                            <div className="w-20 h-20 rounded-2xl bg-slate-800 shrink-0 overflow-hidden border border-white/10">
                                {item.image ? (
                                    <img src={item.image} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-700 font-black">{item.name?.charAt(0)}</div>
                                )}
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Name</label>
                                    <input value={item.name} onChange={e => updateItem(idx, 'name', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-white font-bold text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Role / Subtitle</label>
                                    <input value={item.role} onChange={e => updateItem(idx, 'role', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-primary font-bold text-xs" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Quote size={12} /> Testimonial Content</label>
                            <textarea rows={4} value={item.content} onChange={e => updateItem(idx, 'content', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-slate-400 text-sm leading-relaxed" />
                        </div>
                        <div className="mt-6 flex items-center gap-3">
                            <ImageIcon size={14} className="text-slate-600" />
                            <input value={item.image} placeholder="Cloudinary Image URL" onChange={e => updateItem(idx, 'image', e.target.value)} className="flex-1 bg-transparent border-none outline-none text-[10px] text-slate-500 focus:text-white transition-colors" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
