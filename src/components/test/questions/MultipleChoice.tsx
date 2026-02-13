"use client";

import React, { memo } from "react";

/* ════════════════════════════════════════════
   Multiple Choice – Single Answer  (IELTS type 1)
   Tag: [MC1:A,B,C,D]
   ════════════════════════════════════════════ */
interface MultipleChoiceProps {
  qIdx: number;
  options: string[];
  value: string;
  onChange: (qIdx: number, val: string) => void;
  inputRef?: (el: HTMLElement | null) => void;
}

export const MultipleChoice = memo(function MultipleChoice({
  qIdx,
  options,
  value,
  onChange,
  inputRef,
}: MultipleChoiceProps) {
  return (
    <div ref={inputRef} className="my-3 ml-1">
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(qIdx, selected ? "" : opt)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                selected
                  ? "bg-primary/10 border-primary text-primary shadow-sm"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black ${
                  selected
                    ? "bg-primary border-primary text-white"
                    : "border-slate-300 text-slate-400"
                }`}
              >
                {opt}
              </span>
            </button>
          );
        })}
        <span
          className={`ml-2 inline-flex items-center px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
            value
              ? "bg-emerald-50 text-emerald-600"
              : "bg-slate-50 text-slate-300"
          }`}
        >
          Q{qIdx}
        </span>
      </div>
    </div>
  );
});

export default MultipleChoice;
