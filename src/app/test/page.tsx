"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Headphones, PenTool, CheckCircle, Clock, AlertCircle, ChevronRight, ChevronLeft, Send, Play, Pause } from "lucide-react";

type Question = {
    id: number;
    type: "radio" | "checkbox" | "text" | "essay";
    question: string;
    options?: string[];
    section: "reading" | "writing" | "listening";
};

const TEST_DATA: Question[] = [
    // Listening
    {
        id: 1,
        section: "listening",
        type: "radio",
        question: "What is the main topic of the conversation?",
        options: ["University admission", "Course selection", "Library registration", "Campus tour"]
    },
    {
        id: 2,
        section: "listening",
        type: "radio",
        question: "When does the library close on Fridays?",
        options: ["5:00 PM", "7:00 PM", "9:00 PM", "11:00 PM"]
    },
    // Reading
    {
        id: 3,
        section: "reading",
        type: "radio",
        question: "According to the passage, what is the primary cause of urban heat islands?",
        options: ["Lack of vegetation", "Traffic congestion", "Industrial emissions", "High-rise buildings"]
    },
    {
        id: 4,
        section: "reading",
        type: "checkbox",
        question: "Which TWO of the following are mentioned as potential solutions? (Select 2)",
        options: ["Green roofs", "Reflective pavements", "Limiting car usage", "Building underground"]
    },
    // Writing
    {
        id: 5,
        section: "writing",
        type: "essay",
        question: "Some people believe that artificial intelligence will eventually replace teachers in the classroom. To what extent do you agree or disagree with this statement? (Minimum 250 words)"
    }
];

