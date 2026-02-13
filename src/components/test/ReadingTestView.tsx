"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Highlighter,
  Eraser,
  StickyNote,
  X,
  BookOpen,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Maximize2,
  Minimize2,
  List,
} from "lucide-react";
import { parseContent } from "@/lib/questionParser";
import {
  FillBlank,
  MultipleChoice,
  MultipleChoiceMulti,
  TrueFalseNG,
  YesNoNG,
  MatchingDropdown,
  SummaryWordList,
} from "./questions";

interface TestSection {
  title: string;
  passage?: string;
  content: string;
  answers: Record<string, string>;
  questionsCount: number;
}

interface Note {
  id: string;
  text: string;
  selectedText: string;
  timestamp: number;
}

interface ReadingTestViewProps {
  sections: TestSection[];
  activeSectionIdx: number;
  onSectionChange: (idx: number) => void;
  answers: Record<number, string>;
  onAnswerChange: (qIdx: number, val: string) => void;
  onQuestionScroll?: (qIdx: number) => void;
}

/* ─────────────────────────────────────────────
   Memoized sub-components to prevent re-renders
   ───────────────────────────────────────────── */

const PartNavBar = memo(function PartNavBar({
  sections,
  activeSectionIdx,
  onSectionChange,
  answers,
  scrollRefs,
}: {
  sections: TestSection[];
  activeSectionIdx: number;
  onSectionChange: (idx: number) => void;
  answers: Record<number, string>;
  scrollRefs: React.RefObject<Record<number, HTMLElement | null>>;
}) {
  const totalAnswered = Object.values(answers).filter((v) => !!v).length;
  const totalQuestions = 40;

  return (
    <div className="bg-white border-t border-slate-200 shrink-0 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex items-stretch">
        {sections.map((_, idx) => {
          const s = idx === 0 ? 1 : idx === 1 ? 14 : 27;
          const e = idx === 0 ? 13 : idx === 1 ? 26 : 40;
          const partAnswered = Array.from({ length: e - s + 1 }, (__, i) => s + i).filter((q) => !!answers[q]).length;
          const partTotal = e - s + 1;
          const isActive = activeSectionIdx === idx;

          return (
            <div key={idx} className={`flex-1 transition-all ${idx > 0 ? "border-l border-slate-200" : ""}`}>
              {isActive ? (
                /* Active part: show question number grid */
                <div className="px-2 md:px-3 py-2 md:py-2.5">
                  <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                    {/* Part label */}
                    <button
                      onClick={() => onSectionChange(idx)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-white text-[10px] font-extrabold uppercase tracking-wide shrink-0 shadow-sm"
                    >
                      Part {idx + 1}
                    </button>

                    {/* Question number buttons */}
                    <div className="flex items-center gap-[3px] md:gap-1 flex-wrap">
                      {Array.from({ length: partTotal }, (__, i) => s + i).map((q) => {
                        const isAnswered = !!answers[q];
                        return (
                          <button
                            key={q}
                            onClick={() => {
                              scrollRefs.current?.[q]?.scrollIntoView({ behavior: "smooth", block: "center" });
                            }}
                            className={`w-6 h-6 md:w-[30px] md:h-[30px] rounded-md flex items-center justify-center text-[9px] md:text-[10px] font-bold transition-all ${
                              isAnswered
                                ? "bg-emerald-500 text-white shadow-sm"
                                : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                            }`}
                          >
                            {q}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* Inactive part: show summary */
                <button
                  onClick={() => onSectionChange(idx)}
                  className="w-full h-full px-3 md:px-5 py-3 md:py-4 flex items-center justify-center gap-2 md:gap-3 hover:bg-slate-50 transition-all group"
                >
                  <span className="text-[10px] md:text-xs font-extrabold text-slate-500 group-hover:text-slate-700 uppercase tracking-wide">
                    Part {idx + 1} :
                  </span>
                  <span className="text-[10px] md:text-xs font-bold text-slate-400 group-hover:text-slate-500">
                    {partAnswered} of {partTotal} questions
                  </span>
                </button>
              )}
            </div>
          );
        })}

        {/* Overall score indicator */}
        <div className="hidden lg:flex items-center gap-2 px-5 border-l border-slate-200 shrink-0">
          <CheckCircle2 size={14} className="text-emerald-500" />
          <span className="text-xs font-extrabold text-emerald-600 tabular-nums">{totalAnswered} / {totalQuestions}</span>
        </div>
      </div>
    </div>
  );
});

const QuickNavGrid = memo(function QuickNavGrid({
  qStart,
  qEnd,
  answers,
  scrollRefs,
}: {
  qStart: number;
  qEnd: number;
  answers: Record<number, string>;
  scrollRefs: React.RefObject<Record<number, HTMLElement | null>>;
}) {
  const totalInPart = qEnd - qStart + 1;
  return (
    <div className="bg-white border-t border-slate-200 px-3 md:px-5 py-2.5 shrink-0">
      <div className="flex flex-wrap gap-1 md:gap-1.5 justify-center">
        {Array.from({ length: totalInPart }, (_, i) => qStart + i).map((q) => (
          <button key={q} onClick={() => { scrollRefs.current?.[q]?.scrollIntoView({ behavior: "smooth", block: "center" }); }} className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-[9px] md:text-[10px] font-bold ${answers[q] ? "bg-emerald-500 text-white shadow-sm shadow-emerald-200" : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600"}`}>{q}</button>
        ))}
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────── */

function ReadingTestViewInner({
  sections,
  activeSectionIdx,
  onSectionChange,
  answers,
  onAnswerChange,
}: ReadingTestViewProps) {
  const [isHighlighterActive, setIsHighlighterActive] = useState(false);
  const [highlights, setHighlights] = useState<Record<string, Array<{ text: string; color: string }>>>({});
  const [highlightColor, setHighlightColor] = useState("yellow");
  const [notes, setNotes] = useState<Record<string, Note[]>>({});
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [pendingNoteText, setPendingNoteText] = useState("");
  const [pendingSelectedText, setPendingSelectedText] = useState("");
  const [showNotesPanel, setShowNotesPanel] = useState(false);

  const [mobileView, setMobileView] = useState<"passage" | "questions">("passage");
  const [isMobile, setIsMobile] = useState(false);
  const [splitRatio, setSplitRatio] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [passageFullscreen, setPassageFullscreen] = useState(false);
  const [questionsFullscreen, setQuestionsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(15);

  const passageRef = useRef<HTMLDivElement>(null);
  const scrollRefs = useRef<Record<number, HTMLElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const highlightKey = `reading-${activeSectionIdx}`;
  const activeSection = sections[activeSectionIdx];

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* Highlight handler */
  const handleTextSelection = useCallback(() => {
    if (!isHighlighterActive) return;
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    if (selectedText && selectedText.length > 2) {
      if (passageRef.current && selection?.anchorNode) {
        if (passageRef.current.contains(selection.anchorNode)) {
          setHighlights((prev) => {
            const existing = prev[highlightKey] || [];
            if (existing.some((h) => h.text === selectedText)) return prev;
            return { ...prev, [highlightKey]: [...existing, { text: selectedText, color: highlightColor }] };
          });
        }
      }
    }
  }, [isHighlighterActive, highlightKey, highlightColor]);

  useEffect(() => {
    document.addEventListener("mouseup", handleTextSelection);
    document.addEventListener("touchend", handleTextSelection);
    return () => {
      document.removeEventListener("mouseup", handleTextSelection);
      document.removeEventListener("touchend", handleTextSelection);
    };
  }, [handleTextSelection]);

  /* Resizable splitter */
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitRatio(Math.max(25, Math.min(75, pct)));
    };
    const handleUp = () => setIsDragging(false);
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };
  }, [isDragging]);

  /* Notes */
  const handleAddNote = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (text && text.length > 2) {
      setPendingSelectedText(text);
      setShowNoteInput(true);
    }
  }, []);

  const saveNote = useCallback(() => {
    if (!pendingNoteText.trim()) return;
    const note: Note = { id: Date.now().toString(), text: pendingNoteText, selectedText: pendingSelectedText, timestamp: Date.now() };
    setNotes((prev) => ({ ...prev, [highlightKey]: [...(prev[highlightKey] || []), note] }));
    setHighlights((prev) => {
      const existing = prev[highlightKey] || [];
      if (existing.some((h) => h.text === pendingSelectedText)) return prev;
      return { ...prev, [highlightKey]: [...existing, { text: pendingSelectedText, color: "blue" }] };
    });
    setShowNoteInput(false);
    setPendingNoteText("");
    setPendingSelectedText("");
  }, [pendingNoteText, pendingSelectedText, highlightKey]);

  const removeNote = useCallback((noteId: string) => {
    setNotes((prev) => ({ ...prev, [highlightKey]: (prev[highlightKey] || []).filter((n) => n.id !== noteId) }));
  }, [highlightKey]);

  const clearHighlights = useCallback(() => {
    setHighlights((prev) => ({ ...prev, [highlightKey]: [] }));
  }, [highlightKey]);

  /* Apply highlights to HTML (memoized) */
  const currentHighlights = highlights[highlightKey] || [];
  const currentNotes = notes[highlightKey] || [];

  const highlightedPassageHtml = useMemo(() => {
    const html = activeSection?.passage || "";
    if (!html || currentHighlights.length === 0) return html;
    let result = html;
    currentHighlights.forEach(({ text, color }) => {
      const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escaped})`, "gi");
      const cls = color === "blue" ? "hl-blue" : color === "green" ? "hl-green" : color === "pink" ? "hl-pink" : "hl-yellow";
      result = result.replace(regex, `<mark class="${cls}">$1</mark>`);
    });
    return result;
  }, [activeSection?.passage, currentHighlights]);

  /* Question ranges (memoized) */
  const { qStart, qEnd, answeredInPart, totalInPart } = useMemo(() => {
    const start = activeSectionIdx === 0 ? 1 : activeSectionIdx === 1 ? 14 : 27;
    const end = activeSectionIdx === 0 ? 13 : activeSectionIdx === 1 ? 26 : 40;
    const answered = Array.from({ length: end - start + 1 }, (_, i) => start + i).filter((q) => !!answers[q]).length;
    return { qStart: start, qEnd: end, answeredInPart: answered, totalInPart: end - start + 1 };
  }, [activeSectionIdx, answers]);

  /* Parse questions (memoized) — supports all 14 IELTS question types */
  const questionsContent = useMemo(() => {
    const content = activeSection?.content;
    if (!content) return <div className="text-slate-400 italic p-8 text-center text-sm">No questions available for this section.</div>;

    const parts = parseContent(content);
    const setRef = (qIdx: number) => (el: HTMLElement | null) => { scrollRefs.current[qIdx] = el; };

    return (
      <div className="prose prose-slate max-w-none dark:prose-invert font-body leading-relaxed text-slate-700">
        {parts.map((part, i) => {
          if (part.kind === "html") {
            return <span key={i} dangerouslySetInnerHTML={{ __html: part.html || "" }} />;
          }
          const q = part.question!;
          const val = answers[q.qIdx] || "";

          switch (q.type) {
            case "mc":
              return (
                <MultipleChoice
                  key={i}
                  qIdx={q.qIdx}
                  options={q.options || ["A", "B", "C", "D"]}
                  value={val}
                  onChange={onAnswerChange}
                  inputRef={setRef(q.qIdx)}
                />
              );
            case "mcm":
              return (
                <MultipleChoiceMulti
                  key={i}
                  qIdx={q.qIdx}
                  options={q.options || ["A", "B", "C", "D", "E"]}
                  maxSelect={q.maxSelect || 2}
                  value={val}
                  onChange={onAnswerChange}
                  inputRef={setRef(q.qIdx)}
                />
              );
            case "tfng":
              return (
                <TrueFalseNG
                  key={i}
                  qIdx={q.qIdx}
                  value={val}
                  onChange={onAnswerChange}
                  inputRef={setRef(q.qIdx)}
                />
              );
            case "ynng":
              return (
                <YesNoNG
                  key={i}
                  qIdx={q.qIdx}
                  value={val}
                  onChange={onAnswerChange}
                  inputRef={setRef(q.qIdx)}
                />
              );
            case "mh":
            case "mi":
            case "mf":
            case "mse":
              return (
                <MatchingDropdown
                  key={i}
                  qIdx={q.qIdx}
                  variant={q.type}
                  options={q.options || []}
                  value={val}
                  onChange={onAnswerChange}
                  inputRef={setRef(q.qIdx)}
                />
              );
            case "sc":
              return (
                <SummaryWordList
                  key={i}
                  qIdx={q.qIdx}
                  options={q.options || []}
                  value={val}
                  onChange={onAnswerChange}
                  inputRef={setRef(q.qIdx)}
                />
              );
            case "fill":
            default:
              return (
                <FillBlank
                  key={i}
                  qIdx={q.qIdx}
                  value={val}
                  onChange={onAnswerChange}
                  inputRef={setRef(q.qIdx)}
                />
              );
          }
        })}
      </div>
    );
  }, [activeSection?.content, answers, onAnswerChange]);

  /* ═══════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════ */
  return (
    <div className="flex flex-col h-full">
      {/* Note modal */}
      <AnimatePresence>
        {showNoteInput && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[300] flex items-center justify-center p-4" onClick={() => setShowNoteInput(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center"><StickyNote size={16} className="text-blue-600" /></div>
                <h3 className="font-heading font-black text-accent text-lg">Add Note</h3>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 mb-4 border border-blue-100">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">Selected Text</p>
                <p className="text-xs text-blue-700 italic leading-relaxed">&ldquo;{pendingSelectedText.slice(0, 120)}{pendingSelectedText.length > 120 ? "..." : ""}&rdquo;</p>
              </div>
              <textarea autoFocus rows={3} value={pendingNoteText} onChange={(e) => setPendingNoteText(e.target.value)} placeholder="Type your note here..." className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 resize-none" onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) saveNote(); }} />
              <p className="text-[9px] text-slate-400 mt-1.5 mb-4">&#8984;+Enter to save</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowNoteInput(false)} className="px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50">Cancel</button>
                <button onClick={saveNote} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-200">Save Note</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Part nav bar */}
      <PartNavBar sections={sections} activeSectionIdx={activeSectionIdx} onSectionChange={onSectionChange} answers={answers} scrollRefs={scrollRefs} />

      {/* Main content */}
      {isMobile ? (
        <>
          <div className="flex-1 overflow-hidden">
            {mobileView === "passage" ? (
              <div className="h-full flex flex-col bg-white">
                {/* Passage toolbar */}
                <div className="min-h-[48px] bg-white border-b border-slate-200 px-3 flex items-center justify-between shrink-0 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <BookOpen size={14} className="text-primary shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500 truncate">{activeSection?.title || "Reading Passage"}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                      <button onClick={() => setIsHighlighterActive(!isHighlighterActive)} className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-[9px] font-black uppercase tracking-wider ${isHighlighterActive ? "bg-yellow-400 text-yellow-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>
                        <Highlighter size={12} /><span className="hidden sm:inline">Highlight</span>
                      </button>
                      <button onClick={handleAddNote} className="flex items-center gap-1 px-2 py-1.5 rounded-md text-[9px] font-black uppercase tracking-wider text-slate-400 hover:text-blue-600">
                        <StickyNote size={12} />
                      </button>
                      {currentHighlights.length > 0 && (
                        <button onClick={clearHighlights} className="p-1.5 text-slate-400 hover:text-red-500"><Eraser size={12} /></button>
                      )}
                    </div>
                  </div>
                </div>
                {/* Passage content */}
                <div ref={passageRef} className={`flex-1 overflow-y-auto custom-scrollbar p-4 ${isHighlighterActive ? "cursor-crosshair" : ""}`}>
                  {highlightedPassageHtml ? (
                    <div className="reading-passage select-text" style={{ fontSize: `${fontSize}px`, lineHeight: "1.9" }} dangerouslySetInnerHTML={{ __html: highlightedPassageHtml }} />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-4 py-20">
                      <BookOpen size={48} className="opacity-20" />
                      <p className="text-sm font-bold text-slate-400">No passage content</p>
                      <p className="text-xs text-slate-400 max-w-sm text-center leading-relaxed">Admin can paste the reading passage in the Mock Test Manager.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col bg-slate-50">
                <div className="min-h-[48px] bg-white border-b border-slate-200 px-3 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">Questions {qStart}&ndash;{qEnd}</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 tabular-nums">{answeredInPart}/{totalInPart}</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                  {activeSection ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                        <h4 className="text-sm font-heading font-black text-accent leading-tight">{activeSection.title}</h4>
                      </div>
                      <div className="p-4">{questionsContent}</div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-300 gap-4">
                      <AlertCircle size={40} className="opacity-15" />
                      <p className="text-xs font-bold uppercase tracking-widest">Section content missing</p>
                    </div>
                  )}
                </div>
                <QuickNavGrid qStart={qStart} qEnd={qEnd} answers={answers} scrollRefs={scrollRefs} />
              </div>
            )}
          </div>
          {/* Mobile tab bar */}
          <div className="h-14 bg-white border-t border-slate-200 flex shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <button onClick={() => setMobileView("passage")} className={`flex-1 flex items-center justify-center gap-2 ${mobileView === "passage" ? "text-primary border-t-2 border-primary bg-primary/5 font-black" : "text-slate-400"}`}>
              <BookOpen size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Passage</span>
            </button>
            <div className="w-px bg-slate-100" />
            <button onClick={() => setMobileView("questions")} className={`flex-1 flex items-center justify-center gap-2 relative ${mobileView === "questions" ? "text-primary border-t-2 border-primary bg-primary/5 font-black" : "text-slate-400"}`}>
              <List size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Questions</span>
              {answeredInPart > 0 && <span className="absolute top-1.5 ml-24 w-5 h-5 rounded-full bg-emerald-500 text-white text-[8px] font-black flex items-center justify-center">{answeredInPart}</span>}
            </button>
          </div>
        </>
      ) : (
        /* Desktop */
        <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
          {/* Passage side */}
          <div className={`flex flex-col h-full overflow-hidden ${passageFullscreen ? "w-full" : questionsFullscreen ? "w-0 overflow-hidden" : ""}`} style={!passageFullscreen && !questionsFullscreen ? { width: `${splitRatio}%` } : undefined}>
            <div className="flex flex-col h-full bg-white">
              {/* Passage toolbar */}
              <div className="min-h-[48px] bg-white border-b border-slate-200 px-3 md:px-4 flex items-center justify-between shrink-0 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <BookOpen size={14} className="text-primary shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500 truncate">{activeSection?.title || "Reading Passage"}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <div className="flex items-center bg-slate-100 rounded-lg border border-slate-200 overflow-hidden mr-1">
                    <button onClick={() => setFontSize((f) => Math.max(12, f - 1))} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:bg-slate-200 text-[10px] font-bold" title="Decrease font size">A-</button>
                    <div className="w-px h-4 bg-slate-200" />
                    <button onClick={() => setFontSize((f) => Math.min(22, f + 1))} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:bg-slate-200 text-xs font-bold" title="Increase font size">A+</button>
                  </div>
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <button onClick={() => setIsHighlighterActive(!isHighlighterActive)} className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-[9px] font-black uppercase tracking-wider ${isHighlighterActive ? "bg-yellow-400 text-yellow-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`} title="Toggle highlighter">
                      <Highlighter size={12} /><span className="hidden sm:inline">Highlight</span>
                    </button>
                    {isHighlighterActive && (
                      <div className="flex items-center gap-0.5 ml-0.5 pl-1 border-l border-slate-200">
                        {[{ color: "yellow", bg: "bg-yellow-300" }, { color: "green", bg: "bg-emerald-300" }, { color: "pink", bg: "bg-pink-300" }, { color: "blue", bg: "bg-blue-300" }].map((c) => (
                          <button key={c.color} onClick={() => setHighlightColor(c.color)} className={`w-5 h-5 rounded-full ${c.bg} ${highlightColor === c.color ? "ring-2 ring-slate-700 ring-offset-1 scale-110" : "opacity-50 hover:opacity-100"}`} />
                        ))}
                      </div>
                    )}
                    <button onClick={handleAddNote} className="flex items-center gap-1 px-2 py-1.5 rounded-md text-[9px] font-black uppercase tracking-wider text-slate-400 hover:text-blue-600" title="Add note">
                      <StickyNote size={12} /><span className="hidden sm:inline">Note</span>
                    </button>
                    {currentHighlights.length > 0 && (
                      <button onClick={clearHighlights} className="p-1.5 text-slate-400 hover:text-red-500" title="Clear all highlights"><Eraser size={12} /></button>
                    )}
                  </div>
                  {currentNotes.length > 0 && (
                    <button onClick={() => setShowNotesPanel(!showNotesPanel)} className={`relative flex items-center gap-1 px-2 py-1.5 rounded-lg text-[9px] font-black uppercase ml-0.5 ${showNotesPanel ? "bg-blue-500 text-white" : "bg-blue-50 text-blue-500 hover:bg-blue-100"}`}>
                      <MessageSquare size={12} />
                      <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[8px] flex items-center justify-center font-black absolute -top-1.5 -right-1.5">{currentNotes.length}</span>
                    </button>
                  )}
                  <button onClick={() => { setPassageFullscreen(!passageFullscreen); setQuestionsFullscreen(false); }} className="p-1.5 text-slate-400 hover:text-slate-600 ml-0.5" title={passageFullscreen ? "Exit fullscreen" : "Fullscreen passage"}>
                    {passageFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  </button>
                </div>
              </div>
              {/* Passage body */}
              <div className="flex-1 overflow-hidden flex">
                <div ref={passageRef} className={`flex-1 overflow-y-auto custom-scrollbar ${isHighlighterActive ? "cursor-crosshair" : ""}`} style={{ padding: "24px 32px" }}>
                  {highlightedPassageHtml ? (
                    <div className="reading-passage select-text" style={{ fontSize: `${fontSize}px`, lineHeight: "1.9" }} dangerouslySetInnerHTML={{ __html: highlightedPassageHtml }} />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-4 py-20">
                      <BookOpen size={48} className="opacity-20" />
                      <p className="text-sm font-bold text-slate-400">No passage content</p>
                      <p className="text-xs text-slate-400 max-w-sm text-center leading-relaxed">Admin can paste the reading passage in the Mock Test Manager.</p>
                    </div>
                  )}
                </div>
                {/* Notes drawer */}
                {showNotesPanel && currentNotes.length > 0 && (
                  <div className="h-full bg-blue-50/80 border-l border-blue-100 overflow-hidden shrink-0 w-[280px]">
                    <div className="p-4 h-full overflow-y-auto w-[280px]">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2"><MessageSquare size={12} /> My Notes ({currentNotes.length})</h4>
                        <button onClick={() => setShowNotesPanel(false)} className="text-blue-300 hover:text-blue-600"><X size={14} /></button>
                      </div>
                      <div className="space-y-3">
                        {currentNotes.map((note) => (
                          <div key={note.id} className="bg-white rounded-xl p-3 shadow-sm border border-blue-100 group relative">
                            <p className="text-[10px] font-semibold text-blue-500 mb-1.5 italic leading-relaxed">&ldquo;{note.selectedText.slice(0, 80)}{note.selectedText.length > 80 ? "..." : ""}&rdquo;</p>
                            <p className="text-xs text-slate-700 leading-relaxed">{note.text}</p>
                            <button onClick={() => removeNote(note.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500"><X size={12} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resize divider */}
          {!passageFullscreen && !questionsFullscreen && (
            <div onMouseDown={handleDragStart} className={`w-[6px] flex items-center justify-center cursor-col-resize shrink-0 group relative z-10 ${isDragging ? "bg-primary/30" : "bg-slate-200 hover:bg-primary/20"}`}>
              <div className={`w-[3px] h-10 rounded-full ${isDragging ? "bg-primary" : "bg-slate-300 group-hover:bg-primary/50"}`} />
            </div>
          )}

          {/* Questions side */}
          <div className={`flex flex-col h-full overflow-hidden ${questionsFullscreen ? "w-full" : passageFullscreen ? "w-0 overflow-hidden" : "flex-1"}`}>
            <div className="flex flex-col h-full bg-slate-50">
              <div className="min-h-[48px] bg-white border-b border-slate-200 px-3 md:px-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">Questions {qStart}&ndash;{qEnd}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${totalInPart > 0 ? (answeredInPart / totalInPart) * 100 : 0}%` }} />
                    </div>
                    <span className="text-[10px] font-black text-emerald-600 tabular-nums">{answeredInPart}/{totalInPart}</span>
                  </div>
                  <button onClick={() => { setQuestionsFullscreen(!questionsFullscreen); setPassageFullscreen(false); }} className="p-1.5 text-slate-400 hover:text-slate-600">
                    {questionsFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6">
                {activeSection ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-4 py-3 md:px-6 md:py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                      <h4 className="text-sm md:text-base font-heading font-black text-accent leading-tight">{activeSection.title}</h4>
                    </div>
                    <div className="p-4 md:p-6">{questionsContent}</div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-300 gap-4">
                    <AlertCircle size={40} className="opacity-15" />
                    <p className="text-xs font-bold uppercase tracking-widest">Section content missing</p>
                  </div>
                )}
              </div>
              <QuickNavGrid qStart={qStart} qEnd={qEnd} answers={answers} scrollRefs={scrollRefs} />
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.15); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .reading-passage { color: #334155; }
        .reading-passage h1, .reading-passage h2, .reading-passage h3 { font-family: var(--font-heading); font-weight: 900; color: #0f172a; margin-top: 1.8rem; margin-bottom: 0.8rem; line-height: 1.3; }
        .reading-passage h1 { font-size: 1.6em; }
        .reading-passage h2 { font-size: 1.3em; }
        .reading-passage h3 { font-size: 1.1em; }
        .reading-passage p { margin-bottom: 1rem; }
        .reading-passage strong, .reading-passage b { font-weight: 700; color: #1e293b; }
        .reading-passage em { font-style: italic; }
        .reading-passage ul, .reading-passage ol { margin: 1rem 0; padding-left: 1.5rem; }
        .reading-passage li { margin-bottom: 0.4rem; }
        .reading-passage img { border-radius: 0.75rem; margin: 1.5rem 0; max-width: 100%; box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
        .reading-passage table { border-collapse: collapse; width: 100%; margin: 1.5rem 0; font-size: 0.9em; }
        .reading-passage th, .reading-passage td { border: 1px solid #e2e8f0; padding: 0.6rem 0.8rem; }
        .reading-passage th { background: #f8fafc; font-weight: 700; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.05em; color: #64748b; }
        .reading-passage blockquote { border-left: 3px solid #e2e8f0; padding-left: 1rem; margin: 1rem 0; color: #64748b; font-style: italic; }
        mark.hl-yellow { background-color: #fef08a; color: inherit; padding: 1px 3px; border-radius: 3px; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
        mark.hl-green { background-color: #bbf7d0; color: inherit; padding: 1px 3px; border-radius: 3px; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
        mark.hl-pink { background-color: #fbcfe8; color: inherit; padding: 1px 3px; border-radius: 3px; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
        mark.hl-blue { background-color: #bfdbfe; color: inherit; padding: 1px 3px; border-radius: 3px; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
        .reading-passage ::selection { background-color: rgba(250, 204, 21, 0.4); color: inherit; }
        .reading-passage ::-moz-selection { background-color: rgba(250, 204, 21, 0.4); color: inherit; }
        .select-text, .select-text * { user-select: text !important; -webkit-user-select: text !important; }
      `}</style>
    </div>
  );
}

const ReadingTestView = memo(ReadingTestViewInner);
export default ReadingTestView;
