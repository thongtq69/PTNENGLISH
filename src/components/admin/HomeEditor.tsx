"use client";

import React, { useState, useEffect } from 'react';
import { Save, Video, Type, Link as LinkIcon, AlertCircle, CheckCircle2, Plus, Trash2, Image as ImageIcon, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import RichTitleEditor from './shared/RichTitleEditor';
import FileUpload from './shared/FileUpload';
import InlineFontSize from './shared/InlineFontSize';
import { useFontSizeEditor } from '@/hooks/useFontSizeEditor';

export default function HomeEditor() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const fs = useFontSizeEditor('home');

    useEffect(() => {
        fetch('/api/site-settings', { cache: 'no-store' })
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
            hero: { ...(settings.hero || {}), [field]: value }
        });
    };

    const updateCTA = (type: 'primaryCTA' | 'secondaryCTA', field: string, value: string) => {
        setSettings({
            ...settings,
            hero: {
                ...(settings.hero || {}),
                [type]: { ...(settings.hero?.[type] || {}), [field]: value }
            }
        });
    };

    const updateSection = (section: string, field: string, value: string) => {
        setSettings({
            ...settings,
            [section]: { ...(settings[section] || {}), [field]: value }
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
                {fs.saving && (
                    <span className="text-[10px] text-primary font-bold animate-pulse ml-2">💾 Font size đang lưu...</span>
                )}
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
            <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
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
                    {/* Video URL & Upload */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="text-sm font-black text-white uppercase tracking-widest block mb-4">Background Preview</label>
                            <div className="aspect-video rounded-3xl bg-black overflow-hidden border border-white/10 relative group">
                                {settings.hero.videoUrl && (
                                    <video
                                        key={settings.hero.videoUrl}
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
                        <div className="space-y-6">
                            <FileUpload
                                mode="video"
                                label="Hero Video Background"
                                value={settings.hero.videoUrl}
                                onChange={(url) => updateHero('videoUrl', url)}
                                folder="home/hero"
                            />
                            <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-4">
                                <AlertCircle size={18} className="text-primary shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-500 leading-relaxed italic">
                                    Dùng Cloudinary Video để đảm bảo tốc độ tải trang tối ưu. Video nên có thời lượng ngắn (15-30s) và tắt tiếng.
                                </p>
                            </div>
                        </div>
                    </div>

                    <hr className="border-white/5" />

                    {/* Titles - Bilingual */}
                    <div className="space-y-10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Font Size: Tiêu đề Hero</span>
                            <InlineFontSize
                                value={fs.getFontSize('heroTitle')}
                                onChange={(v) => fs.setFontSize('heroTitle', v)}
                                defaultDesktop={fs.getDefault('heroTitle').desktop}
                                defaultMobile={fs.getDefault('heroTitle').mobile}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <RichTitleEditor
                                    value={settings.hero.title}
                                    onChange={(val) => updateHero('title', val)}
                                    label="Main Headline (VN)"
                                />
                            </div>
                            <div className="space-y-4">
                                <RichTitleEditor
                                    value={settings.hero.titleEn}
                                    onChange={(val) => updateHero('titleEn', val)}
                                    label="Main Headline (EN)"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    Subheadline (VN)
                                    <InlineFontSize
                                        value={fs.getFontSize('heroSubtitle')}
                                        onChange={(v) => fs.setFontSize('heroSubtitle', v)}
                                        defaultDesktop={fs.getDefault('heroSubtitle').desktop}
                                        defaultMobile={fs.getDefault('heroSubtitle').mobile}
                                    />
                                </label>
                                <textarea
                                    rows={2}
                                    value={settings.hero.subtitle}
                                    onChange={(e) => updateHero('subtitle', e.target.value)}
                                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-slate-300 outline-none focus:ring-2 focus:ring-primary font-medium leading-relaxed h-[130px]"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    Subheadline (EN)
                                </label>
                                <textarea
                                    rows={2}
                                    value={settings.hero.subtitleEn}
                                    onChange={(e) => updateHero('subtitleEn', e.target.value)}
                                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-slate-300 outline-none focus:ring-2 focus:ring-primary font-medium leading-relaxed h-[130px]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* CTAs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                    Primary Button
                                    <InlineFontSize
                                        value={fs.getFontSize('heroCTA')}
                                        onChange={(v) => fs.setFontSize('heroCTA', v)}
                                        defaultDesktop={fs.getDefault('heroCTA').desktop}
                                        defaultMobile={fs.getDefault('heroCTA').mobile}
                                    />
                                </span>
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

            {/* Introduction Section */}
            <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-blue-500 text-white shadow-lg">
                        <Type size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white">Introduction Section</h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Main center introduction titles</p>
                    </div>
                </div>
                <div className="p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                Section Badge
                                <InlineFontSize
                                    value={fs.getFontSize('introBadge')}
                                    onChange={(v) => fs.setFontSize('introBadge', v)}
                                    defaultDesktop={fs.getDefault('introBadge').desktop}
                                    defaultMobile={fs.getDefault('introBadge').mobile}
                                />
                            </label>
                            <input
                                value={settings.intro?.badge || ''}
                                onChange={e => updateSection('intro', 'badge', e.target.value)}
                                placeholder="e.g. Hệ Thống Đào Tạo Academic Master"
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="space-y-4">
                            <RichTitleEditor
                                label="Main Title"
                                value={settings.intro?.title || ''}
                                onChange={val => updateSection('intro', 'title', val)}
                                compact
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            Description
                            <InlineFontSize
                                value={fs.getFontSize('introDesc')}
                                onChange={(v) => fs.setFontSize('introDesc', v)}
                                defaultDesktop={fs.getDefault('introDesc').desktop}
                                defaultMobile={fs.getDefault('introDesc').mobile}
                            />
                        </label>
                        <textarea
                            rows={3}
                            value={settings.intro?.description || ''}
                            onChange={e => updateSection('intro', 'description', e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-primary h-32"
                        />
                    </div>
                    <div className="w-1/2 space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">About Button Text</label>
                        <input
                            value={settings.intro?.aboutBtn || ''}
                            onChange={e => updateSection('intro', 'aboutBtn', e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>
            </section>

            {/* Digital Campus Section */}
            <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-indigo-500 text-white shadow-lg">
                        <LinkIcon size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white">Academic System & Mock Test</h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">LMS portal & test system messaging</p>
                    </div>
                </div>
                <div className="p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                Section Badge
                                <InlineFontSize
                                    value={fs.getFontSize('campusBadge')}
                                    onChange={(v) => fs.setFontSize('campusBadge', v)}
                                    defaultDesktop={fs.getDefault('campusBadge').desktop}
                                    defaultMobile={fs.getDefault('campusBadge').mobile}
                                />
                            </label>
                            <input
                                value={settings.campus?.badge || ''}
                                onChange={e => updateSection('campus', 'badge', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">System Name</label>
                            <input
                                value={settings.campus?.system || ''}
                                onChange={e => updateSection('campus', 'system', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Font Size: Campus Title</span>
                            <InlineFontSize
                                value={fs.getFontSize('campusTitle')}
                                onChange={(v) => fs.setFontSize('campusTitle', v)}
                                defaultDesktop={fs.getDefault('campusTitle').desktop}
                                defaultMobile={fs.getDefault('campusTitle').mobile}
                            />
                        </div>
                        <RichTitleEditor
                            label="Section Title"
                            value={settings.campus?.title || ''}
                            onChange={val => updateSection('campus', 'title', val)}
                            compact
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            Description
                            <InlineFontSize
                                value={fs.getFontSize('campusDesc')}
                                onChange={(v) => fs.setFontSize('campusDesc', v)}
                                defaultDesktop={fs.getDefault('campusDesc').desktop}
                                defaultMobile={fs.getDefault('campusDesc').mobile}
                            />
                        </label>
                        <textarea
                            rows={3}
                            value={settings.campus?.description || ''}
                            onChange={e => updateSection('campus', 'description', e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none h-24"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                LMS Button Text
                                <InlineFontSize
                                    value={fs.getFontSize('campusBtn')}
                                    onChange={(v) => fs.setFontSize('campusBtn', v)}
                                    defaultDesktop={fs.getDefault('campusBtn').desktop}
                                    defaultMobile={fs.getDefault('campusBtn').mobile}
                                />
                            </label>
                            <input
                                value={settings.campus?.lmsBtn || ''}
                                onChange={e => updateSection('campus', 'lmsBtn', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Mock Test Button Text</label>
                            <input
                                value={settings.campus?.testBtn || ''}
                                onChange={e => updateSection('campus', 'testBtn', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Faculty Section */}
            <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-teal-500 text-white shadow-lg">
                        <GraduationCap size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white">Faculty Highlight</h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Founders & teachers section</p>
                    </div>
                </div>
                <div className="p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                Section Badge
                                <InlineFontSize
                                    value={fs.getFontSize('facultyBadge')}
                                    onChange={(v) => fs.setFontSize('facultyBadge', v)}
                                    defaultDesktop={fs.getDefault('facultyBadge').desktop}
                                    defaultMobile={fs.getDefault('facultyBadge').mobile}
                                />
                            </label>
                            <input
                                value={settings.faculty?.badge || ''}
                                onChange={e => updateSection('faculty', 'badge', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                            />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Font Size: Faculty Title</span>
                                <InlineFontSize
                                    value={fs.getFontSize('facultyTitle')}
                                    onChange={(v) => fs.setFontSize('facultyTitle', v)}
                                    defaultDesktop={fs.getDefault('facultyTitle').desktop}
                                    defaultMobile={fs.getDefault('facultyTitle').mobile}
                                />
                            </div>
                            <RichTitleEditor
                                label="Section Title"
                                value={settings.faculty?.title || ''}
                                onChange={val => updateSection('faculty', 'title', val)}
                                compact
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            Description
                            <InlineFontSize
                                value={fs.getFontSize('facultyDesc')}
                                onChange={(v) => fs.setFontSize('facultyDesc', v)}
                                defaultDesktop={fs.getDefault('facultyDesc').desktop}
                                defaultMobile={fs.getDefault('facultyDesc').mobile}
                            />
                        </label>
                        <textarea
                            rows={3}
                            value={settings.faculty?.description || ''}
                            onChange={e => updateSection('faculty', 'description', e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none h-24"
                        />
                    </div>
                    <div className="w-1/2 space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            Button Text
                            <InlineFontSize
                                value={fs.getFontSize('facultyBtn')}
                                onChange={(v) => fs.setFontSize('facultyBtn', v)}
                                defaultDesktop={fs.getDefault('facultyBtn').desktop}
                                defaultMobile={fs.getDefault('facultyBtn').mobile}
                            />
                        </label>
                        <input
                            value={settings.faculty?.btn || ''}
                            onChange={e => updateSection('faculty', 'btn', e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                        />
                    </div>
                </div>
            </section>

            {/* Blog Section Titles */}
            <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-pink-500 text-white shadow-lg">
                        <ImageIcon size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white">Home Blog Section</h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Titles for latest news section</p>
                    </div>
                </div>
                <div className="p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                Section Badge
                                <InlineFontSize
                                    value={fs.getFontSize('blogBadge')}
                                    onChange={(v) => fs.setFontSize('blogBadge', v)}
                                    defaultDesktop={fs.getDefault('blogBadge').desktop}
                                    defaultMobile={fs.getDefault('blogBadge').mobile}
                                />
                            </label>
                            <input
                                value={settings.homeBlog?.badge || ''}
                                onChange={e => updateSection('homeBlog', 'badge', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                            />
                        </div>
                        <div className="space-y-4 md:col-span-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                Section Title (supports &amp; highlight)
                                <InlineFontSize
                                    value={fs.getFontSize('blogTitle')}
                                    onChange={(v) => fs.setFontSize('blogTitle', v)}
                                    defaultDesktop={fs.getDefault('blogTitle').desktop}
                                    defaultMobile={fs.getDefault('blogTitle').mobile}
                                />
                            </label>
                            <input
                                value={settings.homeBlog?.title || ''}
                                onChange={e => updateSection('homeBlog', 'title', e.target.value)}
                                placeholder="e.g. Tin tức & Học thuật"
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                            />
                        </div>
                    </div>
                    <div className="w-1/3 space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">View All Text</label>
                        <input
                            value={settings.homeBlog?.viewAll || ''}
                            onChange={e => updateSection('homeBlog', 'viewAll', e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                        />
                    </div>
                </div>
            </section>

            {/* Hall of Fame Titles */}
            <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-amber-500 text-white shadow-lg">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white">Hall of Fame Section</h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Student achievements main titles</p>
                    </div>
                </div>
                <div className="p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                Section Badge
                                <InlineFontSize
                                    value={fs.getFontSize('hallOfFameBadge')}
                                    onChange={(v) => fs.setFontSize('hallOfFameBadge', v)}
                                    defaultDesktop={fs.getDefault('hallOfFameBadge').desktop}
                                    defaultMobile={fs.getDefault('hallOfFameBadge').mobile}
                                />
                            </label>
                            <input
                                value={settings.hallOfFame?.badge || ''}
                                onChange={e => updateSection('hallOfFame', 'badge', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                Title Start
                                <InlineFontSize
                                    value={fs.getFontSize('hallOfFameTitle')}
                                    onChange={(v) => fs.setFontSize('hallOfFameTitle', v)}
                                    defaultDesktop={fs.getDefault('hallOfFameTitle').desktop}
                                    defaultMobile={fs.getDefault('hallOfFameTitle').mobile}
                                />
                            </label>
                            <input
                                value={settings.hallOfFame?.title || ''}
                                onChange={e => updateSection('hallOfFame', 'title', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Title Highlight</label>
                            <input
                                value={settings.hallOfFame?.titleHighlight || ''}
                                onChange={e => updateSection('hallOfFame', 'titleHighlight', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Title End</label>
                            <input
                                value={settings.hallOfFame?.titleEnd || ''}
                                onChange={e => updateSection('hallOfFame', 'titleEnd', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                Desc Start
                                <InlineFontSize
                                    value={fs.getFontSize('hallOfFameDesc')}
                                    onChange={(v) => fs.setFontSize('hallOfFameDesc', v)}
                                    defaultDesktop={fs.getDefault('hallOfFameDesc').desktop}
                                    defaultMobile={fs.getDefault('hallOfFameDesc').mobile}
                                />
                            </label>
                            <input
                                value={settings.hallOfFame?.description || ''}
                                onChange={e => updateSection('hallOfFame', 'description', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Desc Highlight</label>
                            <input
                                value={settings.hallOfFame?.descriptionHighlight || ''}
                                onChange={e => updateSection('hallOfFame', 'descriptionHighlight', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Desc End</label>
                            <input
                                value={settings.hallOfFame?.descriptionEnd || ''}
                                onChange={e => updateSection('hallOfFame', 'descriptionEnd', e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Programs List */}
            <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/20">
                            <GraduationCap size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white">Training Programs</h2>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-2">
                                Featured courses on landing page
                                <InlineFontSize
                                    value={fs.getFontSize('programName')}
                                    onChange={(v) => fs.setFontSize('programName', v)}
                                    defaultDesktop={fs.getDefault('programName').desktop}
                                    defaultMobile={fs.getDefault('programName').mobile}
                                />
                            </p>
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
                                className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white z-10"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="flex gap-4 items-center">
                                <div className="flex-1 space-y-2">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tiếng Việt</label>
                                        <input
                                            value={prog.name}
                                            onChange={(e) => {
                                                const newList = [...settings.programs];
                                                newList[idx].name = e.target.value;
                                                setSettings({ ...settings, programs: newList });
                                            }}
                                            className="w-full bg-transparent border-b border-white/10 outline-none text-white font-bold text-sm focus:border-primary transition-all py-1 placeholder:text-slate-600"
                                            placeholder="Tên chương trình (VN)"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">English</label>
                                        <input
                                            value={prog.nameEn || ''}
                                            onChange={(e) => {
                                                const newList = [...settings.programs];
                                                newList[idx].nameEn = e.target.value;
                                                setSettings({ ...settings, programs: newList });
                                            }}
                                            className="w-full bg-transparent border-b border-white/10 outline-none text-slate-300 font-bold text-sm focus:border-primary transition-all py-1 placeholder:text-slate-600"
                                            placeholder="Program Name (EN)"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 focus-within:border-primary transition-all mt-2">
                                        <LinkIcon size={12} className="text-slate-600" />
                                        <input
                                            value={prog.link}
                                            onChange={(e) => {
                                                const newList = [...settings.programs];
                                                newList[idx].link = e.target.value;
                                                setSettings({ ...settings, programs: newList });
                                            }}
                                            className="flex-1 bg-transparent border-none outline-none text-slate-400 text-[10px] placeholder:text-slate-700"
                                            placeholder="Navigation Link (/courses/...)"
                                        />
                                    </div>
                                </div>
                            </div>
                            <FileUpload
                                label="Program Card Image — hiển thị tỉ lệ 3:4 (portrait)"
                                value={prog.image}
                                onChange={(url) => {
                                    const newList = [...settings.programs];
                                    newList[idx].image = url;
                                    setSettings({ ...settings, programs: newList });
                                }}
                                folder="home/programs"
                                aspect={3 / 4}
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
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Partners List */}
            <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
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
                    <div className="flex items-center gap-4">
                        <div className="space-x-2 flex items-center bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 translate-y-0.5">
                            <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap flex items-center gap-1">
                                Badge:
                                <InlineFontSize
                                    value={fs.getFontSize('partnersBadge')}
                                    onChange={(v) => fs.setFontSize('partnersBadge', v)}
                                    defaultDesktop={fs.getDefault('partnersBadge').desktop}
                                    defaultMobile={fs.getDefault('partnersBadge').mobile}
                                />
                            </label>
                            <input
                                value={settings.partnersSection?.badge || ''}
                                onChange={e => updateSection('partnersSection', 'badge', e.target.value)}
                                placeholder="Đối tác chiến lược..."
                                className="bg-transparent border-none outline-none text-[10px] text-white w-32"
                            />
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
                </div>

                <div className="p-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {(settings.partners || []).map((p: any, idx: number) => (
                        <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-4 group relative flex flex-col items-center">
                            <button
                                onClick={() => {
                                    const filtered = settings.partners.filter((_: any, i: number) => i !== idx);
                                    setSettings({ ...settings, partners: filtered });
                                }}
                                className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white z-10"
                            >
                                <Trash2 size={12} />
                            </button>

                            <div className="w-full h-16 bg-white rounded-xl mb-4 flex items-center justify-center p-2 overflow-hidden border border-white/5">
                                {p.logo ? (
                                    <img src={p.logo} alt={p.name} className="max-h-full max-w-full object-contain transition-all" />
                                ) : (
                                    <ImageIcon size={20} className="text-slate-200" />
                                )}
                            </div>

                            <input
                                value={p.name}
                                onChange={(e) => {
                                    const newList = [...settings.partners];
                                    newList[idx].name = e.target.value;
                                    setSettings({ ...settings, partners: newList });
                                }}
                                className="w-full bg-transparent border-none outline-none text-[10px] font-black uppercase text-center text-slate-500 group-hover:text-white transition-colors mb-1"
                                placeholder="Partner Name"
                            />
                            <input
                                value={p.link}
                                onChange={(e) => {
                                    const newList = [...settings.partners];
                                    newList[idx].link = e.target.value;
                                    setSettings({ ...settings, partners: newList });
                                }}
                                className="w-full bg-transparent border-none outline-none text-[8px] text-center text-slate-600 focus:text-primary transition-colors mb-4"
                                placeholder="Link..."
                            />
                            <div className="w-full">
                                <FileUpload
                                    label="Logo (không crop — logo hiển thị object-contain)"
                                    compact
                                    value={p.logo}
                                    onChange={(url) => {
                                        const newList = [...settings.partners];
                                        newList[idx].logo = url;
                                        setSettings({ ...settings, partners: newList });
                                    }}
                                    folder="home/partners"
                                    noCrop
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-indigo-500 text-white shadow-lg">
                        <Type size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white">PTN Philosophy</h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Educational focus and mission text</p>
                    </div>
                </div>
                <div className="p-10 space-y-8">
                    <div className="space-y-4">
                        <RichTitleEditor
                            label="Philosophy Section Title"
                            value={settings.philosophyTitle || ''}
                            onChange={val => setSettings({ ...settings, philosophyTitle: val })}
                            compact
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                            Philosophy Text (Vietnamse)
                            <InlineFontSize
                                value={fs.getFontSize('philosophyText')}
                                onChange={(v) => fs.setFontSize('philosophyText', v)}
                                defaultDesktop={fs.getDefault('philosophyText').desktop}
                                defaultMobile={fs.getDefault('philosophyText').mobile}
                            />
                        </label>
                        <textarea
                            rows={4}
                            value={settings.philosophy || ''}
                            onChange={(e) => setSettings({ ...settings, philosophy: e.target.value })}
                            placeholder="Xuất phát từ niềm tin của các nhà sáng lập..."
                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-slate-300 outline-none focus:ring-2 focus:ring-primary font-medium leading-relaxed"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
