"use client";

import React, { memo } from "react";
import { ChevronDown } from "lucide-react";

/* ════════════════════════════════════════════
   Summary Completion with Word List (IELTS type 10)
   Tag: [SC1:fossil,solar,wind,nuclear]
   ════════════════════════════════════════════ */
interface SummaryWordListProps {
  qIdx: number;
  options: string[];
  value: string;
  onChange: (qIdx: number, val: string) => void;
  inputRef?: (el: HTMLElement | null) => void;
}

export const SummaryWordList = memo(function SummaryWordList({
  qIdx,
  options,
  value,
  onChange,
  inputRef,
}: SummaryWordListProps) {
  return (
    <span
      ref={inputRef}
      className="inline-flex items-center bg-white border-2 border-indigo-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 rounded-xl shadow-sm overflow-hidden h-10 mx-1 my-1 align-middle"
    >
      <div
        className={`w-9 h-full flex items-center justify-center text-[10px] font-black border-r ${
          value
            ? "bg-indigo-500 text-white border-indigo-500"
            : "bg-indigo-50 text-indigo-400 border-indigo-200"
        }`}
      >
        {qIdx}
      </div>
      <div className="relative flex-1">
        <select
          value={value}
          onChange={(e) => onChange(qIdx, e.target.value)}
          className="appearance-none bg-transparent outline-none pl-3 pr-8 py-2 text-sm font-bold text-slate-800 w-full cursor-pointer h-full"
        >
          <option value="">— word —</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={12}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none"
        />
      </div>
    </span>
  );
});

export default SummaryWordList;
