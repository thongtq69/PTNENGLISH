"use client";

import React, { useState, useEffect } from 'react';
import {
    Plus, Trash2, Headphones, BookOpen, PenTool,
    Save, Eye, ChevronRight, Settings, PlusCircle,
    FileAudio, FileText, Layout, Info, CheckCircle2,
    Database, Download, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FileUpload from './shared/FileUpload';
import AdvancedEditor from './shared/AdvancedEditor';
import { convertScannedText } from '@/lib/testUtils';

interface TestSection {
    title: string;
    content: string;
    answers: Record<string, string>;
    questionsCount: number;
    audioUrl?: string;
}

interface MockTest {
    _id?: string;
    name: string;
    category: string;
    listening: { pdf: string; sections: TestSection[]; totalQuestions: number };
    reading: { pdf: string; sections: TestSection[]; totalQuestions: number };
    writing: { pdf: string; content: string; tasksCount: number };
}

const DEFAULT_SECTION: TestSection = {
    title: 'New Section',
    content: '',
    answers: {},
    questionsCount: 10
};

export default function MockTestManager() {
    const [tests, setTests] = useState<MockTest[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeIdx, setActiveIdx] = useState<number | null>(null);
    const [activeSkill, setActiveSkill] = useState<'listening' | 'reading' | 'writing'>('listening');
    const [activeSectionIdx, setActiveSectionIdx] = useState(0);

    useEffect(() => {
        fetch('/api/mock-tests')
            .then(res => res.json())
            .then(data => {
                // Ensure new structure compatibility
                const upgraded = data.map((t: any) => ({
                    ...t,
                    listening: t.listening?.sections ? t.listening : { pdf: t.listening?.pdf || '', sections: [], totalQuestions: 40 },
                    reading: t.reading?.sections ? t.reading : { pdf: t.reading?.pdf || '', sections: [], totalQuestions: 40 },
                    writing: t.writing || { pdf: '', content: '', tasksCount: 2 }
                }));
                setTests(upgraded);
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
            alert("Test Library Sync Successful!");
        } catch (e) {
            alert("Sync Failed");
        } finally {
            setSaving(false);
        }
    };

    const updateTest = (updated: MockTest) => {
        if (activeIdx === null) return;
        const newList = [...tests];
        newList[activeIdx] = updated;
        setTests(newList);
    };

    if (loading) return (
        <div className="h-96 flex flex-col items-center justify-center text-slate-500 gap-4">
            <RefreshCw className="animate-spin" />
            <p className="font-black uppercase tracking-widest text-[10px]">Loading Academic Engine...</p>
        </div>
    );

    const test = activeIdx !== null ? tests[activeIdx] : null;

    return (
        <div className="space-y-12 pb-32">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-heading font-black text-white tracking-tight">Academic Mock Test Center</h1>
                    <p className="text-slate-500 mt-2">Manage structured IELTS/Academic simulation environments. Use [Q1], [Q2]... tags in content.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                    >
                        {saving ? <RefreshCw className="animate-spin" size={18} /> : <Database size={18} />}
                        Sync to Database
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-18rem)]">
                {/* Left Sidebar: Test List */}
                <div className="lg:col-span-1 bg-slate-900 border border-white/5 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Sets Available</h3>
                        <button
                            onClick={() => {
                                const newTest: MockTest = {
                                    name: 'Academic Set ' + (tests.length + 1),
                                    category: 'IELTS',
                                    listening: { pdf: '', sections: [], totalQuestions: 40 },
                                    reading: { pdf: '', sections: [], totalQuestions: 40 },
                                    writing: { pdf: '', content: '', tasksCount: 2 }
                                };
                                setTests([...tests, newTest]);
                                setActiveIdx(tests.length);
                            }}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                            <PlusCircle size={20} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                        {tests.map((t, idx) => (
                            <button
                                key={idx}
                                onClick={() => { setActiveIdx(idx); setActiveSectionIdx(0); }}
                                className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center justify-between group ${activeIdx === idx ? 'bg-primary border-primary text-white shadow-lg' : 'bg-slate-950 border-white/5 text-slate-500 hover:border-white/10'}`}
                            >
                                <div>
                                    <p className={`text-[8px] font-black uppercase mb-1 ${activeIdx === idx ? 'text-white/60' : 'text-primary'}`}>{t.category}</p>
                                    <h4 className="font-bold text-sm truncate max-w-[120px]">{t.name}</h4>
                                </div>
                                <ChevronRight size={16} className={`${activeIdx === idx ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content: Test Editor */}
                <div className="lg:col-span-3 bg-slate-900 border border-white/5 rounded-[3rem] overflow-hidden flex flex-col shadow-2xl shadow-black/50">
                    {test ? (
                        <>
                            {/* Editor Tabs (Skill) */}
                            <div className="px-8 pt-8 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
                                <div className="flex gap-8">
                                    {(['listening', 'reading', 'writing'] as const).map(skill => (
                                        <button
                                            key={skill}
                                            onClick={() => { setActiveSkill(skill); setActiveSectionIdx(0); }}
                                            className={`pb-6 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeSkill === skill ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}
                                        >
                                            {activeSkill === skill && <motion.div layoutId="skillLine" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full shadow-[0_0_15px_rgba(255,59,59,0.5)]" />}
                                            <span className="flex items-center gap-2">
                                                {skill === 'listening' && <Headphones size={14} />}
                                                {skill === 'reading' && <BookOpen size={14} />}
                                                {skill === 'writing' && <PenTool size={14} />}
                                                {skill}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-4 pb-6">
                                    <button
                                        onClick={() => {
                                            if (confirm("Delete this entire test set?")) {
                                                setTests(tests.filter((_, i) => i !== activeIdx));
                                                setActiveIdx(null);
                                            }
                                        }}
                                        className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 flex overflow-hidden">
                                {activeSkill !== 'writing' ? (
                                    <>
                                        {/* Sub-sidebar: Sections */}
                                        <div className="w-64 border-r border-white/5 flex flex-col bg-slate-950/50">
                                            <div className="p-6 flex justify-between items-center border-b border-white/5">
                                                <span className="text-[9px] font-black text-slate-500 uppercase">Sections</span>
                                                <button
                                                    onClick={() => {
                                                        const updated = { ...test };
                                                        updated[activeSkill].sections = [...(updated[activeSkill].sections || []), { ...DEFAULT_SECTION }];
                                                        updateTest(updated);
                                                        setActiveSectionIdx(updated[activeSkill].sections.length - 1);
                                                    }}
                                                    className="p-1 hover:bg-white/5 rounded text-primary"
                                                >
                                                    <PlusCircle size={14} />
                                                </button>
                                            </div>
                                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                                {(test[activeSkill].sections || []).map((sec, sIdx) => (
                                                    <button
                                                        key={sIdx}
                                                        onClick={() => setActiveSectionIdx(sIdx)}
                                                        className={`w-full text-left p-4 rounded-xl text-[10px] font-bold transition-all border ${activeSectionIdx === sIdx ? 'bg-white/5 border-white/10 text-white' : 'border-transparent text-slate-600 hover:text-slate-400'}`}
                                                    >
                                                        {sIdx + 1}. {sec.title || 'Untitled Section'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Section Content Area */}
                                        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-10">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase">Section Backdrop (PDF)</label>
                                                    <FileUpload
                                                        mode="pdf"
                                                        value={test[activeSkill].pdf || ''}
                                                        onChange={url => {
                                                            const updated = { ...test };
                                                            updated[activeSkill].pdf = url;
                                                            updateTest(updated);
                                                        }}
                                                        folder={`tests/${activeSkill}`}
                                                    />
                                                </div>
                                                {activeSkill === 'listening' && (
                                                    <div className="space-y-4">
                                                        <label className="text-[10px] font-black text-slate-500 uppercase">Section Audio</label>
                                                        <FileUpload
                                                            mode="audio"
                                                            value={test.listening.sections[activeSectionIdx]?.audioUrl || ''}
                                                            onChange={url => {
                                                                const updated = { ...test };
                                                                updated.listening.sections[activeSectionIdx].audioUrl = url;
                                                                updateTest(updated);
                                                            }}
                                                            folder="tests/listening"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {test[activeSkill].sections[activeSectionIdx] ? (
                                                <div className="space-y-8 animate-in fade-in duration-500">
                                                    <div className="space-y-4">
                                                        <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl mb-6">
                                                            <p className="text-[9px] font-black text-primary uppercase mb-1 flex items-center gap-2"><Info size={12} /> Hướng dẫn tạo đề:</p>
                                                            <p className="text-[10px] text-slate-400 leading-relaxed font-body">
                                                                1. Tải lên file PDF đề thi tương ứng.<br />
                                                                2. Copy nội dung văn bản (đã scan) vào ô soạn thảo.<br />
                                                                3. Chèn tag <strong>[Q1]</strong>, <strong>[Q2]</strong>... vào vị trí cần điền đáp án.<br />
                                                                4. Nhập đáp án đúng vào bảng Answer Keys phía dưới.
                                                            </p>
                                                        </div>
                                                        <label className="text-[10px] font-black text-slate-500 uppercase">Section Title</label>
                                                        <input
                                                            value={test[activeSkill].sections[activeSectionIdx].title}
                                                            onChange={e => {
                                                                const updated = { ...test };
                                                                updated[activeSkill].sections[activeSectionIdx].title = e.target.value;
                                                                updateTest(updated);
                                                            }}
                                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white text-lg font-bold"
                                                        />
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-center">
                                                            <label className="text-[10px] font-black text-slate-500 uppercase">Interactive Content</label>
                                                            <button
                                                                onClick={() => {
                                                                    const raw = window.prompt("Paste scanned text here (e.g. from test_scan):");
                                                                    if (raw) {
                                                                        // Calculate Ranges
                                                                        let start = (activeSectionIdx * 10) + 1;
                                                                        let end = (activeSectionIdx + 1) * 10;
                                                                        if (activeSkill === 'reading') {
                                                                            start = activeSectionIdx === 0 ? 1 : (activeSectionIdx === 1 ? 14 : 27);
                                                                            end = activeSectionIdx === 0 ? 13 : (activeSectionIdx === 1 ? 26 : 40);
                                                                        }
                                                                        const upgraded = convertScannedText(raw, start, end);
                                                                        const updated = { ...test };
                                                                        updated[activeSkill].sections[activeSectionIdx].content = upgraded;
                                                                        updateTest(updated);
                                                                    }
                                                                }}
                                                                className="text-[10px] font-black text-primary flex items-center gap-2 hover:underline"
                                                            >
                                                                <RefreshCw size={12} /> Convert Scanned Text
                                                            </button>
                                                        </div>
                                                        <AdvancedEditor
                                                            value={test[activeSkill].sections[activeSectionIdx].content}
                                                            onChange={val => {
                                                                const updated = { ...test };
                                                                updated[activeSkill].sections[activeSectionIdx].content = val;
                                                                updateTest(updated);
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Answer Key Grid */}
                                                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6">
                                                        <div className="flex justify-between items-center">
                                                            <h4 className="text-xs font-black text-white uppercase flex items-center gap-3">
                                                                <CheckCircle2 size={16} className="text-primary" /> Answer Keys Manager
                                                            </h4>
                                                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                                                Total: {test[activeSkill].sections[activeSectionIdx].questionsCount} Questions
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                                                            {Array.from({ length: test[activeSkill].sections[activeSectionIdx].questionsCount }).map((_, qi) => {
                                                                // Calculate Offset
                                                                let offset = 0;
                                                                if (activeSkill === 'listening') {
                                                                    offset = activeSectionIdx * 10;
                                                                } else if (activeSkill === 'reading') {
                                                                    if (activeSectionIdx === 1) offset = 13;
                                                                    if (activeSectionIdx === 2) offset = 26;
                                                                }
                                                                const qNum = offset + qi + 1;

                                                                return (
                                                                    <div key={qi} className="group relative">
                                                                        <div className="absolute -top-2 left-3 px-1.5 bg-slate-900 text-[8px] font-black text-slate-500 uppercase z-10">Q{qNum}</div>
                                                                        <input
                                                                            placeholder="..."
                                                                            value={test[activeSkill].sections[activeSectionIdx].answers?.[qNum] || ''}
                                                                            onChange={e => {
                                                                                const updated = { ...test };
                                                                                const currentAnswers = { ...(updated[activeSkill].sections[activeSectionIdx].answers || {}) };
                                                                                currentAnswers[qNum] = e.target.value;
                                                                                updated[activeSkill].sections[activeSectionIdx].answers = currentAnswers;
                                                                                updateTest(updated);
                                                                            }}
                                                                            className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                                                        />
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-full flex flex-col items-center justify-center text-slate-700 gap-4">
                                                    <Layout size={48} className="opacity-20" />
                                                    <p className="text-xs font-bold uppercase tracking-widest">Select a section to begin editing</p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    /* Writing Editor */
                                    <div className="flex-1 overflow-y-auto p-12 space-y-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase">Writing Tasks PDF</label>
                                            <FileUpload
                                                mode="pdf"
                                                value={test.writing.pdf}
                                                onChange={url => {
                                                    const updated = { ...test };
                                                    updated.writing.pdf = url;
                                                    updateTest(updated);
                                                }}
                                                folder="tests/writing"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase">Tasks Description / Prompts</label>
                                            <AdvancedEditor
                                                value={test.writing.content}
                                                onChange={val => {
                                                    const updated = { ...test };
                                                    updated.writing.content = val;
                                                    updateTest(updated);
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-700 gap-6">
                            <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center">
                                <Database size={40} />
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-heading font-black text-slate-400">Mock Test Engine Idle</h3>
                                <p className="text-xs font-bold text-slate-600 mt-2 uppercase tracking-widest">Select or create a test set from the sidebar</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const TypographyHint = ({ current }: { current: string }) => (
    <div className="flex flex-col shrink-0">
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Skill Target</span>
        <span className="text-xs font-black text-accent uppercase">{current}</span>
    </div>
);
