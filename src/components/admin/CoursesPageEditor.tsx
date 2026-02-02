"use client";

import React, { useState, useEffect } from 'react';
import {
    Plus, Trash2, Target, Settings2, Layout, Book, Users, Award,
    ChevronDown, ChevronUp, Clock, Calendar, BookOpen, Zap, Trophy,
    CheckCircle2, ArrowRight, GraduationCap, Save, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RichTitleEditor from './shared/RichTitleEditor';
import FileUpload from './shared/FileUpload';

const TABS = [
    { id: 'hero', name: 'Hero Banner', icon: <Layout size={18} /> },
    { id: 'targetAudience', name: 'Đối tượng phù hợp', icon: <Users size={18} /> },
    { id: 'specs', name: 'Tiêu chuẩn & Lịch học', icon: <Settings2 size={18} /> },
    { id: 'pathways', name: 'Lộ trình học', icon: <Layers size={18} /> },
    { id: 'levels', name: 'Chi tiết cấp độ', icon: <GraduationCap size={18} /> },
    { id: 'placement', name: 'Kiểm tra trình độ', icon: <Award size={18} /> },
    { id: 'bottomCta', name: 'CTA cuối trang', icon: <Target size={18} /> },
];

interface CoursesData {
    hero: {
        badge: string;
        title: string;
        subtitle: string;
        cta1: string;
        cta2: string;
    };
    targetAudience: {
        title: string;
        subtitle: string;
        groups: {
            students: { title: string; sub: string };
            teens: { title: string; sub: string };
            graduates: { title: string; sub: string };
            communicators: { title: string; sub: string };
        };
    };
    specs: {
        title: string;
        hours: { title: string; desc: string };
        schedule: { title: string; desc: string };
        materials: { title: string; desc: string };
        transfer: { title: string; desc: string };
    };
    schedules: {
        morning: { label: string; time: string; duration: string };
        evening: { label: string; time: string; duration: string };
        weekend: { label: string; time: string; duration: string };
    };
    pathway: {
        title: string;
        ie: { name: string; subtitle: string; desc: string };
        eft: { name: string; subtitle: string; desc: string };
        ge: { name: string; subtitle: string; desc: string };
    };
    levels: {
        ie: Record<string, { target: string; benefits: string[]; fullDesc: string }>;
        eft: Record<string, { target: string; benefits: string[]; fullDesc: string }>;
        ge: Record<string, { target: string; benefits: string[]; fullDesc: string }>;
    };
    placement: {
        badge: string;
        title: string;
        desc: string;
        step1: { title: string; desc: string };
        step2: { title: string; desc: string };
        cta: string;
    };
    levelModal: {
        badge: string;
        cefr: string;
        exit: string;
        description: string;
        benefits: string;
        register: string;
        close: string;
    };
    bottomCta: {
        title: string;
        desc: string;
        cta1: string;
        cta2: string;
    };
}

const LEVEL_KEYS = ['foundation', 'starter', 'standard', 'booster', 'master', 'elite'];

export default function CoursesPageEditor() {
    const [activeTab, setActiveTab] = useState('hero');
    const [language, setLanguage] = useState<'vi' | 'en'>('vi');
    const [data, setData] = useState<CoursesData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [expandedPathway, setExpandedPathway] = useState<string | null>('ie');
    const [expandedLevel, setExpandedLevel] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/courses-page?lang=${language}`)
            .then(res => res.json())
            .then(d => {
                setData(d);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [language]);

    const handleSave = async () => {
        if (!data) return;
        setSaving(true);
        try {
            await fetch(`/api/courses-page?lang=${language}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            alert(`Đã lưu thành công nội dung tiếng ${language === 'vi' ? 'Việt' : 'Anh'}!`);
        } catch (e) {
            alert('Lỗi khi lưu dữ liệu');
        } finally {
            setSaving(false);
        }
    };

    const updateData = (path: string, value: any) => {
        if (!data) return;
        const keys = path.split('.');
        const newData = JSON.parse(JSON.stringify(data));
        let current: any = newData;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        setData(newData);
    };

    const updateBenefit = (pathway: string, level: string, index: number, value: string) => {
        if (!data) return;
        const newData = JSON.parse(JSON.stringify(data));
        if (!newData.levels[pathway][level]) {
            newData.levels[pathway][level] = { target: '', benefits: [], fullDesc: '' };
        }
        newData.levels[pathway][level].benefits[index] = value;
        setData(newData);
    };

    const addBenefit = (pathway: string, level: string) => {
        if (!data) return;
        const newData = JSON.parse(JSON.stringify(data));
        if (!newData.levels[pathway][level]) {
            newData.levels[pathway][level] = { target: '', benefits: [], fullDesc: '' };
        }
        newData.levels[pathway][level].benefits.push('');
        setData(newData);
    };

    const removeBenefit = (pathway: string, level: string, index: number) => {
        if (!data) return;
        const newData = JSON.parse(JSON.stringify(data));
        newData.levels[pathway][level].benefits.splice(index, 1);
        setData(newData);
    };

    if (loading) return (
        <div className="p-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-slate-500">Đang tải nội dung trang khóa học ({language === 'vi' ? 'Tiếng Việt' : 'Tiếng Anh'})...</div>
        </div>
    );

    if (!data) return <div className="p-20 text-center text-red-500">Không thể tải dữ liệu</div>;

    return (
        <div className="space-y-8 pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-heading font-black text-white tracking-tight">Quản lý trang Khóa học</h1>
                    <p className="text-slate-400 mt-2">Chỉnh sửa nội dung trang /courses - <span className="text-primary font-bold uppercase">{language}</span></p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Language Selector */}
                    <div className="flex p-1 bg-slate-900 border border-white/5 rounded-xl">
                        <button
                            onClick={() => setLanguage('vi')}
                            className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${language === 'vi' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            TIẾNG VIỆT
                        </button>
                        <button
                            onClick={() => setLanguage('en')}
                            className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${language === 'en' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            ENGLISH
                        </button>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-primary text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20"
                    >
                        <Save size={18} />
                        {saving ? 'Đang lưu...' : 'Lưu tất cả'}
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 p-2 bg-slate-900 border border-white/5 rounded-2xl overflow-x-auto">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-slate-700 text-white shadow-lg'
                            : 'text-slate-400 hover:bg-white/5'
                            }`}
                    >
                        {tab.icon}
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-slate-900 border border-white/5 p-8 md:p-12 rounded-[2rem]"
                >
                    {/* HERO TAB */}
                    {activeTab === 'hero' && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                    <Layout size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Hero Banner</h2>
                                    <p className="text-slate-500 text-sm">Phần đầu tiên hiển thị khi vào trang</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Badge</label>
                                    <input
                                        value={data.hero.badge}
                                        onChange={e => updateData('hero.badge', e.target.value)}
                                        className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white"
                                        placeholder="Ví dụ: Lộ trình Học thuật"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tiêu đề chính</label>
                                    <input
                                        value={data.hero.title}
                                        onChange={e => updateData('hero.title', e.target.value)}
                                        className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white font-bold"
                                        placeholder="Khung Chương Trình Học"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mô tả ngắn</label>
                                <textarea
                                    rows={3}
                                    value={data.hero.subtitle}
                                    onChange={e => updateData('hero.subtitle', e.target.value)}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-slate-300"
                                    placeholder="Mô tả về chương trình học..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nút CTA 1 (Primary)</label>
                                    <input
                                        value={data.hero.cta1}
                                        onChange={e => updateData('hero.cta1', e.target.value)}
                                        className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-primary font-bold"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nút CTA 2 (Secondary)</label>
                                    <input
                                        value={data.hero.cta2}
                                        onChange={e => updateData('hero.cta2', e.target.value)}
                                        className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-slate-300"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TARGET AUDIENCE TAB */}
                    {activeTab === 'targetAudience' && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Đối tượng phù hợp</h2>
                                    <p className="text-slate-500 text-sm">4 nhóm đối tượng học viên mục tiêu</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tiêu đề section</label>
                                    <input
                                        value={data.targetAudience.title}
                                        onChange={e => updateData('targetAudience.title', e.target.value)}
                                        className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white font-bold"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mô tả</label>
                                    <input
                                        value={data.targetAudience.subtitle}
                                        onChange={e => updateData('targetAudience.subtitle', e.target.value)}
                                        className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-slate-300"
                                    />
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-primary" />
                                    4 Nhóm đối tượng
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {['students', 'teens', 'graduates', 'communicators'].map((key) => (
                                        <div key={key} className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 space-y-4">
                                            <div className="text-primary text-xs font-black uppercase tracking-widest">
                                                {key === 'students' && 'Nhóm 1: Sinh viên & Người đi làm'}
                                                {key === 'teens' && 'Nhóm 2: Học sinh 12-15 tuổi'}
                                                {key === 'graduates' && 'Nhóm 3: Học sinh cuối cấp'}
                                                {key === 'communicators' && 'Nhóm 4: Người cần giao tiếp'}
                                            </div>
                                            <div className="space-y-3">
                                                <input
                                                    value={data.targetAudience.groups[key as keyof typeof data.targetAudience.groups].title}
                                                    onChange={e => updateData(`targetAudience.groups.${key}.title`, e.target.value)}
                                                    className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2.5 text-white text-sm"
                                                    placeholder="Tiêu đề nhóm"
                                                />
                                                <input
                                                    value={data.targetAudience.groups[key as keyof typeof data.targetAudience.groups].sub}
                                                    onChange={e => updateData(`targetAudience.groups.${key}.sub`, e.target.value)}
                                                    className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2.5 text-slate-400 text-sm"
                                                    placeholder="Mô tả ngắn"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SPECS TAB */}
                    {activeTab === 'specs' && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                    <Settings2 size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Tiêu chuẩn & Lịch học</h2>
                                    <p className="text-slate-500 text-sm">Thông tin về thời lượng, lịch học và giáo trình</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tiêu đề section</label>
                                <input
                                    value={data.specs.title}
                                    onChange={e => updateData('specs.title', e.target.value)}
                                    className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white font-bold"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                {[
                                    { key: 'hours', icon: <Clock size={16} />, label: 'Thời lượng' },
                                    { key: 'schedule', icon: <Calendar size={16} />, label: 'Lịch học' },
                                    { key: 'materials', icon: <BookOpen size={16} />, label: 'Giáo trình' },
                                    { key: 'transfer', icon: <Zap size={16} />, label: 'Lưu chuyển' },
                                ].map(item => (
                                    <div key={item.key} className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 space-y-4">
                                        <div className="text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                            {item.icon} {item.label}
                                        </div>
                                        <div className="space-y-3">
                                            <input
                                                value={data.specs[item.key as keyof typeof data.specs] && typeof data.specs[item.key as keyof typeof data.specs] === 'object' ? (data.specs[item.key as keyof typeof data.specs] as { title: string }).title : ''}
                                                onChange={e => updateData(`specs.${item.key}.title`, e.target.value)}
                                                className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2.5 text-white text-sm font-bold"
                                                placeholder="Tiêu đề"
                                            />
                                            <input
                                                value={data.specs[item.key as keyof typeof data.specs] && typeof data.specs[item.key as keyof typeof data.specs] === 'object' ? (data.specs[item.key as keyof typeof data.specs] as { desc: string }).desc : ''}
                                                onChange={e => updateData(`specs.${item.key}.desc`, e.target.value)}
                                                className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2.5 text-slate-400 text-sm"
                                                placeholder="Mô tả"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/5">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Calendar size={16} className="text-primary" />
                                    Lịch học chi tiết
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {['morning', 'evening', 'weekend'].map(slot => (
                                        <div key={slot} className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 space-y-4">
                                            <div className="text-primary text-xs font-black uppercase tracking-widest">
                                                {slot === 'morning' && 'Ca Sáng - Chiều'}
                                                {slot === 'evening' && 'Ca Tối'}
                                                {slot === 'weekend' && 'Cuối Tuần'}
                                            </div>
                                            <div className="space-y-3">
                                                <input
                                                    value={data.schedules[slot as keyof typeof data.schedules].label}
                                                    onChange={e => updateData(`schedules.${slot}.label`, e.target.value)}
                                                    className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2.5 text-white text-sm"
                                                    placeholder="Nhãn"
                                                />
                                                <input
                                                    value={data.schedules[slot as keyof typeof data.schedules].time}
                                                    onChange={e => updateData(`schedules.${slot}.time`, e.target.value)}
                                                    className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2.5 text-slate-300 text-sm"
                                                    placeholder="Thời gian"
                                                />
                                                <input
                                                    value={data.schedules[slot as keyof typeof data.schedules].duration}
                                                    onChange={e => updateData(`schedules.${slot}.duration`, e.target.value)}
                                                    className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2.5 text-primary text-sm font-bold"
                                                    placeholder="Thời lượng khóa"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PATHWAYS TAB */}
                    {activeTab === 'pathways' && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                    <Layers size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">3 Lộ trình học chính</h2>
                                    <p className="text-slate-500 text-sm">IELTS, English for Teens, General English</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tiêu đề section</label>
                                <input
                                    value={data.pathway.title}
                                    onChange={e => updateData('pathway.title', e.target.value)}
                                    className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white font-bold"
                                />
                            </div>

                            <div className="mt-8 space-y-4">
                                {[
                                    { key: 'ie', name: 'IELTS Preparation', color: 'from-red-500 to-orange-500' },
                                    { key: 'eft', name: 'English for Teens', color: 'from-blue-500 to-purple-500' },
                                    { key: 'ge', name: 'General English', color: 'from-green-500 to-teal-500' },
                                ].map(pathway => (
                                    <div key={pathway.key} className="bg-white/[0.02] rounded-2xl border border-white/5 overflow-hidden">
                                        <div
                                            onClick={() => setExpandedPathway(expandedPathway === pathway.key ? null : pathway.key)}
                                            className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/[0.02]"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pathway.color} flex items-center justify-center text-white font-black`}>
                                                    {pathway.key.toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-bold">{pathway.name}</h3>
                                                    <p className="text-slate-500 text-sm">{data.pathway[pathway.key as keyof typeof data.pathway] && typeof data.pathway[pathway.key as keyof typeof data.pathway] === 'object' ? (data.pathway[pathway.key as keyof typeof data.pathway] as { name: string }).name : ''}</p>
                                                </div>
                                            </div>
                                            {expandedPathway === pathway.key ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                                        </div>

                                        <AnimatePresence>
                                            {expandedPathway === pathway.key && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="border-t border-white/5 overflow-hidden"
                                                >
                                                    <div className="p-6 space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-black text-slate-500 uppercase tracked-widest">Tên lộ trình (Tiếng Việt)</label>
                                                                <input
                                                                    value={data.pathway[pathway.key as keyof typeof data.pathway] && typeof data.pathway[pathway.key as keyof typeof data.pathway] === 'object' ? (data.pathway[pathway.key as keyof typeof data.pathway] as { name: string }).name : ''}
                                                                    onChange={e => updateData(`pathway.${pathway.key}.name`, e.target.value)}
                                                                    className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2.5 text-white"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subtitle (Tiếng Anh)</label>
                                                                <input
                                                                    value={data.pathway[pathway.key as keyof typeof data.pathway] && typeof data.pathway[pathway.key as keyof typeof data.pathway] === 'object' ? (data.pathway[pathway.key as keyof typeof data.pathway] as { subtitle: string }).subtitle : ''}
                                                                    onChange={e => updateData(`pathway.${pathway.key}.subtitle`, e.target.value)}
                                                                    className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2.5 text-slate-300"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mô tả chi tiết</label>
                                                            <textarea
                                                                rows={3}
                                                                value={data.pathway[pathway.key as keyof typeof data.pathway] && typeof data.pathway[pathway.key as keyof typeof data.pathway] === 'object' ? (data.pathway[pathway.key as keyof typeof data.pathway] as { desc: string }).desc : ''}
                                                                onChange={e => updateData(`pathway.${pathway.key}.desc`, e.target.value)}
                                                                className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-slate-400"
                                                            />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* LEVELS TAB */}
                    {activeTab === 'levels' && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                    <GraduationCap size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Chi tiết từng cấp độ</h2>
                                    <p className="text-slate-500 text-sm">Foundation → Elite (6 cấp độ x 3 lộ trình)</p>
                                </div>
                            </div>

                            {/* Level Modal Labels */}
                            <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 mb-8">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Nhãn hiển thị trong Modal</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {['badge', 'cefr', 'exit', 'description', 'benefits', 'register', 'close'].map(key => (
                                        <div key={key} className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase">{key}</label>
                                            <input
                                                value={(data.levelModal as any)[key] || ''}
                                                onChange={e => updateData(`levelModal.${key}`, e.target.value)}
                                                className="w-full bg-slate-950 border border-white/5 rounded-lg px-3 py-2 text-white text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pathway Selector */}
                            <div className="flex gap-2 mb-6">
                                {['ie', 'eft', 'ge'].map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setExpandedPathway(p)}
                                        className={`px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all ${expandedPathway === p ? 'bg-primary text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {p === 'ie' && 'IELTS'}
                                        {p === 'eft' && 'EfT'}
                                        {p === 'ge' && 'General'}
                                    </button>
                                ))}
                            </div>

                            {/* Levels for selected pathway */}
                            <div className="space-y-4">
                                {LEVEL_KEYS.map(level => {
                                    const levelData = data.levels[expandedPathway as keyof typeof data.levels]?.[level] || { target: '', benefits: [], fullDesc: '' };
                                    const levelId = `${expandedPathway}-${level}`;

                                    return (
                                        <div key={level} className="bg-white/[0.02] rounded-2xl border border-white/5 overflow-hidden">
                                            <div
                                                onClick={() => setExpandedLevel(expandedLevel === levelId ? null : levelId)}
                                                className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02]"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-sm uppercase">
                                                        {level.slice(0, 2)}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-white font-bold capitalize">{level}</h3>
                                                        <p className="text-slate-500 text-xs">{levelData.target || 'Chưa có mô tả'}</p>
                                                    </div>
                                                </div>
                                                {expandedLevel === levelId ? <ChevronUp className="text-slate-400" size={18} /> : <ChevronDown className="text-slate-400" size={18} />}
                                            </div>

                                            <AnimatePresence>
                                                {expandedLevel === levelId && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="border-t border-white/5 overflow-hidden"
                                                    >
                                                        <div className="p-6 space-y-6">
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Đối tượng mục tiêu</label>
                                                                <input
                                                                    value={levelData.target}
                                                                    onChange={e => {
                                                                        const newData = JSON.parse(JSON.stringify(data));
                                                                        if (!newData.levels[expandedPathway!]) newData.levels[expandedPathway!] = {};
                                                                        if (!newData.levels[expandedPathway!][level]) newData.levels[expandedPathway!][level] = { target: '', benefits: [], fullDesc: '' };
                                                                        newData.levels[expandedPathway!][level].target = e.target.value;
                                                                        setData(newData);
                                                                    }}
                                                                    className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2.5 text-white"
                                                                    placeholder="Ví dụ: Học viên mất gốc hoặc cần củng cố"
                                                                />
                                                            </div>

                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mô tả chi tiết</label>
                                                                <textarea
                                                                    rows={3}
                                                                    value={levelData.fullDesc}
                                                                    onChange={e => {
                                                                        const newData = JSON.parse(JSON.stringify(data));
                                                                        if (!newData.levels[expandedPathway!]) newData.levels[expandedPathway!] = {};
                                                                        if (!newData.levels[expandedPathway!][level]) newData.levels[expandedPathway!][level] = { target: '', benefits: [], fullDesc: '' };
                                                                        newData.levels[expandedPathway!][level].fullDesc = e.target.value;
                                                                        setData(newData);
                                                                    }}
                                                                    className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-slate-400"
                                                                />
                                                            </div>

                                                            <div className="space-y-4">
                                                                <div className="flex items-center justify-between">
                                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                                        <Trophy size={14} className="text-primary" />
                                                                        Lợi ích ({levelData.benefits?.length || 0})
                                                                    </label>
                                                                    <button
                                                                        onClick={() => addBenefit(expandedPathway!, level)}
                                                                        className="text-primary text-xs font-bold flex items-center gap-1 hover:underline"
                                                                    >
                                                                        <Plus size={14} /> Thêm
                                                                    </button>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    {(levelData.benefits || []).map((benefit: string, idx: number) => (
                                                                        <div key={idx} className="flex gap-2">
                                                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">{idx + 1}</div>
                                                                            <input
                                                                                value={benefit}
                                                                                onChange={e => updateBenefit(expandedPathway!, level, idx, e.target.value)}
                                                                                className="flex-1 bg-slate-950 border border-white/5 rounded-lg px-3 py-2 text-white text-sm"
                                                                            />
                                                                            <button
                                                                                onClick={() => removeBenefit(expandedPathway!, level, idx)}
                                                                                className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500/20"
                                                                            >
                                                                                <Trash2 size={14} />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* PLACEMENT TAB */}
                    {activeTab === 'placement' && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                    <Award size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Kiểm tra trình độ</h2>
                                    <p className="text-slate-500 text-sm">Section giới thiệu bài test đầu vào</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Badge</label>
                                    <input
                                        value={data.placement.badge}
                                        onChange={e => updateData('placement.badge', e.target.value)}
                                        className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-primary font-bold"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tiêu đề</label>
                                    <input
                                        value={data.placement.title}
                                        onChange={e => updateData('placement.title', e.target.value)}
                                        className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mô tả</label>
                                <textarea
                                    rows={3}
                                    value={data.placement.desc}
                                    onChange={e => updateData('placement.desc', e.target.value)}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-slate-300"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 space-y-4">
                                    <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-black">1</div>
                                    <div className="space-y-3">
                                        <input
                                            value={data.placement.step1.title}
                                            onChange={e => updateData('placement.step1.title', e.target.value)}
                                            className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2.5 text-white font-bold"
                                            placeholder="Tiêu đề bước 1"
                                        />
                                        <input
                                            value={data.placement.step1.desc}
                                            onChange={e => updateData('placement.step1.desc', e.target.value)}
                                            className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2.5 text-slate-400"
                                            placeholder="Mô tả bước 1"
                                        />
                                    </div>
                                </div>
                                <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 space-y-4">
                                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-black">2</div>
                                    <div className="space-y-3">
                                        <input
                                            value={data.placement.step2.title}
                                            onChange={e => updateData('placement.step2.title', e.target.value)}
                                            className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2.5 text-white font-bold"
                                            placeholder="Tiêu đề bước 2"
                                        />
                                        <input
                                            value={data.placement.step2.desc}
                                            onChange={e => updateData('placement.step2.desc', e.target.value)}
                                            className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2.5 text-slate-400"
                                            placeholder="Mô tả bước 2"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mt-6">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nút CTA</label>
                                <input
                                    value={data.placement.cta}
                                    onChange={e => updateData('placement.cta', e.target.value)}
                                    className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-primary font-bold"
                                />
                            </div>
                        </div>
                    )}

                    {/* BOTTOM CTA TAB */}
                    {activeTab === 'bottomCta' && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                    <Target size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">CTA Cuối trang</h2>
                                    <p className="text-slate-500 text-sm">Section kêu gọi hành động cuối cùng</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tiêu đề</label>
                                <input
                                    value={data.bottomCta.title}
                                    onChange={e => updateData('bottomCta.title', e.target.value)}
                                    className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white font-bold text-xl"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mô tả</label>
                                <textarea
                                    rows={3}
                                    value={data.bottomCta.desc}
                                    onChange={e => updateData('bottomCta.desc', e.target.value)}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-slate-300"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nút CTA 1 (Primary)</label>
                                    <input
                                        value={data.bottomCta.cta1}
                                        onChange={e => updateData('bottomCta.cta1', e.target.value)}
                                        className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-primary font-bold"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nút CTA 2 (Secondary)</label>
                                    <input
                                        value={data.bottomCta.cta2}
                                        onChange={e => updateData('bottomCta.cta2', e.target.value)}
                                        className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-slate-300"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
