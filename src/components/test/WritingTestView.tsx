"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Highlighter,
  StickyNote,
  X,
  PenTool,
  MessageSquare,
  Maximize2,
  Minimize2,
  Trash2,
  BookOpen,
} from "lucide-react";
import { applyHighlightsToHtml, getSelectionCharacterOffset } from "@/lib/domUtils";

/* ───── Types ───── */
interface Highlight {
  id: string;
  start: number;
  end: number;
  text: string;
  color: string;
  type: "prompt";
}

interface Note {
  id: string;
  text: string;
  selectedText: string;
  start?: number;
  end?: number;
  timestamp: number;
}

interface WritingTestViewProps {
  content: string; // HTML content for writing prompts (Task 1 + Task 2)
  backdropUrl?: string; // Optional image/PDF backdrop (e.g. graph, diagram)
  answers: Record<number, string>; // { 1: "essay text...", 2: "essay text..." }
  onAnswerChange: (taskIdx: number, val: string) => void;
}

/* ───── Component ───── */
function WritingTestViewInner({ content, backdropUrl, answers, onAnswerChange }: WritingTestViewProps) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [pendingNoteText, setPendingNoteText] = useState("");
  const [pendingSelection, setPendingSelection] = useState<Highlight | null>(null);
  const [showNotesPanel, setShowNotesPanel] = useState(false);

  /* floating popup */
  const [popupPos, setPopupPos] = useState<{ x: number; y: number } | null>(null);
  const [popupSelection, setPopupSelection] = useState<Highlight | null>(null);
  const [popupIsHighlighted, setPopupIsHighlighted] = useState(false);

  const [mobileView, setMobileView] = useState<"prompt" | "response">("prompt");
  const [isMobile, setIsMobile] = useState(false);
  const [splitRatio, setSplitRatio] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [promptFullscreen, setPromptFullscreen] = useState(false);
  const [responseFullscreen, setResponseFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(15);

  const promptRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── Floating popup on text selection ── */
  const closePopup = useCallback(() => {
    setPopupPos(null);
    setPopupSelection(null);
    setPopupIsHighlighted(false);
  }, []);

  const handleTextSelect = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (!text || text.length < 2) return;

    const anchor = selection?.anchorNode;
    if (!anchor) return;

    const promptEl = promptRef.current;
    if (!promptEl?.contains(anchor)) return;

    // Don't trigger if inside input/textarea
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "SELECT" || activeEl.tagName === "TEXTAREA")) return;

    const range = selection?.getRangeAt(0);
    if (!range) return;
    const rect = range.getBoundingClientRect();
    const x = Math.min(rect.left + rect.width / 2 - 80, window.innerWidth - 200);
    const y = rect.top - 52;

    const offset = getSelectionCharacterOffset(promptEl);
    if (!offset) return;

    const highlight: Highlight = {
      id: `prompt-${offset.start}-${offset.end}`,
      start: offset.start,
      end: offset.end,
      text: offset.text,
      color: "yellow",
      type: "prompt",
    };

    const isAlreadyHighlighted = highlights.some((h) => h.id === highlight.id);

    setPopupPos({ x: Math.max(8, x), y: Math.max(8, y) });
    setPopupSelection(highlight);
    setPopupIsHighlighted(isAlreadyHighlighted);
  }, [highlights]);

  useEffect(() => {
    const handleUp = () => setTimeout(handleTextSelect, 10);
    const handleDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-selection-popup]")) closePopup();
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
    if (!popupSelection) return;
    setHighlights((prev) => {
      if (prev.some((h) => h.id === popupSelection.id)) return prev;
      return [...prev, popupSelection];
    });
    window.getSelection()?.removeAllRanges();
    closePopup();
  }, [popupSelection, closePopup]);

  const doRemoveHighlight = useCallback(() => {
    if (!popupSelection) return;
    setHighlights((prev) => prev.filter((h) => h.id !== popupSelection.id));
    setNotes((prev) => prev.filter((n) => n.start !== popupSelection.start));
    window.getSelection()?.removeAllRanges();
    closePopup();
  }, [popupSelection, closePopup]);

  const doOpenNote = useCallback(() => {
    if (!popupSelection) return;
    setPendingSelection(popupSelection);
    setShowNoteInput(true);
    window.getSelection()?.removeAllRanges();
    closePopup();
  }, [popupSelection, closePopup]);

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
    if (!pendingNoteText.trim() || !pendingSelection) return;
    const note: Note = {
      id: Date.now().toString(),
      text: pendingNoteText,
      selectedText: pendingSelection.text,
      start: pendingSelection.start,
      end: pendingSelection.end,
      timestamp: Date.now(),
    };
    setNotes((prev) => [...prev, note]);
    setHighlights((prev) => {
      const noteHighlight = { ...pendingSelection, color: "blue" };
      if (prev.some((h) => h.id === noteHighlight.id)) return prev;
      return [...prev, noteHighlight];
    });
    setShowNoteInput(false);
    setPendingNoteText("");
    setPendingSelection(null);
  }, [pendingNoteText, pendingSelection]);

  const removeNote = useCallback((noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  }, []);

  /* Apply highlights to prompt HTML */
  const highlightedPromptHtml = useMemo(() => {
    if (!content) return content;
    return applyHighlightsToHtml(content, highlights);
  }, [content, highlights]);

  /* Word count helper */
  const wordCount = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  };

  /* ── Prompt content (reusable between mobile/desktop) ── */
  const promptContent = (
    <>
      {(content || backdropUrl) ? (
        <div className="space-y-6">
          {backdropUrl && (
            <div className="mb-6 rounded-2xl overflow-hidden border border-slate-100 shadow-lg">
              <img
                src={backdropUrl}
                alt="Writing Task Backdrop"
                className="w-full h-auto object-contain bg-white"
                onError={(e) => {
                  // If it's a PDF, we could try an iframe or just show a link
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}
          {highlightedPromptHtml && (
            <div
              className="reading-passage select-text"
              style={{ fontSize: `${fontSize}px`, lineHeight: "1.9" }}
              dangerouslySetInnerHTML={{ __html: highlightedPromptHtml }}
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-4 py-20">
          <PenTool size={48} className="opacity-20" />
          <p className="text-sm font-bold text-slate-400">No writing prompts available</p>
          <p className="text-xs text-slate-400 max-w-sm text-center leading-relaxed">
            Admin can add the writing task content in the Mock Test Manager.
          </p>
        </div>
      )}
    </>
  );

  /* ── Response panel (reusable between mobile/desktop) ── */
  const responseContent = (
    <div className="space-y-6 p-4 md:p-6">
      {[1, 2].map((idx) => (
        <div key={idx} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.15em] flex items-center gap-2">
              <PenTool size={13} className="text-primary" />
              Task {idx}
            </label>
            <span
              className={`text-[10px] font-bold tabular-nums px-2 py-0.5 rounded-full ${wordCount(answers[idx] || "") >= (idx === 1 ? 150 : 250)
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-400"
                }`}
            >
              {wordCount(answers[idx] || "")} words
              {idx === 1 ? " / min 150" : " / min 250"}
            </span>
          </div>
          <textarea
            className="w-full h-72 md:h-80 p-5 rounded-2xl bg-white border border-slate-200 focus:ring-8 focus:ring-primary/5 focus:border-primary/30 outline-none transition-all font-body text-slate-700 text-sm leading-relaxed resize-none shadow-inner"
            placeholder={`Enter your Writing Task ${idx} essay here...`}
            value={answers[idx] || ""}
            onChange={(e) => onAnswerChange(idx, e.target.value)}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {/* Note input modal */}
      <AnimatePresence>
        {showNoteInput && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-heading font-black text-accent flex items-center gap-2">
                  <StickyNote size={15} className="text-blue-500" /> Add Note
                </h4>
                <button onClick={() => { setShowNoteInput(false); setPendingSelection(null); }} className="text-slate-300 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>
              {pendingSelection && (
                <p className="text-[11px] text-blue-500 italic mb-3 bg-blue-50 p-2 rounded-lg leading-relaxed">
                  &ldquo;{pendingSelection.text.slice(0, 100)}{pendingSelection.text.length > 100 ? "..." : ""}&rdquo;
                </p>
              )}
              <textarea
                autoFocus
                value={pendingNoteText}
                onChange={(e) => setPendingNoteText(e.target.value)}
                placeholder="Type your note..."
                className="w-full h-24 p-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-300 outline-none text-sm text-slate-700 resize-none mb-3"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => { setShowNoteInput(false); setPendingSelection(null); }} className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600">
                  Cancel
                </button>
                <button onClick={saveNote} className="px-4 py-2 bg-blue-500 text-white text-xs font-bold rounded-lg hover:bg-blue-600 shadow-md">
                  Save Note
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Selection popup */}
      <AnimatePresence>
        {popupPos && (
          <div className="fixed z-[150]" style={{ left: popupPos.x, top: popupPos.y }} data-selection-popup>
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="bg-accent rounded-xl shadow-2xl border border-white/10 flex items-center gap-0.5 px-1 py-0.5">
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Main layout ── */}
      {isMobile ? (
        <>
          <div className="flex-1 overflow-hidden">
            {mobileView === "prompt" ? (
              <div className="h-full flex flex-col bg-white">
                <div className="min-h-[40px] bg-white border-b border-slate-200 px-3 flex items-center justify-between shrink-0 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <BookOpen size={13} className="text-primary shrink-0" />
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 truncate">Writing Prompts</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {notes.length > 0 && (
                      <button onClick={() => setShowNotesPanel(!showNotesPanel)} className={`relative flex items-center gap-1 px-2 py-1.5 rounded-lg text-[9px] font-bold ${showNotesPanel ? "bg-blue-500 text-white" : "bg-blue-50 text-blue-500 hover:bg-blue-100"}`}>
                        <MessageSquare size={12} />
                        <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[7px] flex items-center justify-center font-bold absolute -top-1 -right-1">{notes.length}</span>
                      </button>
                    )}
                  </div>
                </div>
                <div ref={promptRef} className="flex-1 overflow-y-auto custom-scrollbar p-4">
                  {promptContent}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col bg-slate-50">
                <div className="min-h-[40px] bg-white border-b border-slate-200 px-3 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <PenTool size={13} className="text-primary" />
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">Your Response</span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {responseContent}
                </div>
              </div>
            )}
          </div>
          {/* Mobile tab bar */}
          <div className="h-11 bg-white border-t border-slate-200 flex shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <button onClick={() => setMobileView("prompt")} className={`flex-1 flex items-center justify-center gap-1.5 ${mobileView === "prompt" ? "text-primary border-t-2 border-primary bg-primary/5 font-black" : "text-slate-400"}`}>
              <BookOpen size={15} /><span className="text-[9px] font-bold uppercase tracking-wider">Đề bài</span>
            </button>
            <div className="w-px bg-slate-100" />
            <button onClick={() => setMobileView("response")} className={`flex-1 flex items-center justify-center gap-1.5 ${mobileView === "response" ? "text-primary border-t-2 border-primary bg-primary/5 font-black" : "text-slate-400"}`}>
              <PenTool size={15} /><span className="text-[9px] font-bold uppercase tracking-wider">Bài viết</span>
            </button>
          </div>
        </>
      ) : (
        /* Desktop: split view */
        <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
          {/* Prompt side */}
          <div
            className={`flex flex-col h-full overflow-hidden ${promptFullscreen ? "w-full" : responseFullscreen ? "w-0 overflow-hidden" : ""}`}
            style={!promptFullscreen && !responseFullscreen ? { width: `${splitRatio}%` } : undefined}
          >
            <div className="flex flex-col h-full bg-white">
              {/* Prompt toolbar */}
              <div className="min-h-[40px] bg-white border-b border-slate-200 px-3 md:px-4 flex items-center justify-between shrink-0 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <BookOpen size={13} className="text-primary shrink-0" />
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 truncate">Writing Prompts</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {/* Font size */}
                  <div className="hidden md:flex items-center bg-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                    <button onClick={() => setFontSize((f) => Math.max(12, f - 1))} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:bg-slate-200 text-[10px] font-bold">A-</button>
                    <div className="w-px h-4 bg-slate-200" />
                    <button onClick={() => setFontSize((f) => Math.min(22, f + 1))} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:bg-slate-200 text-xs font-bold">A+</button>
                  </div>
                  {/* Notes toggle */}
                  {notes.length > 0 && (
                    <button onClick={() => setShowNotesPanel(!showNotesPanel)} className={`relative flex items-center gap-1 px-2 py-1.5 rounded-lg text-[9px] font-bold ml-0.5 ${showNotesPanel ? "bg-blue-500 text-white" : "bg-blue-50 text-blue-500 hover:bg-blue-100"}`}>
                      <MessageSquare size={12} />
                      <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[7px] flex items-center justify-center font-bold absolute -top-1 -right-1">{notes.length}</span>
                    </button>
                  )}
                  {/* Fullscreen */}
                  <button onClick={() => { setPromptFullscreen(!promptFullscreen); setResponseFullscreen(false); }} className="p-1.5 text-slate-400 hover:text-slate-600 ml-0.5">
                    {promptFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  </button>
                </div>
              </div>
              {/* Prompt body */}
              <div className="flex-1 overflow-hidden flex">
                <div ref={promptRef} className="flex-1 overflow-y-auto custom-scrollbar" style={{ padding: "20px 28px" }}>
                  {promptContent}
                </div>
                {/* Notes drawer */}
                {showNotesPanel && notes.length > 0 && (
                  <div className="h-full bg-blue-50/80 border-l border-blue-100 overflow-hidden shrink-0 w-[260px]">
                    <div className="p-3 h-full overflow-y-auto">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5"><MessageSquare size={11} /> Notes ({notes.length})</h4>
                        <button onClick={() => setShowNotesPanel(false)} className="text-blue-300 hover:text-blue-600"><X size={13} /></button>
                      </div>
                      <div className="space-y-2.5">
                        {notes.map((note) => (
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
          {!promptFullscreen && !responseFullscreen && (
            <div onMouseDown={handleDragStart} className={`w-[6px] flex items-center justify-center cursor-col-resize shrink-0 group relative z-10 ${isDragging ? "bg-primary/30" : "bg-slate-200 hover:bg-primary/20"}`}>
              <div className={`w-[3px] h-10 rounded-full ${isDragging ? "bg-primary" : "bg-slate-300 group-hover:bg-primary/50"}`} />
            </div>
          )}

          {/* Response side */}
          <div className={`flex flex-col h-full overflow-hidden ${responseFullscreen ? "w-full" : promptFullscreen ? "w-0 overflow-hidden" : "flex-1"}`}>
            <div className="flex flex-col h-full bg-slate-50">
              <div className="min-h-[40px] bg-white border-b border-slate-200 px-3 md:px-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <PenTool size={13} className="text-primary" />
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">Your Response</span>
                </div>
                <button onClick={() => { setResponseFullscreen(!responseFullscreen); setPromptFullscreen(false); }} className="p-1 text-slate-400 hover:text-slate-600 ml-1">
                  {responseFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                </button>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {responseContent}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
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
        mark.hl-blue { background-color: #bfdbfe; color: inherit; padding: 1px 3px; border-radius: 3px; cursor: pointer; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
        .reading-passage ::selection { background-color: rgba(250, 204, 21, 0.4); color: inherit; }
        .reading-passage ::-moz-selection { background-color: rgba(250, 204, 21, 0.4); color: inherit; }
        .select-text, .select-text * { user-select: text !important; -webkit-user-select: text !important; }
      `}</style>
    </div>
  );
}

const WritingTestView = memo(WritingTestViewInner);
export default WritingTestView;
