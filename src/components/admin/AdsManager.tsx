"use client";

import React, { useState, useEffect } from 'react';
import {
    Plus, Trash2, Save, Eye, Layout,
    Type, Image as ImageIcon, List, CheckCircle2,
    RefreshCw, Megaphone, ToggleLeft, ToggleRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FileUpload from './shared/FileUpload';

interface AdItem {
    icon: string;
    text: string;
    link: string;
}

interface Advertisement {
    _id?: string;
    name: string;
    isActive: boolean;
    leftImage: string;
    leftLabel: string;
    leftHeading: string;
    leftSubheading: string;
    rightTitle: string;
    rightSubtitle: string;
    rightSlogan: string;
    items: AdItem[];
    showOnce: boolean;
}

const DEFAULT_AD: Advertisement = {
    name: 'New Promotion',
    isActive: false,
    leftImage: '',
    leftLabel: 'ADMISSION 2025',
    leftHeading: 'CHIÊU SINH THÁNG 11 & 12',
    leftSubheading: 'Đồng hành cùng đội ngũ chuyên gia MA.TESOL hàng đầu.',
    rightTitle: 'LỊCH KHAI GIẢNG',
    rightSubtitle: 'Hệ thống đào tạo học thuật chuyên sâu.',
    rightSlogan: '"Quality over speed, mastery over tricks."',
    items: [
        { icon: 'Calendar', text: 'LUYỆN THI IELTS', link: '/courses' },
        { icon: 'MessageSquare', text: 'ENGLISH FOR TEENS', link: '/courses' }
    ],
    showOnce: true
};

export default function AdsManager() {
    const [ads, setAds] = useState<Advertisement[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeIdx, setActiveIdx] = useState<number | null>(null);

    useEffect(() => {
        fetch('/api/advertisements')
            .then(res => res.json())
            .then(data => {
                setAds(data);
                setLoading(false);
            });
    }, []);

    const handleSave = async (ad: Advertisement) => {
        setSaving(true);
        try {
            const res = await fetch('/api/advertisements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ad)
            });
            const savedAd = await res.json();

            const newAds = [...ads];
            if (activeIdx !== null && ads[activeIdx]._id === savedAd._id) {
                newAds[activeIdx] = savedAd;
            } else if (activeIdx === ads.length) {
                newAds[activeIdx] = savedAd;
            } else {
                // Refresh list if toggle caused deactivations
                const refreshRes = await fetch('/api/advertisements');
                const refreshData = await refreshRes.json();
                setAds(refreshData);
                setSaving(false);
                return;
            }

            setAds(newAds);
            alert("Promotion saved and synced!");
        } catch (e) {
            alert("Failed to save");
        } finally {
            setSaving(false);
        }
    };

    const deleteAd = async (id: string, idx: number) => {
        if (!confirm("Delete this promotion permanently?")) return;
        try {
            await fetch(`/api/advertisements?id=${id}`, { method: 'DELETE' });
            setAds(ads.filter((_, i) => i !== idx));
            setActiveIdx(null);
        } catch (e) {
            alert("Delete failed");
        }
    };

    if (loading) return (
        <div className="h-96 flex flex-col items-center justify-center text-slate-500 gap-4">
            <RefreshCw className="animate-spin" />
            <p className="font-black uppercase tracking-widest text-[10px]">Loading Marketing Engine...</p>
        </div>
    );

    const activeAd = activeIdx !== null ? ads[activeIdx] : null;

    return (
        <div className="space-y-12 pb-32">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-heading font-black text-white tracking-tight">Advertisement Center</h1>
                    <p className="text-slate-500 mt-2">Manage popup notifications and promotional campaigns.</p>
                </div>
                <button
                    onClick={() => {
                        setAds([...ads, { ...DEFAULT_AD }]);
                        setActiveIdx(ads.length);
                    }}
                    className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20"
                >
                    <Plus size={18} /> New Campaign
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* List */}
                <div className="lg:col-span-1 space-y-4">
                    {ads.map((ad, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIdx(idx)}
                            className={`w-full text-left p-6 rounded-[2rem] border transition-all relative overflow-hidden group ${activeIdx === idx ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/10'}`}
                        >
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <p className={`text-[8px] font-black uppercase tracking-widest mb-1 ${activeIdx === idx ? 'text-white/60' : 'text-primary'}`}>
                                        {ad.isActive ? '● Live Now' : 'Draft'}
                                    </p>
                                    <h3 className="font-bold truncate max-w-[150px]">{ad.name}</h3>
                                </div>
                                {ad.isActive && <Megaphone size={16} className="animate-bounce" />}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Editor */}
                <div className="lg:col-span-3 bg-slate-900 border border-white/5 rounded-[3rem] p-12 min-h-[600px] relative overflow-hidden shadow-2xl">
                    <AnimatePresence mode="wait">
                        {activeAd ? (
                            <motion.div
                                key={activeIdx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-12"
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex-1 max-w-md">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Campaign Name</label>
                                        <input
                                            value={activeAd.name}
                                            onChange={e => {
                                                const newList = [...ads];
                                                newList[activeIdx!].name = e.target.value;
                                                setAds(newList);
                                            }}
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white text-xl font-black focus:border-primary/50 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleSave(activeAd)}
                                            disabled={saving}
                                            className="bg-white text-slate-900 px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary hover:text-white transition-all shadow-xl"
                                        >
                                            {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                                            Save Changes
                                        </button>
                                        {activeAd._id && (
                                            <button
                                                onClick={() => deleteAd(activeAd._id!, activeIdx!)}
                                                className="p-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                                            >
                                                <Trash2 size={24} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    {/* Content Config */}
                                    <div className="space-y-8">
                                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6">
                                            <h4 className="text-xs font-black text-white uppercase flex items-center gap-2">
                                                <ToggleRight size={16} className="text-primary" /> Status & Logic
                                            </h4>
                                            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl">
                                                <span className="text-xs font-bold text-slate-400">Set as Active Campaign</span>
                                                <button
                                                    onClick={() => {
                                                        const newList = [...ads];
                                                        newList[activeIdx!].isActive = !newList[activeIdx!].isActive;
                                                        setAds(newList);
                                                    }}
                                                    className={`transition-all ${activeAd.isActive ? 'text-primary' : 'text-slate-600'}`}
                                                >
                                                    {activeAd.isActive ? <ToggleRight size={48} /> : <ToggleLeft size={48} />}
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl">
                                                <span className="text-xs font-bold text-slate-400">Show only once per session</span>
                                                <button
                                                    onClick={() => {
                                                        const newList = [...ads];
                                                        newList[activeIdx!].showOnce = !newList[activeIdx!].showOnce;
                                                        setAds(newList);
                                                    }}
                                                    className={`transition-all ${activeAd.showOnce ? 'text-emerald-500' : 'text-slate-600'}`}
                                                >
                                                    {activeAd.showOnce ? <CheckCircle2 size={24} /> : <div className="w-6 h-6 border-2 border-slate-700 rounded-full" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6">
                                            <h4 className="text-xs font-black text-white uppercase flex items-center gap-2">
                                                <ImageIcon size={16} className="text-primary" /> Visual Assets
                                            </h4>
                                            <FileUpload
                                                mode="image"
                                                label="Hero Image (Left Side)"
                                                value={activeAd.leftImage}
                                                onChange={url => {
                                                    const newList = [...ads];
                                                    newList[activeIdx!].leftImage = url;
                                                    setAds(newList);
                                                }}
                                                folder="ads"
                                            />
                                        </div>
                                    </div>

                                    {/* Content Detail */}
                                    <div className="space-y-8">
                                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6">
                                            <h4 className="text-xs font-black text-white uppercase flex items-center gap-2">
                                                <Type size={16} className="text-primary" /> Left Detail
                                            </h4>
                                            <div className="space-y-4">
                                                <input placeholder="Side Tag / Label (e.g. ADMISSION 2025)" value={activeAd.leftLabel} onChange={e => { const nl = [...ads]; nl[activeIdx!].leftLabel = e.target.value; setAds(nl); }} className="w-full bg-slate-950 border border-white/5 rounded-none px-4 py-3 text-xs text-white" />
                                                <input placeholder="Heading" value={activeAd.leftHeading} onChange={e => { const nl = [...ads]; nl[activeIdx!].leftHeading = e.target.value; setAds(nl); }} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-xs text-white" />
                                                <textarea placeholder="Subheading" value={activeAd.leftSubheading} onChange={e => { const nl = [...ads]; nl[activeIdx!].leftSubheading = e.target.value; setAds(nl); }} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-xs text-white h-20" />
                                            </div>
                                        </div>

                                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6">
                                            <h4 className="text-xs font-black text-white uppercase flex items-center gap-2">
                                                <Layout size={16} className="text-primary" /> Right Detail
                                            </h4>
                                            <div className="space-y-4">
                                                <input placeholder="Title" value={activeAd.rightTitle} onChange={e => { const nl = [...ads]; nl[activeIdx!].rightTitle = e.target.value; setAds(nl); }} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-xs text-white" />
                                                <input placeholder="Subtitle" value={activeAd.rightSubtitle} onChange={e => { const nl = [...ads]; nl[activeIdx!].rightSubtitle = e.target.value; setAds(nl); }} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-xs text-white" />
                                                <input placeholder="Slogan" value={activeAd.rightSlogan} onChange={e => { const nl = [...ads]; nl[activeIdx!].rightSlogan = e.target.value; setAds(nl); }} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-xs text-white" />
                                            </div>
                                        </div>

                                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6">
                                            <h4 className="text-xs font-black text-white uppercase flex items-center gap-2">
                                                <List size={16} className="text-primary" /> Feature List
                                            </h4>
                                            <div className="space-y-4">
                                                {activeAd.items.map((item, i) => (
                                                    <div key={i} className="flex gap-2 items-center">
                                                        <select value={item.icon} onChange={e => { const nl = [...ads]; nl[activeIdx!].items[i].icon = e.target.value; setAds(nl); }} className="bg-slate-950 border border-white/5 rounded-xl px-2 py-3 text-[10px] text-white">
                                                            <option value="Calendar">Calendar</option>
                                                            <option value="Clock">Clock</option>
                                                            <option value="MessageSquare">Message</option>
                                                            <option value="BookOpen">Book</option>
                                                            <option value="Check">Check</option>
                                                        </select>
                                                        <input placeholder="Text" value={item.text} onChange={e => { const nl = [...ads]; nl[activeIdx!].items[i].text = e.target.value; setAds(nl); }} className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-[10px] text-white" />
                                                        <button onClick={() => { const nl = [...ads]; nl[activeIdx!].items = nl[activeIdx!].items.filter((_, idx) => idx !== i); setAds(nl); }} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={14} /></button>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => {
                                                        const nl = [...ads];
                                                        nl[activeIdx!].items.push({ icon: 'Check', text: 'New Feature', link: '#' });
                                                        setAds(nl);
                                                    }}
                                                    className="w-full py-3 border border-dashed border-white/10 rounded-xl text-[10px] text-slate-600 hover:text-white transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Plus size={12} /> Add Item
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-slate-700 mb-6 border border-dashed border-white/10">
                                    <Megaphone size={40} />
                                </div>
                                <h3 className="text-xl font-heading font-black text-slate-500">Select a campaign to manage</h3>
                                <p className="text-xs text-slate-600 mt-2 uppercase tracking-widest">Only one active campaign can be live at a time</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
