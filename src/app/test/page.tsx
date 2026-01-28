"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
    BookOpen, Headphones, PenTool, Clock,
    AlertCircle, ChevronRight, Send, Play,
    Pause, FileText, Maximize2, Minimize2,
    CheckCircle2, ChevronLeft, Volume2, RefreshCw
} from "lucide-react";
import Link from "next/link";

interface TestSection {
    title: string;
    content: string;
    answers: Record<string, string>;
    questionsCount: number;
    audioUrl?: string;
}

interface Test {
    _id: string;
    name: string;
    listening: { pdf: string; sections: TestSection[]; totalQuestions: number };
    reading: { pdf: string; sections: TestSection[]; totalQuestions: number };
    writing: { pdf: string; content: string; tasksCount: number };
}

export default function TestPage() {
    const [academicTests, setAcademicTests] = useState<Test[]>([]);
    const [selectedTest, setSelectedTest] = useState<Test | null>(null);
    const [step, setStep] = useState(0); // 0: Selection, 1: Intro, 2: Testing, 3: Success
    const [loading, setLoading] = useState(true);
    const [currentSkill, setCurrentSkill] = useState<"listening" | "reading" | "writing">("listening");
    const [activeSectionIdx, setActiveSectionIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<string, Record<number, string>>>({
        listening: {},
        reading: {},
        writing: {}
    });

    useEffect(() => {
        fetch("/api/mock-tests")
            .then(res => res.json())
            .then(data => {
                setAcademicTests(data);
                setLoading(false);
            });
    }, []);

    // UI States
    const [viewMode, setViewMode] = useState<"pdf" | "answers">("pdf");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(3600); // 60 minutes default

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const scrollRefs = useRef<Record<number, HTMLElement | null>>({});

    // Timer Logic
    useEffect(() => {
        if (step === 2) {
            timerRef.current = setInterval(() => {
                setCurrentTime(prev => {
                    if (prev <= 0) {
                        clearInterval(timerRef.current!);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [step]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    const handleAnswerChange = (skill: string, qIdx: number, val: string) => {
        setAnswers(prev => ({
            ...prev,
            [skill]: {
                ...prev[skill as keyof typeof answers],
                [qIdx]: val
            }
        }));
    };

    const toggleAudio = (url?: string) => {
        if (!audioRef.current || !url) return;

        // If switching to a different audio file
        if (currentAudioUrl !== url) {
            audioRef.current.src = url;
            audioRef.current.play();
            setCurrentAudioUrl(url);
            setIsPlaying(true);
        } else {
            // Same audio - toggle play/pause
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const handleSubmit = () => {
        if (confirm("Bạn có chắc chắn muốn nộp bài?")) {
            setStep(3);
        }
    };

    const scrollToQuestion = (qIdx: number) => {
        const el = scrollRefs.current[qIdx];
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // Find section that contains qIdx
            if (currentSkill === 'writing') return;
            const skillData = selectedTest?.[currentSkill];
            if (!skillData || !('sections' in skillData)) return;

            const secIdx = (skillData as { sections: TestSection[] }).sections.findIndex((s: TestSection, i: number) => {
                const start = currentSkill === 'listening' ? (i * 10) + 1 : (i === 0 ? 1 : (i === 1 ? 14 : 27));
                const end = currentSkill === 'listening' ? (i + 1) * 10 : (i === 0 ? 13 : (i === 1 ? 26 : 40));
                return qIdx >= start && qIdx <= end;
            });
            if (secIdx !== -1) {
                setActiveSectionIdx(secIdx);
                // Delay scroll slightly to allow section to mount
                setTimeout(() => {
                    scrollRefs.current[qIdx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        }
    };

    const parseContentWithInputs = (content: string, skill: "listening" | "reading" | "writing") => {
        if (!content) return <div className="text-slate-400 italic">No interactive content provided for this section.</div>;

        // Ensure we don't break tables with whitespace-pre-wrap
        // and improve typography
        const parts = content.split(/(\[Q\d+\])/g);

        return (
            <div className="prose prose-slate max-w-none dark:prose-invert font-body leading-relaxed text-slate-700">
                {parts.map((part, i) => {
                    const match = part.match(/\[Q(\d+)\]/);
                    if (match) {
                        const qIdx = parseInt(match[1]);
                        return (
                            <span
                                key={i}
                                ref={el => { scrollRefs.current[qIdx] = el; }}
                                className="inline-block mx-2 group relative align-middle"
                            >
                                <input
                                    type="text"
                                    className={`w-32 md:w-40 bg-slate-50 border-2 border-slate-200 focus:border-primary focus:bg-white transition-all outline-none px-3 py-1.5 text-sm font-black text-primary rounded-lg shadow-sm ${answers[skill][qIdx] ? 'border-primary bg-primary/[0.02]' : ''}`}
                                    value={answers[skill][qIdx] || ""}
                                    onChange={(e) => handleAnswerChange(skill, qIdx, e.target.value)}
                                    placeholder={""}
                                />
                                <span className={`absolute -top-5 left-1 text-[10px] font-black uppercase tracking-widest transition-colors ${answers[skill][qIdx] ? 'text-primary' : 'text-slate-400'}`}>Q{qIdx}</span>
                            </span>
                        );
                    }
                    return <span key={i} dangerouslySetInnerHTML={{ __html: part }} />;
                })}
            </div>
        );
    };

    const renderAnswerSheet = () => {
        if (!selectedTest) return null;

        if (currentSkill === "writing") {
            return (
                <div className="space-y-12">
                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200">
                        <div className="flex items-center gap-4 mb-6">
                            <PenTool className="text-primary" />
                            <h3 className="font-heading font-black text-accent text-xl uppercase tracking-tight">Writing Response</h3>
                        </div>
                        <div className="prose prose-slate max-w-none mb-10 text-slate-700" dangerouslySetInnerHTML={{ __html: selectedTest.writing.content }} />

                        <div className="space-y-8">
                            {[1, 2].map(idx => (
                                <div key={idx} className="space-y-4">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Task {idx} Response Area</label>
                                    <textarea
                                        className="w-full h-96 p-8 rounded-[2rem] bg-white border border-slate-200 focus:ring-8 focus:ring-primary/5 outline-none transition-all font-body text-slate-700 resize-none shadow-inner"
                                        placeholder={`Enter your Writing Task ${idx} essay here...`}
                                        value={answers.writing[idx] || ""}
                                        onChange={(e) => handleAnswerChange("writing", idx, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )
        }

        const sections = selectedTest[currentSkill].sections || [];
        const activeSection = sections[activeSectionIdx];

        return (
            <div className="space-y-8">
                {/* Section Navigation Header */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 sticky top-0 bg-slate-50 z-20 pt-2">
                    {sections.map((sec, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveSectionIdx(idx)}
                            className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap shadow-sm border ${activeSectionIdx === idx ? 'bg-primary border-primary text-white' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                        >
                            {currentSkill === 'listening' ? `Section 0${idx + 1}` : `Passage 0${idx + 1}`}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${currentSkill}-${activeSectionIdx}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white p-6 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[60vh]"
                    >
                        {activeSection ? (
                            <>
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 border-b border-slate-50 pb-8">
                                    <h4 className="text-xl md:text-2xl font-heading font-black text-accent">{activeSection.title}</h4>
                                    {currentSkill === 'listening' && activeSection.audioUrl && (
                                        <button
                                            onClick={() => toggleAudio(activeSection.audioUrl)}
                                            className={`p-4 rounded-2xl flex items-center gap-3 transition-all ${isPlaying ? 'bg-primary text-white scale-105 shadow-lg shadow-primary/30' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
                                        >
                                            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                            <span className="text-[10px] font-black uppercase tracking-widest">Listen This Section</span>
                                        </button>
                                    )}
                                </div>
                                {parseContentWithInputs(activeSection.content, currentSkill)}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-300 gap-4">
                                <AlertCircle size={48} className="opacity-10" />
                                <p className="text-xs font-bold uppercase tracking-widest">Section content missing</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    };

    if (step === 3) {
        return (
            <main className="min-h-screen bg-slate-50">
                <Header />
                <div className="pt-32 pb-20 container mx-auto px-6 max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[4rem] p-12 md:p-24 shadow-2xl border border-slate-100"
                    >
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-10">
                            <Send size={48} className="text-primary animate-pulse" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-heading font-black text-accent mb-8">
                            Submission <span className="text-primary">Successful!</span>
                        </h2>
                        <p className="text-slate-500 text-lg mb-12 font-body max-w-2xl mx-auto">
                            Bài làm của bạn đã được ghi nhận. Chuyên gia <span className="text-primary font-bold">PTN</span> sẽ chấm điểm và gửi kết quả chi tiết qua email trong vòng 24h.
                        </p>
                        <button
                            onClick={() => window.location.href = "/"}
                            className="bg-accent text-white px-12 py-5 rounded-full font-bold shadow-xl hover:bg-slate-900 transition-all active:scale-95"
                        >
                            Quay lại Trang Chủ
                        </button>
                    </motion.div>
                </div>
                <Footer />
            </main>
        );
    }

    if (step === 0) {
        if (loading) return <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-500 gap-4">
            <RefreshCw className="animate-spin text-primary" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Connecting to Secure Academic Server...</p>
        </div>;
        return (
            <main className="min-h-screen bg-slate-50">
                <Header />
                <div className="pt-40 pb-20 container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-heading font-black text-accent mb-6 leading-tight uppercase tracking-tighter"
                        >
                            IELTS Academic <br /> <span className="text-primary">Simulator</span>
                        </motion.h1>
                        <p className="text-slate-500 text-lg font-body">Trải nghiệm phòng thi thật với các bộ đề chuẩn quốc tế, cấu trúc IELTS 4 kỹ năng.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {academicTests.map((test, idx) => (
                            <motion.div
                                key={test._id}
                                whileHover={{ y: -10 }}
                                className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100 flex flex-col items-center group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem] -translate-y-8 translate-x-8"></div>
                                <div className="w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center text-white mb-10 group-hover:bg-primary transition-all duration-500 rotate-3 group-hover:rotate-0 shadow-xl border border-white/5">
                                    <FileText size={36} />
                                </div>
                                <h3 className="text-2xl font-heading font-black text-accent mb-4">Set 0{idx + 1}</h3>
                                <div className="space-y-4 mb-10 w-full bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <span>Listening</span> <span className="text-primary">4 Sections</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <span>Reading</span> <span className="text-primary">3 Passages</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <span>Result</span> <span className="text-primary">24h Response</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedTest(test);
                                        setStep(1);
                                    }}
                                    className="w-full bg-accent text-white py-5 rounded-2xl font-black transition-all hover:bg-slate-900 shadow-xl active:scale-95 flex items-center justify-center gap-2 group-hover:shadow-primary/20"
                                >
                                    Select Test <ChevronRight size={18} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    if (step === 1) {
        return (
            <main className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2"></div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="bg-white rounded-[4rem] p-12 md:p-24 max-w-4xl w-full text-center shadow-2xl relative z-10"
                >
                    <div className="flex justify-center gap-6 mb-12">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100"><Headphones size={24} /></div>
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100"><BookOpen size={24} /></div>
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100"><PenTool size={24} /></div>
                    </div>
                    <h2 className="text-accent font-heading font-black text-5xl mb-8 leading-tight">{selectedTest?.name}</h2>
                    <p className="text-slate-500 mb-14 text-xl font-body leading-relaxed max-w-2xl mx-auto">
                        Chào mừng bạn đến với hệ thống thi thử của <strong className="text-accent font-black">PTN English</strong>.
                        Bài thi được thiết kế để đo lường chính xác các kỹ năng IELTS Academic của bạn.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
                        <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl text-left border border-slate-100">
                            <Clock className="text-primary shrink-0" size={20} />
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Limit</p>
                                <p className="text-sm font-bold text-accent">150 Minutes Total</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl text-left border border-slate-100">
                            <AlertCircle className="text-primary shrink-0" size={20} />
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Requirement</p>
                                <p className="text-sm font-bold text-accent">Stable Connection & Audio</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button
                            onClick={() => setStep(0)}
                            className="px-12 py-5 rounded-full border-2 border-slate-100 font-bold text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]"
                        >
                            Back to Center
                        </button>
                        <button
                            onClick={() => setStep(2)}
                            className="px-16 py-6 rounded-full bg-primary text-white font-black text-xl shadow-2xl shadow-primary/30 hover:bg-red-700 transition-all flex items-center gap-4 active:scale-95 group"
                        >
                            Start Simulation <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </motion.div>
            </main>
        );
    }

    return (
        <main className={`h-screen flex flex-col bg-slate-100 overflow-hidden relative`}>
            {/* Pro Navbar */}
            <div className="bg-slate-900 min-h-[5rem] md:h-24 shrink-0 px-4 md:px-10 flex items-center justify-between text-white border-b border-white/5 relative z-[100] shadow-2xl">
                <div className="flex items-center gap-4 md:gap-10">
                    <button className="cursor-pointer" onClick={() => window.location.href = "/"}>
                        <span className="text-xl font-heading font-extrabold tracking-tighter">
                            <span className="text-primary uppercase">PTN</span>
                            <span className="uppercase text-white hidden sm:inline"> Simulator</span>
                        </span>
                    </button>
                    <div className="h-10 w-px bg-white/10 hidden lg:block"></div>
                    <div className="hidden lg:flex flex-col">
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">IELTS Academic</span>
                        <span className="text-xs font-bold text-white">{selectedTest?.name}</span>
                    </div>
                </div>

                {/* Skill Selector - Responsive */}
                <div className="absolute left-1/2 -translate-x-1/2 bg-white/5 p-1.5 rounded-2xl flex gap-1 border border-white/10 scale-90 md:scale-100">
                    {(["listening", "reading", "writing"] as const).map(skill => (
                        <button
                            key={skill}
                            onClick={() => {
                                setCurrentSkill(skill);
                                setIsPlaying(false);
                                setActiveSectionIdx(0);
                            }}
                            className={`px-4 md:px-8 py-2 md:py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${currentSkill === skill ? "bg-primary text-white shadow-xl" : "text-slate-400 hover:text-white"}`}
                        >
                            {skill}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 md:gap-8">
                    <div className="hidden sm:flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                        <Clock size={20} className="text-primary" />
                        <span className="font-mono text-2xl font-black tabular-nums">{formatTime(currentTime)}</span>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="bg-primary hover:bg-red-700 text-white px-5 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-primary/20"
                    >
                        Nộp Bài
                    </button>
                </div>
            </div>

            {/* Main Content Split View or Single View on Mobile */}
            <div className="flex-1 flex overflow-hidden flex-col lg:flex-row">
                {/* PDF Block */}
                <div className={`transition-all duration-700 flex flex-col h-full ${isMobile ? (viewMode === 'pdf' ? "w-full" : "hidden") : (isSidebarOpen ? "w-1/2" : "w-0 overflow-hidden")}`}>
                    <div className="bg-white h-10 border-b border-slate-200 px-6 flex items-center justify-between shadow-sm z-10 shrink-0">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                            <FileText size={12} /> Original PDF Exam
                        </span>
                        {!isMobile && <button onClick={() => setIsSidebarOpen(false)} className="text-slate-300 hover:text-accent"><Minimize2 size={14} /></button>}
                    </div>
                    <div className="flex-1 bg-slate-800 relative">
                        {(() => {
                            const pdfUrl = selectedTest?.[currentSkill]?.pdf || '';

                            if (!pdfUrl) {
                                return (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900 p-12 text-center">
                                        <FileText size={64} className="mb-6 opacity-10" />
                                        <p className="text-xs font-bold uppercase tracking-widest">PDF not available for this section.</p>
                                    </div>
                                );
                            }

                            // Use Google Docs Viewer (gview) for reliable cross-origin PDF viewing
                            const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`;

                            return (
                                <iframe
                                    src={viewerUrl}
                                    className="w-full h-full border-none"
                                    title="Exam PDF"
                                />
                            );
                        })()}
                    </div>
                </div>

                {/* Answer Block */}
                <div className={`transition-all duration-700 flex flex-col bg-slate-50 h-full overflow-hidden ${isMobile ? (viewMode === 'answers' ? "w-full" : "hidden") : (!isSidebarOpen ? "w-full" : "w-1/2 border-l border-slate-200")}`}>
                    <div className="bg-white h-10 border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-4">
                            {!isSidebarOpen && !isMobile && <button onClick={() => setIsSidebarOpen(true)} className="p-1 px-3 bg-slate-100 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 hover:bg-primary hover:text-white transition-all"><Maximize2 size={12} /> View PDF</button>}
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                                <CheckCircle2 size={12} /> Active Response Area
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[9px] font-black text-emerald-600 uppercase">Live Saving</span>
                            </div>
                            {isMobile && (
                                <div className="md:hidden flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                                    <Clock size={10} className="text-primary" />
                                    <span className="text-[10px] font-black text-accent">{formatTime(currentTime)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-12 custom-scrollbar pb-32 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-[0.98]">
                        {renderAnswerSheet()}
                    </div>

                    {/* Question Tracker & Mobile Switcher */}
                    <div className="h-24 md:h-28 bg-white border-t border-slate-200 px-4 md:px-10 flex items-center gap-3 shrink-0 relative">
                        <TypographyHint current={currentSkill} />
                        <div className="h-10 w-px bg-slate-100 mx-2 md:mx-4"></div>
                        <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2.5 py-4">
                            {Array.from({ length: 40 }).map((_, i) => {
                                const qIdx = i + 1;
                                const isAnswered = !!answers[currentSkill][qIdx];
                                return (
                                    <button
                                        key={qIdx}
                                        onClick={() => scrollToQuestion(qIdx)}
                                        className={`w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl flex items-center justify-center text-[10px] font-black transition-all ${isAnswered ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105" : "bg-slate-50 text-slate-400 border border-slate-100 hover:border-slate-300"}`}
                                    >
                                        {qIdx}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile View Toggle */}
            {isMobile && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex bg-slate-900/90 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-2xl">
                    <button
                        onClick={() => setViewMode('pdf')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'pdf' ? 'bg-primary text-white shadow-lg' : 'text-slate-400'}`}
                    >
                        <FileText size={16} /> PDF
                    </button>
                    <button
                        onClick={() => setViewMode('answers')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'answers' ? 'bg-primary text-white shadow-lg' : 'text-slate-400'}`}
                    >
                        <PenTool size={16} /> Answers
                    </button>
                </div>
            )}

            <audio ref={audioRef} onEnded={() => setIsPlaying(false)} className="hidden" />

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                
                /* Test Content Table Styling */
                .prose table { border-collapse: collapse; width: 100%; margin: 2rem 0; border: 1.5px solid #e2e8f0; border-radius: 0.75rem; overflow: hidden; }
                .prose th, .prose td { border: 1px solid #e2e8f0; padding: 1rem 1.5rem !important; vertical-align: top; }
                .prose th { background-color: #f8fafc; font-weight: 800; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; color: #475569; }
                .prose tr:nth-child(even) { background-color: #fbfcfe; }
                .prose h3 { font-family: var(--font-heading); font-weight: 900; color: #0f172a; margin-top: 3rem; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: -0.02em; }
                .prose p { margin-bottom: 1.5rem; line-height: 1.8; }
            `}</style>
        </main>
    );
}

const TypographyHint = ({ current }: { current: string }) => (
    <div className="flex flex-col shrink-0 min-w-[70px]">
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Testing</span>
        <span className="text-xs font-black text-primary uppercase tracking-tighter leading-none">{current}</span>
    </div>
);
