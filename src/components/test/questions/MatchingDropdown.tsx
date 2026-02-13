"use client";

import React, { memo } from "react";
import { ChevronDown } from "lucide-react";

/* ════════════════════════════════════════════
   Matching Dropdown  (IELTS types 5,6,7,8)
   Tags: [MH1:...], [MI1:...], [MF1:...], [MSE1:...]

   A generic select dropdown for all matching-style
   question types.
   ════════════════════════════════════════════ */

type MatchingVariant = "mh" | "mi" | "mf" | "mse";

interface MatchingDropdownProps {
  qIdx: number;
  variant: MatchingVariant;
  options: string[];
  value: string;
  onChange: (qIdx: number, val: string) => void;
  inputRef?: (el: HTMLElement | null) => void;
}

const VARIANT_LABELS: Record<MatchingVariant, string> = {
  mh: "Heading",
  mi: "Paragraph",
  mf: "Feature",
  mse: "Ending",
};

export const MatchingDropdown = memo(function MatchingDropdown({
  qIdx,
  variant,
  options,
  value,
  onChange,
  inputRef,
}: MatchingDropdownProps) {
  const label = VARIANT_LABELS[variant] || "Option";

  return (
    <span
      ref={inputRef}
      className="inline-flex items-center bg-white border-2 border-slate-200 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 rounded-xl shadow-sm overflow-hidden h-10 mx-1 my-1 align-middle"
    >
      <div
        className={`w-9 h-full flex items-center justify-center text-[10px] font-black border-r ${
          value
            ? "bg-emerald-500 text-white border-emerald-500"
            : "bg-slate-50 text-slate-400 border-slate-200"
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
          <option value="">— {label} —</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={12}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
      </div>
    </span>
  );
});

export default MatchingDropdown;
