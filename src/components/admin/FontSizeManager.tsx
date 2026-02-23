"use client";

import React, { useState, useEffect } from 'react';
import { Save, Type, Monitor, Smartphone, CheckCircle2, AlertCircle, RotateCcw, Search, ChevronDown, ChevronUp } from 'lucide-react';
import FontSizeControl, { FontSizeValue } from './shared/FontSizeControl';

// ============================================
// DEFAULT FONT SIZES DEFINITION
// These are the standard defaults that match the hardcoded Tailwind classes
// ============================================
export const DEFAULT_FONT_SIZES: Record<string, Record<string, FontSizeValue>> = {
    // ---- HOME PAGE ----
    home: {
        heroTitle: { desktop: 60, mobile: 24 },
        heroSubtitle: { desktop: 20, mobile: 14 },
        heroCTA: { desktop: 18, mobile: 12 },
        philosophyText: { desktop: 20, mobile: 14 },
        philosophyLabel: { desktop: 9, mobile: 11 },
        introBadge: { desktop: 20, mobile: 12 },
        introTitle: { desktop: 48, mobile: 24 },
        introDesc: { desktop: 20, mobile: 16 },
        programName: { desktop: 15, mobile: 12 },
        hallOfFameBadge: { desktop: 12, mobile: 12 },
        hallOfFameTitle: { desktop: 60, mobile: 30 },
        hallOfFameDesc: { desktop: 18, mobile: 14 },
        campusBadge: { desktop: 11, mobile: 11 },
        campusTitle: { desktop: 36, mobile: 18 },
        campusDesc: { desktop: 16, mobile: 12 },
        campusBtn: { desktop: 17, mobile: 14 },
        facultyBadge: { desktop: 18, mobile: 12 },
        facultyTitle: { desktop: 48, mobile: 18 },
        facultyDesc: { desktop: 18, mobile: 14 },
        facultyBtn: { desktop: 16, mobile: 12 },
        blogBadge: { desktop: 14, mobile: 10 },
        blogTitle: { desktop: 60, mobile: 20 },
        blogPostTitle: { desktop: 48, mobile: 18 },
        partnersBadge: { desktop: 10, mobile: 10 },
    },
    // ---- ABOUT US PAGE ----
    aboutUs: {
        heroTitle: { desktop: 48, mobile: 28 },
        heroSubtitle: { desktop: 20, mobile: 14 },
        heroHighlight: { desktop: 18, mobile: 14 },
        storySubtitle: { desktop: 20, mobile: 16 },
        storyText: { desktop: 16, mobile: 14 },
        storyTeachers: { desktop: 16, mobile: 14 },
        storyQuote: { desktop: 16, mobile: 14 },
        teacherName: { desktop: 18, mobile: 16 },
        teacherCerts: { desktop: 12, mobile: 11 },
        teacherExp: { desktop: 14, mobile: 12 },
        teacherDesc: { desktop: 12, mobile: 11 },
        philosophyTitle: { desktop: 20, mobile: 16 },
        philosophyDesc: { desktop: 14, mobile: 12 },
        valueTitle: { desktop: 18, mobile: 14 },
        valueDesc: { desktop: 14, mobile: 12 },
        differenceTitle: { desktop: 18, mobile: 14 },
        differenceDesc: { desktop: 14, mobile: 12 },
        policyTitle: { desktop: 16, mobile: 14 },
    },
    // ---- COURSES PAGE ----
    courses: {
        heroTitle: { desktop: 48, mobile: 28 },
        heroSubtitle: { desktop: 18, mobile: 14 },
        heroCTA: { desktop: 16, mobile: 12 },
        sectionTitle: { desktop: 36, mobile: 24 },
        sectionSubtitle: { desktop: 16, mobile: 14 },
        pathwayName: { desktop: 24, mobile: 18 },
        pathwayDesc: { desktop: 16, mobile: 14 },
        levelName: { desktop: 18, mobile: 14 },
        levelDesc: { desktop: 14, mobile: 12 },
        specTitle: { desktop: 16, mobile: 14 },
        specDesc: { desktop: 14, mobile: 12 },
        placementTitle: { desktop: 36, mobile: 24 },
        placementDesc: { desktop: 16, mobile: 14 },
        bottomCtaTitle: { desktop: 36, mobile: 24 },
        bottomCtaDesc: { desktop: 16, mobile: 14 },
    },
    // ---- BLOG PAGE ----
    blog: {
        pageTitle: { desktop: 48, mobile: 28 },
        postTitle: { desktop: 28, mobile: 20 },
        postExcerpt: { desktop: 16, mobile: 14 },
        postBody: { desktop: 18, mobile: 16 },
        postCategory: { desktop: 12, mobile: 10 },
        postDate: { desktop: 12, mobile: 10 },
    },
    // ---- CONTACT PAGE ----
    contact: {
        heroTitle: { desktop: 48, mobile: 28 },
        heroSubtitle: { desktop: 18, mobile: 14 },
        formLabel: { desktop: 14, mobile: 12 },
        infoTitle: { desktop: 18, mobile: 16 },
        infoText: { desktop: 14, mobile: 12 },
    },
    // ---- STUDENT CORNER PAGE ----
    studentCorner: {
        heroTitle: { desktop: 48, mobile: 28 },
        heroSubtitle: { desktop: 20, mobile: 14 },
        heroDesc: { desktop: 18, mobile: 14 },
        playgroundTitle: { desktop: 36, mobile: 24 },
        playgroundHeadline: { desktop: 14, mobile: 12 },
        lmsTitle: { desktop: 24, mobile: 14 },
        lmsDesc: { desktop: 18, mobile: 12 },
        lmsBtn: { desktop: 18, mobile: 12 },
        mocktestTitle: { desktop: 24, mobile: 14 },
        mocktestDesc: { desktop: 18, mobile: 12 },
        mocktestBtn: { desktop: 18, mobile: 12 },
        supportTitle: { desktop: 36, mobile: 20 },
        supportDesc: { desktop: 18, mobile: 14 },
    },
    // ---- GLOBAL / SHARED ----
    global: {
        headerNav: { desktop: 14, mobile: 12 },
        headerLogo: { desktop: 18, mobile: 16 },
        footerText: { desktop: 14, mobile: 12 },
        footerLinks: { desktop: 14, mobile: 12 },
        footerCopyright: { desktop: 12, mobile: 10 },
        testimonialName: { desktop: 18, mobile: 14 },
        testimonialText: { desktop: 16, mobile: 14 },
        testimonialRole: { desktop: 14, mobile: 12 },
    },
};

