"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Trophy, User, Save, CheckCircle2, Image as ImageIcon, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AchievementManager() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('/api/achievements')
            .then(res => res.json())
            .then(d => {
                setData(d);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch('/api/achievements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            alert("Achievements updated!");
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

    if (loading) return <div>Loading Hall of Fame...</div>;

    return (
        <div className="space-y-12 pb-32">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-heading font-black text-white tracking-tight">Hall of Fame</h1>
                    <p className="text-slate-400 mt-2">Showcase high-scoring students and their certifications.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setData([{ student: 'Student Name', score: '8.0', title: 'IELTS High Achiever', url: '' }, ...data])}
                        className="flex items-center gap-2 px-6 py-4 rounded-xl font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                    >
                        <Plus size={20} /> Add Student
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-primary text-white hover:scale-105 transition-all shadow-xl"
                    >
                        {saving ? "Updating..." : "Save Hall of Fame"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.map((item, idx) => (
                    <motion.div
                        key={idx}
                        layout
                        className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] relative group"
                    >
                        <button
                            onClick={() => setData(data.filter((_, i) => i !== idx))}
                            className="absolute top-6 right-6 p-2 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                        >
                            <Trash2 size={16} />
                        </button>
                        <div className="w-full aspect-[3/4] rounded-2xl bg-slate-800 mb-6 overflow-hidden border border-white/5 relative">
                            {item.url ? (
                                <img src={item.url} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-700">
                                    <ImageIcon size={48} />
                                </div>
                            )}
                            <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-lg">
                                <Star size={20} fill="white" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">Student Name</label>
                                <input value={item.student} onChange={e => updateItem(idx, 'student', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-white font-bold" />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">Band Score / Result</label>
                                    <input value={item.score} onChange={e => updateItem(idx, 'score', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-primary font-black" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">Badge Title</label>
                                    <input value={item.title} onChange={e => updateItem(idx, 'title', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-slate-400 text-[10px]" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">Certificate Image URL</label>
                                <input value={item.url} onChange={e => updateItem(idx, 'url', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-slate-600 text-[10px] truncate" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
