"use client";

import React, { useState, useEffect } from 'react';
import {
    Plus, Trash2, Headphones, BookOpen, PenTool,
    Save, Eye, ChevronRight, Settings, PlusCircle,
    FileAudio, FileText, Layout, Info, CheckCircle2,
    Database, Download, RefreshCw, ClipboardList, User, Phone, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FileUpload from './shared/FileUpload';
import AdvancedEditor from './shared/AdvancedEditor';
import { convertScannedText } from '@/lib/testUtils';
import { generateTag, type QuestionType } from '@/lib/questionParser';
import QuestionGuide from './QuestionGuide';

interface TestSection {
    title: string;
    passage?: string;
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

interface ResultDetail {
    q: number;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
}

interface SkillResult {
    band?: string;
    score?: number;
    total?: number;
    pct?: number;
    hasAnswerKey?: boolean;
    details?: ResultDetail[];
}

interface MockTestSubmission {
    _id: string;
    testName?: string;
    contact?: { name?: string; phone?: string; email?: string };
    answers?: {
        listening?: Record<string, string>;
        reading?: Record<string, string>;
        writing?: Record<string, string>;
    };
    results?: {
        listening?: SkillResult;
        reading?: SkillResult;
        writing?: { status?: string; score?: string; feedback?: string };
    };
    status?: string;
    adminNotes?: string;
    submittedAt?: string;
    timeSpentSeconds?: number;
}

const DEFAULT_SECTION: TestSection = {
    title: 'New Section',
    content: '',
    answers: {},
    questionsCount: 10
};

export default function MockTestManager() {
    const [tests, setTests] = useState<MockTest[]>([]);
    const [submissions, setSubmissions] = useState<MockTestSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [submissionsLoading, setSubmissionsLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [submissionSaving, setSubmissionSaving] = useState(false);
    const [viewMode, setViewMode] = useState<'library' | 'submissions'>('library');
    const [activeIdx, setActiveIdx] = useState<number | null>(null);
    const [activeSubmissionIdx, setActiveSubmissionIdx] = useState<number | null>(null);
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

    const fetchSubmissions = async () => {
        setSubmissionsLoading(true);
        try {
            const res = await fetch('/api/mock-test-submissions');
            const data = await res.json();
            const list = Array.isArray(data) ? data : [];
            setSubmissions(list);
            if (list.length > 0 && activeSubmissionIdx === null) {
                setActiveSubmissionIdx(0);
            }
            if (list.length === 0) {
                setActiveSubmissionIdx(null);
            }
        } finally {
            setSubmissionsLoading(false);
        }
    };

    useEffect(() => {
        if (viewMode === 'submissions') {
            fetchSubmissions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewMode]);

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

    const updateSubmission = (updated: MockTestSubmission) => {
        if (activeSubmissionIdx === null) return;
        const newList = [...submissions];
        newList[activeSubmissionIdx] = updated;
        setSubmissions(newList);
    };

    const handleSaveSubmission = async () => {
        if (activeSubmissionIdx === null) return;
        const submission = submissions[activeSubmissionIdx];
        setSubmissionSaving(true);
        try {
            const res = await fetch('/api/mock-test-submissions', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submission)
            });
            if (!res.ok) throw new Error('Save failed');
            const data = await res.json();
            if (data?.data) {
                const newList = [...submissions];
                newList[activeSubmissionIdx] = data.data;
                setSubmissions(newList);
            }
            alert('Submission updated successfully!');
        } catch {
            alert('Could not update submission.');
        } finally {
            setSubmissionSaving(false);
        }
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
                    <div className="bg-slate-900 border border-white/5 p-1 rounded-2xl flex">
                        <button
                            onClick={() => setViewMode('library')}
                            className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${viewMode === 'library' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <Database size={14} /> Test Library
                        </button>
                        <button
                            onClick={() => setViewMode('submissions')}
                            className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${viewMode === 'submissions' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <ClipboardList size={14} /> Submissions
                        </button>
                    </div>
                    {viewMode === 'library' ? (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                        >
                            {saving ? <RefreshCw className="animate-spin" size={18} /> : <Database size={18} />}
                            Sync to Database
                        </button>
                    ) : (
                        <button
                            onClick={fetchSubmissions}
                            disabled={submissionsLoading}
                            className="bg-slate-900 border border-white/5 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:border-primary/30 transition-all disabled:opacity-50"
                        >
                            <RefreshCw className={submissionsLoading ? 'animate-spin' : ''} size={18} />
                            Refresh
                        </button>
                    )}
                </div>
            </div>

            {viewMode === 'submissions' ? (
                <SubmissionsPanel
                    submissions={submissions}
                    loading={submissionsLoading}
                    activeIdx={activeSubmissionIdx}
                    onSelect={setActiveSubmissionIdx}
                    onUpdate={updateSubmission}
                    onSave={handleSaveSubmission}
                    saving={submissionSaving}
                />
            ) : (
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
                                            if (confirm("WARNING: Delete this ENTIRE mock test set? This cannot be undone.")) {
                                                setTests(tests.filter((_, i) => i !== activeIdx));
                                                setActiveIdx(null);
                                            }
                                        }}
                                        title="Delete entire test set"
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
                                                    <div key={sIdx} className="group relative">
                                                        <button
                                                            onClick={() => setActiveSectionIdx(sIdx)}
                                                            className={`w-full text-left p-4 pr-10 rounded-xl text-[10px] font-bold transition-all border ${activeSectionIdx === sIdx ? 'bg-white/5 border-white/10 text-white' : 'border-transparent text-slate-600 hover:text-slate-400'}`}
                                                        >
                                                            {sIdx + 1}. {sec.title || 'Untitled Section'}
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (confirm("Delete this section?")) {
                                                                    const updated = { ...test };
                                                                    const newSections = [...updated[activeSkill].sections];
                                                                    newSections.splice(sIdx, 1);
                                                                    updated[activeSkill].sections = newSections;
                                                                    updateTest(updated);
                                                                    if (activeSectionIdx >= newSections.length) {
                                                                        setActiveSectionIdx(Math.max(0, newSections.length - 1));
                                                                    }
                                                                }
                                                            }}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Section Content Area */}
                                        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-10">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase">Section Backdrop (PDF/Image/Word)</label>
                                                    <FileUpload
                                                        mode="all"
                                                        value={test[activeSkill].pdf || ''}
                                                        onChange={url => {
                                                            const updated = { ...test };
                                                            updated[activeSkill].pdf = url;
                                                            updateTest(updated);
                                                        }}
                                                        folder={`tests/${activeSkill}`}
                                                    />
                                                </div>
                                                {activeSkill === 'listening' && test.listening.sections[activeSectionIdx] && (
                                                    <div className="space-y-4">
                                                        <label className="text-[10px] font-black text-slate-500 uppercase">Section Audio</label>
                                                        <FileUpload
                                                            mode="audio"
                                                            value={test.listening.sections[activeSectionIdx]?.audioUrl || ''}
                                                            onChange={url => {
                                                                const updated = { ...test };
                                                                if (updated.listening.sections[activeSectionIdx]) {
                                                                    updated.listening.sections[activeSectionIdx].audioUrl = url;
                                                                    updateTest(updated);
                                                                }
                                                            }}
                                                            folder="tests/listening"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {test[activeSkill].sections[activeSectionIdx] ? (
                                                <div className="space-y-8 animate-in fade-in duration-500">
                                                    <div className="space-y-4">
                                                        <QuestionGuide />
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

                                                    {/* Reading Passage Editor - only for reading skill */}
                                                    {activeSkill === 'reading' && (
                                                        <div className="space-y-4">
                                                            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl">
                                                                <p className="text-[9px] font-black text-blue-400 uppercase mb-1 flex items-center gap-2"><BookOpen size={12} /> Bài đọc (Reading Passage)</p>
                                                                <p className="text-[10px] text-slate-400 leading-relaxed font-body">
                                                                    Paste nội dung bài đọc vào đây. Học viên sẽ thấy bài đọc ở panel bên trái, câu hỏi ở panel bên phải.
                                                                </p>
                                                            </div>
                                                            <label className="text-[10px] font-black text-slate-500 uppercase">Reading Passage Content (hiển thị bên trái)</label>
                                                            <AdvancedEditor
                                                                value={test[activeSkill].sections[activeSectionIdx].passage || ''}
                                                                onChange={val => {
                                                                    const updated = { ...test };
                                                                    updated[activeSkill].sections[activeSectionIdx].passage = val;
                                                                    updateTest(updated);
                                                                }}
                                                                placeholder="Paste bài đọc vào đây (hỗ trợ copy từ Word, Docs...)"
                                                            />
                                                        </div>
                                                    )}

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

                                                        {/* ═══ Question Type Toolbar ═══ */}
                                                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
                                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                                <Layout size={11} /> Insert Question Tag — 14 IELTS Question Types
                                                            </p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {([
                                                                    { type: "fill" as QuestionType, label: "Fill Blank", desc: "Sentence/Note/Table/Diagram/Short Answer", color: "bg-slate-700 hover:bg-slate-600" },
                                                                    { type: "mc" as QuestionType, label: "MC (1)", desc: "Multiple Choice single", color: "bg-blue-900 hover:bg-blue-800" },
                                                                    { type: "mcm" as QuestionType, label: "MC (Multi)", desc: "Multiple Choice multi-answer", color: "bg-blue-800 hover:bg-blue-700" },
                                                                    { type: "tfng" as QuestionType, label: "T/F/NG", desc: "True False Not Given", color: "bg-emerald-900 hover:bg-emerald-800" },
                                                                    { type: "ynng" as QuestionType, label: "Y/N/NG", desc: "Yes No Not Given", color: "bg-green-900 hover:bg-green-800" },
                                                                    { type: "mh" as QuestionType, label: "Match Head", desc: "Matching Headings", color: "bg-purple-900 hover:bg-purple-800" },
                                                                    { type: "mi" as QuestionType, label: "Match Info", desc: "Matching Information", color: "bg-violet-900 hover:bg-violet-800" },
                                                                    { type: "mf" as QuestionType, label: "Match Feat", desc: "Matching Features", color: "bg-indigo-900 hover:bg-indigo-800" },
                                                                    { type: "mse" as QuestionType, label: "Match End", desc: "Matching Sentence Endings", color: "bg-fuchsia-900 hover:bg-fuchsia-800" },
                                                                    { type: "sc" as QuestionType, label: "Word List", desc: "Summary Completion (word list)", color: "bg-amber-900 hover:bg-amber-800" },
                                                                ]).map(({ type, label, desc, color }) => (
                                                                    <button
                                                                        key={type}
                                                                        type="button"
                                                                        title={desc}
                                                                        onClick={() => {
                                                                            const qNum = window.prompt(`Question number for "${label}":`);
                                                                            if (!qNum) return;
                                                                            const idx = parseInt(qNum, 10);
                                                                            if (isNaN(idx)) return;

                                                                            let options: string[] | undefined;
                                                                            let maxSelect: number | undefined;

                                                                            if (["mc", "mcm", "mh", "mi", "mf", "mse", "sc"].includes(type)) {
                                                                                const raw = window.prompt(
                                                                                    type === "sc"
                                                                                        ? 'Enter word list (comma-separated):\ne.g. fossil,solar,wind,nuclear'
                                                                                        : 'Enter options (comma-separated):\ne.g. A,B,C,D'
                                                                                );
                                                                                if (!raw) return;
                                                                                options = raw.split(",").map(s => s.trim()).filter(Boolean);
                                                                            }

                                                                            if (type === "mcm") {
                                                                                const ms = window.prompt("How many answers to select? (default 2):");
                                                                                maxSelect = ms ? parseInt(ms, 10) || 2 : 2;
                                                                            }

                                                                            const tag = generateTag(type, idx, options, maxSelect);
                                                                            const currentContent = test[activeSkill].sections[activeSectionIdx].content || "";
                                                                            const updated = { ...test };
                                                                            updated[activeSkill].sections[activeSectionIdx].content = currentContent + "\n" + tag;
                                                                            updateTest(updated);
                                                                        }}
                                                                        className={`${color} text-white/80 hover:text-white px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border border-white/5`}
                                                                    >
                                                                        {label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                            <p className="text-[8px] text-slate-600 leading-relaxed">
                                                                Click a type → enter question number → enter options (if needed) → tag is appended to content.
                                                                Tags: <code className="text-primary">[Q1]</code> <code className="text-blue-400">[MC1:A,B,C,D]</code> <code className="text-emerald-400">[TFNG1]</code> <code className="text-purple-400">[MH1:i,ii,iii]</code> <code className="text-amber-400">[SC1:word1,word2]</code> etc.
                                                            </p>
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
                                            <label className="text-[10px] font-black text-slate-500 uppercase">Writing Tasks Backdrop (PDF/Image/Word)</label>
                                            <FileUpload
                                                mode="all"
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
            )}
        </div>
    );
}

const formatSubmissionTime = (value?: string) => {
    if (!value) return 'No timestamp';
    return new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'short',
        timeStyle: 'short'
    }).format(new Date(value));
};

const formatDuration = (seconds?: number) => {
    if (!seconds) return '—';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
};

const SubmissionsPanel = ({
    submissions,
    loading,
    activeIdx,
    onSelect,
    onUpdate,
    onSave,
    saving
}: {
    submissions: MockTestSubmission[];
    loading: boolean;
    activeIdx: number | null;
    onSelect: (idx: number) => void;
    onUpdate: (submission: MockTestSubmission) => void;
    onSave: () => void;
    saving: boolean;
}) => {
    const submission = activeIdx !== null ? submissions[activeIdx] : null;

    const updateContact = (key: 'name' | 'phone' | 'email', value: string) => {
        if (!submission) return;
        onUpdate({
            ...submission,
            contact: { ...(submission.contact || {}), [key]: value }
        });
    };

    const updateSkillResult = (
        skill: 'listening' | 'reading',
        patch: Partial<SkillResult>
    ) => {
        if (!submission) return;
        onUpdate({
            ...submission,
            results: {
                ...(submission.results || {}),
                [skill]: {
                    ...(submission.results?.[skill] || {}),
                    ...patch
                }
            }
        });
    };

    const updateResultDetail = (
        skill: 'listening' | 'reading',
        detailIdx: number,
        patch: Partial<ResultDetail>
    ) => {
        if (!submission) return;
        const currentResult = submission.results?.[skill] || {};
        const details = [...(currentResult.details || [])];
        details[detailIdx] = { ...details[detailIdx], ...patch };
        const score = details.filter(detail => detail.isCorrect).length;
        const total = currentResult.total || details.length;
        updateSkillResult(skill, {
            details,
            score,
            total,
            pct: total ? Math.round((score / total) * 100) : 0
        });
    };

    const updateWriting = (patch: Partial<NonNullable<MockTestSubmission['results']>['writing']>) => {
        if (!submission) return;
        onUpdate({
            ...submission,
            results: {
                ...(submission.results || {}),
                writing: {
                    ...(submission.results?.writing || {}),
                    ...patch
                }
            }
        });
    };

    const updateWritingAnswer = (task: string, value: string) => {
        if (!submission) return;
        onUpdate({
            ...submission,
            answers: {
                ...(submission.answers || {}),
                writing: {
                    ...(submission.answers?.writing || {}),
                    [task]: value
                }
            }
        });
    };

    const updateNotes = (value: string) => {
        if (!submission) return;
        onUpdate({ ...submission, adminNotes: value });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-18rem)]">
            <div className="lg:col-span-1 bg-slate-900 border border-white/5 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                    <div>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Student Submissions</h3>
                        <p className="text-[10px] text-slate-600 mt-1">{submissions.length} completed tests</p>
                    </div>
                    {loading && <RefreshCw size={16} className="animate-spin text-primary" />}
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                    {submissions.length === 0 && !loading ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-700 text-center p-8">
                            <ClipboardList size={40} className="mb-4 opacity-30" />
                            <p className="text-xs font-black uppercase tracking-widest">No submissions yet</p>
                        </div>
                    ) : submissions.map((item, idx) => {
                        const listening = item.results?.listening;
                        const reading = item.results?.reading;
                        return (
                            <button
                                key={item._id}
                                onClick={() => onSelect(idx)}
                                className={`w-full text-left p-5 rounded-2xl border transition-all ${activeIdx === idx ? 'bg-primary border-primary text-white shadow-lg' : 'bg-slate-950 border-white/5 text-slate-500 hover:border-white/10'}`}
                            >
                                <p className={`text-[8px] font-black uppercase mb-1 ${activeIdx === idx ? 'text-white/70' : 'text-primary'}`}>
                                    {formatSubmissionTime(item.submittedAt)}
                                </p>
                                <h4 className="font-bold text-sm truncate">{item.contact?.name || 'Khách ẩn danh'}</h4>
                                <p className={`text-[10px] truncate mt-1 ${activeIdx === idx ? 'text-white/70' : 'text-slate-600'}`}>{item.testName}</p>
                                <div className="flex gap-2 mt-3">
                                    <span className={`text-[9px] font-black px-2 py-1 rounded-lg ${activeIdx === idx ? 'bg-white/15 text-white' : 'bg-white/5 text-slate-400'}`}>
                                        L {listening?.score ?? '—'}/{listening?.total ?? 40}
                                    </span>
                                    <span className={`text-[9px] font-black px-2 py-1 rounded-lg ${activeIdx === idx ? 'bg-white/15 text-white' : 'bg-white/5 text-slate-400'}`}>
                                        R {reading?.score ?? '—'}/{reading?.total ?? 40}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="lg:col-span-3 bg-slate-900 border border-white/5 rounded-[3rem] overflow-hidden flex flex-col shadow-2xl shadow-black/50">
                {submission ? (
                    <>
                        <div className="px-8 py-6 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
                            <div>
                                <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Completed Mock Test</p>
                                <h2 className="text-2xl font-heading font-black text-white mt-1">{submission.testName || 'Untitled Test'}</h2>
                                <p className="text-xs text-slate-500 mt-1">
                                    {formatSubmissionTime(submission.submittedAt)} · Duration {formatDuration(submission.timeSpentSeconds)}
                                </p>
                            </div>
                            <button
                                onClick={onSave}
                                disabled={saving}
                                className="bg-primary text-white px-7 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                            >
                                {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                                Save Submission
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                                <label className="space-y-2">
                                    <span className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><User size={12} /> Student Name</span>
                                    <input value={submission.contact?.name || ''} onChange={e => updateContact('name', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm" />
                                </label>
                                <label className="space-y-2">
                                    <span className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Phone size={12} /> Phone</span>
                                    <input value={submission.contact?.phone || ''} onChange={e => updateContact('phone', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm" />
                                </label>
                                <label className="space-y-2">
                                    <span className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Mail size={12} /> Email</span>
                                    <input value={submission.contact?.email || ''} onChange={e => updateContact('email', e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white text-sm" />
                                </label>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                                <SkillSummaryEditor title="Listening" result={submission.results?.listening} onChange={(patch) => updateSkillResult('listening', patch)} />
                                <SkillSummaryEditor title="Reading" result={submission.results?.reading} onChange={(patch) => updateSkillResult('reading', patch)} />
                                <div className="bg-slate-950 border border-white/5 rounded-3xl p-6 space-y-4">
                                    <h3 className="text-sm font-heading font-black text-white flex items-center gap-2"><PenTool size={16} className="text-primary" /> Writing</h3>
                                    <select value={submission.results?.writing?.status || 'pending'} onChange={e => updateWriting({ status: e.target.value })} className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white text-xs font-bold">
                                        <option value="pending">Pending Review</option>
                                        <option value="reviewed">Reviewed</option>
                                        <option value="emailed">Emailed to Student</option>
                                    </select>
                                    <input value={submission.results?.writing?.score || ''} onChange={e => updateWriting({ score: e.target.value })} placeholder="Writing band / score" className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white text-xs" />
                                    <textarea value={submission.results?.writing?.feedback || ''} onChange={e => updateWriting({ feedback: e.target.value })} placeholder="Writing feedback..." rows={4} className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white text-xs resize-none" />
                                </div>
                            </div>

                            <AnswerDetailsEditor title="Listening Answers" skill="listening" result={submission.results?.listening} onChange={updateResultDetail} />
                            <AnswerDetailsEditor title="Reading Answers" skill="reading" result={submission.results?.reading} onChange={updateResultDetail} />

                            <div className="bg-slate-950 border border-white/5 rounded-3xl p-6 space-y-5">
                                <h3 className="text-sm font-heading font-black text-white flex items-center gap-2"><PenTool size={16} className="text-primary" /> Writing Responses</h3>
                                {Object.entries(submission.answers?.writing || { 1: '', 2: '' }).map(([task, value]) => (
                                    <label key={task} className="block space-y-2">
                                        <span className="text-[10px] font-black text-slate-500 uppercase">Task {task}</span>
                                        <textarea value={value || ''} onChange={e => updateWritingAnswer(task, e.target.value)} rows={8} className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm resize-y leading-relaxed" />
                                    </label>
                                ))}
                            </div>

                            <div className="bg-slate-950 border border-white/5 rounded-3xl p-6 space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase">Internal Admin Notes</label>
                                <textarea value={submission.adminNotes || ''} onChange={e => updateNotes(e.target.value)} rows={4} className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm resize-none" />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-700 gap-6">
                        <ClipboardList size={48} className="opacity-30" />
                        <div className="text-center">
                            <h3 className="text-xl font-heading font-black text-slate-400">No Submission Selected</h3>
                            <p className="text-xs font-bold text-slate-600 mt-2 uppercase tracking-widest">Select a completed test from the sidebar</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const SkillSummaryEditor = ({
    title,
    result,
    onChange
}: {
    title: string;
    result?: SkillResult;
    onChange: (patch: Partial<SkillResult>) => void;
}) => (
    <div className="bg-slate-950 border border-white/5 rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-heading font-black text-white flex items-center gap-2">
            {title === 'Listening' ? <Headphones size={16} className="text-primary" /> : <BookOpen size={16} className="text-primary" />}
            {title}
        </h3>
        <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1">
                <span className="text-[9px] font-black text-slate-600 uppercase">Band</span>
                <input value={result?.band || ''} onChange={e => onChange({ band: e.target.value })} className="w-full bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-white text-xs" />
            </label>
            <label className="space-y-1">
                <span className="text-[9px] font-black text-slate-600 uppercase">Raw Score</span>
                <input type="number" value={result?.score ?? ''} onChange={e => onChange({ score: Number(e.target.value) })} className="w-full bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-white text-xs" />
            </label>
            <label className="space-y-1">
                <span className="text-[9px] font-black text-slate-600 uppercase">Total</span>
                <input type="number" value={result?.total ?? ''} onChange={e => onChange({ total: Number(e.target.value) })} className="w-full bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-white text-xs" />
            </label>
            <label className="space-y-1">
                <span className="text-[9px] font-black text-slate-600 uppercase">Percent</span>
                <input type="number" value={result?.pct ?? ''} onChange={e => onChange({ pct: Number(e.target.value) })} className="w-full bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-white text-xs" />
            </label>
        </div>
    </div>
);

const AnswerDetailsEditor = ({
    title,
    skill,
    result,
    onChange
}: {
    title: string;
    skill: 'listening' | 'reading';
    result?: SkillResult;
    onChange: (skill: 'listening' | 'reading', detailIdx: number, patch: Partial<ResultDetail>) => void;
}) => {
    const details = result?.details || [];
    return (
        <div className="bg-slate-950 border border-white/5 rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-heading font-black text-white flex items-center gap-2">
                    {skill === 'listening' ? <Headphones size={16} className="text-primary" /> : <BookOpen size={16} className="text-primary" />}
                    {title}
                </h3>
                <span className="text-[10px] font-black text-slate-500 uppercase">{details.length} questions</span>
            </div>
            {details.length === 0 ? (
                <p className="text-xs text-slate-600 font-bold uppercase tracking-widest py-4">No answer details saved for this skill.</p>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                    {details.map((detail, idx) => (
                        <div key={`${skill}-${detail.q}-${idx}`} className={`rounded-2xl border p-4 space-y-3 ${detail.isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-white">Question {detail.q}</span>
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                                    <input type="checkbox" checked={!!detail.isCorrect} onChange={e => onChange(skill, idx, { isCorrect: e.target.checked })} />
                                    Correct
                                </label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <label className="space-y-1">
                                    <span className="text-[9px] font-black text-slate-600 uppercase">Student Answer</span>
                                    <input value={detail.userAnswer || ''} onChange={e => onChange(skill, idx, { userAnswer: e.target.value })} className="w-full bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-white text-xs" />
                                </label>
                                <label className="space-y-1">
                                    <span className="text-[9px] font-black text-slate-600 uppercase">Correct Answer</span>
                                    <input value={detail.correctAnswer || ''} onChange={e => onChange(skill, idx, { correctAnswer: e.target.value })} className="w-full bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-white text-xs" />
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const TypographyHint = ({ current }: { current: string }) => (
    <div className="flex flex-col shrink-0">
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Skill Target</span>
        <span className="text-xs font-black text-accent uppercase">{current}</span>
    </div>
);
