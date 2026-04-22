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

      // Tag "options" tables via content heuristic: first row's first cell
      // starts with a single uppercase letter (A, B, C...). Works whether the
      // letter column uses <td> or <th>.
      node.querySelectorAll<HTMLTableElement>("table").forEach((t) => {
        const firstCell = t.querySelector("tr:first-child > td, tr:first-child > th");
        const firstText = (firstCell?.textContent || "").trim();
        const looksLikeOption = /^[A-Z](\s|$|[^A-Za-z0-9])/.test(firstText);
        if (!looksLikeOption) return;

        t.classList.add("options-box");

        // Normalize each cell: replace nbsp AND split multi-option cells
        // (<strong>A</strong> advice <strong>B</strong> body language ...) into
        // separate block spans, one per option, so each letter sits on its own row.
        t.querySelectorAll("td, th").forEach((cell) => {
          const strongs = cell.querySelectorAll(":scope > strong");
          if (strongs.length > 1) {
            // Collect each <strong>...</strong> + following siblings until the next <strong>
            const groups: Node[][] = [];
            let current: Node[] | null = null;
            Array.from(cell.childNodes).forEach((n) => {
              if (n.nodeType === 1 && (n as Element).tagName === "STRONG") {
                if (current) groups.push(current);
                current = [n];
              } else if (current) {
                current.push(n);
              }
            });
            if (current) groups.push(current);

            cell.innerHTML = "";
            groups.forEach((nodes) => {
              const span = document.createElement("span");
              span.className = "option-line";
              nodes.forEach((n) => {
                if (n.nodeType === 3 && n.textContent) {
                  n.textContent = n.textContent.replace(/ /g, " ").trim();
                  if (!n.textContent) return;
                  // Prepend a space between letter and description
                  span.appendChild(document.createTextNode(" "));
                  span.appendChild(document.createTextNode(n.textContent));
                } else {
                  span.appendChild(n);
                }
              });
              cell.appendChild(span);
            });
          } else {
            // Simple cell — just normalize nbsp in text nodes
            cell.childNodes.forEach((n) => {
              if (n.nodeType === 3 && n.textContent) {
                n.textContent = n.textContent.replace(/ /g, " ");
              }
            });
          }
        });
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
