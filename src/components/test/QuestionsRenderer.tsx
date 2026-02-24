"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { parseTag, type ParsedQuestion } from "@/lib/questionParser";
import {
  FillBlank,
  MultipleChoice,
  MultipleChoiceMulti,
  TrueFalseNG,
  YesNoNG,
  MatchingDropdown,
  SummaryWordList,
} from "./questions";

const TAG_RE = /\[(MCM|MC|TFNG|YNNG|MH|MI|MF|MSE|SC|Q)(\d+)(?::([^\]]*))?\]/g;

interface QuestionsRendererProps {
  content: string;
  answers: Record<number, string>;
  onAnswerChange: (qIdx: number, val: string) => void;
  scrollRefs?: React.MutableRefObject<Record<number, HTMLElement | null>>;
  className?: string;
  isHighlighterActive?: boolean;
}

/**
 * Renders IELTS question content using a portal-based approach.
 *
 * 1. Replaces question tags with placeholder <span> elements in the HTML
 * 2. Renders the full HTML as one piece (preserving DOM structure)
 * 3. Uses React portals to mount interactive components into placeholders
 */
export default function QuestionsRenderer({
  content,
  answers,
  onAnswerChange,
  scrollRefs,
  className = "",
  isHighlighterActive = false,
}: QuestionsRendererProps) {
  const { placeholderHtml, parsedQuestions } = useMemo(() => {
    if (!content) return { placeholderHtml: "", parsedQuestions: [] as ParsedQuestion[] };

    const questions: ParsedQuestion[] = [];
    TAG_RE.lastIndex = 0;
    const html = content.replace(TAG_RE, (match) => {
      const q = parseTag(match);
      if (!q) return match;
      questions.push(q);
      return `<span data-q-placeholder="${q.qIdx}" data-q-type="${q.type}" style="display:inline-flex;vertical-align:middle"></span>`;
    });
    return { placeholderHtml: html, parsedQuestions: questions };
  }, [content]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [portalTargets, setPortalTargets] = useState<Record<number, HTMLElement>>({});

  // After every render where the HTML changes, discover placeholders.
  // useEffect fires after DOM commit — container is guaranteed to exist.
  useEffect(() => {
    const node = containerRef.current;
    if (!node) {
      setPortalTargets({});
      return;
    }
    const targets: Record<number, HTMLElement> = {};
    node.querySelectorAll<HTMLElement>("[data-q-placeholder]").forEach((el) => {
      const qIdx = parseInt(el.getAttribute("data-q-placeholder") || "0", 10);
      if (qIdx > 0) {
        targets[qIdx] = el;
        if (scrollRefs) scrollRefs.current[qIdx] = el;
      }
    });
    setPortalTargets(targets);
  }, [placeholderHtml, scrollRefs]);

  if (!content) {
    return (
      <div className="text-slate-400 italic">
        No interactive content provided for this section.
      </div>
    );
  }

  // Build portals from the current targets
  const portals = parsedQuestions
    .map((q) => {
      const target = portalTargets[q.qIdx];
      if (!target) return null;

      const val = answers[q.qIdx] || "";
      let component: React.ReactNode;

      switch (q.type) {
        case "mc":
          component = <MultipleChoice qIdx={q.qIdx} options={q.options || ["A","B","C","D"]} value={val} onChange={onAnswerChange} />;
          break;
        case "mcm":
          component = <MultipleChoiceMulti qIdx={q.qIdx} options={q.options || ["A","B","C","D","E"]} maxSelect={q.maxSelect || 2} value={val} onChange={onAnswerChange} />;
          break;
        case "tfng":
          component = <TrueFalseNG qIdx={q.qIdx} value={val} onChange={onAnswerChange} />;
          break;
        case "ynng":
          component = <YesNoNG qIdx={q.qIdx} value={val} onChange={onAnswerChange} />;
          break;
        case "mh": case "mi": case "mf": case "mse":
          component = <MatchingDropdown qIdx={q.qIdx} variant={q.type} options={q.options || []} value={val} onChange={onAnswerChange} />;
          break;
        case "sc":
          component = <SummaryWordList qIdx={q.qIdx} options={q.options || []} value={val} onChange={onAnswerChange} />;
          break;
        case "fill": default:
          component = <FillBlank qIdx={q.qIdx} value={val} onChange={onAnswerChange} />;
          break;
      }

      return createPortal(component, target, `q-portal-${q.qIdx}`);
    })
    .filter(Boolean);

  return (
    <div
      className={`prose prose-slate max-w-none dark:prose-invert font-body leading-relaxed text-slate-700 ${isHighlighterActive ? "cursor-text" : ""} ${className}`}
    >
      <div
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: placeholderHtml }}
      />
      {portals}
    </div>
  );
}
