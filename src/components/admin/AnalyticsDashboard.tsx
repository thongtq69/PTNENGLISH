"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Activity, Users, Eye, Globe, Monitor, Smartphone, Tablet,
    TrendingUp, TrendingDown, Clock, BarChart3, ArrowUpRight,
    RefreshCw, Wifi, MapPin, MousePointerClick, ExternalLink,
    UserPlus, Zap, Chrome, Layout, Layers, ArrowDown
} from "lucide-react";

/* ───────────── Types ───────────── */
interface RealtimeData {
    realtime: {
        activeUsers: number;
        byCountry: { country: string; users: number }[];
        byPage: { page: string; users: number }[];
        byDevice: { device: string; users: number }[];
        bySource: { source: string; users: number }[];
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
function fmtDuration(s: number) {
    const m = Math.floor(s / 60);
    const sec = Math.round(s % 60);
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}
function fmtPct(v: number) { return `${(v * 100).toFixed(1)}%`; }
function fmtNum(v: number) { return v.toLocaleString("vi-VN"); }

function ChangeBadge({ current, previous }: { current: number; previous: number }) {
    if (previous === 0 && current === 0) return <span className="text-xs text-gray-400">—</span>;
    if (previous === 0) return <span className="text-xs font-semibold text-emerald-600">+∞</span>;
    const change = ((current - previous) / previous) * 100;
    const isUp = change >= 0;
    return (
        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${isUp ? "text-emerald-600" : "text-red-500"}`}>
            {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change).toFixed(1)}%
        </span>
    );
}

function DeviceIcon({ device }: { device: string }) {
    const d = device.toLowerCase();
    if (d.includes("mobile")) return <Smartphone size={14} className="text-blue-500" />;
    if (d.includes("tablet")) return <Tablet size={14} className="text-purple-500" />;
    return <Monitor size={14} className="text-gray-600" />;
}

/* Simple bar chart */
function BarChartSimple({ data, color = "bg-blue-500" }: { data: { label: string; value: number }[]; color?: string }) {
    const maxVal = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="flex items-end gap-[3px] h-28">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className="text-[9px] text-gray-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        {d.value}
                    </span>
                    <div
                        className={`w-full ${color} rounded-t transition-all duration-500 min-h-[2px] hover:opacity-80`}
                        style={{ height: `${(d.value / maxVal) * 100}%` }}
                    />
                    <span className="text-[9px] text-gray-400 leading-none font-medium">{d.label}</span>
                </div>
            ))}
        </div>
    );
}

/* Progress bar row */
function ProgressRow({ label, value, total, color = "bg-blue-500", suffix = "" }: { label: string; value: number; total: number; color?: string; suffix?: string }) {
    const pct = total > 0 ? (value / total) * 100 : 0;
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 font-medium truncate flex-1 mr-2">{label}</span>
                <span className="text-gray-900 font-semibold shrink-0">{fmtNum(value)}{suffix}</span>
                <span className="text-gray-400 text-xs ml-2 w-12 text-right">{pct.toFixed(0)}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${Math.max(pct, 1)}%` }} />
            </div>
        </div>
    );
}

