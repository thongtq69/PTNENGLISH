"use client";

import React, { useState, useEffect } from 'react';
import { Type, CheckSquare, AlignLeft, Info } from 'lucide-react';

interface RichTitleEditorProps {
    value: string;
    onChange: (newValue: string) => void;
    label?: string;
    compact?: boolean;
}

export default function RichTitleEditor({ value, onChange, label, compact }: RichTitleEditorProps) {
    const [parts, setParts] = useState({
        prefix: '',
        highlight: '',
        suffix: '',
        line2: '',
        hasBreak: false
    });

    // Parse HTML string into parts
    useEffect(() => {
        if (!value) return;

        // Simple regex to extract common patterns
        // Pattern: prefix <span class='...'>highlight</span> suffix <br /> line2
        const spanRegex = /<span [^>]*>(.*?)<\/span>/;
        const breakRegex = /<br\s*\/?>/;

        let tempValue = value;
        let line2 = '';
        let hasBreak = false;

        if (breakRegex.test(tempValue)) {
            const splitContent = tempValue.split(breakRegex);
            tempValue = splitContent[0].trim();
            line2 = (splitContent[1] || '').trim();
            hasBreak = true;
        }

        let prefix = tempValue;
        let highlight = '';
        let suffix = '';

        const spanMatch = tempValue.match(spanRegex);
        if (spanMatch) {
            highlight = spanMatch[1];
            const splitBySpan = tempValue.split(spanMatch[0]);
            prefix = splitBySpan[0].trim();
            suffix = splitBySpan[1]?.trim() || '';
        }

        setParts({ prefix, highlight, suffix, line2, hasBreak });
    }, [value]);

    const updateValue = (newParts: any) => {
        setParts(newParts);

        let html = newParts.prefix;
        if (newParts.highlight) {
            html += ` <span class='text-primary font-bold'>${newParts.highlight}</span>`;
        }
        if (newParts.suffix) {
            html += ` ${newParts.suffix}`;
        }
        if (newParts.hasBreak) {
            html += ` <br />`;
        }
        if (newParts.line2) {
            html += ` ${newParts.line2}`;
        }

        onChange(html.trim());
    };

    return (
        <div className={`${compact ? 'p-4' : 'p-6'} bg-slate-950/50 border border-white/5 rounded-3xl space-y-4`}>
            {label && (
                <div className="flex items-center gap-2 mb-2">
                    <Type size={14} className="text-primary" />
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
                </div>
            )}

            <div className={`grid grid-cols-1 ${compact ? '' : 'md:grid-cols-2'} gap-4`}>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-600 uppercase ml-2">Phần đầu</label>
                    <input
                        value={parts.prefix}
                        onChange={e => updateValue({ ...parts, prefix: e.target.value })}
                        placeholder="Text..."
                        className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-white text-xs outline-none focus:border-primary/50"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-primary uppercase ml-2">Nổi bật (Đỏ)</label>
                    <input
                        value={parts.highlight}
                        onChange={e => updateValue({ ...parts, highlight: e.target.value })}
                        placeholder="Highlight..."
                        className="w-full bg-slate-900 border border-primary/20 rounded-xl px-4 py-2 text-primary font-bold text-xs outline-none focus:border-primary"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-600 uppercase ml-2">Phần sau</label>
                    <input
                        value={parts.suffix}
                        onChange={e => updateValue({ ...parts, suffix: e.target.value })}
                        className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-slate-400 text-xs outline-none"
                    />
                </div>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between ml-2">
                        <label className="text-[9px] font-bold text-slate-600 uppercase">Dòng 2</label>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                updateValue({ ...parts, hasBreak: !parts.hasBreak });
                            }}
                            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-black transition-all ${parts.hasBreak ? 'bg-primary text-white' : 'bg-slate-800 text-slate-500'}`}
                        >
                            <AlignLeft size={8} /> {parts.hasBreak ? 'BR' : 'NO BR'}
                        </button>
                    </div>
                    <input
                        value={parts.line2}
                        onChange={e => updateValue({ ...parts, line2: e.target.value })}
                        placeholder="Xuống hàng..."
                        className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-slate-300 text-xs outline-none"
                    />
                </div>
            </div>

            {!compact && (
                <div className="pt-4 border-t border-white/5 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                        <Info size={14} />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                            <span className="text-slate-300 font-bold">Xem trước mã (tự động):</span> <code className="text-primary/70 bg-black/30 px-2 py-0.5 rounded">{value || '...'}</code>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
