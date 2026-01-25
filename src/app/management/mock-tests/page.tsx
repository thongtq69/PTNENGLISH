export const dynamic = "force-dynamic";
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    GraduationCap,
    Plus,
    Trash2,
    Save,
    FileText,
    Headphones,
    BookOpen as ReadingIcon,
    PenTool as WritingIcon,
    Music,
    ChevronDown,
    CheckCircle2
} from "lucide-react";

export default function MockTestsManagementPage() {
    const [tests, setTests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        fetch("/api/mock-tests")
            .then(res => res.json())
            .then(data => {
                setTests(data);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/mock-tests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tests)
            });
            if (res.ok) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-slate-400">Loading mock tests...</div>;

    const addTest = () => {
        const newId = `test-${(tests.length + 1).toString().padStart(2, '0')}`;
        setTests([...tests, {
            id: newId,
            name: `New Academic Test ${tests.length + 1}`,
            listening: { pdf: "", audio: [], questionsCount: 40 },
            reading: { pdf: "", questionsCount: 40 },
            writing: { pdf: "", questionsCount: 2 }
        }]);
    };

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30 bg-[#0F172A]/80 backdrop-blur-md py-4">
                <div>
                    <h2 className="text-2xl font-bold font-heading">Quản lý Mock Tests</h2>
                    <p className="text-slate-400">Quản lý các bộ đề IELTS Academic & General.</p>
                </div>
                <div className="flex items-center gap-3">
                    {showSuccess && (
                        <motion.span
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-green-400 text-sm font-bold flex items-center gap-2"
                        >
                            <CheckCircle2 size={16} /> Saved Successfully
                        </motion.span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : <><Save size={18} /> Lưu thay đổi</>}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {tests.map((test, idx) => (
                    <motion.div
                        key={test.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#1E293B]/30 border border-slate-800 rounded-3xl p-8 group relative overflow-hidden"
                    >
                        {/* ID Badge */}
                        <div className="absolute top-0 right-0 px-6 py-2 bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 rounded-bl-2xl">
                            {test.id}
                        </div>

                        <div className="flex flex-col lg:flex-row gap-10">
                            {/* General Info */}
                            <div className="lg:w-1/3 space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Tên bộ đề</label>
                                    <input
                                        className="bg-transparent border-none text-2xl font-bold p-0 w-full outline-none focus:text-primary transition-colors font-heading"
                                        value={test.name}
                                        onChange={(e) => {
                                            const newTests = [...tests];
                                            newTests[idx].name = e.target.value;
                                            setTests(newTests);
                                        }}
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            const newTests = [...tests];
                                            newTests.splice(idx, 1);
                                            setTests(newTests);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        <Trash2 size={14} /> Xóa bộ đề
                                    </button>
                                </div>
                            </div>

                            {/* Skills Grid */}
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Listening */}
                                <div className="space-y-4 p-5 rounded-2xl bg-slate-800/20 border border-slate-800">
                                    <div className="flex items-center gap-2 text-blue-400 font-bold text-sm uppercase tracking-widest">
                                        <Headphones size={16} /> Listening
                                    </div>
                                    <div className="space-y-3">
                                        <div className="relative">
                                            <FileText size={14} className="absolute left-3 top-3 text-slate-500" />
                                            <input
                                                placeholder="Link PDF đề thi..."
                                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-blue-400"
                                                value={test.listening.pdf}
                                                onChange={(e) => {
                                                    const nt = [...tests];
                                                    nt[idx].listening.pdf = e.target.value;
                                                    setTests(nt);
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-500 uppercase">Audio Sections ({test.listening.audio.length})</label>
                                            <button
                                                onClick={() => {
                                                    const nt = [...tests];
                                                    nt[idx].listening.audio.push({ section: nt[idx].listening.audio.length + 1, url: "" });
                                                    setTests(nt);
                                                }}
                                                className="w-full py-2 bg-slate-800 rounded-lg text-[9px] font-bold uppercase hover:bg-blue-500 transition-colors"
                                            >
                                                + Thêm audio
                                            </button>
                                            {test.listening.audio.map((ans: any, aidx: number) => (
                                                <div key={aidx} className="flex gap-2">
                                                    <input
                                                        placeholder="URL audio..."
                                                        className="flex-1 bg-slate-800/30 border border-slate-700 rounded-lg px-3 py-2 text-[10px] outline-none"
                                                        value={ans.url}
                                                        onChange={(e) => {
                                                            const nt = [...tests];
                                                            nt[idx].listening.audio[aidx].url = e.target.value;
                                                            setTests(nt);
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            const nt = [...tests];
                                                            nt[idx].listening.audio.splice(aidx, 1);
                                                            setTests(nt);
                                                        }}
                                                        className="text-slate-600 hover:text-red-400"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Reading */}
                                <div className="space-y-4 p-5 rounded-2xl bg-slate-800/20 border border-slate-800">
                                    <div className="flex items-center gap-2 text-green-400 font-bold text-sm uppercase tracking-widest">
                                        <ReadingIcon size={16} /> Reading
                                    </div>
                                    <div className="relative">
                                        <FileText size={14} className="absolute left-3 top-3 text-slate-500" />
                                        <input
                                            placeholder="Link PDF đề thi..."
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-green-400"
                                            value={test.reading.pdf}
                                            onChange={(e) => {
                                                const nt = [...tests];
                                                nt[idx].reading.pdf = e.target.value;
                                                setTests(nt);
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Writing */}
                                <div className="space-y-4 p-5 rounded-2xl bg-slate-800/20 border border-slate-800">
                                    <div className="flex items-center gap-2 text-orange-400 font-bold text-sm uppercase tracking-widest">
                                        <WritingIcon size={16} /> Writing
                                    </div>
                                    <div className="relative">
                                        <FileText size={14} className="absolute left-3 top-3 text-slate-500" />
                                        <input
                                            placeholder="Link PDF đề thi..."
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-orange-400"
                                            value={test.writing.pdf}
                                            onChange={(e) => {
                                                const nt = [...tests];
                                                nt[idx].writing.pdf = e.target.value;
                                                setTests(nt);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                <button
                    onClick={addTest}
                    className="border-2 border-dashed border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center text-slate-600 hover:text-primary hover:border-primary/30 transition-all gap-4"
                >
                    <Plus size={40} />
                    <span className="font-bold uppercase tracking-widest text-sm">Thêm bộ đề mới</span>
                </button>
            </div>
        </div>
    );
}
