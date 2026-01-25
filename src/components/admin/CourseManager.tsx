"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowRight, Target, Settings2, CheckCircle2, ChevronDown, ChevronUp, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CourseManager() {
    const [courses, setCourses] = useState<any[]>([]);
    const [banner, setBanner] = useState<any>({ title: '', subtitle: '', description: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'courses' | 'banner'>('courses');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([
            fetch('/api/courses').then(res => res.json()),
            fetch('/api/pages/courses').then(res => res.json())
        ]).then(([cData, pData]) => {
            setCourses(cData);
            if (pData && pData.sections) {
                const b = pData.sections.find((s: any) => s.type === 'courses-hero')?.content;
                if (b) {
                    setBanner(b);
                } else {
                    setBanner({
                        title: "Lộ Trình <span class='text-primary font-bold'>Chuyên Biệt</span> <br /> Kiến Tạo Bản Lĩnh",
                        subtitle: "The Academic Navigation Roadmap",
                        description: "Khám phá các khóa học được thiết kế chuẩn Châu Âu, giúp bạn nắm bắt cơ hội học tập toàn cầu."
                    });
                }
            } else {
                setBanner({
                    title: "Lộ Trình <span class='text-primary font-bold'>Chuyên Biệt</span> <br /> Kiến Tạo Bản Lĩnh",
                    subtitle: "The Academic Navigation Roadmap",
                    description: "Khám phá các khóa học được thiết kế chuẩn Châu Âu, giúp bạn nắm bắt cơ hội học tập toàn cầu."
                });
            }
            setLoading(false);
        });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await Promise.all([
                fetch('/api/courses', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(courses)
                }),
                fetch('/api/pages', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        slug: 'courses',
                        title: 'Courses Page',
                        sections: [{ id: 'courses-hero', type: 'courses-hero', content: banner, order: 1, isVisible: true }]
                    })
                })
            ]);
            alert("Courses & Banner updated!");
        } catch (e) {
            alert("Error saving");
        } finally {
            setSaving(false);
        }
    };

    const updateCourse = (idx: number, field: string, value: any) => {
        const list = [...courses];
        list[idx] = { ...list[idx], [field]: value };
        setCourses(list);
    };

    const updatePath = (courseIdx: number, pathIdx: number, value: string) => {
        const list = [...courses];
        const path = [...list[courseIdx].path];
        path[pathIdx] = value;
        list[courseIdx].path = path;
        setCourses(list);
    };

    if (loading) return <div className="p-20 text-center text-slate-500">Loading curriculum...</div>;

    return (
        <div className="space-y-12 pb-32">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-heading font-black text-white tracking-tight">Academic Curriculum</h1>
                    <p className="text-slate-400 mt-2">Manage the roadmap, pricing, and details of all active courses.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20"
                >
                    {saving ? "Updating..." : "Save All Changes"}
                </button>
            </div>

            {/* Tab Nav */}
            <div className="flex gap-2 p-1.5 bg-slate-900 border border-white/5 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('courses')}
                    className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'courses' ? "bg-slate-700 text-white shadow-lg" : "text-slate-400 hover:bg-white/5"}`}
                >
                    Roadmap List
                </button>
                <button
                    onClick={() => setActiveTab('banner')}
                    className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'banner' ? "bg-slate-700 text-white shadow-lg" : "text-slate-400 hover:bg-white/5"}`}
                >
                    Hero Banner
                </button>
            </div>

            {activeTab === 'courses' ? (
                <div className="grid grid-cols-1 gap-6">
                    {courses.map((course, idx) => (
                        <div key={idx} className={`bg-slate-900 border transition-all rounded-[2rem] overflow-hidden ${expandedId === course._id ? 'border-primary shadow-2xl' : 'border-white/5 shadow-sm'}`}>
                            <div
                                onClick={() => setExpandedId(expandedId === course._id ? null : course._id)}
                                className="p-8 flex items-center justify-between cursor-pointer hover:bg-white/[0.02]"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                                        {course.goal}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{course.name}</h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">{course.level} • {course.duration}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Price</p>
                                        <p className="text-sm font-bold text-emerald-400">{course.price}</p>
                                    </div>
                                    {expandedId === course._id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedId === course._id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-white/5 overflow-hidden"
                                    >
                                        <div className="p-10 space-y-10">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Display Name</label>
                                                    <input value={course.name} onChange={e => updateCourse(idx, 'name', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-white font-bold" />
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Level Tag</label>
                                                    <input value={course.level} onChange={e => updateCourse(idx, 'level', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-slate-300" />
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Category (Goal)</label>
                                                    <select value={course.goal} onChange={e => updateCourse(idx, 'goal', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-slate-300 outline-none">
                                                        <option value="IELTS">IELTS</option>
                                                        <option value="EfT">Academic English (EfT)</option>
                                                        <option value="GE">General English (GE)</option>
                                                        <option value="PTE">PTE Academic</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Description</label>
                                                <textarea rows={3} value={course.description} onChange={e => updateCourse(idx, 'description', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-[1.5rem] px-6 py-4 text-slate-400 text-sm leading-relaxed" />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Duration Text</label>
                                                    <input value={course.duration} onChange={e => updateCourse(idx, 'duration', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-slate-400" />
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pricing Headline</label>
                                                    <input value={course.price} onChange={e => updateCourse(idx, 'price', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-emerald-400 font-bold" />
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Badge Tag</label>
                                                    <input value={course.tag} onChange={e => updateCourse(idx, 'tag', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-primary font-black uppercase" />
                                                </div>
                                            </div>

                                            <div className="bg-white/[0.02] rounded-3xl p-8 space-y-6">
                                                <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                                                    <Target size={14} className="text-primary" /> Learning Milestones (Path)
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {(course.path || []).map((p: string, pIdx: number) => (
                                                        <div key={pIdx} className="flex gap-2">
                                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-slate-600 shrink-0">{pIdx + 1}</div>
                                                            <input value={p} onChange={e => updatePath(idx, pIdx, e.target.value)} className="flex-1 bg-slate-950 border border-white/5 rounded-lg px-3 py-2 text-xs text-white" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex justify-end pt-4">
                                                <button
                                                    onClick={() => {
                                                        const filtered = courses.filter((_, i) => i !== idx);
                                                        setCourses(filtered);
                                                    }}
                                                    className="text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-500/10 px-4 py-2 rounded-lg"
                                                >
                                                    <Trash2 size={14} /> Remove Course Entirely
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}

                    <button
                        onClick={() => {
                            const newCourse = { _id: Date.now().toString(), name: 'New Course Title', level: 'Target 6.5+', goal: 'IELTS', duration: '12 weeks', price: 'Contact', description: 'Enter description...', path: ['Step 1', 'Step 2', 'Step 3'], tag: 'NEW' };
                            setCourses([...courses, newCourse]);
                            setExpandedId(newCourse._id);
                        }}
                        className="w-full py-10 border-2 border-dashed border-white/5 hover:border-white/10 hover:bg-white/[0.02] rounded-[2rem] flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-white transition-all group"
                    >
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                            <Plus size={24} />
                        </div>
                        <span className="font-bold uppercase tracking-widest text-xs">Add New Curriculum Roadmap</span>
                    </button>
                </div>
            ) : (
                <div className="bg-slate-900 border border-white/5 p-12 rounded-[3rem] space-y-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Page Main Title (HTML)</label>
                            <textarea
                                value={banner.title}
                                onChange={e => setBanner({ ...banner, title: e.target.value })}
                                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold min-h-[120px]"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hero Subtitle</label>
                            <input
                                value={banner.subtitle}
                                onChange={e => setBanner({ ...banner, subtitle: e.target.value })}
                                className="w-full bg-slate-950 border border-white/5 rounded-xl px-6 py-4 text-slate-300"
                            />
                        </div>
                        <div className="lg:col-span-2 space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Page Description</label>
                            <textarea
                                rows={4}
                                value={banner.description}
                                onChange={e => setBanner({ ...banner, description: e.target.value })}
                                className="w-full bg-slate-950 border border-white/5 rounded-[2rem] px-8 py-6 text-slate-400 leading-relaxed font-body"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
