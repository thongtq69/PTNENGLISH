"use client";

import React, { useState, useEffect } from 'react';
import {
    Plus, Trash2, User, Users, Briefcase, GraduationCap,
    Heart, MessageSquare, Laptop, Globe, ClipboardCheck,
    ArrowRight, BookOpen, Compass, ShieldCheck, FileText,
    Lock, UserCheck, Layout, Book, Star, Save, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RichTitleEditor from './shared/RichTitleEditor';
import FileUpload from './shared/FileUpload';
import InlineFontSize from './shared/InlineFontSize';
import { useFontSizeEditor } from '@/hooks/useFontSizeEditor';

const ICON_OPTIONS = [
    { name: 'BookOpen', icon: <BookOpen size={16} /> },
    { name: 'Users', icon: <Users size={16} /> },
    { name: 'Compass', icon: <Compass size={16} /> },
    { name: 'ShieldCheck', icon: <ShieldCheck size={16} /> },
    { name: 'FileText', icon: <FileText size={16} /> },
    { name: 'Lock', icon: <Lock size={16} /> },
    { name: 'UserCheck', icon: <UserCheck size={16} /> },
    { name: 'GraduationCap', icon: <GraduationCap size={16} /> },
    { name: 'Heart', icon: <Heart size={16} /> },
    { name: 'MessageSquare', icon: <MessageSquare size={16} /> },
    { name: 'Laptop', icon: <Laptop size={16} /> },
    { name: 'Globe', icon: <Globe size={16} /> },
    { name: 'ClipboardCheck', icon: <ClipboardCheck size={16} /> },
    { name: 'ArrowRight', icon: <ArrowRight size={16} /> }
];

const TABS = [
    { id: 'hero', name: 'Hero Banner', icon: <Layout size={18} /> },
    { id: 'story', name: 'Câu chuyện', icon: <Book size={18} /> },
    { id: 'teachers', name: 'Đội ngũ giáo viên', icon: <Users size={18} /> },
    { id: 'philosophy', name: 'Triết lý & Giá trị', icon: <Star size={18} /> },
    { id: 'differences', name: 'Sự khác biệt', icon: <Info size={18} /> },
    { id: 'policies', name: 'Chính sách', icon: <ShieldCheck size={18} /> },
];

export default function AboutEditor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('hero');
    const fs = useFontSizeEditor('aboutUs');

    useEffect(() => {
        fetch('/api/about-us')
            .then(res => res.json())
            .then(d => {
                const normalized = {
                    hero: d.hero || { title: '', subtitle: '', highlight: '' },
                    story: d.story || { title: '', quote: '', text: '', image: '' },
                    teachers: d.teachers || [],
                    philosophy: d.philosophy || [],
                    values: d.values || [],
                    differences: d.differences || [],
                    policies: d.policies || []
                };
                setData(normalized);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        if (!data) return;
        setSaving(true);
        try {
            await fetch('/api/about-us', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            alert("Lưu thành công!");
        } catch (e) {
            alert("Lỗi khi lưu dữ liệu");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
    );

    if (!data) return <div className="text-white">Không tìm thấy dữ liệu.</div>;

    return (
        <div className="space-y-8 pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-heading font-black text-white tracking-tight">About Us Management</h1>
                    <p className="text-slate-400 mt-2">Cấu hình chi tiết giao diện và nội dung trang Về chúng tôi.</p>
                </div>
                <div className="flex items-center gap-4">
                    {fs.saving && <span className="text-xs text-primary animate-pulse">💾 Font size đang lưu...</span>}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-primary text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20"
                    >
                        <Save size={20} />
                        {saving ? "Đang lưu..." : "Lưu Thay Đổi"}
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 p-1.5 bg-slate-900 border border-white/5 rounded-2xl overflow-x-auto no-scrollbar">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shrink-0 ${activeTab === tab.id ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:bg-white/5"}`}
                    >
                        {tab.icon}
                        <span className="whitespace-nowrap">{tab.name}</span>
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* HERO TAB */}
                    {activeTab === 'hero' && (
                        <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
                            <h2 className="text-xl font-black text-white flex items-center gap-3">
                                <span className="w-8 h-1 bg-primary rounded-full"></span>
                                Hero Page Header
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <RichTitleEditor
                                        label={<span className="flex items-center gap-2">Headline (Main Title) <InlineFontSize value={fs.getFontSize('heroTitle')} onChange={(v) => fs.setFontSize('heroTitle', v)} defaultDesktop={fs.getDefault('heroTitle').desktop} defaultMobile={fs.getDefault('heroTitle').mobile} /></span>}
                                        value={data.hero.title}
                                        onChange={val => setData({ ...data, hero: { ...data.hero, title: val } })}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">Subtitle / Highlight <InlineFontSize value={fs.getFontSize('heroSubtitle')} onChange={(v) => fs.setFontSize('heroSubtitle', v)} defaultDesktop={fs.getDefault('heroSubtitle').desktop} defaultMobile={fs.getDefault('heroSubtitle').mobile} /></label>
                                    <input
                                        value={data.hero.subtitle}
                                        onChange={e => setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })}
                                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-slate-300 font-bold focus:border-primary/50 outline-none"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">Quotes / Mission Highlight <InlineFontSize value={fs.getFontSize('heroHighlight')} onChange={(v) => fs.setFontSize('heroHighlight', v)} defaultDesktop={fs.getDefault('heroHighlight').desktop} defaultMobile={fs.getDefault('heroHighlight').mobile} /></label>
                                    <input
                                        value={data.hero.highlight}
                                        onChange={e => setData({ ...data, hero: { ...data.hero, highlight: e.target.value } })}
                                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-primary font-bold focus:border-primary/50 outline-none italic"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STORY TAB */}
                    {activeTab === 'story' && (
                        <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 space-y-10 shadow-2xl">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <h2 className="text-xl font-black text-white flex items-center gap-3">
                                        <span className="w-8 h-1 bg-primary rounded-full"></span>
                                        Văn bản nội dung
                                    </h2>

                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block flex items-center gap-2">Tiêu đề phụ (Subtitle) <InlineFontSize value={fs.getFontSize('storySubtitle')} onChange={(v) => fs.setFontSize('storySubtitle', v)} defaultDesktop={fs.getDefault('storySubtitle').desktop} defaultMobile={fs.getDefault('storySubtitle').mobile} /></label>
                                            <input
                                                value={data.story.subtitle || ''}
                                                onChange={e => setData({ ...data, story: { ...data.story, subtitle: e.target.value } })}
                                                placeholder="Ví dụ: Câu Chuyện Hình Thành"
                                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-primary/50"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block flex items-center gap-2">Đoạn mở đầu (Paragraph 1) <InlineFontSize value={fs.getFontSize('storyText')} onChange={(v) => fs.setFontSize('storyText', v)} defaultDesktop={fs.getDefault('storyText').desktop} defaultMobile={fs.getDefault('storyText').mobile} /></label>
                                            <textarea
                                                value={data.story.p1 || ''}
                                                onChange={e => setData({ ...data, story: { ...data.story, p1: e.target.value } })}
                                                rows={2}
                                                placeholder="PTN English bắt đầu từ những lớp học tâm huyết..."
                                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-slate-300 text-sm outline-none focus:border-primary/50"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block flex items-center gap-2">Điểm nhấn giảng viên (Highlight Teachers) <InlineFontSize value={fs.getFontSize('storyTeachers')} onChange={(v) => fs.setFontSize('storyTeachers', v)} defaultDesktop={fs.getDefault('storyTeachers').desktop} defaultMobile={fs.getDefault('storyTeachers').mobile} /></label>
                                            <input
                                                value={data.story.teachers || ''}
                                                onChange={e => setData({ ...data, story: { ...data.story, teachers: e.target.value } })}
                                                placeholder="Ví dụ: Phong – Trâm – Nhân."
                                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-primary font-black outline-none focus:border-primary/50"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block flex items-center gap-2">Đoạn nội dung chính (Paragraph 2) <InlineFontSize value={fs.getFontSize('storyText')} onChange={(v) => fs.setFontSize('storyText', v)} defaultDesktop={fs.getDefault('storyText').desktop} defaultMobile={fs.getDefault('storyText').mobile} /></label>
                                            <textarea
                                                value={data.story.p2 || ''}
                                                onChange={e => setData({ ...data, story: { ...data.story, p2: e.target.value } })}
                                                rows={3}
                                                placeholder="Chúng tôi hiểu người học thực sự cần nền tảng vững chắc..."
                                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-slate-300 text-sm outline-none focus:border-primary/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-6">
                                        <h3 className="text-white font-bold text-xs uppercase tracking-widest">Định nghĩa PTN Box</h3>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">Giải nghĩa từ viết tắt (Acronym)</label>
                                                <input
                                                    value={data.story.ptnAcronym || ''}
                                                    onChange={e => setData({ ...data, story: { ...data.story, ptnAcronym: e.target.value } })}
                                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-slate-300 text-xs outline-none focus:border-primary/50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">Giải nghĩa tinh thần (Spirit)</label>
                                                <input
                                                    value={data.story.ptnSpirit || ''}
                                                    onChange={e => setData({ ...data, story: { ...data.story, ptnSpirit: e.target.value } })}
                                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-slate-300 text-xs outline-none focus:border-primary/50"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block flex items-center gap-2">Trích dẫn (Quote) <InlineFontSize value={fs.getFontSize('storyQuote')} onChange={(v) => fs.setFontSize('storyQuote', v)} defaultDesktop={fs.getDefault('storyQuote').desktop} defaultMobile={fs.getDefault('storyQuote').mobile} /></label>
                                        <textarea
                                            value={data.story.quote || ''}
                                            onChange={e => setData({ ...data, story: { ...data.story, quote: e.target.value } })}
                                            rows={2}
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-amber-500 italic font-medium outline-none focus:border-primary/50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <h2 className="text-xl font-black text-white flex items-center gap-3">
                                        <span className="w-8 h-1 bg-primary rounded-full"></span>
                                        Hình ảnh & Chỉ số
                                    </h2>

                                    <div className="space-y-6">
                                        <FileUpload
                                            label="Hình ảnh chính"
                                            value={data.story.image || ''}
                                            onChange={(url) => setData({ ...data, story: { ...data.story, image: url } })}
                                            folder="about/story"
                                            aspect={4 / 3}
                                        />

                                        <div className="p-8 bg-slate-950 border border-white/5 rounded-[2rem] space-y-6">
                                            <h3 className="text-white font-bold text-xs uppercase tracking-widest">Huy hiệu kinh nghiệm</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">Giá trị (VD: 25+)</label>
                                                    <input
                                                        value={data.story.expValue || ''}
                                                        onChange={e => setData({ ...data, story: { ...data.story, expValue: e.target.value } })}
                                                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-primary font-black lg:text-2xl outline-none focus:border-primary/50"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">Nhãn (Label)</label>
                                                    <input
                                                        value={data.story.expBadge || ''}
                                                        onChange={e => setData({ ...data, story: { ...data.story, expBadge: e.target.value } })}
                                                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white font-bold text-xs outline-none focus:border-primary/50 uppercase"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TEACHERS TAB */}
                    {activeTab === 'teachers' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-black text-white px-2">Expert Faculty Pool ({data.teachers?.length})</h2>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 text-[9px] text-slate-500">
                                        <span>Tên</span><InlineFontSize value={fs.getFontSize('teacherName')} onChange={(v) => fs.setFontSize('teacherName', v)} defaultDesktop={fs.getDefault('teacherName').desktop} defaultMobile={fs.getDefault('teacherName').mobile} />
                                        <span>Certs</span><InlineFontSize value={fs.getFontSize('teacherCerts')} onChange={(v) => fs.setFontSize('teacherCerts', v)} defaultDesktop={fs.getDefault('teacherCerts').desktop} defaultMobile={fs.getDefault('teacherCerts').mobile} />
                                        <span>Exp</span><InlineFontSize value={fs.getFontSize('teacherExp')} onChange={(v) => fs.setFontSize('teacherExp', v)} defaultDesktop={fs.getDefault('teacherExp').desktop} defaultMobile={fs.getDefault('teacherExp').mobile} />
                                        <span>Desc</span><InlineFontSize value={fs.getFontSize('teacherDesc')} onChange={(v) => fs.setFontSize('teacherDesc', v)} defaultDesktop={fs.getDefault('teacherDesc').desktop} defaultMobile={fs.getDefault('teacherDesc').mobile} />
                                    </div>
                                    <button
                                        onClick={() => setData({ ...data, teachers: [{ name: 'New Expert', certs: '', exp: '', desc: '', image: '' }, ...data.teachers] })}
                                        className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all font-heading"
                                    >
                                        Add New Member
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {data.teachers.map((teacher: any, idx: number) => (
                                    <div key={idx} className={`bg-slate-900 border ${idx < 3 ? 'border-primary/30 shadow-lg shadow-primary/5' : 'border-white/5'} p-6 rounded-[2rem] flex flex-col lg:flex-row gap-6 group hover:border-primary/50 transition-all`}>
                                        <div className="relative">
                                            <div className="w-24 h-24 bg-slate-800 rounded-2xl shrink-0 overflow-hidden border border-white/5">
                                                {teacher.image ? <img src={teacher.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-600"><Plus /></div>}
                                            </div>
                                            {idx < 3 && (
                                                <div className="absolute -top-2 -right-2 bg-primary text-white text-[8px] font-black uppercase tracking-tighter px-2 py-1 rounded-md shadow-lg">
                                                    PTN Founder
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <input placeholder="Tên giáo viên" value={teacher.name} onChange={e => {
                                                    const list = [...data.teachers];
                                                    list[idx].name = e.target.value;
                                                    setData({ ...data, teachers: list });
                                                }} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-white font-bold text-sm" />
                                                <input placeholder="Bằng cấp / Chức danh" value={teacher.certs} onChange={e => {
                                                    const list = [...data.teachers];
                                                    list[idx].certs = e.target.value;
                                                    setData({ ...data, teachers: list });
                                                }} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-primary font-bold text-[10px]" />
                                                <FileUpload
                                                    label="Teacher Photo"
                                                    value={teacher.image}
                                                    onChange={(url) => {
                                                        const list = [...data.teachers];
                                                        list[idx].image = url;
                                                        setData({ ...data, teachers: list });
                                                    }}
                                                    folder="teachers"
                                                    aspect={3 / 4}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <input placeholder="Kinh nghiệm (VD: 20+ năm...)" value={teacher.exp} onChange={e => {
                                                    const list = [...data.teachers];
                                                    list[idx].exp = e.target.value;
                                                    setData({ ...data, teachers: list });
                                                }} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-slate-300 text-xs" />
                                                <textarea placeholder="Mô tả chi tiết kỹ năng / thành tựu" value={teacher.desc} rows={2} onChange={e => {
                                                    const list = [...data.teachers];
                                                    list[idx].desc = e.target.value;
                                                    setData({ ...data, teachers: list });
                                                }} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-slate-500 text-[10px] leading-relaxed" />
                                            </div>
                                        </div>
                                        <div className="flex flex-row lg:flex-col justify-end gap-2 shrink-0">
                                            <button
                                                onClick={() => setData({ ...data, teachers: data.teachers.filter((_: any, i: number) => i !== idx) })}
                                                className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PHILOSOPHY & VALUES TAB */}
                    {activeTab === 'philosophy' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Philosophy */}
                            <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-2xl h-fit">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-black text-white flex items-center gap-2">Triết lý Giáo dục <InlineFontSize value={fs.getFontSize('philosophyTitle')} onChange={(v) => fs.setFontSize('philosophyTitle', v)} defaultDesktop={fs.getDefault('philosophyTitle').desktop} defaultMobile={fs.getDefault('philosophyTitle').mobile} /> <InlineFontSize value={fs.getFontSize('philosophyDesc')} onChange={(v) => fs.setFontSize('philosophyDesc', v)} defaultDesktop={fs.getDefault('philosophyDesc').desktop} defaultMobile={fs.getDefault('philosophyDesc').mobile} /></h2>
                                    <button onClick={() => setData({ ...data, philosophy: [...data.philosophy, { title: 'Triết lý mới', desc: '', icon: 'BookOpen' }] })} className="text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 bg-primary/5 px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-all">+ Thêm mới</button>
                                </div>
                                <div className="space-y-4">
                                    {data.philosophy.map((phi: any, idx: number) => (
                                        <div key={idx} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl relative group hover:border-white/10 transition-all">
                                            <div className="flex flex-col sm:flex-row gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest block">Icon</label>
                                                    <select value={phi.icon} onChange={e => {
                                                        const list = [...data.philosophy];
                                                        list[idx].icon = e.target.value;
                                                        setData({ ...data, philosophy: list });
                                                    }} className="w-full bg-slate-950 border border-white/5 rounded-lg text-primary text-xs p-3 font-bold appearance-none cursor-pointer">
                                                        {ICON_OPTIONS.map(opt => <option key={opt.name} value={opt.name}>{opt.name}</option>)}
                                                    </select>
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <input value={phi.title} onChange={e => {
                                                        const list = [...data.philosophy];
                                                        list[idx].title = e.target.value;
                                                        setData({ ...data, philosophy: list });
                                                    }} className="w-full bg-transparent border-none text-white font-black text-base px-0 outline-none" placeholder="Tiêu đề (Học thuật...)" />
                                                    <textarea value={phi.desc} onChange={e => {
                                                        const list = [...data.philosophy];
                                                        list[idx].desc = e.target.value;
                                                        setData({ ...data, philosophy: list });
                                                    }} className="w-full bg-transparent border-none text-slate-500 text-xs leading-relaxed px-0 outline-none" rows={2} placeholder="Mô tả cụ thể ý nghĩa của triết lý..." />
                                                </div>
                                            </div>
                                            <button onClick={() => setData({ ...data, philosophy: data.philosophy.filter((_: any, i: number) => i !== idx) })} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Core Values */}
                            <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-2xl h-fit">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-black text-white flex items-center gap-2">Giá trị Cốt lõi <InlineFontSize value={fs.getFontSize('valueTitle')} onChange={(v) => fs.setFontSize('valueTitle', v)} defaultDesktop={fs.getDefault('valueTitle').desktop} defaultMobile={fs.getDefault('valueTitle').mobile} /> <InlineFontSize value={fs.getFontSize('valueDesc')} onChange={(v) => fs.setFontSize('valueDesc', v)} defaultDesktop={fs.getDefault('valueDesc').desktop} defaultMobile={fs.getDefault('valueDesc').mobile} /></h2>
                                    <button onClick={() => setData({ ...data, values: [...data.values, { title: 'Giá trị mới', desc: '' }] })} className="text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 bg-primary/5 px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-all">+ Thêm mới</button>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {data.values.map((val: any, idx: number) => (
                                        <div key={idx} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl relative group hover:border-white/10 transition-all">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-black text-primary/40">0{idx + 1}</span>
                                                    <input value={val.title} onChange={e => {
                                                        const list = [...data.values];
                                                        list[idx].title = e.target.value;
                                                        setData({ ...data, values: list });
                                                    }} className="w-full bg-transparent border-none text-white font-black text-base uppercase tracking-tight px-0 outline-none" placeholder="Tiêu đề (Tận tâm...)" />
                                                </div>
                                                <textarea value={val.desc} onChange={e => {
                                                    const list = [...data.values];
                                                    list[idx].desc = e.target.value;
                                                    setData({ ...data, values: list });
                                                }} className="w-full bg-transparent border-none text-slate-500 text-xs leading-relaxed px-0 outline-none" rows={2} placeholder="Nội dung diễn giải giá trị..." />
                                            </div>
                                            <button onClick={() => setData({ ...data, values: data.values.filter((_: any, i: number) => i !== idx) })} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DIFFERENCES TAB */}
                    {activeTab === 'differences' && (
                        <div className="space-y-6">
                            <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-[2.5rem] flex items-center gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center shrink-0">
                                    <Info className="text-amber-500" size={24} />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Hướng dẫn Quản lý Hub Diferences</p>
                                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                                        Phần "Sự khác biệt" hiển thị dưới dạng WheelHub vòng tròn tương tác tại trang chủ. Để đạt hiệu quả thẩm mỹ tốt nhất, vui lòng duy trì <strong>8 hoặc 9 điểm khác biệt</strong>. Mỗi điểm cần một tiêu đề ngắn cho Hub và tiêu đề dài cho phần nội dung chi tiết.
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {data.differences.map((diff: any, idx: number) => (
                                    <div key={idx} className="bg-slate-900 border border-white/5 p-10 rounded-[2.5rem] space-y-8 group hover:border-primary/50 transition-all shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4">
                                            <button onClick={() => setData({ ...data, differences: data.differences.filter((_: any, i: number) => i !== idx) })} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-10">
                                            <div className="space-y-3 shrink-0">
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block">Icon Hub</label>
                                                <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                    <select value={diff.icon} onChange={e => {
                                                        const list = [...data.differences];
                                                        list[idx].icon = e.target.value;
                                                        setData({ ...data, differences: list });
                                                    }} className="w-full h-full bg-transparent border-none text-center appearance-none cursor-pointer p-2 font-black">
                                                        {ICON_OPTIONS.map(opt => <option key={opt.name} value={opt.name}>{opt.name}</option>)}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="flex-1 space-y-6">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-2 flex items-center gap-2">Short Title (Nhãn vòng xoay) <InlineFontSize value={fs.getFontSize('differenceTitle')} onChange={(v) => fs.setFontSize('differenceTitle', v)} defaultDesktop={fs.getDefault('differenceTitle').desktop} defaultMobile={fs.getDefault('differenceTitle').mobile} /></label>
                                                        <input value={diff.title} onChange={e => {
                                                            const list = [...data.differences];
                                                            list[idx].title = e.target.value;
                                                            setData({ ...data, differences: list });
                                                        }} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white font-heading font-black text-lg" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-2">Full Headline (Tiêu đề nội dung)</label>
                                                        <input value={diff.fullTitle} onChange={e => {
                                                            const list = [...data.differences];
                                                            list[idx].fullTitle = e.target.value;
                                                            setData({ ...data, differences: list });
                                                        }} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-primary font-bold text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-2 flex items-center gap-2">Detailed Content (Markdown/HTML) <InlineFontSize value={fs.getFontSize('differenceDesc')} onChange={(v) => fs.setFontSize('differenceDesc', v)} defaultDesktop={fs.getDefault('differenceDesc').desktop} defaultMobile={fs.getDefault('differenceDesc').mobile} /></label>
                                                        <textarea value={diff.desc} rows={5} onChange={e => {
                                                            const list = [...data.differences];
                                                            list[idx].desc = e.target.value;
                                                            setData({ ...data, differences: list });
                                                        }} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-4 text-slate-400 text-xs leading-relaxed font-body" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setData({ ...data, differences: [...data.differences, { id: Date.now(), title: 'Điểm khác biệt mới', fullTitle: '', desc: '', icon: 'ArrowRight' }] })}
                                    className="border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center min-h-[400px] text-slate-700 hover:text-primary hover:border-primary/50 transition-all p-10 bg-white/[0.01] hover:bg-white/[0.03]"
                                >
                                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-800 flex items-center justify-center mb-6">
                                        <Plus size={40} />
                                    </div>
                                    <span className="font-heading font-black uppercase tracking-[0.2em] text-sm">Add New Hub Difference</span>
                                    <span className="text-[10px] text-slate-600 mt-2">Dẫn dắt bởi sự thấu hiểu người học</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* POLICIES TAB */}
                    {activeTab === 'policies' && (
                        <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-black text-white px-2 flex items-center gap-2">Quy định & Chính sách <InlineFontSize value={fs.getFontSize('policyTitle')} onChange={(v) => fs.setFontSize('policyTitle', v)} defaultDesktop={fs.getDefault('policyTitle').desktop} defaultMobile={fs.getDefault('policyTitle').mobile} /></h2>
                                <button
                                    onClick={() => setData({ ...data, policies: [...(data.policies || []), { title: 'Chính sách mới', icon: 'ShieldCheck' }] })}
                                    className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all font-heading"
                                >
                                    Add New Policy
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(data.policies || []).map((policy: any, idx: number) => (
                                    <div key={idx} className="bg-white/5 border border-white/5 p-6 rounded-2xl flex items-center gap-6 group hover:border-primary/30 transition-all">
                                        <div className="w-12 h-12 bg-slate-950 border border-white/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                            <select value={policy.icon} onChange={e => {
                                                const list = [...data.policies];
                                                list[idx].icon = e.target.value;
                                                setData({ ...data, policies: list });
                                            }} className="bg-transparent border-none text-center appearance-none cursor-pointer w-full h-full flex items-center justify-center font-black">
                                                {ICON_OPTIONS.map(opt => <option key={opt.name} value={opt.name}>{opt.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                value={policy.title}
                                                onChange={e => {
                                                    const list = [...data.policies];
                                                    list[idx].title = e.target.value;
                                                    setData({ ...data, policies: list });
                                                }}
                                                className="w-full bg-transparent border-none text-white font-bold text-sm outline-none"
                                            />
                                        </div>
                                        <button
                                            onClick={() => setData({ ...data, policies: data.policies.filter((_: any, i: number) => i !== idx) })}
                                            className="p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
