"use client";

import React, { useState, useEffect } from 'react';
import { Save, Video, Type, Link as LinkIcon, AlertCircle, CheckCircle2, Plus, Trash2, Image as ImageIcon, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomeEditor() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetch('/api/site-settings')
            .then(res => res.json())
            .then(data => {
                setSettings(data);
                setLoading(false);
            })
            .catch(err => {
                setError("Failed to load settings");
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setSuccess(false);
        setError(null);
        try {
            const res = await fetch('/api/site-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                throw new Error("Failed to save");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const updateHero = (field: string, value: any) => {
        setSettings({
            ...settings,
            hero: { ...settings.hero, [field]: value }
        });
    };

    const updateCTA = (type: 'primaryCTA' | 'secondaryCTA', field: string, value: string) => {
        setSettings({
            ...settings,
            hero: {
                ...settings.hero,
                [type]: { ...settings.hero[type], [field]: value }
            }
        });
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
    );

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-heading font-black text-white tracking-tight">Home Page Editor</h1>
                    <p className="text-slate-400 mt-2">Manage your homepage hero, sections, and global brand visibility.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all shadow-xl ${saving ? 'bg-slate-800 text-slate-500' : 'bg-primary text-white hover:scale-105 shadow-primary/20'
                        }`}
                >
                    {saving ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-500 border-t-transparent"></div> : <Save size={20} />}
                    {saving ? 'Saving...' : 'Save All Changes'}
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-400">
                    <AlertCircle size={20} />
                    <p className="font-bold text-sm tracking-wide">{error}</p>
                </div>
            )}

            {success && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4 text-emerald-400">
                    <CheckCircle2 size={20} />
                    <p className="font-bold text-sm tracking-wide">Homepage updated successfully!</p>
                </div>
            )}

            {/* Hero Section */}
            <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-primary text-white shadow-lg">
                        <Video size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white">Hero Section</h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Video background & main messaging</p>
                    </div>
                </div>

                <div className="p-10 space-y-10">
                    {/* Video URL */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-1">
                            <label className="text-sm font-black text-white uppercase tracking-widest block mb-4">Background Video</label>
                            <div className="aspect-video rounded-3xl bg-black overflow-hidden border border-white/10 relative group">
                                {settings.hero.videoUrl && (
                                    <video
                                        src={settings.hero.videoUrl}
                                        className="w-full h-full object-cover opacity-50 transition-opacity group-hover:opacity-80"
                                        autoPlay muted loop
                                    />
                                )}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <Video className="text-white/20" size={48} />
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Cloudinary Video URL</label>
                                <input
                                    type="text"
                                    value={settings.hero.videoUrl}
                                    onChange={(e) => updateHero('videoUrl', e.target.value)}
                                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium"
                                />
                            </div>
                            <p className="text-xs text-slate-500 italic flex items-center gap-2">
                                <AlertCircle size={12} />
                                Input the direct .mp4 link from Cloudinary or your public/assets folder.
                            </p>
                        </div>
                    </div>

                    <hr className="border-white/5" />

                    {/* Titles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Type size={14} className="text-primary" /> Main Title
                            </label>
                            <textarea
                                rows={2}
                                value={settings.hero.title}
                                onChange={(e) => updateHero('title', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-primary font-heading font-black text-xl leading-snug"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                Subheadline
                            </label>
                            <textarea
                                rows={2}
                                value={settings.hero.subtitle}
                                onChange={(e) => updateHero('subtitle', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-slate-300 outline-none focus:ring-2 focus:ring-primary font-medium leading-relaxed"
                            />
                        </div>
                    </div>

                    {/* CTAs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Primary Button</span>
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                                    <LinkIcon size={16} className="text-white" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <input
                                    placeholder="Button Text"
                                    value={settings.hero.primaryCTA.text}
                                    onChange={(e) => updateCTA('primaryCTA', 'text', e.target.value)}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none text-sm font-bold"
                                />
                                <input
                                    placeholder="Link (e.g. /contact)"
                                    value={settings.hero.primaryCTA.link}
                                    onChange={(e) => updateCTA('primaryCTA', 'link', e.target.value)}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-slate-400 outline-none text-sm"
                                />
                            </div>
                        </div>

                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Secondary Button</span>
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                    <LinkIcon size={16} className="text-slate-400" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <input
                                    placeholder="Button Text"
                                    value={settings.hero.secondaryCTA.text}
                                    onChange={(e) => updateCTA('secondaryCTA', 'text', e.target.value)}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none text-sm font-bold"
                                />
                                <input
                                    placeholder="Link"
                                    value={settings.hero.secondaryCTA.link}
                                    onChange={(e) => updateCTA('secondaryCTA', 'link', e.target.value)}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-slate-400 outline-none text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Programs List */}
            <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/20">
                            <GraduationCap size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white">Training Programs</h2>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Featured courses on landing page</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            const newPrograms = [...(settings.programs || []), { name: 'New Program', image: '', color: 'bg-primary' }];
                            setSettings({ ...settings, programs: newPrograms });
                        }}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition-all border border-white/10"
                    >
                        <Plus size={16} /> Add Program
                    </button>
                </div>

                <div className="p-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {(settings.programs || []).map((prog: any, idx: number) => (
                        <motion.div
                            key={idx}
                            layout
                            className="bg-white/5 border border-white/5 rounded-3xl p-6 relative group"
                        >
                            <button
                                onClick={() => {
                                    const filtered = settings.programs.filter((_: any, i: number) => i !== idx);
                                    setSettings({ ...settings, programs: filtered });
                                }}
                                className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="flex gap-4">
                                <div className="w-20 h-24 rounded-xl bg-slate-800 shrink-0 overflow-hidden border border-white/10">
                                    {prog.image ? (
                                        <img src={prog.image} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                                            <ImageIcon size={24} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-4">
                                    <input
                                        value={prog.name}
                                        onChange={(e) => {
                                            const newList = [...settings.programs];
                                            newList[idx].name = e.target.value;
                                            setSettings({ ...settings, programs: newList });
                                        }}
                                        className="w-full bg-transparent border-b border-white/10 outline-none text-white font-bold text-sm focus:border-primary transition-all py-1"
                                    />
                                    <input
                                        placeholder="Image URL"
                                        value={prog.image}
                                        onChange={(e) => {
                                            const newList = [...settings.programs];
                                            newList[idx].image = e.target.value;
                                            setSettings({ ...settings, programs: newList });
                                        }}
                                        className="w-full bg-slate-950/50 border border-white/5 rounded-lg px-3 py-1.5 text-[10px] text-slate-400 outline-none"
                                    />
                                    <select
                                        value={prog.color}
                                        onChange={(e) => {
                                            const newList = [...settings.programs];
                                            newList[idx].color = e.target.value;
                                            setSettings({ ...settings, programs: newList });
                                        }}
                                        className="w-full bg-slate-950/50 border border-white/5 rounded-lg px-3 py-1.5 text-[10px] text-slate-400 outline-none"
                                    >
                                        <option value="bg-primary">PTN Red (Primary)</option>
                                        <option value="bg-accent">PTN Dark (Accent)</option>
                                        <option value="bg-secondary">Yellow (Secondary)</option>
                                        <option value="bg-blue-600">Blue</option>
                                        <option value="bg-slate-900">Black/Dark Slate</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Partners List */}
            <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-emerald-500 text-white shadow-lg">
                            <ImageIcon size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white">Trust Partners</h2>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Logo carousel section</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            const newList = [...(settings.partners || []), { name: 'New Partner', logo: '' }];
                            setSettings({ ...settings, partners: newList });
                        }}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition-all border border-white/10"
                    >
                        <Plus size={16} /> Add Partner
                    </button>
                </div>

                <div className="p-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {(settings.partners || []).map((p: any, idx: number) => (
                        <div key={idx} className="bg-white/5 border border-white/5 rounded-3xl p-6 group relative aspect-square flex flex-col items-center justify-center">
                            <button
                                onClick={() => {
                                    const filtered = settings.partners.filter((_: any, i: number) => i !== idx);
                                    setSettings({ ...settings, partners: filtered });
                                }}
                                className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                            >
                                <Trash2 size={12} />
                            </button>
                            <div className="w-full h-1/2 flex items-center justify-center mb-4 px-2">
                                {p.logo ? (
                                    <img src={p.logo} className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all" />
                                ) : (
                                    <ImageIcon className="text-slate-600" />
                                )}
                            </div>
                            <input
                                value={p.name}
                                onChange={(e) => {
                                    const newList = [...settings.partners];
                                    newList[idx].name = e.target.value;
                                    setSettings({ ...settings, partners: newList });
                                }}
                                className="w-full bg-transparent border-none outline-none text-[10px] font-black uppercase text-center text-slate-500 group-hover:text-white transition-colors"
                            />
                            <input
                                placeholder="Logo URL"
                                value={p.logo}
                                onChange={(e) => {
                                    const newList = [...settings.partners];
                                    newList[idx].logo = e.target.value;
                                    setSettings({ ...settings, partners: newList });
                                }}
                                className="absolute bottom-2 left-2 right-2 bg-slate-950 opacity-0 group-hover:opacity-100 focus:opacity-100 rounded px-2 py-1 text-[8px] text-slate-500 outline-none"
                            />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
