"use client";

import React, { useState, useRef, useLayoutEffect, useMemo } from "react";
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

export default function QuestionsRenderer({
  content,
  answers,
  onAnswerChange,
  scrollRefs,
  className = "",
  isHighlighterActive = false,
}: QuestionsRendererProps) {
  /* ── Step 1: Replace tags with placeholder spans ── */
  const { placeholderHtml, parsedQuestions } = useMemo(() => {
    if (!content) return { placeholderHtml: "", parsedQuestions: [] as ParsedQuestion[] };

    const questions: ParsedQuestion[] = [];
    TAG_RE.lastIndex = 0;
    const html = content.replace(TAG_RE, (match) => {
      const q = parseTag(match);
      if (!q) return match;
      questions.push(q);
      return `<span data-q-placeholder="${q.qIdx}" style="display:inline-flex;vertical-align:middle"></span>`;
    });
    return { placeholderHtml: html, parsedQuestions: questions };
  }, [content]);

  /* ── Step 2: Set innerHTML manually and discover placeholders ── */
  const containerRef = useRef<HTMLDivElement>(null);
  const [portalTargets, setPortalTargets] = useState<Record<number, HTMLElement>>({});
  const appliedHtmlRef = useRef("");

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    // Only set innerHTML if it changed (avoid destroying portal targets)
    if (appliedHtmlRef.current !== placeholderHtml) {
      node.innerHTML = placeholderHtml;
      appliedHtmlRef.current = placeholderHtml;

      // Tag "options" tables (no <th>, typically matching-task option lists)
      // and replace their non-breaking spaces so narrow widths can wrap.
      node.querySelectorAll<HTMLTableElement>("table").forEach((t) => {
        if (!t.querySelector("th")) {
          t.classList.add("options-box");
          t.querySelectorAll("td").forEach((td) => {
            // Only mutate text nodes; don't touch any nested elements.
            td.childNodes.forEach((n) => {
              if (n.nodeType === Node.TEXT_NODE && n.textContent) {
                n.textContent = n.textContent.replace(/ /g, " ");
              }
            });
          });
        }
      });

      // Tag flow-chart containers (div with child <p> holding ⬇)
      node.querySelectorAll<HTMLDivElement>("div").forEach((d) => {
        if (Array.from(d.children).some((c) => c.tagName === "P" && /⬇|↓/.test(c.textContent || ""))) {
          d.classList.add("flow-chart");
        }
      });

      // Discover placeholder spans only after HTML changes
      const targets: Record<number, HTMLElement> = {};
      node.querySelectorAll<HTMLElement>("[data-q-placeholder]").forEach((el) => {
        const qIdx = parseInt(el.getAttribute("data-q-placeholder") || "0", 10);
        if (qIdx > 0) {
          targets[qIdx] = el;
          if (scrollRefs) scrollRefs.current[qIdx] = el;
        }
      });
      setPortalTargets(targets);
    }
  }, [placeholderHtml, scrollRefs]);

  if (!content) {
    return (
      <div className="text-slate-400 italic">
        No interactive content provided for this section.
      </div>
    );
  }

  /* ── Step 3: Build portals ── */
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
      {/* Container for HTML content — innerHTML set imperatively via useLayoutEffect */}
      <div ref={containerRef} />
      {portals}
    </div>
  );
}
