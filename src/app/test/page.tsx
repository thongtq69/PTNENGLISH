"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
    BookOpen, Headphones, PenTool, Clock,
    AlertCircle, ChevronRight, Play,
    Pause, FileText, Maximize2, Minimize2,
    CheckCircle2, ChevronLeft, RefreshCw
} from "lucide-react";
import Link from "next/link";
import ReadingTestView from "@/components/test/ReadingTestView";
import WritingTestView from "@/components/test/WritingTestView";
import QuestionsRenderer from "@/components/test/QuestionsRenderer";
import { Highlighter, Eraser } from "lucide-react";

interface TestSection {
    title: string;
    passage?: string;
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
    const { t, language } = useLanguage();
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
    const [highlights, setHighlights] = useState<Record<string, string[]>>({}); // skill-sectionIdx -> array of highlighted text
    const [isHighlighterActive, setIsHighlighterActive] = useState(false);
    const [resultTab, setResultTab] = useState<"listening" | "reading" | "writing">("listening");
    const [writingContact, setWritingContact] = useState({ name: "", phone: "", email: "" });
    const [writingContactSubmitted, setWritingContactSubmitted] = useState(false);
    const [submissionId, setSubmissionId] = useState<string | null>(null);
    const [submissionSaving, setSubmissionSaving] = useState(false);
    const [listeningPrepTime, setListeningPrepTime] = useState(60); // 60s preparation
    const [listeningPhase, setListeningPhase] = useState<"prep" | "playing" | "done">("prep");
    const prepTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [audioProgress, setAudioProgress] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);

    useEffect(() => {
        fetch("/api/mock-tests")
            .then(res => res.json())
            .then(data => {
                const readyTests = (data as Test[]).filter((test) =>
                    (test.listening?.sections || []).length > 0
                    && (test.reading?.sections || []).length > 0
                    && !!(test.writing?.content || test.writing?.pdf)
                );
                setAcademicTests(readyTests);
                setLoading(false);
            });
    }, []);

    // UI States
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(3600); // 60 minutes default

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const scrollRefs = useRef<Record<number, HTMLElement | null>>({});

    // Selection/Highlight Logic (skip for reading - ReadingTestView handles its own)
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (!isHighlighterActive || currentSkill === 'reading') return;
            const selection = window.getSelection();
            const selectedText = selection?.toString().trim();

            if (selectedText && selectedText.length > 2) {
                const key = `${currentSkill}-${activeSectionIdx}`;
                setHighlights(prev => ({
                    ...prev,
                    [key]: Array.from(new Set([...(prev[key] || []), selectedText]))
                }));
                // We keep the selection so the user sees what they highlighted
                // selection?.removeAllRanges(); 
            }
        };

        document.addEventListener('mouseup', handleGlobalMouseUp);
        return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
    }, [isHighlighterActive, currentSkill, activeSectionIdx]);

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

    const handleAnswerChange = useCallback((skill: string, qIdx: number, val: string) => {
        setAnswers(prev => ({
            ...prev,
            [skill]: {
                ...prev[skill as keyof typeof answers],
                [qIdx]: val
            }
        }));
    }, []);

    const handleReadingAnswerChange = useCallback((qIdx: number, val: string) => {
        handleAnswerChange('reading', qIdx, val);
    }, [handleAnswerChange]);

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

    // Start listening audio playback
    const startListeningAudio = useCallback(() => {
        setListeningPhase("playing");
        if (prepTimerRef.current) clearInterval(prepTimerRef.current);
        const section = selectedTest?.listening?.sections?.[activeSectionIdx];
        if (section?.audioUrl && audioRef.current) {
            audioRef.current.src = section.audioUrl;
            audioRef.current.play();
            setCurrentAudioUrl(section.audioUrl);
            setIsPlaying(true);
        }
    }, [selectedTest, activeSectionIdx]);

    // Start listening preparation countdown (60s → auto play)
    const startListeningPrep = useCallback(() => {
        setListeningPhase("prep");
        setListeningPrepTime(60);
        if (prepTimerRef.current) clearInterval(prepTimerRef.current);
        prepTimerRef.current = setInterval(() => {
            setListeningPrepTime(prev => {
                if (prev <= 1) {
                    clearInterval(prepTimerRef.current!);
                    startListeningAudio();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [startListeningAudio]);

    const skipPrep = useCallback(() => {
        if (prepTimerRef.current) clearInterval(prepTimerRef.current);
        startListeningAudio();
    }, [startListeningAudio]);

    // When switching listening sections, start prep
    useEffect(() => {
        if (step === 2 && currentSkill === 'listening' && selectedTest) {
            startListeningPrep();
        }
        return () => { if (prepTimerRef.current) clearInterval(prepTimerRef.current); };
    }, [activeSectionIdx, currentSkill, step]);

    // Audio progress tracking handled via React event props on <audio> below

    const handleSubmit = async () => {
        if (confirm(t.test.testing.confirmSubmit)) {
            setSubmissionSaving(true);
            try {
                const timeSpentSeconds = Math.max(0, 3600 - currentTime);
                const response = await fetch("/api/mock-test-submissions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        testId: selectedTest?._id,
                        testName: selectedTest?.name,
                        contact: writingContact,
                        answers,
                        results: {
                            listening: {
                                band: getListeningBandScore(listeningResults.score),
                                score: listeningResults.score,
                                total: listeningResults.total,
                                pct: Math.round((listeningResults.score / listeningResults.total) * 100),
                                hasAnswerKey: hasCompleteAnswerKey(listeningResults, listeningResults.total),
                                details: listeningResults.details
                            },
                            reading: {
                                band: getBandScore(readingResults.score),
                                score: readingResults.score,
                                total: readingResults.total,
                                pct: Math.round((readingResults.score / readingResults.total) * 100),
                                hasAnswerKey: hasCompleteAnswerKey(readingResults, readingResults.total),
                                details: readingResults.details
                            },
                            writing: {
                                status: "pending",
                                score: "",
                                feedback: ""
                            }
                        },
                        status: "completed",
                        submittedAt: new Date().toISOString(),
                        timeSpentSeconds
                    })
                });

                const data = await response.json().catch(() => null);
                if (response.ok && data?.data?._id) {
                    setSubmissionId(data.data._id);
                } else {
                    alert(data?.error || "Không lưu được bài làm vào admin. Kết quả vẫn hiển thị cho học viên.");
                }
            } catch (error) {
                alert("Không lưu được bài làm vào admin. Vui lòng kiểm tra kết nối/server.");
            } finally {
                setSubmissionSaving(false);
            }
            setStep(3);
        }
    };

    /* ── Compute reading score for results page ── */
    /* ── Helper: flexible IELTS answer matching ── */
    const isAnswerMatch = (userRaw: string, correctRaw: string): boolean => {
        const normalize = (value: string) => value
            .trim()
            .toUpperCase()
            .replace(/&AMP;/g, "&")
            .replace(/[^A-Z0-9]/g, "");
        const normUser = normalize(userRaw);
        if (!normUser) return false;

        const expandOptionalText = (value: string): string[] => {
            const match = value.match(/\(([^()]*)\)/);
            if (!match || match.index === undefined) return [value];

            const prefix = value.slice(0, match.index);
            const suffix = value.slice(match.index + match[0].length);
            return [
                ...expandOptionalText(`${prefix}${suffix}`),
                ...expandOptionalText(`${prefix}${match[1]}${suffix}`)
            ];
        };

        const answerOptions = correctRaw
            .split("||")
            .flatMap(option => option.includes("/") ? option.split("/") : [option])
            .flatMap(expandOptionalText)
            .map(option => option.trim())
            .filter(Boolean);

        return answerOptions.some((option) => {
            // Handle multi-answer (MCM): "B,D" matches "B,D" or "D,B".
            if (option.includes(",")) {
                const userParts = userRaw.split(",").map(normalize).filter(Boolean).sort();
                const correctParts = option.split(",").map(normalize).filter(Boolean).sort();
                return userParts.length > 0 && userParts.join(",") === correctParts.join(",");
            }

            // SC values may include an explanation after the option letter.
            const optionAnswer = option.split(" - ")[0];
            return normUser === normalize(optionAnswer);
        });
    };

    const hasCompleteAnswerKey = (
        results: { details: Array<{ correctAnswer: string }> },
        total: number
    ) => {
        return results.details.length === total
            && results.details.every(({ correctAnswer }) => correctAnswer.trim().length > 0);
    };

    /* ── Compute reading score for results page ── */
    const readingResults = (() => {
        if (!selectedTest) return { score: 0, total: 40, details: [] as Array<{ q: number; userAnswer: string; correctAnswer: string; isCorrect: boolean }> };
        const details: Array<{ q: number; userAnswer: string; correctAnswer: string; isCorrect: boolean }> = [];
        const sections = selectedTest.reading?.sections || [];
        sections.forEach((sec: TestSection, sIdx: number) => {
            const sectionAnswers = sec.answers || {};
            const qStart = sIdx === 0 ? 1 : sIdx === 1 ? 14 : 27;
            const qEnd = sIdx === 0 ? 13 : sIdx === 1 ? 26 : 40;
            for (let q = qStart; q <= qEnd; q++) {
                const userRaw = (answers.reading[q] || "").trim();
                const correctRaw = (sectionAnswers[String(q)] || "").trim();
                const isCorrect = isAnswerMatch(userRaw, correctRaw);
                details.push({ q, userAnswer: userRaw || "—", correctAnswer: correctRaw, isCorrect });
            }
        });
        const score = details.filter(d => d.isCorrect).length;
        return { score, total: 40, details };
    })();

    /* ── Compute listening score for results page ── */
    const listeningResults = (() => {
        if (!selectedTest) return { score: 0, total: 40, details: [] as Array<{ q: number; userAnswer: string; correctAnswer: string; isCorrect: boolean }> };
        const details: Array<{ q: number; userAnswer: string; correctAnswer: string; isCorrect: boolean }> = [];
        const sections = selectedTest.listening?.sections || [];
        sections.forEach((sec: TestSection, sIdx: number) => {
            const sectionAnswers = sec.answers || {};
            const qStart = sIdx * 10 + 1;
            const qEnd = (sIdx + 1) * 10;
            for (let q = qStart; q <= qEnd; q++) {
                const userRaw = (answers.listening[q] || "").trim();
                const correctRaw = (sectionAnswers[String(q)] || "").trim();
                const isCorrect = isAnswerMatch(userRaw, correctRaw);
                details.push({ q, userAnswer: userRaw || "—", correctAnswer: correctRaw, isCorrect });
            }
        });
        const score = details.filter(d => d.isCorrect).length;
        return { score, total: 40, details };
    })();

    /* ── IELTS band score estimation ── */
    const getListeningBandScore = (raw: number): string => {
        if (raw >= 39) return "9.0";
        if (raw >= 37) return "8.5";
        if (raw >= 35) return "8.0";
        if (raw >= 32) return "7.5";
        if (raw >= 30) return "7.0";
        if (raw >= 26) return "6.5";
        if (raw >= 23) return "6.0";
        if (raw >= 18) return "5.5";
        if (raw >= 16) return "5.0";
        if (raw >= 13) return "4.5";
        if (raw >= 10) return "4.0";
        if (raw >= 8) return "3.5";
        if (raw >= 6) return "3.0";
        if (raw >= 4) return "2.5";
        return "2.0";
    };

    const getBandScore = (raw: number): string => {
        if (raw >= 39) return "9.0";
        if (raw >= 37) return "8.5";
        if (raw >= 35) return "8.0";
        if (raw >= 33) return "7.5";
        if (raw >= 30) return "7.0";
        if (raw >= 27) return "6.5";
        if (raw >= 23) return "6.0";
        if (raw >= 19) return "5.5";
        if (raw >= 15) return "5.0";
        if (raw >= 13) return "4.5";
        if (raw >= 10) return "4.0";
        if (raw >= 8) return "3.5";
        if (raw >= 6) return "3.0";
        if (raw >= 4) return "2.5";
        return "2.0";
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

    const getHighlightedContent = (content: string, skill: "listening" | "reading" | "writing") => {
        if (!content) return content;

        // Apply highlights from state
        let highlightedContent = content;
        const highlightKey = `${skill}-${activeSectionIdx}`;
        if (highlights[highlightKey]) {
            highlights[highlightKey].forEach(text => {
                const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`(${escapedText})`, 'gi');
                highlightedContent = highlightedContent.replace(regex, '<mark class="highlight-yellow">$1</mark>');
            });
        }
        return highlightedContent;
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

        // For listening, skip section tabs (tracker bar handles navigation)
        if (currentSkill === 'listening') {
            return (
                <div className="space-y-4">
                    <div
                        key={`listening-${activeSectionIdx}`}
                        className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 min-h-[50vh]"
                    >
                        {activeSection ? (
                            <>
                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                                    <h4 className="text-base sm:text-lg md:text-xl font-heading font-black text-accent">{activeSection.title}</h4>
                                </div>
                                <QuestionsRenderer
                                    content={getHighlightedContent(activeSection.content, currentSkill)}
                                    answers={answers[currentSkill] as Record<number, string>}
                                    onAnswerChange={(qIdx: number, val: string) => handleAnswerChange(currentSkill, qIdx, val)}
                                    scrollRefs={scrollRefs}
                                    isHighlighterActive={isHighlighterActive}
                                />
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-slate-300 gap-3">
                                <AlertCircle size={40} className="opacity-10" />
                                <p className="text-xs font-bold uppercase tracking-widest">Section content missing</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // Reading/other: show section tabs
        return (
            <div className="space-y-6">
                {/* Section Navigation Header */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 sticky top-0 bg-slate-50 z-20 pt-2">
                    {sections.map((sec, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveSectionIdx(idx)}
                            className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap shadow-sm border ${activeSectionIdx === idx ? 'bg-primary border-primary text-white' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                        >
                            Passage 0{idx + 1}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${currentSkill}-${activeSectionIdx}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="bg-white p-4 sm:p-6 md:p-10 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 min-h-[50vh]"
                    >
                        {activeSection ? (
                            <>
                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                                    <h4 className="text-base sm:text-lg md:text-xl font-heading font-black text-accent">{activeSection.title}</h4>
                                </div>
                                <QuestionsRenderer
                                    content={getHighlightedContent(activeSection.content, currentSkill)}
                                    answers={answers[currentSkill] as Record<number, string>}
                                    onAnswerChange={handleReadingAnswerChange}
                                    scrollRefs={scrollRefs}
                                    isHighlighterActive={isHighlighterActive}
                                />
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-slate-300 gap-3">
                                <AlertCircle size={40} className="opacity-10" />
                                <p className="text-xs font-bold uppercase tracking-widest">Section content missing</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    };

    if (step === 3) {
        const readingBand = getBandScore(readingResults.score);
        const readingPct = Math.round((readingResults.score / readingResults.total) * 100);
        const listeningBand = getListeningBandScore(listeningResults.score);
        const listeningPct = Math.round((listeningResults.score / listeningResults.total) * 100);

        // Check if listening/reading have answer keys
        const hasListeningAnswers = hasCompleteAnswerKey(listeningResults, listeningResults.total);
        const hasReadingAnswers = hasCompleteAnswerKey(readingResults, readingResults.total);

        const renderScoreCard = (
            skillName: string,
            band: string,
            score: number,
            total: number,
            pct: number,
            icon: React.ReactNode,
            hasAnswers: boolean,
            results: typeof readingResults,
            sections: TestSection[],
            getSectionRange: (sIdx: number) => [number, number],
            sectionLabel: (idx: number) => string
        ) => (
            <>
                {/* Score Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl sm:rounded-[3rem] p-8 sm:p-12 shadow-2xl border border-slate-100 text-center mb-8 sm:mb-12"
                >
                    {!hasAnswers ? (
                        <div className="flex flex-col items-center gap-4 py-6">
                            <AlertCircle size={48} className="text-amber-400" />
                            <p className="text-lg font-heading font-black text-accent">{t.testPage.noAnswerKeyTitle} {skillName}</p>
                            <p className="text-sm text-slate-400">{t.testPage.noAnswerKeyDesc}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-16">
                            <div className="flex flex-col items-center">
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">{skillName} Band</span>
                                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-primary to-red-700 flex items-center justify-center shadow-2xl shadow-primary/30">
                                    <span className="text-4xl sm:text-5xl font-heading font-black text-white">{band}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Raw Score</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl sm:text-6xl font-heading font-black text-accent">{score}</span>
                                    <span className="text-2xl font-bold text-slate-300">/{total}</span>
                                </div>
                                <span className="text-sm font-bold text-slate-400 mt-1">{pct}% correct</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Breakdown</span>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                        <span className="text-xs font-bold text-slate-500">{score} correct</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-400" />
                                        <span className="text-xs font-bold text-slate-500">{total - score} incorrect</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Detailed Results */}
                {hasAnswers && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-3xl sm:rounded-[3rem] p-6 sm:p-10 shadow-xl border border-slate-100 mb-8 sm:mb-12"
                    >
                        <h3 className="text-xl sm:text-2xl font-heading font-black text-accent mb-6 sm:mb-8 flex items-center gap-3">
                            {icon}
                            {skillName} — Detailed Results
                        </h3>

                        {sections.map((sec: TestSection, sIdx: number) => {
                            const [qStart, qEnd] = getSectionRange(sIdx);
                            const sectionDetails = results.details.filter(d => d.q >= qStart && d.q <= qEnd);
                            const sectionCorrect = sectionDetails.filter(d => d.isCorrect).length;
                            const sectionTotal = sectionDetails.length;

                            return (
                                <div key={sIdx} className="mb-6 sm:mb-8 last:mb-0">
                                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                                        <h4 className="text-sm sm:text-base font-heading font-black text-accent">{sec.title || sectionLabel(sIdx)}</h4>
                                        <span className={`text-xs sm:text-sm font-black px-3 py-1.5 rounded-full ${sectionCorrect === sectionTotal ? "bg-emerald-100 text-emerald-700" : sectionCorrect >= sectionTotal * 0.7 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                                            {sectionCorrect}/{sectionTotal}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {sectionDetails.map(({ q, userAnswer, correctAnswer, isCorrect }) => (
                                            <div key={q} className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border transition-all ${isCorrect ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
                                                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-black shrink-0 ${isCorrect ? "bg-emerald-500 text-white" : "bg-red-400 text-white"}`}>
                                                    {q}
                                                </div>
                                                <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
                                                    <span className={`text-xs sm:text-sm font-bold truncate ${isCorrect ? "text-emerald-700" : "text-red-600 line-through"}`}>
                                                        {userAnswer}
                                                    </span>
                                                    {!isCorrect && (
                                                        <>
                                                            <span className="text-slate-300 text-xs">→</span>
                                                            <span className="text-xs sm:text-sm font-bold text-emerald-600 truncate">{correctAnswer}</span>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="shrink-0">
                                                    {isCorrect ? <CheckCircle2 size={16} className="text-emerald-500" /> : <AlertCircle size={16} className="text-red-400" />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                )}
            </>
        );

        return (
            <main className="min-h-screen bg-slate-50">
                <Header />
                <div className="pt-28 sm:pt-32 pb-20 container mx-auto px-4 sm:px-6 max-w-5xl">
                    {/* Tab Selector */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center mb-8 sm:mb-10"
                    >
                        <div className="bg-white p-1.5 rounded-2xl flex gap-1 border border-slate-200 shadow-lg">
                            {(["listening", "reading", "writing"] as const).map(tab => {
                                const isActive = resultTab === tab;
                                const Icon = tab === "listening" ? Headphones : tab === "reading" ? BookOpen : PenTool;
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setResultTab(tab)}
                                        className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${isActive ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
                                    >
                                        <Icon size={14} />
                                        {tab}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Listening Tab */}
                    {resultTab === "listening" && renderScoreCard(
                        "Listening",
                        listeningBand,
                        listeningResults.score,
                        listeningResults.total,
                        listeningPct,
                        <Headphones size={24} className="text-primary" />,
                        hasListeningAnswers,
                        listeningResults,
                        selectedTest?.listening?.sections || [],
                        (sIdx) => [sIdx * 10 + 1, (sIdx + 1) * 10],
                        (idx) => `Section ${idx + 1}`
                    )}

                    {/* Reading Tab */}
                    {resultTab === "reading" && renderScoreCard(
                        "Reading",
                        readingBand,
                        readingResults.score,
                        readingResults.total,
                        readingPct,
                        <BookOpen size={24} className="text-primary" />,
                        hasReadingAnswers,
                        readingResults,
                        selectedTest?.reading?.sections || [],
                        (sIdx) => [sIdx === 0 ? 1 : sIdx === 1 ? 14 : 27, sIdx === 0 ? 13 : sIdx === 1 ? 26 : 40],
                        (idx) => `Passage ${idx + 1}`
                    )}

                    {/* Writing Tab — No auto-grading, collect contact info */}
                    {resultTab === "writing" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl sm:rounded-[3rem] p-8 sm:p-12 shadow-2xl border border-slate-100 mb-8 sm:mb-12"
                        >
                            <div className="text-center mb-8">
                                <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
                                    <PenTool size={36} className="text-amber-600" />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-heading font-black text-accent mb-3">
                                    {t.testPage.writingPendingTitle}
                                </h3>
                                <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                                    {t.testPage.writingPendingDesc} <span className="font-bold text-primary">{t.testPage.within24h}</span>.
                                </p>
                            </div>

                            {writingContactSubmitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center"
                                >
                                    <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
                                    <h4 className="text-xl font-heading font-black text-emerald-700 mb-2">{t.testPage.sentSuccessTitle}</h4>
                                    <p className="text-emerald-600 text-sm">{t.testPage.sentSuccessDesc}</p>
                                </motion.div>
                            ) : (
                                <div className="max-w-md mx-auto space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 block">{t.testPage.fullName} *</label>
                                        <input
                                            type="text"
                                            value={writingContact.name}
                                            onChange={(e) => setWritingContact(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder={t.testPage.namePlaceholder}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 block">{t.testPage.phone} *</label>
                                        <input
                                            type="tel"
                                            value={writingContact.phone}
                                            onChange={(e) => setWritingContact(prev => ({ ...prev, phone: e.target.value }))}
                                            placeholder="0912 345 678"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 block">Email *</label>
                                        <input
                                            type="email"
                                            value={writingContact.email}
                                            onChange={(e) => setWritingContact(prev => ({ ...prev, email: e.target.value }))}
                                            placeholder="email@example.com"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm"
                                        />
                                    </div>
                                    <button
                                        onClick={async () => {
                                            if (!writingContact.name.trim() || !writingContact.phone.trim() || !writingContact.email.trim()) {
                                                alert(t.testPage.requireFields);
                                                return;
                                            }
                                            if (submissionId) {
                                                try {
                                                    const response = await fetch("/api/mock-test-submissions", {
                                                        method: "PATCH",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({
                                                            id: submissionId,
                                                            contact: writingContact,
                                                            results: {
                                                                listening: {
                                                                    band: listeningBand,
                                                                    score: listeningResults.score,
                                                                    total: listeningResults.total,
                                                                    pct: listeningPct,
                                                                    hasAnswerKey: hasListeningAnswers,
                                                                    details: listeningResults.details
                                                                },
                                                                reading: {
                                                                    band: readingBand,
                                                                    score: readingResults.score,
                                                                    total: readingResults.total,
                                                                    pct: readingPct,
                                                                    hasAnswerKey: hasReadingAnswers,
                                                                    details: readingResults.details
                                                                },
                                                                writing: {
                                                                    status: "pending",
                                                                    score: "",
                                                                    feedback: ""
                                                                }
                                                            }
                                                        })
                                                    });

                                                    if (!response.ok) {
                                                        const data = await response.json().catch(() => null);
                                                        alert(data?.error || "Không cập nhật được thông tin liên hệ.");
                                                        return;
                                                    }
                                                } catch {
                                                    alert("Không cập nhật được thông tin liên hệ.");
                                                    return;
                                                }
                                            }
                                            setWritingContactSubmitted(true);
                                        }}
                                        className="w-full py-4 bg-primary text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-primary/20 mt-2"
                                    >
                                        {t.testPage.sendRequest}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <button
                            onClick={() => {
                                setStep(2);
                                setCurrentSkill(resultTab);
                            }}
                            className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-black text-sm hover:border-primary hover:text-primary transition-all shadow-lg"
                        >
                            ← Review Answers
                        </button>
                        <button
                            onClick={() => window.location.href = "/"}
                            className="px-8 py-4 bg-accent text-white rounded-2xl font-black text-sm shadow-xl hover:bg-slate-900 transition-all"
                        >
                            {t.test.success.backHome}
                        </button>
                    </motion.div>
                </div>
                <Footer />
            </main>
        );
    }

    if (step === 0) {
        if (loading) return <div className="min-h-screen bg-accent flex flex-col items-center justify-center text-slate-500 gap-4">
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
                        <p className="text-slate-500 text-lg font-body">{t.test.selection.subtitle}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
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
                        {t.test.intro.welcome}
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
            {/* Pro Navbar — compact */}
            <div className="bg-slate-900 h-11 sm:h-12 shrink-0 px-2 sm:px-4 md:px-6 flex items-center justify-between text-white border-b border-white/5 relative z-[100]">
                {/* Left: Logo + test info */}
                <div className="flex items-center gap-2 sm:gap-3 md:gap-6 shrink-0">
                    <button className="cursor-pointer" onClick={() => window.location.href = "/"}>
                        <span className="text-sm sm:text-base font-heading font-extrabold tracking-tighter whitespace-nowrap">
                            <span className="text-primary uppercase">PTN</span>
                            <span className="uppercase text-white hidden md:inline"> Simulator</span>
                        </span>
                    </button>
                    <div className="h-6 w-px bg-white/10 hidden xl:block"></div>
                    <div className="hidden xl:block">
                        <span className="text-[9px] font-bold text-white/50 truncate max-w-[200px]">{selectedTest?.name}</span>
                    </div>
                </div>

                {/* Center: Skill Selector */}
                <div className="flex items-center justify-center flex-1 min-w-0 px-2">
                    <div className="bg-white/5 p-0.5 sm:p-1 rounded-lg sm:rounded-xl flex gap-0.5 border border-white/10">
                        {(["listening", "reading", "writing"] as const).map(skill => (
                            <button
                                key={skill}
                                onClick={() => {
                                    setCurrentSkill(skill);
                                    setIsPlaying(false);
                                    setActiveSectionIdx(0);
                                }}
                                className={`px-2.5 sm:px-4 md:px-6 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-[7px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-wider transition-all ${currentSkill === skill ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Timer + Submit */}
                <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 shrink-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-white/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/10">
                        <Clock size={12} className="text-primary hidden sm:block" />
                        <span className="font-mono text-sm sm:text-base md:text-lg font-black tabular-nums">{formatTime(currentTime)}</span>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={submissionSaving}
                        className="bg-primary hover:bg-red-700 text-white px-2.5 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-black text-[7px] sm:text-[9px] md:text-[10px] uppercase tracking-wider transition-all shadow-lg shadow-primary/20 whitespace-nowrap disabled:opacity-50"
                    >
                        {submissionSaving ? "Saving..." : t.test.testing.submit}
                    </button>
                </div>
            </div>

            {/* Control Bar — audio (listening only) + section pills + question numbers */}
            {(currentSkill === 'listening' || currentSkill === 'reading') && selectedTest && (() => {
                const skillData = selectedTest[currentSkill];
                const sections = skillData?.sections || [];
                const section = currentSkill === 'listening' ? selectedTest.listening?.sections?.[activeSectionIdx] : null;
                const hasAudio = currentSkill === 'listening' && !!section?.audioUrl;
                const pct = audioDuration > 0 ? (audioProgress / audioDuration) * 100 : 0;
                const sectionLabel = currentSkill === 'reading' ? 'Passage' : 'Section';
                // Reading: passages use fixed ranges 1-13, 14-26, 27-40
                const getQRange = (idx: number): [number, number] => {
                    if (currentSkill === 'reading') {
                        if (idx === 0) return [1, 13];
                        if (idx === 1) return [14, 26];
                        return [27, 40];
                    }
                    return [idx * 10 + 1, (idx + 1) * 10];
                };
                const [qStart, qEnd] = getQRange(activeSectionIdx);
                return (
                    <div className="bg-white border-b border-slate-200 shrink-0 relative">
                        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 px-2 sm:px-3 md:px-4 py-1.5 overflow-x-auto no-scrollbar">
                            {/* Play button */}
                            {hasAudio && (
                                <button
                                    onClick={() => toggleAudio(section.audioUrl)}
                                    disabled={listeningPhase === 'prep'}
                                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${listeningPhase === 'prep'
                                        ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                        : isPlaying
                                            ? 'bg-primary text-white shadow-md shadow-primary/30'
                                            : 'bg-slate-900 text-white hover:bg-slate-700'
                                        }`}
                                    aria-label={isPlaying ? 'Pause' : 'Play'}
                                >
                                    {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                                </button>
                            )}

                            {/* Time display — always visible */}
                            {hasAudio && (
                                <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-700 tabular-nums shrink-0 px-1">
                                    {formatTime(Math.floor(audioProgress))} / {formatTime(Math.floor(audioDuration))}
                                </span>
                            )}

                            {hasAudio && <div className="h-6 w-px bg-slate-200 shrink-0" />}

                            {/* All section pills — click to switch */}
                            <div className="flex items-center gap-1 shrink-0">
                                {sections.map((_, idx) => {
                                    const isActive = idx === activeSectionIdx;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveSectionIdx(idx)}
                                            className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider shrink-0 transition-all ${isActive
                                                ? "bg-primary text-white shadow-sm"
                                                : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                                                }`}
                                        >
                                            {sectionLabel} {idx + 1}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="h-6 w-px bg-slate-200 shrink-0" />

                            {/* Prev */}
                            <button
                                onClick={() => activeSectionIdx > 0 && setActiveSectionIdx(activeSectionIdx - 1)}
                                disabled={activeSectionIdx === 0}
                                className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-all ${activeSectionIdx === 0 ? "text-slate-200 cursor-not-allowed" : "text-slate-500 hover:bg-slate-100 hover:text-primary"}`}
                            >
                                <ChevronLeft size={15} />
                            </button>

                            {/* Question numbers for active section */}
                            <div className="flex items-center gap-1">
                                {Array.from({ length: qEnd - qStart + 1 }, (__, i) => qStart + i).map(q => {
                                    const isAnswered = !!answers[currentSkill][q];
                                    return (
                                        <button
                                            key={q}
                                            onClick={() => scrollToQuestion(q)}
                                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-[11px] sm:text-xs font-bold transition-all ${isAnswered ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800"}`}
                                        >
                                            {q}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Next */}
                            <button
                                onClick={() => activeSectionIdx < sections.length - 1 && setActiveSectionIdx(activeSectionIdx + 1)}
                                disabled={activeSectionIdx === sections.length - 1}
                                className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-all ${activeSectionIdx === sections.length - 1 ? "text-slate-200 cursor-not-allowed" : "text-slate-500 hover:bg-slate-100 hover:text-primary"}`}
                            >
                                <ChevronRight size={15} />
                            </button>
                        </div>

                        {/* Progress bar — more prominent */}
                        {hasAudio && (
                            <div className="h-1 bg-slate-100">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-red-500 transition-all duration-300"
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        )}
                    </div>
                );
            })()}

            {/* Main Content */}
            {currentSkill === 'reading' && selectedTest ? (
                <ReadingTestView
                    sections={selectedTest.reading.sections || []}
                    activeSectionIdx={activeSectionIdx}
                    onSectionChange={setActiveSectionIdx}
                    answers={answers.reading}
                    onAnswerChange={handleReadingAnswerChange}
                />
            ) : currentSkill === 'listening' && selectedTest ? (
                /* ── LISTENING: Full-width single page with audio player ── */
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    {/* Listening Content — wider layout */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="w-full mx-auto px-3 sm:px-6 md:px-10 lg:px-16 py-4 sm:py-6 pb-24">
                            {renderAnswerSheet()}
                        </div>
                    </div>

                    {/* Preparation Overlay — semi-transparent so questions visible behind */}
                    <AnimatePresence>
                        {listeningPhase === 'prep' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent"
                            >
                                <div className="px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                            <Headphones size={20} className="text-primary" />
                                        </div>
                                        <div className="text-white">
                                            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/60">
                                                {t.testPage.preparation} {activeSectionIdx + 1}
                                            </p>
                                            <p className="text-xs sm:text-sm text-white/80">{t.testPage.previewHint}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="text-3xl sm:text-4xl font-heading font-black text-primary tabular-nums min-w-[70px] text-center">
                                            0:{listeningPrepTime < 10 ? '0' : ''}{listeningPrepTime}
                                        </div>
                                        <button
                                            onClick={skipPrep}
                                            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-red-700 transition-all shadow-lg shadow-primary/30 flex items-center gap-2"
                                        >
                                            <Play size={14} />
                                            {t.testPage.startNow}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ) : (
                /* ── WRITING: Split HTML prompt / Response view ── */
                <WritingTestView
                    content={selectedTest?.writing?.content || ""}
                    backdropUrl={selectedTest?.writing?.pdf}
                    answers={answers.writing}
                    onAnswerChange={(taskIdx, val) => handleAnswerChange("writing", taskIdx, val)}
                />
            )}

            <audio
                ref={audioRef}
                onTimeUpdate={(e) => setAudioProgress(e.currentTarget.currentTime)}
                onDurationChange={(e) => setAudioDuration(Number.isFinite(e.currentTarget.duration) ? e.currentTarget.duration : 0)}
                onLoadedMetadata={(e) => setAudioDuration(Number.isFinite(e.currentTarget.duration) ? e.currentTarget.duration : 0)}
                onEnded={() => { setIsPlaying(false); setListeningPhase("done"); }}
                className="hidden"
            />

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                
                /* Enable text selection */
                .prose, .prose * { user-select: text !important; -webkit-user-select: text !important; }
                
                /* Custom highlight/selection color */
                .prose ::selection { background-color: rgba(255, 59, 59, 0.25); color: inherit; }
                .prose ::-moz-selection { background-color: rgba(255, 59, 59, 0.25); color: inherit; }

                /* Persistent Highlight Styles */
                mark.highlight-yellow {
                    background-color: #fef08a; /* yellow-200 */
                    color: #000;
                    padding: 0 2px;
                    border-radius: 4px;
                    font-weight: 600;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                
                /* Test Content — stronger readability */
                .prose { color: #0f172a; font-size: 1rem; }
                .prose p, .prose li { color: #0f172a; font-weight: 500; line-height: 1.7; }
                .prose strong { color: #0f172a; font-weight: 800; }

                /* Headings */
                .prose h3 { font-family: var(--font-heading); font-weight: 900; color: #0f172a; margin-top: 2rem; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: -0.02em; }
                .prose h4 { color: #0f172a; font-weight: 800; margin-top: 1.25rem; margin-bottom: 0.75rem; }
                .prose p { margin-top: 0.5rem; margin-bottom: 0.85rem; }

                /* Lists — restore bullet markers + tighter spacing */
                .prose ul { list-style-type: disc; padding-left: 1.5rem; margin: 0.5rem 0 1rem; }
                .prose ol { list-style-type: decimal; padding-left: 1.5rem; margin: 0.5rem 0 1rem; }
                .prose ul > li, .prose ol > li { display: list-item; margin: 0.25rem 0; padding-left: 0.25rem; }
                .prose ul > li::marker { color: #C7002B; }
                .prose ol > li::marker { color: #C7002B; font-weight: 800; }

                /* Matching/flow-chart layout — options table floats as left sidebar */
                .prose table.options-box {
                    float: left !important;
                    width: 48% !important;
                    min-width: 260px;
                    margin: 0 2% 1.25rem 0 !important;
                    border: 1.5px solid #cbd5e1 !important;
                    border-radius: 12px !important;
                    overflow: hidden;
                    background: #f8fafc !important;
                    table-layout: auto;
                    border-collapse: separate !important;
                    border-spacing: 0 !important;
                }
                .prose table.options-box tr { background: transparent !important; }
                .prose table.options-box td,
                .prose table.options-box th {
                    padding: 0.7rem 1rem !important;
                    border: none !important;
                    border-bottom: 1px solid #e2e8f0 !important;
                    text-align: left !important;
                    line-height: 1.7 !important;
                    background: transparent !important;
                    color: #0f172a !important;
                    font-weight: 500 !important;
                    vertical-align: top !important;
                    letter-spacing: 0 !important;
                    text-transform: none !important;
                    font-size: inherit !important;
                }
                .prose table.options-box tr:last-child td,
                .prose table.options-box tr:last-child th {
                    border-bottom: none !important;
                }
                .prose table.options-box th {
                    font-weight: 800 !important;
                    color: #C7002B !important;
                    width: 2.25rem;
                    text-align: center !important;
                    padding-right: 0.5rem !important;
                }
                /* Full-span header row (e.g. <th colspan="2">Comments</th>) —
                   don't style as a narrow letter column. */
                .prose table.options-box th[colspan] {
                    width: auto !important;
                    color: #1e293b !important;
                    background: #f1f5f9 !important;
                    font-size: 0.7rem !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.1em !important;
                    text-align: center !important;
                    padding: 0.6rem 1rem !important;
                }
                /* Two-column layout: first cell is the letter, second is the
                   description (e.g. Q25-30 where <td>A</td><td>It illustrates…</td>). */
                .prose table.options-box tr > td:first-child:not(:last-child) {
                    width: 2.25rem !important;
                    text-align: center !important;
                    font-weight: 800 !important;
                    color: #C7002B !important;
                    padding-right: 0.5rem !important;
                    white-space: nowrap;
                }
                .prose table.options-box strong {
                    display: inline-block;
                    min-width: 1.4rem;
                    color: #C7002B;
                    font-weight: 800;
                }
                /* Multi-option cell: option-lines arranged in a 2-column grid
                   to fill the box horizontally instead of a tall narrow list. */
                .prose table.options-box .option-line {
                    padding: 0.35rem 0;
                    line-height: 1.5;
                }
                .prose table.options-box .option-line strong {
                    margin-right: 0.4rem;
                }
                /* When a cell is split into option-lines, the td already provides
                   vertical rhythm via the spans — remove row borders/padding so
                   multiple <tr> cells flow as one continuous list. */
                .prose table.options-box td:has(.option-line) {
                    padding: 0.25rem 1rem !important;
                    border-bottom: none !important;
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    column-gap: 1.5rem;
                    row-gap: 0.15rem;
                }
                .prose table.options-box tr:first-child td:has(.option-line) {
                    padding-top: 0.75rem !important;
                }
                .prose table.options-box tr:last-child td:has(.option-line) {
                    padding-bottom: 0.75rem !important;
                }

                /* Flow-chart wrapping around the floated options box */
                .prose .flow-chart {
                    overflow: hidden;
                    margin-left: 0 !important;
                }
                .prose .flow-chart > p[style*="padding"] {
                    text-align: left !important;
                    padding: 0.9rem 1.1rem !important;
                    line-height: 1.65 !important;
                    margin-bottom: 0.5rem !important;
                    border-color: #94a3b8 !important;
                }
                /* Hide explicit arrow paragraphs (⬇ / ↓) — spacing between
                   flow boxes already conveys the flow visually, matching the
                   cleaner Set 02 layout. */
                .prose .flow-chart > p[style*="font-size: 1.5rem"] {
                    display: none !important;
                }

                /* Some tests put the flow-chart title (<h4 class="text-center">)
                   as a sibling BEFORE the .flow-chart div instead of inside it.
                   Pull them together visually so both layouts look the same. */
                .prose h4.text-center + .flow-chart {
                    margin-top: 0.35rem !important;
                }
                .prose h4.text-center:has(+ .flow-chart) {
                    margin-bottom: 0.35rem !important;
                }

                /* When options-box floats left, the sibling h4 + p questions flow next to it.
                   Tighten top margin so first heading doesn't leave a gap. */
                .prose table.options-box + h4 { margin-top: 0 !important; }

                /* Clear floats so subsequent question groups don't overlap the sidebar */
                .prose hr, .prose h3 { clear: both; }

                /* Narrow screens — stop floating, stack vertically */
                @media (max-width: 900px) {
                    .prose table.options-box {
                        float: none;
                        width: 100%;
                        margin: 0 0 1rem 0;
                    }
                }

                /* Test Content Table Styling */
                .prose table { border-collapse: collapse; width: 100%; margin: 1.5rem 0; border: 1.5px solid #cbd5e1; border-radius: 0.75rem; overflow: hidden; table-layout: auto; }
                .prose th, .prose td { border: 1px solid #e2e8f0; padding: 0.85rem 1rem !important; vertical-align: middle; color: #0f172a; font-weight: 500; line-height: 1.55; }
                .prose th { background-color: #f1f5f9; font-weight: 800; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; color: #1e293b; text-align: center; }
                .prose tr:nth-child(even) { background-color: #fbfcfe; }
                /* Keep inline question inputs glued to their cue word so ")" or "." doesn't orphan on a new line */
                .prose td span[data-q-placeholder] { white-space: nowrap; }
            `}</style>
        </main>
    );
}
