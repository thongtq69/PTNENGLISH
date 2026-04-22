"use client";

import React, { memo } from "react";

/* ════════════════════════════════════════════
   Yes / No / Not Given  (IELTS type 4)
   Tag: [YNNG1]
   ════════════════════════════════════════════ */
interface YesNoNGProps {
  qIdx: number;
  value: string;
  onChange: (qIdx: number, val: string) => void;
  inputRef?: (el: HTMLElement | null) => void;
}

const OPTIONS = ["YES", "NO", "NOT GIVEN"] as const;
const COLORS: Record<string, { active: string; ring: string }> = {
  YES: { active: "bg-emerald-500 border-emerald-500 text-white shadow-emerald-200", ring: "ring-emerald-100" },
  NO: { active: "bg-red-500 border-red-500 text-white shadow-red-200", ring: "ring-red-100" },
  "NOT GIVEN": { active: "bg-amber-500 border-amber-500 text-white shadow-amber-200", ring: "ring-amber-100" },
};

export const YesNoNG = memo(function YesNoNG({ qIdx, value, onChange, inputRef }: YesNoNGProps) {
  return (
    <div ref={inputRef} className="my-3 ml-1 flex items-center gap-2 flex-wrap">
      <span
        className={`inline-flex items-center px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
          value ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-300"
        }`}
      >
        Q{qIdx}
      </span>
      {OPTIONS.map((opt) => {
        const selected = value === opt;
        const c = COLORS[opt];
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(qIdx, selected ? "" : opt)}
            className={`px-3.5 py-2 rounded-xl border-2 text-xs font-black uppercase tracking-wider transition-all ${
              selected
                ? `${c.active} shadow-sm ring-4 ${c.ring}`
                : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
});

export default YesNoNG;
