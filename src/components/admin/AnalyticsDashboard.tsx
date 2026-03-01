"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Activity, Users, Eye, Globe, Monitor, Smartphone, Tablet,
    TrendingUp, TrendingDown, Clock, BarChart3, ArrowUpRight,
    RefreshCw, Wifi, MapPin, MousePointerClick, ExternalLink,
    UserPlus, Zap, Chrome, Layout, Layers
} from "lucide-react";

/* ───────────── Types ───────────── */
interface RealtimeData {
    realtime: {
        activeUsers: number;
        activeUsers5Min: number;
        totalPageViews: number;
        minuteChart: { minutesAgo: number; users: number }[];
        byPage: { page: string; users: number; views: number }[];
        byPagePath: { path: string; users: number; views: number }[];
        byCountry: { country: string; users: number }[];
        byCity: { city: string; users: number }[];
        byDevice: { device: string; users: number }[];
        bySource: { source: string; users: number }[];
        events: { name: string; count: number }[];
    };
}

interface OverviewData {
    today: { users: number; pageViews: number; sessions: number; avgDuration: number; bounceRate: number; newUsers: number; events: number };
    yesterday: { users: number; pageViews: number; sessions: number; avgDuration: number; bounceRate: number; newUsers: number; events: number };
    weeklyChart: { date: string; users: number; pageViews: number; sessions: number; newUsers: number }[];
    monthly: { users: number; pageViews: number; sessions: number; avgDuration: number; bounceRate: number; newUsers: number; events: number };
    topPages: { path: string; title: string; views: number; users: number; avgDuration: number; bounceRate: number }[];
    sources: { channel: string; sessions: number; users: number; newUsers: number; bounceRate: number }[];
    sourceMedium: { source: string; medium: string; sessions: number; users: number }[];
    devices: { device: string; users: number; sessions: number }[];
    browsers: { browser: string; users: number }[];
    countries: { country: string; users: number; sessions: number }[];
    cities: { city: string; users: number; sessions: number }[];
    events: { name: string; count: number; perUser: number }[];
    newVsReturn: { type: string; users: number; sessions: number }[];
    os: { os: string; users: number }[];
    screens: { resolution: string; users: number }[];
}

/* ───────────── Helpers ───────────── */
function fmtDur(s: number) { const m = Math.floor(s / 60); const sec = Math.round(s % 60); return m > 0 ? `${m}m ${sec}s` : `${sec}s`; }
function fmtPct(v: number) { return `${(v * 100).toFixed(1)}%`; }
function fmtN(v: number) { return v.toLocaleString("vi-VN"); }

function Badge({ current, previous }: { current: number; previous: number }) {
    if (previous === 0 && current === 0) return <span className="text-xs text-gray-400">—</span>;
    if (previous === 0) return <span className="text-xs font-semibold text-emerald-600">+∞</span>;
    const c = ((current - previous) / previous) * 100;
    return (
        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${c >= 0 ? "text-emerald-600" : "text-red-500"}`}>
            {c >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}{Math.abs(c).toFixed(1)}%
        </span>
    );
}

function DIcon({ d }: { d: string }) {
    const l = d.toLowerCase();
    if (l.includes("mobile")) return <Smartphone size={13} className="text-blue-500" />;
    if (l.includes("tablet")) return <Tablet size={13} className="text-purple-500" />;
    return <Monitor size={13} className="text-gray-500" />;
}

/* Card */
function Card({ title, icon, children, className = "", noPad }: { title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string; noPad?: boolean }) {
    return (
        <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${className}`}>
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
                {icon && <span className="text-gray-400">{icon}</span>}
                <h3 className="text-sm font-bold text-gray-800">{title}</h3>
            </div>
            <div className={noPad ? "" : "p-5"}>{children}</div>
        </div>
    );
}