// Human-readable labels
const SECTION_LABELS: Record<string, string> = {
    home: '🏠 Trang Chủ (Home)',
    aboutUs: '📖 Giới Thiệu (About Us)',
    courses: '📚 Khóa Học (Courses)',
    blog: '📝 Blog',
    contact: '📞 Liên Hệ (Contact)',
    studentCorner: '🎓 Góc Học Viên (Student Corner)',
    global: '🌐 Chung (Global / Shared)',
};

const FIELD_LABELS: Record<string, string> = {
    heroTitle: 'Hero - Tiêu đề chính',
    heroSubtitle: 'Hero - Phụ đề',
    heroHighlight: 'Hero - Điểm nhấn',
    heroCTA: 'Hero - Nút CTA',
    philosophyText: 'Triết lý - Nội dung',
    philosophyLabel: 'Triết lý - Nhãn',
    philosophyTitle: 'Triết lý - Tiêu đề',
    philosophyDesc: 'Triết lý - Mô tả',
    introBadge: 'Giới thiệu - Badge',
    introTitle: 'Giới thiệu - Tiêu đề',
    introDesc: 'Giới thiệu - Mô tả',
    programName: 'Chương trình - Tên',
    hallOfFameBadge: 'Hall of Fame - Badge',
    hallOfFameTitle: 'Hall of Fame - Tiêu đề',
    hallOfFameDesc: 'Hall of Fame - Mô tả',
    campusBadge: 'Campus - Badge',
    campusTitle: 'Campus - Tiêu đề',
    campusDesc: 'Campus - Mô tả',
    campusBtn: 'Campus - Nút',
    facultyBadge: 'Faculty - Badge',
    facultyTitle: 'Faculty - Tiêu đề',
    facultyDesc: 'Faculty - Mô tả',
    facultyBtn: 'Faculty - Nút',
    blogBadge: 'Blog - Badge',
    blogTitle: 'Blog - Tiêu đề section',
    blogPostTitle: 'Blog - Tiêu đề bài viết',
    partnersBadge: 'Partners - Badge',
    storySubtitle: 'Story - Phụ đề',
    storyText: 'Story - Nội dung',
    storyTeachers: 'Story - Tên giáo viên',
    storyQuote: 'Story - Trích dẫn',
    teacherName: 'GV - Tên',
    teacherCerts: 'GV - Bằng cấp',
    teacherExp: 'GV - Kinh nghiệm',
    teacherDesc: 'GV - Mô tả',
    valueTitle: 'Giá trị - Tiêu đề',
    valueDesc: 'Giá trị - Mô tả',
    differenceTitle: 'Sự khác biệt - Tiêu đề',
    differenceDesc: 'Sự khác biệt - Mô tả',
    policyTitle: 'Chính sách - Tiêu đề',
    sectionTitle: 'Section - Tiêu đề',
    sectionSubtitle: 'Section - Phụ đề',
    pathwayName: 'Lộ trình - Tên',
    pathwayDesc: 'Lộ trình - Mô tả',
    levelName: 'Level - Tên',
    levelDesc: 'Level - Mô tả',
    specTitle: 'Spec - Tiêu đề',
    specDesc: 'Spec - Mô tả',
    placementTitle: 'Placement - Tiêu đề',
    placementDesc: 'Placement - Mô tả',
    bottomCtaTitle: 'CTA cuối - Tiêu đề',
    bottomCtaDesc: 'CTA cuối - Mô tả',
    pageTitle: 'Tiêu đề trang',
    postTitle: 'Bài viết - Tiêu đề',
    postExcerpt: 'Bài viết - Tóm tắt',
    postBody: 'Bài viết - Nội dung',
    postCategory: 'Bài viết - Danh mục',
    postDate: 'Bài viết - Ngày',
    formLabel: 'Form - Nhãn',
    infoTitle: 'Info - Tiêu đề',
    infoText: 'Info - Nội dung',
    playgroundTitle: 'Playground - Tiêu đề',
    playgroundHeadline: 'Playground - Headline',
    lmsTitle: 'LMS - Tiêu đề',
    lmsDesc: 'LMS - Mô tả',
    lmsBtn: 'LMS - Nút',
    mocktestTitle: 'Mock Test - Tiêu đề',
    mocktestDesc: 'Mock Test - Mô tả',
    mocktestBtn: 'Mock Test - Nút',
    supportTitle: 'Hỗ trợ - Tiêu đề',
    supportDesc: 'Hỗ trợ - Mô tả',
    heroDesc: 'Hero - Mô tả',
    headerNav: 'Header - Navigation',
    headerLogo: 'Header - Logo text',
    footerText: 'Footer - Nội dung',
    footerLinks: 'Footer - Links',
    footerCopyright: 'Footer - Bản quyền',
    testimonialName: 'Testimonial - Tên',
    testimonialText: 'Testimonial - Nội dung',
    testimonialRole: 'Testimonial - Chức danh',
};

