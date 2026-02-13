"use client";

import React, { memo } from "react";

/* ════════════════════════════════════════════
   Fill-in-the-blank  (IELTS types 9,11,12,13,14)
   Tag: [Q1]
   ════════════════════════════════════════════ */
interface FillBlankProps {
  qIdx: number;
  value: string;
  onChange: (qIdx: number, val: string) => void;
  inputRef?: (el: HTMLElement | null) => void;
}

export const FillBlank = memo(function FillBlank({ qIdx, value, onChange, inputRef }: FillBlankProps) {
  return (
    <span
      ref={inputRef}
      className="inline-flex items-center bg-white border-2 border-slate-200 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 rounded-xl shadow-sm overflow-hidden h-10 mx-1 my-1 align-middle"
    >
      <div
        className={`w-9 h-full flex items-center justify-center text-[10px] font-black border-r ${
          value ? "bg-emerald-500 text-white border-emerald-500" : "bg-slate-50 text-slate-400 border-slate-200"
        }`}
      >
        {qIdx}
      </div>
      <input
        type="text"
        className="flex-1 bg-transparent outline-none px-3 py-2 text-sm font-bold text-slate-800 w-28 md:w-36 placeholder:text-slate-300 placeholder:font-normal"
        value={value}
        onChange={(e) => onChange(qIdx, e.target.value)}
        placeholder="answer"
      />
    </span>
  );
});

export default FillBlank;