/* DataTable */
function DT({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100">
                        {headers.map((h, i) => (
                            <th key={i} className={`py-2 px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider ${i === 0 ? "text-left" : "text-right"}`}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                            {row.map((cell, j) => (
                                <td key={j} className={`py-2 px-3 ${j === 0 ? "text-left text-gray-700 font-medium" : "text-right text-gray-600"}`}>
                                    {typeof cell === "number" ? fmtN(cell) : cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {rows.length === 0 && <tr><td colSpan={headers.length} className="py-4 text-center text-gray-400 text-sm">Chưa có dữ liệu</td></tr>}
                </tbody>
            </table>
        </div>
    );
}

/* Progress bar */
function PBar({ label, value, total, color = "bg-blue-500", extra }: { label: string; value: number; total: number; color?: string; extra?: string }) {
    const p = total > 0 ? (value / total) * 100 : 0;
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 font-medium truncate flex-1 mr-2">{label}</span>
                <span className="text-gray-900 font-semibold shrink-0">{fmtN(value)}</span>
                {extra && <span className="text-gray-400 text-xs ml-1">{extra}</span>}
                <span className="text-gray-400 text-xs ml-2 w-10 text-right">{p.toFixed(0)}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${Math.max(p, 1)}%` }} />
            </div>
        </div>
    );
}

/* Tabs */
function Tabs({ tabs, active, onChange }: { tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void }) {
    return (
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl overflow-x-auto no-scrollbar">
            {tabs.map(t => (
                <button key={t.id} onClick={() => onChange(t.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${active === t.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{t.label}</button>
            ))}
        </div>
    );
}

/* BarChart */
function BarChart({ data, color = "bg-blue-500", h = "h-28" }: { data: { label: string; value: number }[]; color?: string; h?: string }) {
    const mx = Math.max(...data.map(d => d.value), 1);
    return (
        <div className={`flex items-end gap-[2px] ${h}`}>
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative">
                    <div className="absolute -top-6 bg-gray-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">{d.value}</div>
                    <div className={`w-full ${color} rounded-t transition-all duration-300 min-h-[1px] hover:opacity-80`}
                        style={{ height: `${(d.value / mx) * 100}%` }} />
                    {d.label && <span className="text-[7px] text-gray-400 leading-none">{d.label}</span>}
                </div>
            ))}
        </div>
    );
}

/* ═══════════ MAIN ═══════════ */
export default function AnalyticsDashboard() {
    const [rt, setRt] = useState<RealtimeData | null>(null);
    const [ov, setOv] = useState<OverviewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUp, setLastUp] = useState<Date | null>(null);
    const [period, setPeriod] = useState<"today" | "monthly">("today");
    const [tab, setTab] = useState("realtime");

    const fetchRt = useCallback(async () => {
        try {
            const r = await fetch("/api/analytics/realtime");
            if (!r.ok) throw new Error((await r.json()).error);
            setRt(await r.json()); setLastUp(new Date()); setError(null);
        } catch (e: any) { setError(e.message); }
    }, []);

    const fetchOv = useCallback(async () => {
        try {
            const r = await fetch("/api/analytics/overview");
            if (!r.ok) throw new Error((await r.json()).error);
            setOv(await r.json()); setError(null);
        } catch (e: any) { setError(e.message); }
    }, []);

    useEffect(() => {
        Promise.all([fetchRt(), fetchOv()]).finally(() => setLoading(false));
        const r1 = setInterval(fetchRt, 15000);
        const r2 = setInterval(fetchOv, 300000);
        return () => { clearInterval(r1); clearInterval(r2); };
    }, [fetchRt, fetchOv]);

    if (loading) return (
        <div className="flex items-center justify-center py-20 bg-gray-50 rounded-2xl"><div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent mx-auto" /><p className="text-gray-500 text-sm">Đang kết nối Google Analytics...</p></div></div>
    );

    if (error && !rt && !ov) return (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center mt-10 shadow-sm">
            <p className="text-red-700 font-bold mb-2 flex items-center justify-center gap-2"><TrendingDown size={20} /> Lỗi cung cấp dữ liệu từ Google Analytics</p>
            <p className="text-red-500 text-sm mb-6 max-w-md mx-auto">
                {error.includes("EXHAUSTED") || error.includes("quota")
                    ? "Bạn đã vượt quá hạn mức truy vấn API miễn phí của Google Analytics trong 1 giờ. Dữ liệu sẽ tiếp tục hiển thị bình thường khi hạn mức tự phục hồi (dưới 1 giờ)."
                    : error}
            </p>
            <button onClick={() => { setLoading(true); Promise.all([fetchRt(), fetchOv()]).finally(() => setLoading(false)); }}
                className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-red-700 transition-all flex items-center justify-center mx-auto gap-2">
                <RefreshCw size={16} /> Thử tải lại
            </button>
        </div>
    );

    const GA_URL = "https://analytics.google.com/analytics/web/#/p526354898/reports/reportshub";
    const stats = period === "today" ? ov?.today : ov?.monthly;
    const cmp = period === "today" ? ov?.yesterday : undefined;
    const totalDev = ov?.devices?.reduce((s, d) => s + d.users, 0) || 1;
    const totalBr = ov?.browsers?.reduce((s, d) => s + d.users, 0) || 1;
    const totalOs = ov?.os?.reduce((s, d) => s + d.users, 0) || 1;
    const totalEvt = rt?.realtime?.events?.reduce((s, e) => s + e.count, 0) || 0;

    return (
        <div className="bg-gray-50 -m-8 p-6 min-h-screen">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <BarChart3 className="text-white" size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Analytics Dashboard</h1>
                        <p className="text-xs text-gray-500">ptnenglish.edu.vn &bull; GA4</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {lastUp && <span className="text-[10px] text-gray-400">{lastUp.toLocaleTimeString("vi-VN")}</span>}
                    <button onClick={() => { fetchRt(); fetchOv(); }} className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-all"><RefreshCw size={14} /></button>
                    <a href={GA_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 text-xs font-semibold hover:bg-blue-600 hover:text-white transition-all">
                        <ExternalLink size={12} /> Mở GA4</a>
                </div>
            </div>

            {/* Navigation */}
            <div className="mb-5">
                <Tabs tabs={[
                    { id: "realtime", label: "🟢 Thời gian thực" },
                    { id: "overview", label: "📊 Tổng quan" },
                    { id: "audience", label: "👥 Đối tượng" },
                    { id: "content", label: "📄 Nội dung" },
                    { id: "acquisition", label: "🔗 Nguồn truy cập" },
                    { id: "events", label: "⚡ Sự kiện" },
                ]} active={tab} onChange={setTab} />
            </div>

            {/* Error Banner if partially loaded */}
            {error && (rt || ov) && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 text-sm flex items-start gap-3">
                    <TrendingDown className="text-orange-500 mt-0.5 shrink-0" size={18} />
                    <div>
                        <p className="text-orange-800 font-bold mb-1">Cảnh báo dữ liệu (Google Analytics)</p>
                        <p className="text-orange-600">
                            Hệ thống đã đạt giới hạn truy vấn API miễn phí của Google. Một số dữ liệu có thể không thể hiển thị ngay lúc này.
                            Giao diện sẽ tự động hiển thị đầy đủ sau khoảng 30-60 phút khi giới hạn API được tự động làm mới.
                        </p>
                    </div>
                </div>
            )}

            {/* ═══════════ REALTIME TAB ═══════════ */}
            {tab === "realtime" && !rt && (
                <div className="py-20 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
                    <Activity className="text-gray-300 mb-3" size={40} />
                    <p className="text-gray-500 font-semibold mb-1">Đang chờ cập nhật dữ liệu hiển thị...</p>
                    <p className="text-gray-400 text-sm max-w-sm">Hệ thống sẽ tải lại ngay khi kết nối đến Google Analytics được khôi phục.</p>
                </div>
            )}
            {tab === "realtime" && rt && (
                <div className="space-y-4">
                    {/* Top metrics */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="bg-white rounded-2xl border border-emerald-200 p-5 relative overflow-hidden">
                            <div className="absolute top-3 right-3 flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>
                                <span className="text-[9px] font-bold text-emerald-600 uppercase">Live</span>
                            </div>
                            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Trong 30 phút qua</p>
                            <p className="text-4xl font-bold text-gray-900">{rt.realtime.activeUsers}</p>
                            <p className="text-xs text-gray-500 mt-1">người dùng hoạt động</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-blue-200 p-5">
                            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Trong 5 phút qua</p>
                            <p className="text-4xl font-bold text-blue-600">{rt.realtime.activeUsers5Min}</p>
                            <p className="text-xs text-gray-500 mt-1">người dùng hoạt động</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-200 p-5">
                            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Lượt xem 30 phút</p>
                            <p className="text-4xl font-bold text-purple-600">{rt.realtime.totalPageViews}</p>
                            <p className="text-xs text-gray-500 mt-1">lượt xem trang</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-200 p-5">
                            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Sự kiện 30 phút</p>
                            <p className="text-4xl font-bold text-orange-500">{totalEvt}</p>
                            <p className="text-xs text-gray-500 mt-1">tổng sự kiện</p>
                        </div>
                    </div>

                    {/* Minute chart */}
                    <Card title="Số người dùng hoạt động mỗi phút" icon={<Activity size={14} />}>
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs text-gray-500">30 phút trước ← → Hiện tại</span>
                            <span className="text-xs font-semibold text-blue-600">{rt.realtime.activeUsers} đang online</span>
                        </div>
                        <BarChart
                            data={rt.realtime.minuteChart.map((m, i) => ({
                                label: i % 5 === 0 ? `${m.minutesAgo}p` : "",
                                value: m.users,
                            }))}
                            color="bg-blue-500"
                            h="h-24"
                        />
                    </Card>

                    {/* Realtime details grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {/* Pages by path */}
                        <Card title="Đường dẫn trang & lớp màn hình" icon={<Eye size={14} />} noPad>
                            <DT headers={["Đường dẫn trang", "↓ Người dùng", "Số lần xem"]}
                                rows={rt.realtime.byPagePath.map(p => [p.path, p.users, p.views])} />
                        </Card>

                        {/* Pages by title */}
                        <Card title="Tiêu đề trang" icon={<Layout size={14} />} noPad>
                            <DT headers={["Tiêu đề trang", "Người dùng", "Số lần xem"]}
                                rows={rt.realtime.byPage.map(p => [p.page, p.users, p.views])} />
                        </Card>

                        {/* Events */}
                        <Card title="Sự kiện theo thời gian thực" icon={<Zap size={14} />} noPad>
                            <DT headers={["Tên sự kiện", "Số lượng sự kiện"]}
                                rows={rt.realtime.events.map(e => [e.name, e.count])} />
                        </Card>

                        {/* Countries */}
                        <Card title="Quốc gia" icon={<Globe size={14} />} noPad>
                            <DT headers={["Quốc gia", "Người dùng"]}
                                rows={rt.realtime.byCountry.map(c => [c.country, c.users])} />
                        </Card>

                        {/* Cities */}
                        <Card title="Thành phố" icon={<MapPin size={14} />} noPad>
                            <DT headers={["Thành phố", "Người dùng"]}
                                rows={rt.realtime.byCity.map(c => [c.city, c.users])} />
                        </Card>

                        {/* Sources */}
                        <Card title="Nguồn cho người dùng lần đầu" icon={<MousePointerClick size={14} />} noPad>
                            <DT headers={["Nguồn", "Người dùng"]}
                                rows={rt.realtime.bySource.map(s => [s.source, s.users])} />
                        </Card>

                        {/* Devices */}
                        <Card title="Thiết bị" icon={<Monitor size={14} />}>
                            <div className="space-y-3">
                                {rt.realtime.byDevice.map((d, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700 flex items-center gap-2"><DIcon d={d.device} />{d.device}</span>
                                        <span className="text-sm font-bold text-gray-900">{d.users}</span>
                                    </div>
                                ))}
                                {!rt.realtime.byDevice.length && <p className="text-gray-400 text-sm text-center">Chưa có dữ liệu</p>}
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* ═══════════ OVERVIEW TAB ═══════════ */}
            {tab === "overview" && !ov && (
                <div className="py-20 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
                    <BarChart3 className="text-gray-300 mb-3" size={40} />
                    <p className="text-gray-500 font-semibold mb-1">Chưa có dữ liệu tổng quan tải xuống</p>
                    <p className="text-gray-400 text-sm max-w-sm">Dữ liệu sẽ xuất hiện khi Dashboard kết nối thành công với kho lưu trữ Analytics của bạn.</p>
                </div>
            )}
            {tab === "overview" && ov && (
                <>
                    <div className="flex items-center gap-2 mb-4">
                        <Tabs tabs={[{ id: "today", label: "Hôm nay" }, { id: "monthly", label: "30 ngày" }]} active={period} onChange={(id) => setPeriod(id as any)} />
                    </div>

                    {/* KPIs */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 mb-5">
                        {[
                            { l: "Người dùng", v: stats?.users, p: cmp?.users, icon: <Users size={15} />, c: "text-blue-600" },
                            { l: "Người mới", v: stats?.newUsers, p: cmp?.newUsers, icon: <UserPlus size={15} />, c: "text-emerald-600" },
                            { l: "Lượt xem", v: stats?.pageViews, p: cmp?.pageViews, icon: <Eye size={15} />, c: "text-purple-600" },
                            { l: "Phiên", v: stats?.sessions, p: cmp?.sessions, icon: <Activity size={15} />, c: "text-indigo-600" },
                            { l: "T.gian TB", v: stats?.avgDuration, p: cmp?.avgDuration, icon: <Clock size={15} />, c: "text-amber-600", fmt: fmtDur },
                            { l: "Tỷ lệ thoát", v: stats?.bounceRate, p: cmp?.bounceRate, icon: <ArrowUpRight size={15} />, c: "text-red-500", fmt: fmtPct },
                            { l: "Sự kiện", v: stats?.events, p: cmp?.events, icon: <Zap size={15} />, c: "text-orange-500" },
                        ].map((k, i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={k.c}>{k.icon}</span>
                                    {cmp && <Badge current={k.v || 0} previous={k.p || 0} />}
                                </div>
                                <p className="text-xl font-bold text-gray-900">{k.fmt ? k.fmt(k.v || 0) : fmtN(k.v || 0)}</p>
                                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mt-0.5">{k.l}</p>
                            </div>
                        ))}
                    </div>

                    {/* Chart + New vs Return */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
                        <Card title="Lượt xem trang — 7 ngày qua" icon={<BarChart3 size={14} />} className="lg:col-span-2">
                            <BarChart data={ov.weeklyChart.map(d => ({ label: d.date, value: d.pageViews }))} color="bg-blue-500" />
                            <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-4 gap-4">
                                {[
                                    { l: "Users", v: ov.weeklyChart.reduce((s, d) => s + d.users, 0) },
                                    { l: "Views", v: ov.weeklyChart.reduce((s, d) => s + d.pageViews, 0) },
                                    { l: "Sessions", v: ov.weeklyChart.reduce((s, d) => s + d.sessions, 0) },
                                    { l: "New", v: ov.weeklyChart.reduce((s, d) => s + d.newUsers, 0) },
                                ].map((s, i) => (
                                    <div key={i} className="text-center">
                                        <p className="text-lg font-bold text-gray-800">{fmtN(s.v)}</p>
                                        <p className="text-[9px] text-gray-400 font-semibold uppercase">{s.l}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card title="Mới vs Quay lại" icon={<Users size={14} />}>
                            <div className="space-y-4">
                                {ov.newVsReturn.map((nr, i) => {
                                    const t = ov.newVsReturn.reduce((s, n) => s + n.users, 0) || 1;
                                    const label = nr.type === "new" ? "Người mới" : nr.type === "returning" ? "Quay lại" : nr.type;
                                    const color = nr.type === "new" ? "bg-emerald-500" : "bg-blue-500";
                                    return (
                                        <div key={i}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-700 font-medium">{label}</span>
                                                <span className="font-semibold text-gray-900">{fmtN(nr.users)} ({((nr.users / t) * 100).toFixed(0)}%)</span>
                                            </div>
                                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                                <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${(nr.users / t) * 100}%` }} />
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-0.5">{fmtN(nr.sessions)} phiên</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    </div>

                    {/* 30 day summary */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5">
                        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
                            <h3 className="text-sm font-bold text-gray-700 shrink-0">📊 Tổng 30 ngày</h3>
                            <div className="flex flex-wrap gap-8 justify-center">
                                {[
                                    { l: "Users", v: ov.monthly.users, c: "text-blue-700" },
                                    { l: "New", v: ov.monthly.newUsers, c: "text-emerald-700" },
                                    { l: "Views", v: ov.monthly.pageViews, c: "text-purple-700" },
                                    { l: "Sessions", v: ov.monthly.sessions, c: "text-indigo-700" },
                                    { l: "Avg Time", v: ov.monthly.avgDuration, c: "text-amber-700", fmt: fmtDur },
                                ].map((s, i) => (
                                    <div key={i} className="text-center">
                                        <p className={`text-xl font-bold ${s.c}`}>{s.fmt ? s.fmt(s.v) : fmtN(s.v)}</p>
                                        <p className="text-[9px] text-gray-500 uppercase font-bold">{s.l}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ═══════════ AUDIENCE TAB ═══════════ */}
            {tab === "audience" && !ov && <div className="py-20 text-center text-gray-400 font-medium">Đang chờ tải dữ liệu phân tích đối tượng...</div>}
            {tab === "audience" && ov && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    <Card title="Thiết bị" icon={<Monitor size={14} />}>
                        <div className="space-y-3">{ov.devices.map((d, i) => (
                            <PBar key={i} label={d.device} value={d.users} total={totalDev} extra={`${fmtN(d.sessions)} phiên`}
                                color={d.device.toLowerCase().includes("mobile") ? "bg-blue-500" : d.device.toLowerCase().includes("tablet") ? "bg-purple-500" : "bg-gray-500"} />
                        ))}</div>
                    </Card>
                    <Card title="Trình duyệt" icon={<Chrome size={14} />}>
                        <div className="space-y-3">{ov.browsers.map((b, i) => {
                            const cs = ["bg-blue-500", "bg-orange-500", "bg-emerald-500", "bg-purple-500", "bg-red-500", "bg-yellow-500", "bg-cyan-500", "bg-pink-500"];
                            return <PBar key={i} label={b.browser} value={b.users} total={totalBr} color={cs[i % cs.length]} />;
                        })}</div>
                    </Card>
                    <Card title="Hệ điều hành" icon={<Layout size={14} />}>
                        <div className="space-y-3">{ov.os.map((o, i) => {
                            const cs = ["bg-gray-700", "bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500"];
                            return <PBar key={i} label={o.os} value={o.users} total={totalOs} color={cs[i % cs.length]} />;
                        })}</div>
                    </Card>
                    <Card title="Quốc gia" icon={<Globe size={14} />} noPad>
                        <DT headers={["Quốc gia", "Người dùng", "Phiên"]} rows={ov.countries.map(c => [c.country, c.users, c.sessions])} />
                    </Card>
                    <Card title="Thành phố" icon={<MapPin size={14} />} noPad>
                        <DT headers={["Thành phố", "Người dùng", "Phiên"]} rows={ov.cities.map(c => [c.city, c.users, c.sessions])} />
                    </Card>
                    <Card title="Độ phân giải" icon={<Layers size={14} />}>
                        <div className="space-y-3">{ov.screens.map((s, i) => {
                            const t = ov.screens.reduce((sum, x) => sum + x.users, 0) || 1;
                            return <PBar key={i} label={s.resolution} value={s.users} total={t} color="bg-indigo-500" />;
                        })}</div>
                    </Card>
                </div>
            )}

            {/* ═══════════ CONTENT TAB ═══════════ */}
            {tab === "content" && !ov && <div className="py-20 text-center text-gray-400 font-medium">Đang chờ tải dữ liệu chi tiết trang...</div>}
            {tab === "content" && ov && (
                <Card title="Top trang — 7 ngày qua" icon={<Eye size={14} />} noPad>
                    <DT headers={["Trang", "Tiêu đề", "Lượt xem", "Người dùng", "T.gian TB", "Thoát"]}
                        rows={ov.topPages.map(p => [p.path, p.title || "—", p.views, p.users, fmtDur(p.avgDuration), fmtPct(p.bounceRate)])} />
                </Card>
            )}

            {/* ═══════════ ACQUISITION TAB ═══════════ */}
            {tab === "acquisition" && !ov && <div className="py-20 text-center text-gray-400 font-medium">Đang chờ tải dữ liệu nguồn truy cập...</div>}
            {tab === "acquisition" && ov && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card title="Kênh truy cập — 7 ngày" icon={<Globe size={14} />} noPad>
                        <DT headers={["Kênh", "Phiên", "Users", "Mới", "Thoát"]}
                            rows={ov.sources.map(s => [s.channel, s.sessions, s.users, s.newUsers, fmtPct(s.bounceRate)])} />
                    </Card>
                    <Card title="Nguồn / Phương tiện" icon={<MousePointerClick size={14} />} noPad>
                        <DT headers={["Nguồn", "Phương tiện", "Phiên", "Users"]}
                            rows={ov.sourceMedium.map(s => [s.source || "(direct)", s.medium || "(none)", s.sessions, s.users])} />
                    </Card>
                </div>
            )}

            {/* ═══════════ EVENTS TAB ═══════════ */}
            {tab === "events" && !ov && <div className="py-20 text-center text-gray-400 font-medium">Đang chờ tải thống kê sự kiện...</div>}
            {tab === "events" && ov && (
                <Card title="Sự kiện — 7 ngày qua" icon={<Zap size={14} />} noPad>
                    <DT headers={["Tên sự kiện", "Số lần", "TB / người"]}
                        rows={ov.events.map(e => [e.name, e.count, e.perUser.toFixed(2)])} />
                </Card>
            )}
        </div>
    );
}
