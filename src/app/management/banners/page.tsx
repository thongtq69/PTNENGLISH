"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Image as ImageIcon,
    Save,
    Play,
    Type,
    Link as LinkIcon,
    Bell,
    CheckCircle2,
    Monitor
} from "lucide-react";

export default function BannerManagementPage() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        fetch("/api/site-settings")
            .then(res => res.json())
            .then(data => {
                setSettings(data);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/site-settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-slate-400">Loading site settings...</div>;

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30 bg-[#0F172A]/80 backdrop-blur-md py-4">
                <div>
                    <h2 className="text-2xl font-bold font-heading">Quản lý Banners & Hero</h2>
                    <p className="text-slate-400">Thay đổi video nền, lời chào và các nút bấm trang chủ.</p>
                </div>
                <div className="flex items-center gap-3">
                    {showSuccess && (
                        <motion.span
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-green-400 text-sm font-bold flex items-center gap-2"
                        >
                            <CheckCircle2 size={16} /> Saved Successfully
                        </motion.span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : <><Save size={18} /> Lưu thay đổi</>}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Hero Settings */}
                <div className="space-y-6">
                    <div className="bg-[#1E293B]/30 border border-slate-800 rounded-[2.5rem] p-8">
                        <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-primary">
                            <Monitor size={20} /> Hero Section
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Video Background URL</label>
                                <div className="relative">
                                    <Play size={16} className="absolute left-4 top-4 text-slate-500" />
                                    <input
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:border-primary transition-all font-mono"
                                        value={settings.hero.videoUrl}
                                        onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, videoUrl: e.target.value } })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Cầu khẩu hiệu (Main Title)</label>
                                <textarea
                                    rows={2}
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-4 text-xl font-heading font-medium outline-none focus:border-primary transition-all"
                                    value={settings.hero.title}
                                    onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, title: e.target.value } })}
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Mô tả phụ (Subtitle)</label>
                                <input
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-4 text-sm outline-none focus:border-primary transition-all"
                                    value={settings.hero.subtitle}
                                    onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, subtitle: e.target.value } })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Primary Button</label>
                                    <input
                                        placeholder="Text"
                                        className="w-full bg-slate-800/30 border border-slate-700 rounded-xl px-4 py-2 text-xs outline-none focus:border-primary"
                                        value={settings.hero.primaryCTA.text}
                                        onChange={(e) => {
                                            const ns = { ...settings };
                                            ns.hero.primaryCTA.text = e.target.value;
                                            setSettings(ns);
                                        }}
                                    />
                                    <input
                                        placeholder="Link"
                                        className="w-full bg-slate-800/30 border border-slate-700 rounded-xl px-4 py-2 text-[10px] font-mono outline-none focus:border-primary"
                                        value={settings.hero.primaryCTA.link}
                                        onChange={(e) => {
                                            const ns = { ...settings };
                                            ns.hero.primaryCTA.link = e.target.value;
                                            setSettings(ns);
                                        }}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Secondary Button</label>
                                    <input
                                        placeholder="Text"
                                        className="w-full bg-slate-800/30 border border-slate-700 rounded-xl px-4 py-2 text-xs outline-none focus:border-primary"
                                        value={settings.hero.secondaryCTA.text}
                                        onChange={(e) => {
                                            const ns = { ...settings };
                                            ns.hero.secondaryCTA.text = e.target.value;
                                            setSettings(ns);
                                        }}
                                    />
                                    <input
                                        placeholder="Link"
                                        className="w-full bg-slate-800/30 border border-slate-700 rounded-xl px-4 py-2 text-[10px] font-mono outline-none focus:border-primary"
                                        value={settings.hero.secondaryCTA.link}
                                        onChange={(e) => {
                                            const ns = { ...settings };
                                            ns.hero.secondaryCTA.link = e.target.value;
                                            setSettings(ns);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Announcement Settings */}
                <div className="space-y-6">
                    <div className="bg-[#1E293B]/30 border border-slate-800 rounded-[2.5rem] p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-400">
                                <Bell size={20} /> Announcement Bar
                            </h3>
                            <button
                                onClick={() => setSettings({ ...settings, announcement: { ...settings.announcement, enabled: !settings.announcement.enabled } })}
                                className={`w-12 h-6 rounded-full transition-all relative ${settings.announcement.enabled ? "bg-primary" : "bg-slate-700"}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.announcement.enabled ? "right-1" : "left-1"}`} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Thông báo (Message)</label>
                                <input
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-4 text-sm outline-none focus:border-indigo-400 transition-all font-medium"
                                    value={settings.announcement.text}
                                    onChange={(e) => setSettings({ ...settings, announcement: { ...settings.announcement, text: e.target.value } })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Link liên kết</label>
                                <input
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-4 text-xs font-mono outline-none focus:border-indigo-400 transition-all"
                                    value={settings.announcement.link}
                                    onChange={(e) => setSettings({ ...settings, announcement: { ...settings.announcement, link: e.target.value } })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preview (Simulated) */}
                    <div className="p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 text-center">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 block">Visual Preview</label>
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-800 flex flex-col items-center justify-center p-6 text-center">
                            {/* Hero Content Mockup */}
                            <h4 className="text-white text-lg font-bold mb-2 whitespace-pre-line">{settings.hero.title}</h4>
                            <p className="text-white/60 text-[10px] mb-4">{settings.hero.subtitle}</p>
                            <div className="flex gap-2">
                                <div className="px-3 py-1 bg-primary text-white text-[8px] font-bold rounded-full">{settings.hero.primaryCTA.text}</div>
                                <div className="px-3 py-1 bg-white/10 text-white text-[8px] font-bold rounded-full border border-white/20">{settings.hero.secondaryCTA.text}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
