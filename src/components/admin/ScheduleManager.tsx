"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Clock, Link as LinkIcon, Save, Search, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScheduleManager() {
    const [schedules, setSchedules] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch('/api/schedules').then(res => res.json()),
            fetch('/api/courses').then(res => res.json())
        ]).then(([schedData, courseData]) => {
            setSchedules(schedData);
            setCourses(courseData);
            setLoading(false);
        }).catch(err => {
            setError("Failed to load data");
            setLoading(false);
        });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setSuccess(false);
        setError(null);
        try {
            const res = await fetch('/api/schedules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(schedules)
            });
            if (res.ok) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                throw new Error("Failed to save");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const addSchedule = () => {
        const newSched = {
            courseId: courses[0]?._id || '',
            title: 'Khai giảng mới',
            time: '18:00 - 20:00',
            date: 'Thứ 2 - 4 - 6',
            link: '#'
        };
        setSchedules([...schedules, newSched]);
    };

    const updateSchedule = (idx: number, field: string, value: string) => {
        const list = [...schedules];
        list[idx] = { ...list[idx], [field]: value };
        setSchedules(list);
    };

    const removeSchedule = (idx: number) => {
        setSchedules(schedules.filter((_, i) => i !== idx));
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
    );

    return (
        <div className="space-y-12 pb-32">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-heading font-black text-white tracking-tight">Class Schedules</h1>
                    <p className="text-slate-400 mt-2">Manage upcoming course start dates and registration links.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={addSchedule}
                        className="flex items-center gap-2 px-6 py-4 rounded-xl font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                    >
                        <Plus size={20} /> Add Class
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-primary text-white hover:scale-105 transition-all shadow-xl shadow-primary/20"
                    >
                        {saving ? "Saving..." : "Save Schedules"}
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-400">
                    <AlertCircle size={20} />
                    <p className="font-bold text-sm tracking-wide">{error}</p>
                </div>
            )}

            {success && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4 text-emerald-400">
                    <CheckCircle2 size={20} />
                    <p className="font-bold text-sm tracking-wide">Schedules updated successfully!</p>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {schedules.map((sched, idx) => (
                    <motion.div
                        key={idx}
                        layout
                        className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] flex flex-col lg:flex-row gap-8 items-start lg:items-center group"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Calendar size={28} />
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Course</label>
                                <select
                                    value={sched.courseId}
                                    onChange={e => updateSchedule(idx, 'courseId', e.target.value)}
                                    className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm font-bold outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option value="">General / Other</option>
                                    {courses.map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Event Title</label>
                                <input
                                    value={sched.title}
                                    onChange={e => updateSchedule(idx, 'title', e.target.value)}
                                    className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Time range</label>
                                <div className="flex items-center gap-2 bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5">
                                    <Clock size={14} className="text-slate-500" />
                                    <input
                                        value={sched.time}
                                        onChange={e => updateSchedule(idx, 'time', e.target.value)}
                                        className="bg-transparent border-none outline-none text-white text-sm w-full"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dates / Frequency</label>
                                <input
                                    value={sched.date}
                                    onChange={e => updateSchedule(idx, 'date', e.target.value)}
                                    className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-slate-300 text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 lg:pl-6 lg:border-l border-white/5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Reg Link</label>
                                <div className="flex items-center gap-2 bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-slate-500 focus-within:text-white transition-colors">
                                    <LinkIcon size={14} />
                                    <input
                                        value={sched.link}
                                        onChange={e => updateSchedule(idx, 'link', e.target.value)}
                                        className="bg-transparent border-none outline-none text-xs w-32"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={() => removeSchedule(idx)}
                                className="p-3 rounded-xl bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white mt-6"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </motion.div>
                ))}

                {schedules.length === 0 && (
                    <div className="py-20 text-center bg-slate-900 border border-dashed border-white/10 rounded-[3rem]">
                        <p className="text-slate-500 font-bold">No schedules active. Click "Add Class" to start.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
