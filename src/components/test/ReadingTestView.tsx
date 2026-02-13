"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Highlighter,
  StickyNote,
  X,
  BookOpen,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Maximize2,
  Minimize2,
  List,
  ChevronLeft,
  ChevronRight,
  Trash2,
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

  return (
    <div className="bg-white/95 backdrop-blur-sm border-t border-slate-200 shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-center gap-2 sm:gap-2.5 md:gap-3 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 overflow-x-auto no-scrollbar">
        {/* Prev button */}
        <button
          onClick={() => activeSectionIdx > 0 && onSectionChange(activeSectionIdx - 1)}
          disabled={activeSectionIdx === 0}
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 transition-all ${
            activeSectionIdx === 0
              ? "text-slate-200 cursor-not-allowed"
              : "text-slate-500 hover:bg-slate-100 hover:text-primary"
          }`}
        >
          <ChevronLeft size={18} />
        </button>

        {/* Paragraph label pill */}
        <button
          className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary text-white text-[10px] sm:text-xs font-extrabold uppercase tracking-wider shrink-0 shadow-md"
        >
          Paragraph {activeSectionIdx + 1}
        </button>

        {/* Question number buttons for active section */}
        {(() => {
          const s = activeSectionIdx === 0 ? 1 : activeSectionIdx === 1 ? 14 : 27;
          const e = activeSectionIdx === 0 ? 13 : activeSectionIdx === 1 ? 26 : 40;
          const partTotal = e - s + 1;
          return (
            <div className="flex items-center gap-[3px] sm:gap-1 md:gap-1.5">
              {Array.from({ length: partTotal }, (__, i) => s + i).map((q) => {
                const isAnswered = !!answers[q];
                return (
                  <button
                    key={q}
                    onClick={() => {
                      scrollRefs.current?.[q]?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-md sm:rounded-lg flex items-center justify-center text-[10px] sm:text-xs md:text-sm font-bold transition-all duration-200 ${
                      isAnswered
                        ? "bg-emerald-500 text-white shadow-sm hover:bg-emerald-600 hover:shadow-md"
                        : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                    }`}
                  >
                    {q}
                  </button>
                );
              })}
            </div>
          );
        })()}

        {/* Next button */}
        <button
          onClick={() => activeSectionIdx < sections.length - 1 && onSectionChange(activeSectionIdx + 1)}
          disabled={activeSectionIdx === sections.length - 1}
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 transition-all ${
            activeSectionIdx === sections.length - 1
              ? "text-slate-200 cursor-not-allowed"
              : "text-slate-500 hover:bg-slate-100 hover:text-primary"
          }`}
        >
          <ChevronRight size={18} />
        </button>

        {/* Overall score indicator */}
        <div className="hidden xl:flex items-center gap-2 px-3 border-l border-slate-200 shrink-0 ml-1">
          <CheckCircle2 size={14} className="text-emerald-500" />
          <span className="text-xs font-extrabold text-emerald-600 tabular-nums">{totalAnswered}/40</span>
        </div>
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
  const [highlights, setHighlights] = useState<Record<string, Array<{ text: string; color: string }>>>({});
  const [notes, setNotes] = useState<Record<string, Note[]>>({});
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [pendingNoteText, setPendingNoteText] = useState("");
  const [pendingSelectedText, setPendingSelectedText] = useState("");
  const [showNotesPanel, setShowNotesPanel] = useState(false);

  /* ── floating popup state ── */
  const [popupPos, setPopupPos] = useState<{ x: number; y: number } | null>(null);
  const [popupText, setPopupText] = useState("");
  const [popupIsHighlighted, setPopupIsHighlighted] = useState(false);

  const [mobileView, setMobileView] = useState<"passage" | "questions">("passage");
  const [isMobile, setIsMobile] = useState(false);
  const [splitRatio, setSplitRatio] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [passageFullscreen, setPassageFullscreen] = useState(false);
  const [questionsFullscreen, setQuestionsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(15);

  const passageRef = useRef<HTMLDivElement>(null);
  const questionsRef = useRef<HTMLDivElement>(null);
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

  /* ── Floating popup on text selection (both passage + questions) ── */
  const closePopup = useCallback(() => {
    setPopupPos(null);
    setPopupText("");
    setPopupIsHighlighted(false);
  }, []);

  const handleTextSelect = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (!text || text.length < 2) return;

    const anchor = selection?.anchorNode;
    if (!anchor) return;
    const isInPassage = passageRef.current?.contains(anchor);
    const isInQuestions = questionsRef.current?.contains(anchor);
    if (!isInPassage && !isInQuestions) return;

    // Don't trigger if selection is inside an input/select/textarea
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "SELECT" || activeEl.tagName === "TEXTAREA")) return;

    const range = selection?.getRangeAt(0);
    if (!range) return;
    const rect = range.getBoundingClientRect();
    const x = Math.min(rect.left + rect.width / 2 - 80, window.innerWidth - 200);
    const y = rect.top - 52;

    const existing = highlights[highlightKey] || [];
    const isAlreadyHighlighted = existing.some((h) => h.text === text);

    setPopupPos({ x: Math.max(8, x), y: Math.max(8, y) });
    setPopupText(text);
    setPopupIsHighlighted(isAlreadyHighlighted);
  }, [highlightKey, highlights]);

  useEffect(() => {
    const handleUp = () => setTimeout(handleTextSelect, 10);
    const handleDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-selection-popup]")) {
        closePopup();
      }
    };
    document.addEventListener("mouseup", handleUp);
    document.addEventListener("touchend", handleUp);
    document.addEventListener("mousedown", handleDown);
    document.addEventListener("touchstart", handleDown);
    return () => {
      document.removeEventListener("mouseup", handleUp);
      document.removeEventListener("touchend", handleUp);
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("touchstart", handleDown);
    };
  }, [handleTextSelect, closePopup]);

  /* Popup actions */
  const doHighlight = useCallback(() => {
    if (!popupText) return;
    setHighlights((prev) => {
      const existing = prev[highlightKey] || [];
      if (existing.some((h) => h.text === popupText)) return prev;
      return { ...prev, [highlightKey]: [...existing, { text: popupText, color: "yellow" }] };
    });
    window.getSelection()?.removeAllRanges();
    closePopup();
  }, [popupText, highlightKey, closePopup]);

  const doRemoveHighlight = useCallback(() => {
    if (!popupText) return;
    setHighlights((prev) => {
      const existing = prev[highlightKey] || [];
      return { ...prev, [highlightKey]: existing.filter((h) => h.text !== popupText) };
    });
    setNotes((prev) => {
      const existing = prev[highlightKey] || [];
      return { ...prev, [highlightKey]: existing.filter((n) => n.selectedText !== popupText) };
    });
    window.getSelection()?.removeAllRanges();
    closePopup();
  }, [popupText, highlightKey, closePopup]);

  const doOpenNote = useCallback(() => {
    if (!popupText) return;
    setPendingSelectedText(popupText);
    setShowNoteInput(true);
    window.getSelection()?.removeAllRanges();
    closePopup();
  }, [popupText, closePopup]);

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

      {/* Floating Selection Popup */}
      <AnimatePresence>
        {popupPos && popupText && (
          <div data-selection-popup>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed z-[250] pointer-events-auto"
              style={{ left: popupPos.x, top: popupPos.y }}
            >
              <div className="bg-slate-900 rounded-xl shadow-2xl shadow-black/30 flex items-center gap-0.5 p-1 border border-white/10">
                {popupIsHighlighted ? (
                  <button onClick={doRemoveHighlight} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all">
                    <Trash2 size={14} /><span className="text-[10px] font-bold">Remove</span>
                  </button>
                ) : (
                  <>
                    <button onClick={doHighlight} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-yellow-400 hover:bg-yellow-500/20 hover:text-yellow-300 transition-all">
                      <Highlighter size={14} /><span className="text-[10px] font-bold">Highlight</span>
                    </button>
                    <div className="w-px h-5 bg-white/10" />
                    <button onClick={doOpenNote} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition-all">
                      <StickyNote size={14} /><span className="text-[10px] font-bold">Note</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main content */}
      {isMobile ? (
        <>
          <div className="flex-1 overflow-hidden">
            {mobileView === "passage" ? (
              <div className="h-full flex flex-col bg-white">
                {/* Passage toolbar (compact) */}
                <div className="min-h-[40px] bg-white border-b border-slate-200 px-3 flex items-center justify-between shrink-0 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <BookOpen size={13} className="text-primary shrink-0" />
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 truncate">{activeSection?.title || "Reading Passage"}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {currentNotes.length > 0 && (
                      <button onClick={() => setShowNotesPanel(!showNotesPanel)} className={`relative flex items-center gap-1 px-2 py-1.5 rounded-lg text-[9px] font-bold ${showNotesPanel ? "bg-blue-500 text-white" : "bg-blue-50 text-blue-500 hover:bg-blue-100"}`}>
                        <MessageSquare size={12} />
                        <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[7px] flex items-center justify-center font-bold absolute -top-1 -right-1">{currentNotes.length}</span>
                      </button>
                    )}
                  </div>
                </div>
                {/* Passage content */}
                <div ref={passageRef} className="flex-1 overflow-y-auto custom-scrollbar p-4">
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
                {/* Questions toolbar (mobile) */}
                <div className="min-h-[40px] bg-white border-b border-slate-200 px-3 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">Questions {qStart}&ndash;{qEnd}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 sm:w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${totalInPart > 0 ? (answeredInPart / totalInPart) * 100 : 0}%` }} />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 tabular-nums">{answeredInPart}/{totalInPart}</span>
                  </div>
                </div>
                <div ref={questionsRef} className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-4">
                  {activeSection ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                        <h4 className="text-sm font-heading font-black text-accent leading-tight">{activeSection.title}</h4>
                      </div>
                      <div className="p-4">{questionsContent}</div>
                      {/* Prev / Next */}
                      <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                        <button onClick={() => activeSectionIdx > 0 && onSectionChange(activeSectionIdx - 1)} disabled={activeSectionIdx === 0} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeSectionIdx === 0 ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-100"}`}>
                          <ChevronLeft size={15} /> Prev
                        </button>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Part {activeSectionIdx + 1}/{sections.length}</span>
                        <button onClick={() => activeSectionIdx < sections.length - 1 && onSectionChange(activeSectionIdx + 1)} disabled={activeSectionIdx === sections.length - 1} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeSectionIdx === sections.length - 1 ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-100"}`}>
                          Next <ChevronRight size={15} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-300 gap-4">
                      <AlertCircle size={40} className="opacity-15" />
                      <p className="text-xs font-bold uppercase tracking-widest">Section content missing</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Mobile tab bar */}
          <div className="h-11 bg-white border-t border-slate-200 flex shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <button onClick={() => setMobileView("passage")} className={`flex-1 flex items-center justify-center gap-1.5 ${mobileView === "passage" ? "text-primary border-t-2 border-primary bg-primary/5 font-black" : "text-slate-400"}`}>
              <BookOpen size={15} /><span className="text-[9px] font-bold uppercase tracking-wider">Passage</span>
            </button>
            <div className="w-px bg-slate-100" />
            <button onClick={() => setMobileView("questions")} className={`flex-1 flex items-center justify-center gap-1.5 relative ${mobileView === "questions" ? "text-primary border-t-2 border-primary bg-primary/5 font-black" : "text-slate-400"}`}>
              <List size={15} /><span className="text-[9px] font-bold uppercase tracking-wider">Questions</span>
              {answeredInPart > 0 && <span className="absolute top-1 right-3 w-4 h-4 rounded-full bg-emerald-500 text-white text-[7px] font-bold flex items-center justify-center">{answeredInPart}</span>}
            </button>
          </div>
          {/* Mobile bottom nav */}
          <PartNavBar sections={sections} activeSectionIdx={activeSectionIdx} onSectionChange={onSectionChange} answers={answers} scrollRefs={scrollRefs} />
        </>
      ) : (
        /* Desktop: split view + bottom nav */
        <div className="flex-1 flex flex-col overflow-hidden">
          <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
            {/* Passage side */}
            <div className={`flex flex-col h-full overflow-hidden ${passageFullscreen ? "w-full" : questionsFullscreen ? "w-0 overflow-hidden" : ""}`} style={!passageFullscreen && !questionsFullscreen ? { width: `${splitRatio}%` } : undefined}>
              <div className="flex flex-col h-full bg-white">
                {/* Passage toolbar (clean — no highlight/note buttons) */}
                <div className="min-h-[40px] bg-white border-b border-slate-200 px-3 md:px-4 flex items-center justify-between shrink-0 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <BookOpen size={13} className="text-primary shrink-0" />
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 truncate">{activeSection?.title || "Reading Passage"}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Font size */}
                    <div className="hidden md:flex items-center bg-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                      <button onClick={() => setFontSize((f) => Math.max(12, f - 1))} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:bg-slate-200 text-[10px] font-bold">A-</button>
                      <div className="w-px h-4 bg-slate-200" />
                      <button onClick={() => setFontSize((f) => Math.min(22, f + 1))} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:bg-slate-200 text-xs font-bold">A+</button>
                    </div>
                    {/* Notes panel toggle */}
                    {currentNotes.length > 0 && (
                      <button onClick={() => setShowNotesPanel(!showNotesPanel)} className={`relative flex items-center gap-1 px-2 py-1.5 rounded-lg text-[9px] font-bold ml-0.5 ${showNotesPanel ? "bg-blue-500 text-white" : "bg-blue-50 text-blue-500 hover:bg-blue-100"}`}>
                        <MessageSquare size={12} />
                        <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[7px] flex items-center justify-center font-bold absolute -top-1 -right-1">{currentNotes.length}</span>
                      </button>
                    )}
                    {/* Fullscreen */}
                    <button onClick={() => { setPassageFullscreen(!passageFullscreen); setQuestionsFullscreen(false); }} className="p-1.5 text-slate-400 hover:text-slate-600 ml-0.5">
                      {passageFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>
                  </div>
                </div>
                {/* Passage body */}
                <div className="flex-1 overflow-hidden flex">
                  <div ref={passageRef} className="flex-1 overflow-y-auto custom-scrollbar" style={{ padding: "20px 28px" }}>
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
                    <div className="h-full bg-blue-50/80 border-l border-blue-100 overflow-hidden shrink-0 w-[260px]">
                      <div className="p-3 h-full overflow-y-auto">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5"><MessageSquare size={11} /> Notes ({currentNotes.length})</h4>
                          <button onClick={() => setShowNotesPanel(false)} className="text-blue-300 hover:text-blue-600"><X size={13} /></button>
                        </div>
                        <div className="space-y-2.5">
                          {currentNotes.map((note) => (
                            <div key={note.id} className="bg-white rounded-xl p-2.5 shadow-sm border border-blue-100 group relative">
                              <p className="text-[9px] font-semibold text-blue-500 mb-1 italic leading-relaxed">&ldquo;{note.selectedText.slice(0, 60)}...&rdquo;</p>
                              <p className="text-[11px] text-slate-700 leading-relaxed">{note.text}</p>
                              <button onClick={() => removeNote(note.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500"><X size={11} /></button>
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
                <div className="min-h-[40px] bg-white border-b border-slate-200 px-3 md:px-5 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">Questions {qStart}&ndash;{qEnd}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 sm:w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${totalInPart > 0 ? (answeredInPart / totalInPart) * 100 : 0}%` }} />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 tabular-nums">{answeredInPart}/{totalInPart}</span>
                    <button onClick={() => { setQuestionsFullscreen(!questionsFullscreen); setPassageFullscreen(false); }} className="p-1 text-slate-400 hover:text-slate-600 ml-1">
                      {questionsFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                    </button>
                  </div>
                </div>
                <div ref={questionsRef} className="flex-1 overflow-y-auto custom-scrollbar p-3 md:p-5">
                  {activeSection ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="px-4 py-3 md:px-6 md:py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                        <h4 className="text-sm md:text-base font-heading font-black text-accent leading-tight">{activeSection.title}</h4>
                      </div>
                      <div className="p-4 md:p-6 select-text">{questionsContent}</div>
                      {/* Prev / Next part navigation */}
                      <div className="px-4 md:px-6 py-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => activeSectionIdx > 0 && onSectionChange(activeSectionIdx - 1)}
                          disabled={activeSectionIdx === 0}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeSectionIdx === 0 ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-100 hover:text-primary"}`}
                        >
                          <ChevronLeft size={15} /> Previous
                        </button>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          Part {activeSectionIdx + 1} / {sections.length}
                        </span>
                        <button
                          onClick={() => activeSectionIdx < sections.length - 1 && onSectionChange(activeSectionIdx + 1)}
                          disabled={activeSectionIdx === sections.length - 1}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeSectionIdx === sections.length - 1 ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-100 hover:text-primary"}`}
                        >
                          Next <ChevronRight size={15} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-300 gap-4">
                      <AlertCircle size={40} className="opacity-15" />
                      <p className="text-xs font-bold uppercase tracking-widest">Section content missing</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Bottom navigation bar — desktop */}
          <PartNavBar sections={sections} activeSectionIdx={activeSectionIdx} onSectionChange={onSectionChange} answers={answers} scrollRefs={scrollRefs} />
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
        mark.hl-yellow { background-color: #fef08a; color: inherit; padding: 1px 3px; border-radius: 3px; cursor: pointer; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
        mark.hl-green { background-color: #bbf7d0; color: inherit; padding: 1px 3px; border-radius: 3px; cursor: pointer; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
        mark.hl-pink { background-color: #fbcfe8; color: inherit; padding: 1px 3px; border-radius: 3px; cursor: pointer; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
        mark.hl-blue { background-color: #bfdbfe; color: inherit; padding: 1px 3px; border-radius: 3px; cursor: pointer; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
        .reading-passage ::selection { background-color: rgba(250, 204, 21, 0.4); color: inherit; }
        .reading-passage ::-moz-selection { background-color: rgba(250, 204, 21, 0.4); color: inherit; }
        .select-text, .select-text * { user-select: text !important; -webkit-user-select: text !important; }
        .prose ::selection { background-color: rgba(59, 130, 246, 0.25); color: inherit; }
      `}</style>
    </div>
  );
}

const ReadingTestView = memo(ReadingTestViewInner);
export default ReadingTestView;