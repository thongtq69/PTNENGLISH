"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Monitor, Smartphone, Type, RotateCcw, Minus, Plus } from 'lucide-react';

export interface FontSizeValue {
    desktop: number;
    mobile: number;
}

interface InlineFontSizeProps {
    value: FontSizeValue;
    onChange: (val: FontSizeValue) => void;
    defaultDesktop?: number;
    defaultMobile?: number;
    min?: number;
    max?: number;
}

/**
 * InlineFontSize — Nút nhỏ gọn hiển thị ngay bên cạnh label,
 * click mở popup chỉnh Desktop/Mobile font size.
 */
export default function InlineFontSize({
    value,
    onChange,
    defaultDesktop = 16,
    defaultMobile = 14,
    min = 8,
    max = 120,
}: InlineFontSizeProps) {
    const [open, setOpen] = useState(false);
    const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
    const popupRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);

    const currentSize = device === 'desktop' ? value.desktop : value.mobile;
    const isDefault = value.desktop === defaultDesktop && value.mobile === defaultMobile;
    const isChanged = !isDefault;

    // Close popup on outside click
    useEffect(() => {
        if (!open) return;
        const handleClick = (e: MouseEvent) => {
            if (
                popupRef.current && !popupRef.current.contains(e.target as Node) &&
                btnRef.current && !btnRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    const updateSize = (newSize: number) => {
        const clamped = Math.min(max, Math.max(min, newSize));
        if (device === 'desktop') {
            onChange({ ...value, desktop: clamped });
        } else {
            onChange({ ...value, mobile: clamped });
        }
    };

    const reset = () => {
        onChange({ desktop: defaultDesktop, mobile: defaultMobile });
    };

    const QUICK = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80];

    return (
        <div className="relative inline-flex">
            {/* Trigger Button — tiny icon */}
            <button
                ref={btnRef}
                onClick={() => setOpen(!open)}
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold transition-all border ${isChanged
                    ? 'bg-primary/20 border-primary/30 text-primary'
                    : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/20'
                    }`}
                title="Chỉnh font size (Desktop & Mobile)"
            >
                <Type size={10} />
                <span>{value.desktop}/{value.mobile}</span>
            </button>

            {/* Popup */}
            {open && (
                <div
                    ref={popupRef}
                    className="absolute top-full left-0 mt-1 z-[100] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-4 w-[280px] space-y-3 animate-in fade-in slide-in-from-top-1 duration-200"
                >
                    {/* Device Toggle */}
                    <div className="flex gap-1 p-0.5 bg-slate-950 rounded-lg">
                        <button
                            onClick={() => setDevice('desktop')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[9px] font-black uppercase tracking-wider transition-all ${device === 'desktop'
                                ? 'bg-white/10 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <Monitor size={11} />
                            Desktop
                            <span className={`px-1 py-0.5 rounded text-[8px] ${device === 'desktop' ? 'bg-primary/20 text-primary' : 'bg-white/5 text-slate-600'}`}>
                                {value.desktop}px
                            </span>
                        </button>
                        <button
                            onClick={() => setDevice('mobile')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[9px] font-black uppercase tracking-wider transition-all ${device === 'mobile'
                                ? 'bg-white/10 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <Smartphone size={11} />
                            Mobile
                            <span className={`px-1 py-0.5 rounded text-[8px] ${device === 'mobile' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-slate-600'}`}>
                                {value.mobile}px
                            </span>
                        </button>
                    </div>

                    {/* Slider Row */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => updateSize(currentSize - 1)}
                            className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <Minus size={11} />
                        </button>
                        <input
                            type="range"
                            min={min}
                            max={max}
                            value={currentSize}
                            onChange={e => updateSize(parseInt(e.target.value))}
                            className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer
                                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
                                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg
                                [&::-webkit-slider-thumb]:shadow-primary/30 [&::-webkit-slider-thumb]:cursor-pointer"
                        />
                        <button
                            onClick={() => updateSize(currentSize + 1)}
                            className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <Plus size={11} />
                        </button>
                        <div className="flex items-center bg-slate-950 border border-white/10 rounded-md overflow-hidden">
                            <input
                                type="number"
                                value={currentSize}
                                onChange={e => updateSize(parseInt(e.target.value) || 0)}
                                className="w-10 bg-transparent text-center text-[11px] font-bold text-white outline-none py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                min={min}
                                max={max}
                            />
                            <span className="text-[8px] text-slate-500 pr-1.5">px</span>
                        </div>
                    </div>

                    {/* Quick Presets */}
                    <div className="flex flex-wrap gap-1">
                        {QUICK.filter(s => s >= min && s <= max).map(size => (
                            <button
                                key={size}
                                onClick={() => updateSize(size)}
                                className={`px-1.5 py-0.5 rounded text-[8px] font-bold transition-all ${currentSize === size
                                    ? 'bg-primary text-white'
                                    : 'bg-white/5 text-slate-500 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>

                    {/* Reset */}
                    {isChanged && (
                        <button
                            onClick={reset}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/5 hover:bg-primary/20 text-slate-400 hover:text-primary text-[9px] font-bold uppercase tracking-wider transition-all"
                        >
                            <RotateCcw size={10} />
                            Reset mặc định ({defaultDesktop}/{defaultMobile})
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
