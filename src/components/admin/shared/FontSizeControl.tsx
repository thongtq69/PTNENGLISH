"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Monitor, Smartphone, Type, RotateCcw, Minus, Plus, Lock, Unlock } from 'lucide-react';

export interface FontSizeValue {
    desktop: number; // in px
    mobile: number;  // in px
}

interface FontSizeControlProps {
    label: string;
    value: FontSizeValue;
    onChange: (val: FontSizeValue) => void;
    defaultDesktop?: number;
    defaultMobile?: number;
    min?: number;
    max?: number;
    step?: number;
    compact?: boolean;
}

const PRESET_SIZES = [10, 11, 12, 13, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96];

export default function FontSizeControl({
    label,
    value,
    onChange,
    defaultDesktop = 16,
    defaultMobile = 14,
    min = 8,
    max = 120,
    step = 1,
    compact = false
}: FontSizeControlProps) {
    const [activeDevice, setActiveDevice] = useState<'desktop' | 'mobile'>('desktop');
    const [linked, setLinked] = useState(false);

    const currentSize = activeDevice === 'desktop' ? value.desktop : value.mobile;

    const updateSize = (newSize: number) => {
        const clamped = Math.min(max, Math.max(min, newSize));
        if (activeDevice === 'desktop') {
            if (linked) {
                // Maintain the ratio between desktop and mobile
                const ratio = value.mobile / (value.desktop || 1);
                onChange({ desktop: clamped, mobile: Math.round(clamped * ratio) });
            } else {
                onChange({ ...value, desktop: clamped });
            }
        } else {
            if (linked) {
                const ratio = value.desktop / (value.mobile || 1);
                onChange({ desktop: Math.round(clamped * ratio), mobile: clamped });
            } else {
                onChange({ ...value, mobile: clamped });
            }
        }
    };

    const resetToDefault = () => {
        onChange({ desktop: defaultDesktop, mobile: defaultMobile });
    };

    const isDefault = value.desktop === defaultDesktop && value.mobile === defaultMobile;

    if (compact) {
        return (
            <div className="flex items-center gap-2 bg-slate-950/50 border border-white/5 rounded-lg px-2 py-1.5">
                <Type size={10} className="text-slate-600 shrink-0" />
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider shrink-0 w-12 truncate" title={label}>{label}</span>

                {/* Device Toggle */}
                <div className="flex border border-white/10 rounded overflow-hidden shrink-0">
                    <button
                        onClick={() => setActiveDevice('desktop')}
                        className={`p-0.5 transition-all ${activeDevice === 'desktop' ? 'bg-primary text-white' : 'text-slate-600 hover:text-slate-400'}`}
                        title="Desktop"
                    >
                        <Monitor size={10} />
                    </button>
                    <button
                        onClick={() => setActiveDevice('mobile')}
                        className={`p-0.5 transition-all ${activeDevice === 'mobile' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:text-slate-400'}`}
                        title="Mobile"
                    >
                        <Smartphone size={10} />
                    </button>
                </div>

                {/* Value */}
                <div className="flex items-center gap-1">
                    <button onClick={() => updateSize(currentSize - step)} className="text-slate-600 hover:text-white transition-colors">
                        <Minus size={10} />
                    </button>
                    <input
                        type="number"
                        value={currentSize}
                        onChange={e => updateSize(parseInt(e.target.value) || 0)}
                        className="w-8 bg-transparent text-center text-[10px] font-bold text-white outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        min={min}
                        max={max}
                    />
                    <span className="text-[8px] text-slate-600">px</span>
                    <button onClick={() => updateSize(currentSize + step)} className="text-slate-600 hover:text-white transition-colors">
                        <Plus size={10} />
                    </button>
                </div>

                {!isDefault && (
                    <button onClick={resetToDefault} className="text-slate-600 hover:text-primary transition-colors" title="Reset to default">
                        <RotateCcw size={9} />
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Type size={14} className="text-primary" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                    {!isDefault && (
                        <button
                            onClick={resetToDefault}
                            className="text-[8px] font-black text-slate-600 hover:text-primary transition-colors flex items-center gap-1 px-2 py-0.5 rounded bg-white/5"
                            title="Reset to default"
                        >
                            <RotateCcw size={9} /> RESET
                        </button>
                    )}
                    <button
                        onClick={() => setLinked(!linked)}
                        className={`p-1 rounded transition-all ${linked ? 'bg-primary/20 text-primary' : 'bg-white/5 text-slate-600'}`}
                        title={linked ? "Desktop & Mobile linked" : "Desktop & Mobile independent"}
                    >
                        {linked ? <Lock size={10} /> : <Unlock size={10} />}
                    </button>
                </div>
            </div>

            {/* Device Tabs */}
            <div className="flex gap-1 p-0.5 bg-slate-900 rounded-lg">
                <button
                    onClick={() => setActiveDevice('desktop')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[9px] font-black uppercase tracking-wider transition-all ${activeDevice === 'desktop'
                        ? 'bg-white/10 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-300'
                        }`}
                >
                    <Monitor size={12} />
                    Desktop
                    <span className={`px-1.5 py-0.5 rounded text-[8px] ${activeDevice === 'desktop' ? 'bg-primary/20 text-primary' : 'bg-white/5 text-slate-600'}`}>
                        {value.desktop}px
                    </span>
                </button>
                <button
                    onClick={() => setActiveDevice('mobile')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[9px] font-black uppercase tracking-wider transition-all ${activeDevice === 'mobile'
                        ? 'bg-white/10 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-300'
                        }`}
                >
                    <Smartphone size={12} />
                    Mobile
                    <span className={`px-1.5 py-0.5 rounded text-[8px] ${activeDevice === 'mobile' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-slate-600'}`}>
                        {value.mobile}px
                    </span>
                </button>
            </div>

            {/* Slider + Input */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => updateSize(currentSize - step)}
                        className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <Minus size={12} />
                    </button>

                    <div className="flex-1 relative">
                        <input
                            type="range"
                            min={min}
                            max={max}
                            step={step}
                            value={currentSize}
                            onChange={e => updateSize(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer
                                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg
                                [&::-webkit-slider-thumb]:shadow-primary/30 [&::-webkit-slider-thumb]:cursor-pointer
                                [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:transition-transform"
                        />
                    </div>

                    <button
                        onClick={() => updateSize(currentSize + step)}
                        className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <Plus size={12} />
                    </button>

                    <div className="flex items-center bg-slate-900 border border-white/10 rounded-lg overflow-hidden">
                        <input
                            type="number"
                            value={currentSize}
                            onChange={e => updateSize(parseInt(e.target.value) || 0)}
                            className="w-12 bg-transparent text-center text-xs font-bold text-white outline-none py-1.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            min={min}
                            max={max}
                        />
                        <span className="text-[9px] font-bold text-slate-500 pr-2">px</span>
                    </div>
                </div>

                {/* Quick Preset Sizes */}
                <div className="flex flex-wrap gap-1">
                    {PRESET_SIZES.filter(s => s >= min && s <= max).slice(0, 10).map(size => (
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
            </div>

            {/* Info badges */}
            <div className="flex items-center gap-3 pt-1 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                    <Monitor size={10} className="text-slate-600" />
                    <span className="text-[9px] text-slate-500">
                        Desktop: <span className={`font-bold ${value.desktop !== defaultDesktop ? 'text-primary' : 'text-slate-400'}`}>{value.desktop}px</span>
                    </span>
                </div>
                <div className="w-px h-3 bg-white/10"></div>
                <div className="flex items-center gap-1.5">
                    <Smartphone size={10} className="text-slate-600" />
                    <span className="text-[9px] text-slate-500">
                        Mobile: <span className={`font-bold ${value.mobile !== defaultMobile ? 'text-blue-400' : 'text-slate-400'}`}>{value.mobile}px</span>
                    </span>
                </div>
                {linked && (
                    <>
                        <div className="w-px h-3 bg-white/10"></div>
                        <span className="text-[8px] text-primary/50 font-bold flex items-center gap-1"><Lock size={8} /> LINKED</span>
                    </>
                )}
            </div>
        </div>
    );
}