export default function FontSizeManager() {
    const [fontSizes, setFontSizes] = useState<Record<string, Record<string, FontSizeValue>>>(
        JSON.parse(JSON.stringify(DEFAULT_FONT_SIZES))
    );
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetch('/api/font-sizes', { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                if (data && Object.keys(data).length > 0) {
                    // Deep merge: DB values override defaults
                    const merged = JSON.parse(JSON.stringify(DEFAULT_FONT_SIZES));
                    for (const section of Object.keys(data)) {
                        if (!merged[section]) merged[section] = {};
                        for (const field of Object.keys(data[section])) {
                            merged[section][field] = {
                                desktop: data[section][field].desktop ?? merged[section]?.[field]?.desktop ?? 16,
                                mobile: data[section][field].mobile ?? merged[section]?.[field]?.mobile ?? 14,
                            };
                        }
                    }
                    setFontSizes(merged);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(false);
        try {
            const res = await fetch('/api/font-sizes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fontSizes)
            });
            if (!res.ok) throw new Error('Failed to save');
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    };

    const resetAll = () => {
        if (confirm('Reset toàn bộ font size về mặc định? Hành động này không thể hoàn tác sau khi bấm Save.')) {
            setFontSizes(JSON.parse(JSON.stringify(DEFAULT_FONT_SIZES)));
        }
    };

    const resetSection = (section: string) => {
        setFontSizes(prev => ({
            ...prev,
            [section]: JSON.parse(JSON.stringify(DEFAULT_FONT_SIZES[section]))
        }));
    };

    const updateFontSize = (section: string, field: string, value: FontSizeValue) => {
        setFontSizes(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const toggleSection = (section: string) => {
        setCollapsedSections(prev => {
            const next = new Set(prev);
            if (next.has(section)) next.delete(section);
            else next.add(section);
            return next;
        });
    };

    const getChangedCount = (section: string) => {
        let count = 0;
        const defaults = DEFAULT_FONT_SIZES[section];
        const current = fontSizes[section];
        if (!defaults || !current) return 0;
        for (const field of Object.keys(defaults)) {
            if (
                current[field]?.desktop !== defaults[field]?.desktop ||
                current[field]?.mobile !== defaults[field]?.mobile
            ) {
                count++;
            }
        }
        return count;
    };

    const filteredSections = Object.keys(fontSizes).filter(section => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        if ((SECTION_LABELS[section] || section).toLowerCase().includes(q)) return true;
        return Object.keys(fontSizes[section]).some(field =>
            (FIELD_LABELS[field] || field).toLowerCase().includes(q)
        );
    });

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
    );

    return (
        <div className="space-y-8 pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-heading font-black text-white tracking-tight flex items-center gap-3">
                        <Type size={32} className="text-primary" />
                        Font Size Manager
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Quản lý kích thước chữ riêng biệt cho <span className="text-white font-bold">Desktop</span> và <span className="text-blue-400 font-bold">Mobile</span> trên tất cả các trang.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={resetAll}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/10"
                    >
                        <RotateCcw size={14} /> Reset Tất Cả
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-xl ${saving ? 'bg-slate-800 text-slate-500' : 'bg-primary text-white hover:scale-105 shadow-primary/20'}`}
                    >
                        <Save size={18} />
                        {saving ? 'Đang lưu...' : 'Lưu Font Sizes'}
                    </button>
                </div>
            </div>

            {success && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4 text-emerald-400">
                    <CheckCircle2 size={20} />
                    <p className="font-bold text-sm">Font sizes đã được cập nhật thành công!</p>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-400">
                    <AlertCircle size={20} />
                    <p className="font-bold text-sm">{error}</p>
                </div>
            )}

            {/* Info Banner */}
            <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-start gap-4">
                <div className="flex items-center gap-4 shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <Monitor size={18} className="text-white" />
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <Smartphone size={18} className="text-blue-400" />
                    </div>
                </div>
                <div>
                    <h3 className="text-white font-bold text-sm mb-1">Desktop & Mobile độc lập</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">
                        Mỗi phần tử text có 2 giá trị font size riêng biệt: <span className="text-white font-bold">Desktop (≥768px)</span> và <span className="text-blue-400 font-bold">Mobile (&lt;768px)</span>.
                        Chỉnh sửa một bên sẽ <strong className="text-primary">KHÔNG</strong> ảnh hưởng bên còn lại.
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm theo tên section hoặc field..."
                    className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm text-white outline-none focus:border-primary/30 transition-all"
                />
            </div>

            {/* Sections */}
            <div className="space-y-6">
                {filteredSections.map(section => {
                    const isCollapsed = collapsedSections.has(section);
                    const changedCount = getChangedCount(section);
                    const fields = Object.keys(fontSizes[section]).filter(field => {
                        if (!searchQuery) return true;
                        return (FIELD_LABELS[field] || field).toLowerCase().includes(searchQuery.toLowerCase());
                    });

                    return (
                        <section key={section} className="bg-slate-900 border border-white/5 rounded-[2rem] overflow-hidden">
                            {/* Section Header */}
                            <div
                                className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
                                onClick={() => toggleSection(section)}
                            >
                                <div className="flex items-center gap-4">
                                    <h2 className="text-lg font-black text-white">{SECTION_LABELS[section] || section}</h2>
                                    <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded">
                                        {fields.length} fields
                                    </span>
                                    {changedCount > 0 && (
                                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                                            {changedCount} đã thay đổi
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); resetSection(section); }}
                                        className="text-[9px] font-black text-slate-600 hover:text-primary transition-colors flex items-center gap-1 px-3 py-1 rounded-lg bg-white/5 border border-white/5"
                                    >
                                        <RotateCcw size={10} /> RESET
                                    </button>
                                    {isCollapsed ? <ChevronDown size={18} className="text-slate-500" /> : <ChevronUp size={18} className="text-slate-500" />}
                                </div>
                            </div>

                            {/* Section Content */}
                            {!isCollapsed && (
                                <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {fields.map(field => (
                                        <FontSizeControl
                                            key={`${section}-${field}`}
                                            label={FIELD_LABELS[field] || field}
                                            value={fontSizes[section][field]}
                                            onChange={(val) => updateFontSize(section, field, val)}
                                            defaultDesktop={DEFAULT_FONT_SIZES[section]?.[field]?.desktop ?? 16}
                                            defaultMobile={DEFAULT_FONT_SIZES[section]?.[field]?.mobile ?? 14}
                                            min={8}
                                            max={120}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
