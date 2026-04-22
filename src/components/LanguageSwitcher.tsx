"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Language } from "@/data/translations";

const LANGUAGES: { code: Language; label: string; aria: string }[] = [
    { code: "vi", label: "VI", aria: "Chuyển sang tiếng Việt" },
    { code: "en", label: "EN", aria: "Switch to English" },
];

type Variant = "desktop" | "mobile";

interface LanguageSwitcherProps {
    variant?: Variant;
    isTransparent?: boolean;
    className?: string;
}

export default function LanguageSwitcher({
    variant = "desktop",
    isTransparent = false,
    className = "",
}: LanguageSwitcherProps) {
    const { language, setLanguage } = useLanguage();

    if (variant === "mobile") {
        return (
            <div
                role="group"
                aria-label="Language selector"
                className={`flex items-center gap-2 bg-slate-100 rounded-lg px-2 py-1 ${className}`}
            >
                {LANGUAGES.map((l) => {
                    const active = language === l.code;
                    return (
                        <button
                            key={l.code}
                            type="button"
                            lang={l.code}
                            aria-label={l.aria}
                            aria-pressed={active}
                            onClick={() => setLanguage(l.code)}
                            className={`text-[10px] font-black uppercase transition-all px-1 ${
                                active ? "text-primary" : "text-slate-400 hover:text-slate-600"
                            }`}
                        >
                            {l.label}
                        </button>
                    );
                })}
            </div>
        );
    }

    return (
        <div
            role="group"
            aria-label="Language selector"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                isTransparent ? "border-white/20 bg-white/5" : "border-slate-200 bg-slate-50"
            } ${className}`}
        >
            <Globe
                size={14}
                aria-hidden="true"
                className={isTransparent ? "text-white/60" : "text-slate-400"}
            />
            <div className="flex items-center gap-1.5 text-[10px] font-black tracking-tighter">
                {LANGUAGES.map((l, i) => {
                    const active = language === l.code;
                    const inactiveColor = isTransparent
                        ? "text-white/40 hover:text-white"
                        : "text-slate-400 hover:text-slate-600";
                    return (
                        <span key={l.code} className="flex items-center gap-1.5">
                            {i > 0 && (
                                <span
                                    aria-hidden="true"
                                    className={isTransparent ? "text-white/10" : "text-slate-200"}
                                >
                                    |
                                </span>
                            )}
                            <button
                                type="button"
                                lang={l.code}
                                aria-label={l.aria}
                                aria-pressed={active}
                                onClick={() => setLanguage(l.code)}
                                className={`transition-all ${
                                    active ? "text-primary scale-110" : inactiveColor
                                }`}
                            >
                                {l.label}
                            </button>
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
