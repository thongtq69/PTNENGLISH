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
      className="fill-blank inline-flex items-center bg-white border border-slate-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-md shadow-sm overflow-hidden h-7 mx-0.5 align-middle translate-y-[-1px]"
    >
      <div
        className={`w-6 h-full flex items-center justify-center text-[10px] font-black border-r shrink-0 ${value ? "bg-emerald-500 text-white border-emerald-500" : "bg-slate-50 text-slate-500 border-slate-200"
          }`}
      >
        {qIdx}
      </div>
      <input
        type="text"
        autoComplete="off"
        className="flex-1 bg-transparent outline-none px-2 py-0 text-[13px] font-bold text-slate-900 w-20 md:w-28 placeholder:text-slate-300 placeholder:font-normal h-full"
        value={value}
        onChange={(e) => onChange(qIdx, e.target.value)}
        placeholder="..."
      />
    </span>
  );
});

export default FillBlank;