export default function TestPage() {
    const [step, setStep] = useState(0); // 0: Intro, 1: Listening, 2: Reading, 3: Writing, 4: Success
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<number, any>>({});
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const sections = ["Listening", "Reading", "Writing"];
    const sectionQuestions = TEST_DATA.filter(q => q.section === sections[step - 1]?.toLowerCase());

    const handleNext = () => {
        if (currentQuestionIdx < sectionQuestions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
        } else if (step < 3) {
            setStep(prev => prev + 1);
            setCurrentQuestionIdx(0);
        } else {
            setStep(4);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIdx > 0) {
            setCurrentQuestionIdx(prev => prev - 1);
        } else if (step > 1) {
            setStep(prev => prev - 1);
            const prevSectionQuestions = TEST_DATA.filter(q => q.section === sections[step - 2]?.toLowerCase());
            setCurrentQuestionIdx(prevSectionQuestions.length - 1);
        }
    };

    const handleAnswerChange = (qId: number, value: any) => {
        setAnswers(prev => ({ ...prev, [qId]: value }));
    };

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isPlaying) audioRef.current.pause();
            else audioRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50">
            <Header />

            <div className="pt-32 pb-20 container mx-auto px-6 max-w-5xl">
                <AnimatePresence mode="wait">
                    {/* Step 0: Introduction */}
                    {step === 0 && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[4rem] p-12 md:p-20 shadow-2xl text-center border border-slate-100"
                        >
                            <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-10">
                                <BookOpen size={48} className="text-accent" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-heading font-semibold text-accent mb-8 leading-tight">
                                Academic Placement Test
                            </h1>
                            <p className="text-slate-500 text-lg mb-12 font-body max-w-2xl mx-auto leading-relaxed">
                                Bài kiểm tra năng lực tiếng Anh học thuật chuẩn Châu Âu giúp xác định chính xác trình độ và lộ trình tối ưu cho mục tiêu IELTS của bạn.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <Headphones className="mx-auto mb-4 text-primary" size={24} />
                                    <h3 className="font-bold text-slate-900 mb-2">Listening</h3>
                                    <p className="text-xs text-slate-400">15 Minutes</p>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <BookOpen className="mx-auto mb-4 text-accent" size={24} />
                                    <h3 className="font-bold text-slate-900 mb-2">Reading</h3>
                                    <p className="text-xs text-slate-400">20 Minutes</p>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <PenTool className="mx-auto mb-4 text-primary" size={24} />
                                    <h3 className="font-bold text-slate-900 mb-2">Writing</h3>
                                    <p className="text-xs text-slate-400">25 Minutes</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6 items-center">
                                <button
                                    onClick={() => setStep(1)}
                                    className="bg-primary hover:bg-red-700 text-white px-12 py-5 rounded-full font-bold text-xl shadow-2xl shadow-red-500/30 transition-all flex items-center"
                                >
                                    Bắt Đầu Kiểm Tra <ChevronRight size={20} className="ml-3" />
                                </button>
                                <div className="flex items-center text-slate-400 text-sm">
                                    <AlertCircle size={16} className="mr-2" />
                                    Lưu ý: Kết quả sẽ được gửi tới Admin để chấm điểm chi tiết.
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 1, 2, 3: Test Sections */}
                    {(step >= 1 && step <= 3) && (
                        <motion.div
                            key={`step-${step}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden"
                        >
                            {/* Progress Header */}
                            <div className="bg-accent p-8 text-white flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mr-6">
                                        {step === 1 && <Headphones />}
                                        {step === 2 && <BookOpen />}
                                        {step === 3 && <PenTool />}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Section 0{step}</p>
                                        <h2 className="text-xl font-heading font-semibold">{sections[step - 1]}</h2>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Time Remaining</p>
                                    <div className="flex items-center text-lg font-mono font-bold">
                                        <Clock size={16} className="mr-2" /> 59:59
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 md:p-16">
                                {/* Section Specific Content */}
                                {step === 1 && (
                                    <div className="mb-12 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                                        <div>
                                            <h4 className="font-bold text-slate-900 mb-2">Audio Recording</h4>
                                            <p className="text-xs text-slate-400 font-body">Click play to listen to the recording. You can only play it once in real tests.</p>
                                        </div>
                                        <button
                                            onClick={toggleAudio}
                                            className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-red-500/20"
                                        >
                                            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                                        </button>
                                        <audio
                                            ref={audioRef}
                                            src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                                            onEnded={() => setIsPlaying(false)}
                                            className="hidden"
                                        />
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="mb-12 p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 overflow-y-auto max-h-[300px] font-body text-slate-600 leading-relaxed text-sm">
                                        <h4 className="font-heading font-black text-xl text-accent mb-6 uppercase tracking-tight">Urban Heat Islands</h4>
                                        <p className="mb-4">An urban heat island (UHI) is a metropolitan area that is significantly warmer than its surrounding rural areas due to human activities. The temperature difference is usually larger at night than during the day, and is most apparent when winds are weak. UHI is most noticeable during the summer and winter.</p>
                                        <p>The main cause of the urban heat island effect is from the modification of land surfaces. Waste heat generated by energy usage is a secondary contributor. As a population center grows, it tends to expand its area and increase its average temperature...</p>
                                    </div>
                                )}

                                {/* Question Content */}
                                <div className="min-h-[300px]">
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">
                                        Question {currentQuestionIdx + 1} of {sectionQuestions.length}
                                    </p>
                                    <h3 className="text-2xl font-heading font-bold text-accent mb-10 leading-snug">
                                        {sectionQuestions[currentQuestionIdx]?.question}
                                    </h3>

                                    <div className="space-y-4">
                                        {sectionQuestions[currentQuestionIdx]?.type === "radio" && sectionQuestions[currentQuestionIdx].options?.map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleAnswerChange(sectionQuestions[currentQuestionIdx].id, opt)}
                                                className={`w-full text-left p-6 rounded-3xl border transition-all flex items-center font-body ${answers[sectionQuestions[currentQuestionIdx].id] === opt ? "bg-accent/5 border-accent text-accent font-bold" : "bg-white border-slate-100 text-slate-600 hover:border-accent/40"}`}
                                            >
                                                <div className={`w-5 h-5 rounded-full border-2 mr-6 flex items-center justify-center ${answers[sectionQuestions[currentQuestionIdx].id] === opt ? "border-accent bg-accent" : "border-slate-200"}`}>
                                                    {answers[sectionQuestions[currentQuestionIdx].id] === opt && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                                                </div>
                                                {opt}
                                            </button>
                                        ))}

                                        {sectionQuestions[currentQuestionIdx]?.type === "checkbox" && sectionQuestions[currentQuestionIdx].options?.map((opt, i) => {
                                            const currentAnswers = answers[sectionQuestions[currentQuestionIdx].id] || [];
                                            const isSelected = currentAnswers.includes(opt);
                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        const newVal = isSelected
                                                            ? currentAnswers.filter((v: string) => v !== opt)
                                                            : [...currentAnswers, opt];
                                                        handleAnswerChange(sectionQuestions[currentQuestionIdx].id, newVal);
                                                    }}
                                                    className={`w-full text-left p-6 rounded-3xl border transition-all flex items-center font-body ${isSelected ? "bg-accent/5 border-accent text-accent font-bold" : "bg-white border-slate-100 text-slate-600 hover:border-accent/40"}`}
                                                >
                                                    <div className={`w-5 h-5 rounded border-2 mr-6 flex items-center justify-center ${isSelected ? "border-accent bg-accent" : "border-slate-200"}`}>
                                                        {isSelected && <CheckCircle size={12} className="text-white" />}
                                                    </div>
                                                    {opt}
                                                </button>
                                            );
                                        })}

                                        {sectionQuestions[currentQuestionIdx]?.type === "essay" && (
                                            <textarea
                                                className="w-full h-80 p-8 rounded-[3rem] bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-accent/10 outline-none transition-all font-body text-slate-700 resize-none"
                                                placeholder="Type your response here..."
                                                value={answers[sectionQuestions[currentQuestionIdx].id] || ""}
                                                onChange={(e) => handleAnswerChange(sectionQuestions[currentQuestionIdx].id, e.target.value)}
                                            ></textarea>
                                        )}
                                    </div>
                                </div>

                                {/* Navigation Footer */}
                                <div className="mt-16 pt-10 border-t border-slate-50 flex justify-between items-center">
                                    <button
                                        onClick={handlePrev}
                                        disabled={step === 1 && currentQuestionIdx === 0}
                                        className="flex items-center text-slate-400 font-bold hover:text-accent disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                    >
                                        <ChevronLeft size={20} className="mr-2" /> Previous
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {[...Array(sectionQuestions.length)].map((_, i) => (
                                            <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentQuestionIdx ? "w-8 bg-primary" : "w-1.5 bg-slate-200"}`}></div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleNext}
                                        className="bg-accent text-white px-10 py-4 rounded-full font-bold flex items-center hover:bg-slate-900 transition-all shadow-xl shadow-accent/20"
                                    >
                                        {step === 3 && currentQuestionIdx === sectionQuestions.length - 1 ? "Submit Test" : "Next Step"}
                                        <ChevronRight size={20} className="ml-2" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Success Message */}
                    {step === 4 && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[4rem] p-12 md:p-24 shadow-2xl text-center border border-slate-100"
                        >
                            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-10">
                                <Send size={48} className="text-primary animate-pulse" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-heading font-semibold text-accent mb-8 leading-tight">
                                Submission Successful!
                            </h2>
                            <p className="text-slate-500 text-lg mb-12 font-body max-w-2xl mx-auto leading-relaxed">
                                "Cảm ơn bạn đã hoàn thành bài kiểm tra. Dữ liệu bài làm của bạn đã được gửi tới hệ thống chấm điểm của <span className="text-primary font-bold">PTN</span> <span className="text-accent font-bold">English</span>."
                            </p>
                            <div className="bg-slate-50 p-10 rounded-[3rem] mb-12 text-left border border-slate-100">
                                <h4 className="font-bold text-accent uppercase text-xs tracking-widest mb-6 border-b border-slate-200 pb-4 flex items-center">
                                    <AlertCircle size={16} className="mr-2 text-primary" /> What happens next?
                                </h4>
                                <ul className="space-y-6">
                                    <li className="flex items-start">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-4 shrink-0 mt-0.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                        </div>
                                        <p className="text-sm text-slate-600">Chuyên gia MA.TESOL sẽ chấm điểm bài Writing của bạn trong 24h.</p>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-4 shrink-0 mt-0.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                        </div>
                                        <p className="text-sm text-slate-600">Phân tích chi tiết từng kỹ năng sẽ được gửi qua Email đăng ký.</p>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-4 shrink-0 mt-0.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                        </div>
                                        <p className="text-sm text-slate-600">Tư vấn lộ trình 1-1 miễn phí dựa trên kết quả thực tế.</p>
                                    </li>
                                </ul>
                            </div>
                            <button
                                onClick={() => window.location.href = "/"}
                                className="bg-accent text-white px-12 py-5 rounded-full font-bold shadow-xl hover:bg-slate-900 transition-all"
                            >
                                Quay lại Trang Chủ
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Footer />
        </main>
    );
}
