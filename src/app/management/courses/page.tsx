export const dynamic = "force-dynamic";
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BookOpen,
    Plus,
    Trash2,
    Save,
    Calendar,
    Target,
    Clock,
    DollarSign,
    Tag,
    ChevronDown,
    CheckCircle2,
    Layout
} from "lucide-react";

type TabType = "info" | "schedule" | "banner";

export default function CoursesManagementPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [schedules, setSchedules] = useState<any[]>([]);
    const [banner, setBanner] = useState<any>({ title: '', subtitle: '', description: '' });
    const [activeTab, setActiveTab] = useState<TabType>("info");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch("/api/courses").then(res => res.json()),
            fetch("/api/schedules").then(res => res.json()),
            fetch("/api/pages/courses").then(res => res.json())
        ]).then(([cData, sData, pData]) => {
            setCourses(cData);
            setSchedules(sData);
            if (pData && pData.sections) {
                const b = pData.sections.find((s: any) => s.type === 'courses-hero')?.content;
                if (b) setBanner(b);
            } else {
                setBanner({
                    title: "Lộ Trình <span class='text-primary font-bold'>Chuyên Biệt</span> <br /> Kiến Tạo Bản Lĩnh",
                    subtitle: "The Academic Navigation Roadmap",
                    description: "Khám phá các khóa học được thiết kế chuẩn Châu Âu, giúp bạn nắm bắt cơ hội học tập toàn cầu."
                });
            }
            setLoading(false);
        });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const results = await Promise.all([
                fetch("/api/courses", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(courses)
                }),
                fetch("/api/schedules", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(schedules)
                }),
                fetch("/api/pages", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        slug: 'courses',
                        title: 'Courses Page',
                        sections: [{ id: 'courses-hero', type: 'courses-hero', content: banner, order: 1, isVisible: true }]
                    })
                })
            ]);

            if (results.every(r => r.ok)) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-slate-400">Loading courses...</div>;

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-40 bg-[#0F172A]/80 backdrop-blur-md py-4">
                <div>
                    <h2 className="text-2xl font-bold font-heading">Quản lý Khóa học & Lịch khai giảng</h2>
                    <p className="text-slate-400">Thiết lập lộ trình học thuật and thời gian biểu.</p>
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

            {/* Tabs */}
            <div className="flex bg-slate-800/30 p-1.5 rounded-2xl border border-slate-800 w-fit">
                <button
                    onClick={() => setActiveTab("info")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === "info" ? "bg-slate-700 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                >
                    <BookOpen size={18} /> Danh sách Khóa học
                </button>
                <button
                    onClick={() => setActiveTab("schedule")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === "schedule" ? "bg-slate-700 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                >
                    <Calendar size={18} /> Lịch khai giảng (Popup)
                </button>
                <button
                    onClick={() => setActiveTab("banner")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === "banner" ? "bg-slate-700 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                >
                    <Layout size={18} /> Banner & Hero
                </button>
            </div>

            <main>
                <AnimatePresence mode="wait">
                    {activeTab === "info" && (
                        <motion.div
                            key="info"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {courses.map((course, idx) => (
                                <div key={course.id} className="bg-[#1E293B]/30 border border-slate-800 rounded-3xl p-8 space-y-6 group">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                    {course.goal}
                                                </div>
                                                <input
                                                    className="bg-transparent border-none text-2xl font-bold p-0 w-full outline-none focus:text-primary transition-colors font-heading"
                                                    value={course.name}
                                                    onChange={(e) => {
                                                        const nc = [...courses];
                                                        nc[idx].name = e.target.value;
                                                        setCourses(nc);
                                                    }}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black uppercase text-slate-500 block">Trình độ (Level)</label>
                                                    <div className="relative">
                                                        <Target size={12} className="absolute left-3 top-3 text-slate-500" />
                                                        <input
                                                            className="w-full bg-slate-800/30 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-[11px] outline-none"
                                                            value={course.level}
                                                            onChange={(e) => {
                                                                const nc = [...courses];
                                                                nc[idx].level = e.target.value;
                                                                setCourses(nc);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black uppercase text-slate-500 block">Thời lượng (Duration)</label>
                                                    <div className="relative">
                                                        <Clock size={12} className="absolute left-3 top-3 text-slate-500" />
                                                        <input
                                                            className="w-full bg-slate-800/30 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-[11px] outline-none"
                                                            value={course.duration}
                                                            onChange={(e) => {
                                                                const nc = [...courses];
                                                                nc[idx].duration = e.target.value;
                                                                setCourses(nc);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black uppercase text-slate-500 block">Học phí (Price)</label>
                                                    <div className="relative">
                                                        <DollarSign size={12} className="absolute left-3 top-3 text-slate-500" />
                                                        <input
                                                            className="w-full bg-slate-800/30 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-[11px] outline-none"
                                                            value={course.price}
                                                            onChange={(e) => {
                                                                const nc = [...courses];
                                                                nc[idx].price = e.target.value;
                                                                setCourses(nc);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const nc = courses.filter(item => item.id !== course.id);
                                                setCourses(nc);
                                            }}
                                            className="text-slate-600 hover:text-red-400 p-2"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase text-slate-500 block">Mô tả khóa học (Description)</label>
                                        <textarea
                                            className="w-full bg-slate-800/30 border border-slate-700 rounded-xl p-4 text-sm text-slate-400 outline-none focus:border-primary min-h-[80px]"
                                            value={course.description}
                                            onChange={(e) => {
                                                const nc = [...courses];
                                                nc[idx].description = e.target.value;
                                                setCourses(nc);
                                            }}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase text-slate-500 block">Lộ trình học thuật (Academic Path - Split by comma)</label>
                                        <div className="relative">
                                            <Tag size={12} className="absolute left-3 top-3.5 text-slate-500" />
                                            <input
                                                className="w-full bg-slate-800/30 border border-slate-700 rounded-lg pl-8 pr-3 py-2.5 text-[11px] outline-none"
                                                value={course.path.join(", ")}
                                                onChange={(e) => {
                                                    const nc = [...courses];
                                                    nc[idx].path = e.target.value.split(",").map(s => s.trim()).filter(s => s !== "");
                                                    setCourses(nc);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    setCourses([...courses, {
                                        id: Date.now(),
                                        name: "New Course Name",
                                        level: "Level Info",
                                        goal: "IELTS",
                                        duration: "Duration Info",
                                        price: "Linked",
                                        description: "Course description goes here...",
                                        path: ["Step 1", "Step 2", "Step 3"],
                                        tag: "New"
                                    }]);
                                }}
                                className="w-full border-2 border-dashed border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center text-slate-600 hover:text-primary hover:border-primary/50 transition-all gap-4"
                            >
                                <Plus size={40} />
                                <span className="font-bold uppercase tracking-widest text-sm">Thêm khóa học mới</span>
                            </button>
                        </motion.div>
                    )}

                    {activeTab === "schedule" && (
                        <motion.div
                            key="schedule"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="bg-[#1E293B]/30 border border-slate-800 rounded-[2.5rem] overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-800/30 border-b border-slate-800">
                                        <tr>
                                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">Tiêu đề (IELTS/TEENS...)</th>
                                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">Chi tiết (Level)</th>
                                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">Lịch học (Schedule)</th>
                                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {schedules.map((s, idx) => (
                                            <tr key={idx} className="hover:bg-slate-800/10 transition-colors">
                                                <td className="px-8 py-4">
                                                    <input
                                                        className="bg-transparent border-none font-bold p-0 w-full outline-none focus:text-primary transition-colors uppercase text-sm"
                                                        value={s.title}
                                                        onChange={(e) => {
                                                            const ns = [...schedules];
                                                            ns[idx].title = e.target.value;
                                                            setSchedules(ns);
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-8 py-4">
                                                    <input
                                                        className="bg-transparent border-none text-slate-400 p-0 w-full outline-none focus:text-white transition-colors text-xs"
                                                        value={s.detail}
                                                        onChange={(e) => {
                                                            const ns = [...schedules];
                                                            ns[idx].detail = e.target.value;
                                                            setSchedules(ns);
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-8 py-4">
                                                    <input
                                                        className="bg-transparent border-none text-primary font-mono p-0 w-full outline-none focus:text-white transition-colors text-xs"
                                                        value={s.schedule}
                                                        onChange={(e) => {
                                                            const ns = [...schedules];
                                                            ns[idx].schedule = e.target.value;
                                                            setSchedules(ns);
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-8 py-4 text-right">
                                                    <button
                                                        onClick={() => {
                                                            const ns = schedules.filter((_, i) => i !== idx);
                                                            setSchedules(ns);
                                                        }}
                                                        className="text-slate-600 hover:text-red-400"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <button
                                onClick={() => {
                                    setSchedules([...schedules, { title: "KHÓA HỌC MỚI", detail: "Level 1-2", schedule: "Thứ X - Y - Z | Time" }]);
                                }}
                                className="w-full border-2 border-dashed border-slate-800 rounded-3xl p-6 flex items-center justify-center text-slate-600 hover:text-primary transition-all gap-4"
                            >
                                <Plus size={20} />
                                <span className="font-bold uppercase tracking-widest text-[10px]">Thêm lịch khai giảng</span>
                            </button>
                        </motion.div>
                    )}

                    {activeTab === "banner" && (
                        <motion.div
                            key="banner"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="bg-[#1E293B]/30 border border-slate-800 rounded-3xl p-8 space-y-6">
                                <h3 className="text-xl font-bold flex items-center gap-3">
                                    <Layout className="text-primary" /> Hero Banner Settings
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block">Main Title (HTML)</label>
                                        <textarea
                                            className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-primary/50 min-h-[100px]"
                                            value={banner.title}
                                            onChange={e => setBanner({ ...banner, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block">Subtitle Tag</label>
                                        <input
                                            className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-slate-300 outline-none focus:border-primary/50"
                                            value={banner.subtitle}
                                            onChange={e => setBanner({ ...banner, subtitle: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-4">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block">Banner Description</label>
                                        <textarea
                                            className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-slate-400 font-body outline-none focus:border-primary/50"
                                            rows={4}
                                            value={banner.description}
                                            onChange={e => setBanner({ ...banner, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
