"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, CheckCircle2, XCircle, Search, User, Users, Briefcase, GraduationCap, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AboutEditor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<number | null>(null);

    useEffect(() => {
        fetch('/api/about-us')
            .then(res => res.json())
            .then(d => {
                // Ensure default structure
                const normalized = {
                    story: d.story || { title: '', quote: '', text: '' },
                    teachers: d.teachers || [],
                    hero: d.hero || { title: '', subtitle: '', highlight: '' },
                    philosophy: d.philosophy || [],
                    values: d.values || [],
                    differences: d.differences || []
                };
                setData(normalized);
                setLoading(false);
            })
            .catch(() => {
                setData({
                    story: { title: '', quote: '', text: '' },
                    teachers: [],
                    hero: { title: '', subtitle: '', highlight: '' },
                    philosophy: [],
                    values: [],
                    differences: []
                });
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        if (!data) return;
        setSaving(true);
        try {
            await fetch('/api/about-us', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            alert("Saved successfully!");
        } catch (e) {
            alert("Error saving");
        } finally {
            setSaving(false);
        }
    };

    const updateTeacher = (idx: number, field: string, value: any) => {
        if (!data) return;
        const teachers = [...data.teachers];
        teachers[idx] = { ...teachers[idx], [field]: value };
        setData({ ...data, teachers });
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
    );

    if (!data) return <div>No data found.</div>;

    return (
        <div className="space-y-12 pb-32">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-heading font-black text-white tracking-tight">About Us Management</h1>
                    <p className="text-slate-400 mt-2">Manage expert faculty, core philosophy, and your brand story.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20"
                >
                    {saving ? "Saving..." : "Save About Us"}
                </button>
            </div>

            {/* Story Content */}
            <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 space-y-8">
                <h2 className="text-xl font-black text-white flex items-center gap-3">
                    <span className="w-8 h-1 bg-primary rounded-full"></span>
                    Our Story
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Headline</label>
                        <input
                            value={data.story?.title || ''}
                            onChange={e => setData({ ...data, story: { ...data.story, title: e.target.value } })}
                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Quote / Mission</label>
                        <input
                            value={data.story?.quote || ''}
                            onChange={e => setData({ ...data, story: { ...data.story, quote: e.target.value } })}
                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-slate-300 italic"
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Main Content (HTML Supported)</label>
                    <textarea
                        rows={6}
                        value={data.story?.text || data.story?.mainText || ''}
                        onChange={e => setData({ ...data, story: { ...data.story, text: e.target.value } })}
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-slate-400 font-body text-sm leading-relaxed"
                    />
                </div>
            </section>

            {/* Teacher Pool */}
            <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-indigo-500 text-white shadow-lg">
                            <Users size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white">Expert Faculty Pool</h2>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Manage MA.TESOL teachers</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            const newTeachers = [...(data.teachers || []), { name: 'New Teacher', image: '/gv-placeholder.png', certs: '', exp: '', desc: '' }];
                            setData({ ...data, teachers: newTeachers });
                        }}
                        className="px-6 py-3 rounded-full bg-primary text-white font-bold text-xs"
                    >
                        Add New Teacher
                    </button>
                </div>

                <div className="divide-y divide-white/5">
                    {(data.teachers || []).map((teacher: any, idx: number) => (
                        <div key={idx} className="p-8 hover:bg-white/[0.02] transition-colors group">
                            <div className="flex flex-col xl:flex-row gap-8">
                                <div className="w-32 h-32 rounded-3xl bg-slate-800 shrink-0 overflow-hidden border border-white/10 group-hover:border-primary/50 transition-colors">
                                    {teacher.image ? (
                                        <img src={teacher.image} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-600"><User /></div>
                                    )}
                                </div>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Name</label>
                                                <input value={teacher.name} onChange={e => updateTeacher(idx, 'name', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-white font-bold text-sm" />
                                            </div>
                                            <div className="w-1/3">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Image URL</label>
                                                <input value={teacher.image} onChange={e => updateTeacher(idx, 'image', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-slate-500 text-[10px]" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Credentials (Certs)</label>
                                            <input value={teacher.certs} onChange={e => updateTeacher(idx, 'certs', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-primary text-sm font-bold" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Experience</label>
                                            <input value={teacher.exp} onChange={e => updateTeacher(idx, 'exp', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-slate-300 text-sm font-medium" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Description</label>
                                            <textarea value={teacher.desc} onChange={e => updateTeacher(idx, 'desc', e.target.value)} rows={2} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-slate-500 text-xs leading-relaxed" />
                                        </div>
                                    </div>
                                </div>
                                <div className="xl:w-20 flex xl:flex-col justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            const filtered = data.teachers.filter((_: any, i: number) => i !== idx);
                                            setData({ ...data, teachers: filtered });
                                        }}
                                        className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Philosophy & Differences could be added similarly */}
        </div>
    );
}