/* Table component */
function DataTable({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100">
                        {headers.map((h, i) => (
                            <th key={i} className={`py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ${i === 0 ? "text-left" : "text-right"}`}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-blue-50/40 transition-colors">
                            {row.map((cell, j) => (
                                <td key={j} className={`py-2.5 px-3 ${j === 0 ? "text-left text-gray-700 font-medium" : "text-right text-gray-600"}`}>
                                    {typeof cell === "number" ? fmtNum(cell) : cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {rows.length === 0 && (
                        <tr><td colSpan={headers.length} className="py-6 text-center text-gray-400 text-sm">Chưa có dữ liệu</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

/* Card wrapper */
function Card({ title, icon, children, className = "" }: { title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${className}`}>
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                {icon && <span className="text-gray-400">{icon}</span>}
                <h3 className="text-sm font-bold text-gray-800">{title}</h3>
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

/* Tab component */
function Tabs({ tabs, active, onChange }: { tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void }) {
    return (
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
            {tabs.map(t => (
                <button
                    key={t.id}
                    onClick={() => onChange(t.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${active === t.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                    {t.label}
                </button>
            ))}
        </div>
    );
}

/* ═══════════ MAIN COMPONENT ═══════════ */
export default function AnalyticsDashboard() {
    const [realtime, setRealtime] = useState<RealtimeData | null>(null);
    const [overview, setOverview] = useState<OverviewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [period, setPeriod] = useState<"today" | "monthly">("today");
    const [activeTab, setActiveTab] = useState("overview");

    const fetchRealtime = useCallback(async () => {
        try {
            const res = await fetch("/api/analytics/realtime");
            if (!res.ok) throw new Error((await res.json()).error);
            setRealtime(await res.json());
            setLastUpdated(new Date());
        } catch (err: any) { setError(err.message); }
    }, []);

    const fetchOverview = useCallback(async () => {
        try {
            const res = await fetch("/api/analytics/overview");
            if (!res.ok) throw new Error((await res.json()).error);
            setOverview(await res.json());
        } catch (err: any) { setError(err.message); }
    }, []);

    useEffect(() => {
        Promise.all([fetchRealtime(), fetchOverview()]).finally(() => setLoading(false));
        const rt = setInterval(fetchRealtime, 15000);
        const ov = setInterval(fetchOverview, 300000);
        return () => { clearInterval(rt); clearInterval(ov); };
    }, [fetchRealtime, fetchOverview]);

    if (loading) return (
        <div className="flex items-center justify-center py-20 bg-gray-50 rounded-2xl">
            <div className="text-center space-y-3">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent mx-auto" />
                <p className="text-gray-500 text-sm">Đang kết nối Google Analytics...</p>
            </div>
        </div>
    );

    if (error && !realtime && !overview) return (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-600 font-semibold mb-2">Lỗi kết nối Analytics</p>
            <p className="text-red-400 text-xs mb-4">{error}</p>
            <button onClick={() => { setLoading(true); Promise.all([fetchRealtime(), fetchOverview()]).finally(() => setLoading(false)); }}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition-all">Thử lại</button>
        </div>
    );

    const stats = period === "today" ? overview?.today : overview?.monthly;
    const comparisonStats = period === "today" ? overview?.yesterday : undefined;
    const totalDeviceUsers = overview?.devices?.reduce((s, d) => s + d.users, 0) || 1;
    const totalBrowserUsers = overview?.browsers?.reduce((s, d) => s + d.users, 0) || 1;
    const totalOsUsers = overview?.os?.reduce((s, d) => s + d.users, 0) || 1;
    const GA4_URL = "https://analytics.google.com/analytics/web/#/p526354898/reports/reportshub";

    return (
        <div className="bg-gray-50 -m-8 p-6 min-h-screen">
            {/* ───── HEADER ───── */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <BarChart3 className="text-white" size={22} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Analytics Dashboard</h1>
                        <p className="text-xs text-gray-500">ptnenglish.edu.vn • Google Analytics 4</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    {lastUpdated && <span className="text-[10px] text-gray-400">Cập nhật: {lastUpdated.toLocaleTimeString("vi-VN")}</span>}
                    <button onClick={() => { fetchRealtime(); fetchOverview(); }}
                        className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-all" title="Làm mới">
                        <RefreshCw size={14} />
                    </button>
                    <a href={GA4_URL} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 text-xs font-semibold hover:bg-blue-600 hover:text-white transition-all">
                        <ExternalLink size={12} /> Mở Google Analytics
                    </a>
                </div>
            </div>

            {/* ───── NAVIGATION TABS ───── */}
            <div className="mb-6">
                <Tabs
                    tabs={[
                        { id: "overview", label: "📊 Tổng quan" },
                        { id: "audience", label: "👥 Đối tượng" },
                        { id: "content", label: "📄 Nội dung" },
                        { id: "acquisition", label: "🔗 Nguồn truy cập" },
                        { id: "events", label: "⚡ Sự kiện" },
                    ]}
                    active={activeTab}
                    onChange={setActiveTab}
                />
            </div>

            {/* ═══════════ REALTIME BANNER ═══════════ */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-white">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                        </span>
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Thời gian thực</span>
                    </div>
                    <span className="text-[10px] text-gray-400">Tự cập nhật mỗi 15 giây</span>
                </div>
                <div className="p-5 flex flex-col sm:flex-row items-center gap-6">
                    <div className="text-center sm:text-left sm:w-48 shrink-0">
                        <p className="text-5xl font-bold text-gray-900">{realtime?.realtime?.activeUsers || 0}</p>
                        <p className="text-sm text-gray-500 mt-1">người dùng đang online</p>
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                        <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                            <p className="text-[10px] font-semibold text-gray-500 uppercase flex items-center gap-1"><Eye size={10} /> Trang đang xem</p>
                            {(realtime?.realtime?.byPage || []).slice(0, 3).map((p, i) => (
                                <div key={i} className="flex justify-between text-xs"><span className="text-gray-600 truncate flex-1 mr-2">{p.page}</span><span className="font-bold text-blue-600">{p.users}</span></div>
                            ))}
                            {!realtime?.realtime?.byPage?.length && <p className="text-xs text-gray-400">—</p>}
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                            <p className="text-[10px] font-semibold text-gray-500 uppercase flex items-center gap-1"><MapPin size={10} /> Quốc gia</p>
                            {(realtime?.realtime?.byCountry || []).slice(0, 3).map((c, i) => (
                                <div key={i} className="flex justify-between text-xs"><span className="text-gray-600">{c.country}</span><span className="font-bold text-emerald-600">{c.users}</span></div>
                            ))}
                            {!realtime?.realtime?.byCountry?.length && <p className="text-xs text-gray-400">—</p>}
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                            <p className="text-[10px] font-semibold text-gray-500 uppercase flex items-center gap-1"><Monitor size={10} /> Thiết bị</p>
                            {(realtime?.realtime?.byDevice || []).slice(0, 3).map((d, i) => (
                                <div key={i} className="flex justify-between text-xs"><span className="text-gray-600 flex items-center gap-1"><DeviceIcon device={d.device} />{d.device}</span><span className="font-bold text-gray-700">{d.users}</span></div>
                            ))}
                            {!realtime?.realtime?.byDevice?.length && <p className="text-xs text-gray-400">—</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════ TAB: OVERVIEW ═══════════ */}
            {activeTab === "overview" && overview && (
                <>
                    {/* Period selector */}
                    <div className="flex items-center gap-2 mb-4">
                        <Tabs tabs={[{ id: "today", label: "Hôm nay" }, { id: "monthly", label: "30 ngày" }]} active={period} onChange={(id) => setPeriod(id as any)} />
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">
                        {[
                            { label: "Người dùng", value: stats?.users, prev: comparisonStats?.users, icon: <Users size={16} />, color: "text-blue-600" },
                            { label: "Người mới", value: stats?.newUsers, prev: comparisonStats?.newUsers, icon: <UserPlus size={16} />, color: "text-emerald-600" },
                            { label: "Lượt xem", value: stats?.pageViews, prev: comparisonStats?.pageViews, icon: <Eye size={16} />, color: "text-purple-600" },
                            { label: "Phiên", value: stats?.sessions, prev: comparisonStats?.sessions, icon: <Activity size={16} />, color: "text-indigo-600" },
                            { label: "Thời gian TB", value: stats?.avgDuration, prev: comparisonStats?.avgDuration, icon: <Clock size={16} />, color: "text-amber-600", fmt: fmtDuration },
                            { label: "Tỷ lệ thoát", value: stats?.bounceRate, prev: comparisonStats?.bounceRate, icon: <ArrowUpRight size={16} />, color: "text-red-500", fmt: fmtPct },
                            { label: "Sự kiện", value: stats?.events, prev: comparisonStats?.events, icon: <Zap size={16} />, color: "text-orange-500" },
                        ].map((kpi, i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={kpi.color}>{kpi.icon}</span>
                                    {comparisonStats && <ChangeBadge current={kpi.value || 0} previous={kpi.prev || 0} />}
                                </div>
                                <p className="text-xl font-bold text-gray-900">{kpi.fmt ? kpi.fmt(kpi.value || 0) : fmtNum(kpi.value || 0)}</p>
                                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mt-0.5">{kpi.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Chart + Summary row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                        <Card title="Lượt xem trang — 7 ngày qua" icon={<BarChart3 size={14} />} className="lg:col-span-2">
                            <BarChartSimple data={overview.weeklyChart.map(d => ({ label: d.date, value: d.pageViews }))} color="bg-blue-500" />
                            <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-4 gap-4">
                                {[
                                    { l: "Users", v: overview.weeklyChart.reduce((s, d) => s + d.users, 0) },
                                    { l: "Views", v: overview.weeklyChart.reduce((s, d) => s + d.pageViews, 0) },
                                    { l: "Sessions", v: overview.weeklyChart.reduce((s, d) => s + d.sessions, 0) },
                                    { l: "New", v: overview.weeklyChart.reduce((s, d) => s + d.newUsers, 0) },
                                ].map((s, i) => (
                                    <div key={i} className="text-center">
                                        <p className="text-lg font-bold text-gray-800">{fmtNum(s.v)}</p>
                                        <p className="text-[9px] text-gray-400 font-semibold uppercase">{s.l}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card title="Người dùng mới vs Quay lại" icon={<Users size={14} />}>
                            <div className="space-y-4">
                                {overview.newVsReturn.map((nr, i) => {
                                    const totalU = overview.newVsReturn.reduce((s, n) => s + n.users, 0) || 1;
                                    const pct = (nr.users / totalU) * 100;
                                    const label = nr.type === "new" ? "Người mới" : nr.type === "returning" ? "Quay lại" : nr.type;
                                    const color = nr.type === "new" ? "bg-emerald-500" : "bg-blue-500";
                                    return (
                                        <div key={i}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-700 font-medium">{label}</span>
                                                <span className="font-semibold text-gray-900">{fmtNum(nr.users)} ({pct.toFixed(0)}%)</span>
                                            </div>
                                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                                <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-0.5">{fmtNum(nr.sessions)} phiên</p>
                                        </div>
                                    );
                                })}
                                {!overview.newVsReturn.length && <p className="text-gray-400 text-sm text-center py-4">Chưa có dữ liệu</p>}
                            </div>
                        </Card>
                    </div>

                    {/* 30-day summary */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5 mb-6">
                        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12">
                            <h3 className="text-sm font-bold text-gray-700 shrink-0">📊 Tổng kết 30 ngày</h3>
                            <div className="flex flex-wrap gap-8 justify-center">
                                {[
                                    { l: "Người dùng", v: overview.monthly.users, c: "text-blue-700" },
                                    { l: "Người mới", v: overview.monthly.newUsers, c: "text-emerald-700" },
                                    { l: "Lượt xem", v: overview.monthly.pageViews, c: "text-purple-700" },
                                    { l: "Phiên", v: overview.monthly.sessions, c: "text-indigo-700" },
                                    { l: "Thời gian TB", v: overview.monthly.avgDuration, c: "text-amber-700", fmt: fmtDuration },
                                ].map((s, i) => (
                                    <div key={i} className="text-center">
                                        <p className={`text-xl font-bold ${s.c}`}>{s.fmt ? s.fmt(s.v) : fmtNum(s.v)}</p>
                                        <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wide">{s.l}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ═══════════ TAB: AUDIENCE ═══════════ */}
            {activeTab === "audience" && overview && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {/* Devices */}
                        <Card title="Thiết bị" icon={<Monitor size={14} />}>
                            <div className="space-y-3">
                                {overview.devices.map((d, i) => (
                                    <ProgressRow key={i} label={d.device} value={d.users} total={totalDeviceUsers}
                                        color={d.device.toLowerCase().includes("mobile") ? "bg-blue-500" : d.device.toLowerCase().includes("tablet") ? "bg-purple-500" : "bg-gray-500"}
                                        suffix={` (${fmtNum(d.sessions)} phiên)`} />
                                ))}
                            </div>
                        </Card>

                        {/* Browsers */}
                        <Card title="Trình duyệt" icon={<Chrome size={14} />}>
                            <div className="space-y-3">
                                {overview.browsers.map((b, i) => {
                                    const colors = ["bg-blue-500", "bg-orange-500", "bg-emerald-500", "bg-purple-500", "bg-red-500", "bg-yellow-500", "bg-cyan-500", "bg-pink-500"];
                                    return <ProgressRow key={i} label={b.browser} value={b.users} total={totalBrowserUsers} color={colors[i % colors.length]} />;
                                })}
                            </div>
                        </Card>

                        {/* OS */}
                        <Card title="Hệ điều hành" icon={<Layout size={14} />}>
                            <div className="space-y-3">
                                {overview.os.map((o, i) => {
                                    const colors = ["bg-gray-700", "bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500"];
                                    return <ProgressRow key={i} label={o.os} value={o.users} total={totalOsUsers} color={colors[i % colors.length]} />;
                                })}
                            </div>
                        </Card>

                        {/* Countries */}
                        <Card title="Quốc gia" icon={<Globe size={14} />}>
                            <DataTable headers={["Quốc gia", "Người dùng", "Phiên"]}
                                rows={overview.countries.map(c => [c.country, c.users, c.sessions])} />
                        </Card>

                        {/* Cities */}
                        <Card title="Thành phố" icon={<MapPin size={14} />}>
                            <DataTable headers={["Thành phố", "Người dùng", "Phiên"]}
                                rows={overview.cities.map(c => [c.city, c.users, c.sessions])} />
                        </Card>

                        {/* Screen Resolutions */}
                        <Card title="Độ phân giải màn hình" icon={<Layers size={14} />}>
                            <div className="space-y-3">
                                {overview.screens.map((s, i) => {
                                    const totalScreens = overview.screens.reduce((sum, x) => sum + x.users, 0) || 1;
                                    return <ProgressRow key={i} label={s.resolution} value={s.users} total={totalScreens} color="bg-indigo-500" />;
                                })}
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* ═══════════ TAB: CONTENT ═══════════ */}
            {activeTab === "content" && overview && (
                <Card title="Top trang được xem — 7 ngày qua" icon={<Eye size={14} />}>
                    <DataTable
                        headers={["Trang", "Tiêu đề", "Lượt xem", "Người dùng", "Thời gian TB", "Thoát"]}
                        rows={overview.topPages.map(p => [
                            p.path, p.title || "—", p.views, p.users,
                            fmtDuration(p.avgDuration), fmtPct(p.bounceRate),
                        ])}
                    />
                </Card>
            )}

            {/* ═══════════ TAB: ACQUISITION ═══════════ */}
            {activeTab === "acquisition" && overview && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card title="Kênh truy cập — 7 ngày" icon={<Globe size={14} />}>
                            <DataTable
                                headers={["Kênh", "Phiên", "Người dùng", "Người mới", "Thoát"]}
                                rows={overview.sources.map(s => [s.channel, s.sessions, s.users, s.newUsers, fmtPct(s.bounceRate)])}
                            />
                        </Card>
                        <Card title="Nguồn / Phương tiện — 7 ngày" icon={<MousePointerClick size={14} />}>
                            <DataTable
                                headers={["Nguồn", "Phương tiện", "Phiên", "Người dùng"]}
                                rows={overview.sourceMedium.map(s => [s.source || "(direct)", s.medium || "(none)", s.sessions, s.users])}
                            />
                        </Card>
                    </div>
                </div>
            )}

            {/* ═══════════ TAB: EVENTS ═══════════ */}
            {activeTab === "events" && overview && (
                <Card title="Sự kiện — 7 ngày qua" icon={<Zap size={14} />}>
                    <DataTable
                        headers={["Tên sự kiện", "Số lần", "Trung bình / người"]}
                        rows={overview.events.map(e => [e.name, e.count, e.perUser.toFixed(2)])}
                    />
                </Card>
            )}
        </div>
    );
}
