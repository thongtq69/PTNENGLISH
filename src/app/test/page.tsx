"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
    BookOpen, Headphones, PenTool, CheckCircle, Clock,
    AlertCircle, ChevronRight, ChevronLeft, Send, Play,
    Pause, FileText, Settings, Maximize2, Minimize2
} from "lucide-react";
import { ACADEMIC_TESTS } from "./constants";
import Link from "next/link";

export default function TestPage() {
    const [selectedTest, setSelectedTest] = useState<typeof ACADEMIC_TESTS[0] | null>(null);
    const [step, setStep] = useState(0); // 0: Selection, 1: Intro, 2: Testing, 3: Success
    const [currentSkill, setCurrentSkill] = useState<"listening" | "reading" | "writing">("listening");
    const [answers, setAnswers] = useState<Record<string, Record<number, string>>>({
        listening: {},
        reading: {},
        writing: {}
    });

    // UI States
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(3600); // 60 minutes default
    const [isFullScreen, setIsFullScreen] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

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

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isPlaying) audioRef.current.pause();
            else audioRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleSubmit = () => {
        setStep(3);
    };

    const renderAnswerSheet = () => {
        const count = selectedTest?.[currentSkill]?.questionsCount || 40;

        if (currentSkill === "writing") {
            return (
                <div className="space-y-8">
                    <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl">
                        <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                            <PenTool size={18} /> Writing Task Response
                        </h4>
                        <p className="text-xs text-slate-500">Hãy nhập bài làm của bạn vào ô dưới đây. Định dạng đoạn văn rõ ràng.</p>
                    </div>
                    {[1, 2].map(idx => (
                        <div key={idx} className="space-y-4">
                            <label className="text-sm font-black text-accent uppercase tracking-widest">Task 0{idx}</label>
                            <textarea
                                className="w-full h-80 p-8 rounded-[2rem] bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-body text-slate-700 resize-none shadow-inner"
                                placeholder={`Type your text for Writing Task ${idx}...`}
                                value={answers.writing[idx] || ""}
                                onChange={(e) => handleAnswerChange("writing", idx, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 group">
                        <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-focus-within:bg-primary group-focus-within:text-white transition-colors">
                            {i + 1}
                        </span>
                        <input
                            type="text"
                            placeholder="Answer..."
                            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-sm"
                            value={answers[currentSkill][i + 1] || ""}
                            onChange={(e) => handleAnswerChange(currentSkill, i + 1, e.target.value)}
                        />
                    </div>
                ))}
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
                            Bài làm của bạn đã được ghi nhận. Chuyên gia <span className="text-primary font-bold">PTN</span> sẽ chấm điểm and gửi kết quả chi tiết qua email trong vòng 24h.
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
        return (
            <main className="min-h-screen bg-slate-50">
                <Header />
                <div className="pt-40 pb-20 container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-5xl md:text-6xl font-heading font-black text-accent mb-6 leading-tight">
                            IELTS Academic <br /> <span className="text-primary">Mock Test Center</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-body">Chọn một trong 4 bộ đề thi chuẩn quốc tế để bắt đầu kiểm tra năng lực.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {ACADEMIC_TESTS.map((test, idx) => (
                            <motion.div
                                key={test.id}
                                whileHover={{ y: -10 }}
                                className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 flex flex-col items-center group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -translate-y-4 translate-x-4"></div>
                                <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white mb-8 group-hover:bg-primary transition-colors">
                                    <FileText size={32} />
                                </div>
                                <h3 className="text-xl font-heading font-bold text-accent mb-4">Set 0{idx + 1}</h3>
                                <div className="space-y-3 mb-8 w-full">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                                        <span>Listening</span> <span className="text-accent underline">40 Qs</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                                        <span>Reading</span> <span className="text-accent underline">40 Qs</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                                        <span>Writing</span> <span className="text-accent underline">2 Tasks</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedTest(test);
                                        setStep(1);
                                    }}
                                    className="w-full bg-slate-100 hover:bg-primary hover:text-white text-accent py-4 rounded-2xl font-black transition-all group-hover:shadow-lg active:scale-95"
                                >
                                    Select Test
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
            <main className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[3rem] p-12 md:p-20 max-w-3xl w-full text-center shadow-2xl"
                >
                    <div className="flex justify-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400"><Headphones size={20} /></div>
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400"><BookOpen size={20} /></div>
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400"><PenTool size={20} /></div>
                    </div>
                    <h2 className="text-accent font-heading font-black text-4xl mb-6">{selectedTest?.name}</h2>
                    <p className="text-slate-500 mb-12 text-lg">Chào mừng bạn đến với phòng thi giả lập. <br /> Bài thi gồm 3 phần: Listening (30p), Reading (60p), Writing (60p). Tổng hợp điểm and phản hồi sẽ được xử lý bởi đội ngũ học thuật.</p>

                    <div className="space-y-4 mb-12">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl text-left border border-slate-100">
                            <AlertCircle className="text-primary shrink-0" />
                            <p className="text-sm text-slate-600">Đảm bảo kết nối internet ổn định and tai nghe hoạt động tốt.</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => setStep(0)}
                            className="px-10 py-5 rounded-full border-2 border-slate-100 font-bold text-slate-400 hover:bg-slate-50 transition-all"
                        >
                            Quay lại
                        </button>
                        <button
                            onClick={() => setStep(2)}
                            className="px-12 py-5 rounded-full bg-primary text-white font-black text-xl shadow-xl shadow-primary/20 hover:bg-red-700 transition-all flex items-center gap-3 active:scale-95"
                        >
                            Start Exam <ChevronRight size={20} />
                        </button>
                    </div>
                </motion.div>
            </main>
        );
    }

    return (
        <main className={`h-screen flex flex-col bg-slate-100 overflow-hidden ${isFullScreen ? 'pt-0' : ''}`}>
            {/* Exam Top Navbar */}
            <div className="bg-slate-900 h-20 shrink-0 px-8 flex items-center justify-between text-white border-b border-white/5 relative z-[100]">
                <div className="flex items-center gap-8">
                    <div className="flex flex-col group cursor-pointer" onClick={() => window.location.href = "/"}>
                        <span className="text-xl font-heading font-extrabold tracking-tight">
                            <span className="text-primary uppercase">PTN</span>
                            <span className="uppercase text-white"> English</span>
                        </span>
                    </div>
                    <div className="h-8 w-px bg-white/10 hidden md:block"></div>
                    <div className="hidden md:flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">Exam:</span>
                        <span className="text-sm font-bold text-primary">{selectedTest?.name}</span>
                    </div>
                </div>

                {/* Skill Switcher */}
                <div className="absolute left-1/2 -translate-x-1/2 bg-white/5 p-1.5 rounded-2xl flex gap-1 border border-white/10">
                    {(["listening", "reading", "writing"] as const).map(skill => (
                        <button
                            key={skill}
                            onClick={() => {
                                setCurrentSkill(skill);
                                setIsPlaying(false);
                            }}
                            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${currentSkill === skill ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
                        >
                            {skill}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 bg-white/5 px-5 py-2.5 rounded-xl border border-white/10">
                        <Clock size={18} className="text-primary" />
                        <span className="font-mono text-xl font-bold">{formatTime(currentTime)}</span>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="bg-primary hover:bg-red-700 text-white px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-primary/20"
                    >
                        Finish Test
                    </button>
                </div>
            </div>

            {/* Split Screen Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Side: PDF Viewer */}
                <div className={`flex-1 flex flex-col transition-all duration-500 ${isSidebarOpen ? "w-3/5" : "w-full"}`}>
                    <div className="bg-white h-12 border-b border-slate-200 px-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {currentSkill === "listening" && <Headphones size={16} className="text-primary" />}
                            {currentSkill === "reading" && <BookOpen size={16} className="text-primary" />}
                            {currentSkill === "writing" && <PenTool size={16} className="text-primary" />}
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Exam Sheet (PDF)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                                {isSidebarOpen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 bg-slate-800">
                        <iframe
                            src={`${selectedTest?.[currentSkill]?.pdf}#toolbar=0&navpanes=0&scrollbar=1`}
                            className="w-full h-full border-none"
                            title="Exam PDF"
                        />
                    </div>
                </div>

                {/* Right Side: Answer Input Sheet */}
                <div className={`bg-white transition-all duration-500 border-l border-slate-200 flex flex-col ${isSidebarOpen ? "w-2/5" : "w-0 overflow-hidden"}`}>
                    {/* Control Panel (Audio for Listening) */}
                    {currentSkill === "listening" && (
                        <div className="bg-slate-50 p-6 border-b border-slate-200">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Audio Controller</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tracks: {selectedTest?.listening.audio.length} Sections</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {selectedTest?.listening.audio.map((track, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            if (audioRef.current) {
                                                audioRef.current.src = track.url;
                                                audioRef.current.play();
                                                setIsPlaying(true);
                                            }
                                        }}
                                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[10px] font-bold hover:border-primary hover:text-primary transition-all shadow-sm"
                                    >
                                        Section 0{track.section}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                                <button
                                    onClick={toggleAudio}
                                    className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center hover:scale-110 shadow-lg shadow-primary/20 transition-all active:scale-95"
                                >
                                    {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                                </button>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-accent mb-1 uppercase tracking-tighter">Now Playing</p>
                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            animate={{ x: isPlaying ? ["-100%", "100%"] : "0%" }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                            className="h-full w-1/3 bg-primary"
                                        />
                                    </div>
                                </div>
                                <audio ref={audioRef} onEnded={() => setIsPlaying(false)} className="hidden" />
                            </div>
                        </div>
                    )}

                    <div className="bg-white h-12 px-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Answer Sheet</span>
                        <span className="text-[10px] font-black text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">Automated Saving</span>
                    </div>

                    {/* Scrollable Answer Sheet */}
                    <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                        {renderAnswerSheet()}

                        <div className="mt-16 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center">
                            <h5 className="font-heading font-bold text-accent mb-4">You've reached the end</h5>
                            <button
                                onClick={handleSubmit}
                                className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] hover:underline"
                            >
                                Finish and Send Results <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Warning Overlay */}
            <div className="lg:hidden fixed inset-0 z-[200] bg-slate-900 flex flex-col items-center justify-center text-center p-10">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8">
                    <Maximize2 size={40} className="text-primary" />
                </div>
                <h2 className="text-white font-heading font-black text-2xl mb-4 uppercase">Large Screen Required</h2>
                <p className="text-slate-400 font-body mb-8">Giao diện thi thử học thuật yêu cầu màn hình lớn (Máy tính/Tablet) để hiển thị PDF and Phiếu làm bài đồng thời.</p>
                <Link href="/" className="text-primary font-bold hover:underline">Quay lại Trang chủ</Link>
            </div>
        </main>
    );
}
