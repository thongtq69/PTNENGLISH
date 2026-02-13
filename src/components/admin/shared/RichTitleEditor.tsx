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
        hasBreak: false,
        prefixNowrap: false,
        highlightNowrap: true, // Default true for highlight
        suffixNowrap: false
    });

    // Parse HTML string into parts
    useEffect(() => {
        if (!value) return;

        const spanRegex = /<span [^>]*class=['"]([^'"]*)['"][^>]*>(.*?)<\/span>/;
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
        let highlightNowrap = true;

        const spanMatch = tempValue.match(spanRegex);
        if (spanMatch) {
            highlight = spanMatch[2];
            highlightNowrap = spanMatch[1].includes('whitespace-nowrap');
            const splitBySpan = tempValue.split(spanMatch[0]);
            prefix = splitBySpan[0].trim();
            suffix = splitBySpan[1]?.trim() || '';
        }

        const newState = {
            prefix,
            highlight,
            suffix,
            line2,
            hasBreak,
            prefixNowrap: prefix.includes('whitespace-nowrap'), // This is simplified, actually prefix isn't wrapped in span usually
            highlightNowrap,
            suffixNowrap: suffix.includes('whitespace-nowrap')
        };

        setParts(prev => {
            if (prev.prefix === newState.prefix &&
                prev.highlight === newState.highlight &&
                prev.suffix === newState.suffix &&
                prev.line2 === newState.line2 &&
                prev.hasBreak === newState.hasBreak &&
                prev.highlightNowrap === newState.highlightNowrap) {
                return prev;
            }
            return newState;
        });
    }, [value]);

    const updateValue = (newParts: any) => {
        setParts(newParts);

        let html = '';

        if (newParts.prefix) {
            html += newParts.prefixNowrap ? `<span class='whitespace-nowrap'>${newParts.prefix}</span>` : newParts.prefix;
        }

        if (newParts.highlight) {
            const classes = `text-primary font-bold ${newParts.highlightNowrap ? 'whitespace-nowrap' : ''}`.trim();
            html += ` <span class='${classes}'>${newParts.highlight}</span>`;
        }

        if (newParts.suffix) {
            html += ` ${newParts.suffixNowrap ? `<span class='whitespace-nowrap'>${newParts.suffix}</span>` : newParts.suffix}`;
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
        <div className={`${compact ? 'p-4' : 'p-6'} bg-slate-900 border border-white/10 rounded-3xl space-y-5 shadow-2xl`}>
            {label && (
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Type size={16} className="text-primary" />
                        <label className="text-[11px] font-black text-white uppercase tracking-[0.2em]">{label}</label>
                    </div>
                </div>
            )}

            <div className={`grid grid-cols-1 ${compact ? '' : 'md:grid-cols-2'} gap-6`}>
                {/* Prefix */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phần đầu</label>
                        <button
                            onClick={(e) => { e.preventDefault(); updateValue({ ...parts, prefixNowrap: !parts.prefixNowrap }); }}
                            className={`text-[9px] font-black px-2 py-0.5 rounded transition-all ${parts.prefixNowrap ? 'bg-primary text-white' : 'bg-slate-800 text-slate-500'}`}
                            title="Ngăn không cho chữ tự động xuống dòng"
                        >
                            NOWRAP
                        </button>
                    </div>
                    <input
                        value={parts.prefix}
                        onChange={e => updateValue({ ...parts, prefix: e.target.value })}
                        placeholder="Text..."
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
                    />
                </div>

                {/* Highlight */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black text-primary uppercase tracking-widest">Nổi bật (Đỏ)</label>
                        <button
                            onClick={(e) => { e.preventDefault(); updateValue({ ...parts, highlightNowrap: !parts.highlightNowrap }); }}
                            className={`text-[9px] font-black px-2 py-0.5 rounded transition-all ${parts.highlightNowrap ? 'bg-primary text-white' : 'bg-slate-800 text-slate-500'}`}
                            title="Ngăn không cho chữ tự động xuống dòng"
                        >
                            NOWRAP
                        </button>
                    </div>
                    <input
                        value={parts.highlight}
                        onChange={e => updateValue({ ...parts, highlight: e.target.value })}
                        placeholder="Highlight..."
                        className="w-full bg-slate-950 border border-primary/30 rounded-xl px-4 py-3 text-primary font-black text-sm outline-none focus:ring-2 focus:ring-primary transition-all shadow-lg shadow-primary/5"
                    />
                </div>

                {/* Suffix */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phần sau</label>
                        <button
                            onClick={(e) => { e.preventDefault(); updateValue({ ...parts, suffixNowrap: !parts.suffixNowrap }); }}
                            className={`text-[9px] font-black px-2 py-0.5 rounded transition-all ${parts.suffixNowrap ? 'bg-primary text-white' : 'bg-slate-800 text-slate-500'}`}
                            title="Ngăn không cho chữ tự động xuống dòng"
                        >
                            NOWRAP
                        </button>
                    </div>
                    <input
                        value={parts.suffix}
                        onChange={e => updateValue({ ...parts, suffix: e.target.value })}
                        placeholder="..."
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-slate-400 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
                    />
                </div>

                {/* Break & Line 2 */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dòng 2</label>
                            <span className="text-[8px] text-slate-600 bg-white/5 px-1.5 rounded">BREAK</span>
                        </div>
                        <button
                            onClick={(e) => { e.preventDefault(); updateValue({ ...parts, hasBreak: !parts.hasBreak }); }}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded text-[9px] font-black transition-all ${parts.hasBreak ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-800 text-slate-500'}`}
                        >
                            <AlignLeft size={10} /> {parts.hasBreak ? 'CÓ NGẮT DÒNG' : 'LIỀN MẠCH'}
                        </button>
                    </div>
                    <input
                        value={parts.line2}
                        onChange={e => updateValue({ ...parts, line2: e.target.value })}
                        placeholder="Nội dung dòng tiếp theo..."
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-slate-300 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
                    />
                </div>
            </div>

            {!compact && (
                <div className="pt-5 border-t border-white/5 flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                            <Info size={16} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-black text-white uppercase tracking-wider">Hướng dẫn tinh tế</h4>
                            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                                • Bật <span className="text-primary font-bold">NOWRAP</span> để giữ các từ đi cùng nhau (không bị ngắt giữa chữ).<br />
                                • Dùng <span className="text-indigo-400 font-bold">CÓ NGẮT DÒNG</span> để chủ động xuống hàng tại vị trí mong muốn.<br />
                                • <span className="text-slate-300 font-bold">Mã của bạn:</span> <code className="text-primary/70 bg-black/40 px-2 py-1 rounded-lg ml-1">{value || '...'}</code>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
