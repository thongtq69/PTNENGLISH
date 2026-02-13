"use client";

import React, { memo, useCallback } from "react";

/* ════════════════════════════════════════════
   Multiple Choice – Multi Answer  (IELTS type 2)
   Tag: [MCM1:A,B,C,D,E/2]
   Value stored as comma-separated: "B,D"
   ════════════════════════════════════════════ */
interface MultipleChoiceMultiProps {
  qIdx: number;
  options: string[];
  maxSelect: number;
  value: string;
  onChange: (qIdx: number, val: string) => void;
  inputRef?: (el: HTMLElement | null) => void;
}

export const MultipleChoiceMulti = memo(function MultipleChoiceMulti({
  qIdx,
  options,
  maxSelect,
  value,
  onChange,
  inputRef,
}: MultipleChoiceMultiProps) {
  const selected = value ? value.split(",").map((s) => s.trim()) : [];

  const toggle = useCallback(
    (opt: string) => {
      let next: string[];
      if (selected.includes(opt)) {
        next = selected.filter((s) => s !== opt);
      } else {
        if (selected.length >= maxSelect) {
          // Replace oldest selection
          next = [...selected.slice(1), opt];
        } else {
          next = [...selected, opt];
        }
      }
      onChange(qIdx, next.join(","));
    },
    [qIdx, selected, maxSelect, onChange]
  );

  return (
    <div ref={inputRef} className="my-3 ml-1">
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                isSelected
                  ? "bg-primary/10 border-primary text-primary shadow-sm"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center text-[10px] font-black ${
                  isSelected
                    ? "bg-primary border-primary text-white"
                    : "border-slate-300 text-slate-400"
                }`}
              >
                {isSelected ? "✓" : opt}
              </span>
            </button>
          );
        })}
        <span
          className={`ml-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
            selected.length === maxSelect
              ? "bg-emerald-50 text-emerald-600"
              : "bg-amber-50 text-amber-500"
          }`}
        >
          Q{qIdx}
          <span className="text-[8px] font-bold opacity-70">
            {selected.length}/{maxSelect}
          </span>
        </span>
      </div>
    </div>
  );
});

export default MultipleChoiceMulti;
