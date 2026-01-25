"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, FileText, Headphones, BookOpen, PenTool, Link as LinkIcon, Save, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MockTestManager() {
    const [tests, setTests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<number | null>(null);

    useEffect(() => {
        fetch('/api/mock-tests')
            .then(res => res.json())
            .then(data => {
                setTests(data);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch('/api/mock-tests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tests)
            });
            alert("Mock Tests updated!");
        } catch (e) {
            alert("Error saving tests");
        } finally {
            setSaving(false);
        }
    };

    const updateSection = (testIdx: number, section: string, field: string, value: any) => {
        const list = [...tests];
        list[testIdx][section] = { ...list[testIdx][section], [field]: value };
        setTests(list);
    };

    if (loading) return <div>Loading tests...</div>;

    return (
        <div className="space-y-12 pb-32">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-heading font-black text-white tracking-tight">Mock Test Library</h1>
                    <p className="text-slate-400 mt-2">Manage PDFs and audio files for IELTS/PTE simulation exams.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl"
                >
                    {saving ? "Saving..." : "Save Test Library"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* List */}
                <div className="md:col-span-1 space-y-4">
                    {tests.map((test, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveTab(idx)}
                            className={`w-full text-left p-6 rounded-2xl border transition-all ${activeTab === idx ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' : 'bg-slate-900 border-white/5 text-slate-400 hover:bg-white/5'}`}
                        >
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{test.category || 'IELTS'}</p>
                            <h3 className="font-bold truncate">{test.name}</h3>
                        </button>
                    ))}
                    <button
                        onClick={() => {
                            const newTest = { name: 'New Practice Test', category: 'IELTS', listening: { pdf: '', audio: [] }, reading: { pdf: '' }, writing: { pdf: '' } };
                            setTests([...tests, newTest]);
                            setActiveTab(tests.length);
                        }}
                        className="w-full p-6 bg-slate-900 border border-dashed border-white/10 rounded-2xl text-slate-600 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={16} /> New Test
                    </button>
                </div>

                {/* Editor Area */}
                <div className="md:col-span-3 bg-slate-900 border border-white/5 rounded-[2.5rem] p-12 min-h-[500px]">
                    {activeTab !== null ? (
                        <div className="space-y-12">
                            <div className="flex justify-between items-start">
                                <div className="space-y-4 flex-1 max-w-lg">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Test Name</label>
                                    <input
                                        value={tests[activeTab].name}
                                        onChange={e => {
                                            const list = [...tests];
                                            list[activeTab].name = e.target.value;
                                            setTests(list);
                                        }}
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white text-xl font-black"
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        const filtered = tests.filter((_, i) => i !== activeTab);
                                        setTests(filtered);
                                        setActiveTab(null);
                                    }}
                                    className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl"
                                >
                                    <Trash2 size={24} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-8">
                                {/* Listening */}
                                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-6">
                                    <h4 className="flex items-center gap-3 text-sm font-black text-white uppercase tracking-widest">
                                        <Headphones size={18} className="text-primary" /> Listening Section
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-white/60">Question PDF (Backup)</label>
                                            <input value={tests[activeTab].listening.pdf || ''} onChange={e => updateSection(activeTab, 'listening', 'pdf', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-400" placeholder="PDF URL..." />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-white/60">Questions Count</label>
                                            <input type="number" value={tests[activeTab].listening.questionsCount || 40} onChange={e => updateSection(activeTab, 'listening', 'questionsCount', parseInt(e.target.value))} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-400" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-white/60 flex justify-between">
                                            Interactive Content (Use [Q1], [Q2] as placeholders)
                                            <span className="text-primary lowercase font-normal italic">Tip: [Q1] will become an input field</span>
                                        </label>
                                        <textarea
                                            value={tests[activeTab].listening.content || ''}
                                            onChange={e => updateSection(activeTab, 'listening', 'content', e.target.value)}
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-xs text-slate-300 font-mono h-64 focus:ring-2 focus:ring-primary/50 outline-none"
                                            placeholder="Paste listening transcript or questions here. Use [Q1] for input fields..."
                                        />
                                    </div>
                                </div>

                                {/* Reading */}
                                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-6">
                                    <h4 className="flex items-center gap-3 text-sm font-black text-white uppercase tracking-widest">
                                        <BookOpen size={18} className="text-primary" /> Reading Section
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-white/60">Question PDF (Backup)</label>
                                            <input value={tests[activeTab].reading.pdf || ''} onChange={e => updateSection(activeTab, 'reading', 'pdf', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-400" placeholder="PDF URL..." />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-white/60">Questions Count</label>
                                            <input type="number" value={tests[activeTab].reading.questionsCount || 40} onChange={e => updateSection(activeTab, 'reading', 'questionsCount', parseInt(e.target.value))} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-400" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-white/60 flex justify-between">
                                            Interactive Content (Use [Q1], [Q2] as placeholders)
                                            <span className="text-primary lowercase font-normal italic">Tip: [Q1] will become an input field</span>
                                        </label>
                                        <textarea
                                            value={tests[activeTab].reading.content || ''}
                                            onChange={e => updateSection(activeTab, 'reading', 'content', e.target.value)}
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-xs text-slate-300 font-mono h-96 focus:ring-2 focus:ring-primary/50 outline-none"
                                            placeholder="Paste reading passage and questions here. Use [Q1] for input fields..."
                                        />
                                    </div>
                                </div>

                                {/* Writing */}
                                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-6">
                                    <h4 className="flex items-center gap-3 text-sm font-black text-white uppercase tracking-widest">
                                        <PenTool size={18} className="text-primary" /> Writing Section
                                    </h4>
                                    <div className="space-y-4">
                                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-white/60">Question PDF (Backup)</label>
                                        <input value={tests[activeTab].writing.pdf || ''} onChange={e => updateSection(activeTab, 'writing', 'pdf', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-400" placeholder="PDF URL..." />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-white/60 flex justify-between">
                                            Writing Prompts/Content
                                        </label>
                                        <textarea
                                            value={tests[activeTab].writing.content || ''}
                                            onChange={e => updateSection(activeTab, 'writing', 'content', e.target.value)}
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-xs text-slate-300 font-mono h-64 focus:ring-2 focus:ring-primary/50 outline-none"
                                            placeholder="Describe writing tasks here..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-slate-700 mb-6 border border-dashed border-white/10">
                                <FileText size={32} />
                            </div>
                            <h3 className="text-xl font-heading font-black text-slate-500">Select a test unit to edit</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
