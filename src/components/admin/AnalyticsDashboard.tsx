"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Activity, Users, Eye, Globe, Monitor, Smartphone, Tablet,
    TrendingUp, TrendingDown, Clock, BarChart3, ArrowUpRight,
    RefreshCw, Wifi, MapPin, MousePointerClick
} from "lucide-react";

interface RealtimeData {
    realtime: {
        activeUsers: number;
        byCountry: { country: string; users: number }[];
        byPage: { page: string; users: number }[];
        byDevice: { device: string; users: number }[];
        bySource: { source: string; users: number }[];
    };
    timestamp: string;
}

interface OverviewData {
    today: { users: number; pageViews: number; sessions: number; avgDuration: number; bounceRate: number };
    yesterday: { users: number; pageViews: number; sessions: number; avgDuration: number; bounceRate: number };
    weeklyChart: { date: string; users: number; pageViews: number }[];
    monthly: { users: number; pageViews: number; sessions: number };
    topPages: { path: string; views: number; users: number }[];
    sources: { channel: string; sessions: number; users: number }[];
    devices: { device: string; users: number }[];
    timestamp: string;
}

function formatDuration(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}m ${s}s`;
}

function ChangeBadge({ current, previous, suffix = "" }: { current: number; previous: number; suffix?: string }) {
    if (previous === 0) return <span className="text-xs text-slate-500">—</span>;
    const change = ((current - previous) / previous) * 100;
    const isUp = change >= 0;
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-bold ${isUp ? "text-emerald-400" : "text-red-400"}`}>
            {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change).toFixed(1)}%{suffix}
        </span>
    );
}

function DeviceIcon({ device }: { device: string }) {
    const d = device.toLowerCase();
    if (d.includes("mobile")) return <Smartphone size={14} />;
    if (d.includes("tablet")) return <Tablet size={14} />;
    return <Monitor size={14} />;
}

// Simple bar chart using CSS
function MiniChart({ data, maxVal }: { data: { label: string; value: number }[]; maxVal: number }) {
    return (
        <div className="flex items-end gap-1 h-20">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                        className="w-full bg-gradient-to-t from-primary/80 to-primary/40 rounded-t-sm transition-all duration-500 min-h-[2px]"
                        style={{ height: `${maxVal > 0 ? (d.value / maxVal) * 100 : 0}%` }}
                    />
                    <span className="text-[8px] text-slate-500 leading-none">{d.label}</span>
                </div>
            ))}
        </div>
    );
}

export default function AnalyticsDashboard() {
    const [realtime, setRealtime] = useState<RealtimeData | null>(null);
    const [overview, setOverview] = useState<OverviewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [realtimeLoading, setRealtimeLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchRealtime = useCallback(async () => {
        try {
            setRealtimeLoading(true);
            const res = await fetch("/api/analytics/realtime");
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to fetch realtime");
            }
            const data = await res.json();
            setRealtime(data);
            setLastUpdated(new Date());
            setError(null);
        } catch (err: any) {
            console.error("Realtime fetch error:", err);
            setError(err.message);
        } finally {
            setRealtimeLoading(false);
        }
    }, []);

    const fetchOverview = useCallback(async () => {
        try {
            const res = await fetch("/api/analytics/overview");
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to fetch overview");
            }
            const data = await res.json();
            setOverview(data);
            setError(null);
        } catch (err: any) {
            console.error("Overview fetch error:", err);
            setError(err.message);
        }
    }, []);

    useEffect(() => {
        Promise.all([fetchRealtime(), fetchOverview()]).finally(() => setLoading(false));

        // Auto-refresh realtime every 15 seconds
        const realtimeInterval = setInterval(fetchRealtime, 15000);
        // Refresh overview every 5 minutes
        const overviewInterval = setInterval(fetchOverview, 300000);

        return () => {
            clearInterval(realtimeInterval);
            clearInterval(overviewInterval);
        };
    }, [fetchRealtime, fetchOverview]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto" />
                    <p className="text-slate-400 text-sm">Đang kết nối Google Analytics...</p>
                </div>
            </div>
        );
    }

    if (error && !realtime && !overview) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
                <p className="text-red-400 font-bold mb-2">Lỗi kết nối Analytics</p>
                <p className="text-red-400/70 text-xs mb-4">{error}</p>
                <button onClick={() => { setLoading(true); Promise.all([fetchRealtime(), fetchOverview()]).finally(() => setLoading(false)); }} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all">
                    Thử lại
                </button>
            </div>
        );
    }

    const totalDeviceUsers = overview?.devices?.reduce((s, d) => s + d.users, 0) || 1;
    const maxChartVal = Math.max(...(overview?.weeklyChart?.map(d => d.pageViews) || [1]));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-heading font-black text-white tracking-tight flex items-center gap-3">
                        <BarChart3 className="text-primary" size={28} />
                        Analytics Dashboard
                    </h2>
                    <p className="text-slate-500 text-xs mt-1">
                        Dữ liệu trực tiếp từ Google Analytics 4
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {lastUpdated && (
                        <span className="text-[10px] text-slate-600">
                            Cập nhật: {lastUpdated.toLocaleTimeString("vi-VN")}
                        </span>
                    )}
                    <button
                        onClick={() => { fetchRealtime(); fetchOverview(); }}
                        disabled={realtimeLoading}
                        className={`p-2.5 rounded-xl border border-white/5 bg-white/5 text-slate-400 hover:text-primary hover:border-primary/30 transition-all ${realtimeLoading ? "animate-spin" : ""}`}
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            {/* ===== REALTIME SECTION ===== */}
            <div className="bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-[2rem] p-8 relative overflow-hidden">
                <div className="absolute top-4 right-6 flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                    <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Live</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Active Users Big Number */}
                    <div className="lg:w-56 shrink-0 text-center lg:text-left">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5 justify-center lg:justify-start">
                            <Wifi size={12} /> Đang hoạt động
                        </p>
                        <p className="text-6xl lg:text-7xl font-heading font-black text-white leading-none">
                            {realtime?.realtime?.activeUsers || 0}
                        </p>
                        <p className="text-slate-500 text-xs mt-2">người dùng trong 30 phút qua</p>
                    </div>

                    {/* Live Breakdown */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* By Page */}
                        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <Eye size={11} /> Trang đang xem
                            </p>
                            <div className="space-y-2">
                                {(realtime?.realtime?.byPage || []).slice(0, 5).map((p, i) => (
                                    <div key={i} className="flex items-center justify-between gap-2">
                                        <span className="text-[11px] text-slate-300 truncate flex-1" title={p.page}>{p.page}</span>
                                        <span className="text-xs font-black text-primary shrink-0">{p.users}</span>
                                    </div>
                                ))}
                                {(!realtime?.realtime?.byPage?.length) && <p className="text-slate-600 text-[10px]">Chưa có dữ liệu</p>}
                            </div>
                        </div>

                        {/* By Country */}
                        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <MapPin size={11} /> Quốc gia
                            </p>
                            <div className="space-y-2">
                                {(realtime?.realtime?.byCountry || []).slice(0, 5).map((c, i) => (
                                    <div key={i} className="flex items-center justify-between gap-2">
                                        <span className="text-[11px] text-slate-300 truncate flex-1">{c.country}</span>
                                        <span className="text-xs font-black text-emerald-400 shrink-0">{c.users}</span>
                                    </div>
                                ))}
                                {(!realtime?.realtime?.byCountry?.length) && <p className="text-slate-600 text-[10px]">Chưa có dữ liệu</p>}
                            </div>
                        </div>

                        {/* By Source */}
                        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <MousePointerClick size={11} /> Nguồn truy cập
                            </p>
                            <div className="space-y-2">
                                {(realtime?.realtime?.bySource || []).slice(0, 5).map((s, i) => (
                                    <div key={i} className="flex items-center justify-between gap-2">
                                        <span className="text-[11px] text-slate-300 truncate flex-1">{s.source}</span>
                                        <span className="text-xs font-black text-blue-400 shrink-0">{s.users}</span>
                                    </div>
                                ))}
                                {(!realtime?.realtime?.bySource?.length) && <p className="text-slate-600 text-[10px]">Chưa có dữ liệu</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== TODAY VS YESTERDAY ===== */}
            {overview && (
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    {[
                        { label: "Người dùng", icon: <Users size={16} />, today: overview.today.users, yesterday: overview.yesterday.users, format: (v: number) => v.toLocaleString() },
                        { label: "Lượt xem trang", icon: <Eye size={16} />, today: overview.today.pageViews, yesterday: overview.yesterday.pageViews, format: (v: number) => v.toLocaleString() },
                        { label: "Phiên truy cập", icon: <Activity size={16} />, today: overview.today.sessions, yesterday: overview.yesterday.sessions, format: (v: number) => v.toLocaleString() },
                        { label: "Thời gian TB", icon: <Clock size={16} />, today: overview.today.avgDuration, yesterday: overview.yesterday.avgDuration, format: (v: number) => formatDuration(v) },
                        { label: "Tỷ lệ thoát", icon: <ArrowUpRight size={16} />, today: overview.today.bounceRate * 100, yesterday: overview.yesterday.bounceRate * 100, format: (v: number) => `${v.toFixed(1)}%`, invertColor: true },
                    ].map((stat, i) => (
                        <div key={i} className="bg-slate-900 border border-white/5 rounded-2xl p-5 hover:border-primary/20 transition-all group">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-slate-500 group-hover:text-primary transition-colors">{stat.icon}</span>
                                <ChangeBadge current={stat.today} previous={stat.yesterday} />
                            </div>
                            <p className="text-xl lg:text-2xl font-heading font-black text-white">{stat.format(stat.today)}</p>
                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1">{stat.label} hôm nay</p>
                        </div>
                    ))}
                </div>
            )}

            {/* ===== CHARTS ROW ===== */}
            {overview && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Weekly Chart */}
                    <div className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-white font-bold text-sm">Lượt xem trang 7 ngày qua</h3>
                                <p className="text-slate-600 text-[10px] mt-0.5">Biểu đồ theo ngày</p>
                            </div>
                            <div className="bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 text-primary text-[10px] font-black">
                                Tổng: {overview.weeklyChart.reduce((s, d) => s + d.pageViews, 0).toLocaleString()}
                            </div>
                        </div>
                        <MiniChart
                            data={overview.weeklyChart.map(d => ({ label: d.date, value: d.pageViews }))}
                            maxVal={maxChartVal}
                        />
                    </div>

                    {/* Device Breakdown */}
                    <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                        <h3 className="text-white font-bold text-sm mb-5">Thiết bị (7 ngày)</h3>
                        <div className="space-y-4">
                            {overview.devices.map((d, i) => {
                                const pct = (d.users / totalDeviceUsers) * 100;
                                return (
                                    <div key={i} className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-300 text-xs flex items-center gap-2">
                                                <DeviceIcon device={d.device} />
                                                {d.device}
                                            </span>
                                            <span className="text-white font-bold text-xs">{pct.toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary to-primary/50 rounded-full transition-all duration-700"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                            {!overview.devices.length && <p className="text-slate-600 text-xs">Chưa có dữ liệu</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* ===== TOP PAGES & SOURCES ===== */}
            {overview && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Top Pages */}
                    <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                        <h3 className="text-white font-bold text-sm mb-5 flex items-center gap-2">
                            <Eye size={16} className="text-primary" />
                            Top trang được xem (7 ngày)
                        </h3>
                        <div className="space-y-2">
                            {overview.topPages.map((p, i) => (
                                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors group">
                                    <span className="text-[10px] font-black text-slate-600 w-5 text-right shrink-0">{i + 1}</span>
                                    <span className="text-xs text-slate-300 flex-1 truncate group-hover:text-white transition-colors" title={p.path}>{p.path}</span>
                                    <span className="text-[10px] text-slate-500 shrink-0">{p.users} users</span>
                                    <span className="text-xs font-black text-primary shrink-0">{p.views.toLocaleString()}</span>
                                </div>
                            ))}
                            {!overview.topPages.length && <p className="text-slate-600 text-xs">Chưa có dữ liệu</p>}
                        </div>
                    </div>

                    {/* Traffic Sources */}
                    <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                        <h3 className="text-white font-bold text-sm mb-5 flex items-center gap-2">
                            <Globe size={16} className="text-primary" />
                            Kênh truy cập (7 ngày)
                        </h3>
                        <div className="space-y-2">
                            {overview.sources.map((s, i) => {
                                const colors = ["text-emerald-400", "text-blue-400", "text-amber-400", "text-purple-400", "text-pink-400", "text-cyan-400", "text-orange-400", "text-lime-400"];
                                return (
                                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors">
                                        <span className={`w-2 h-2 rounded-full ${colors[i % colors.length].replace("text-", "bg-")} shrink-0`} />
                                        <span className="text-xs text-slate-300 flex-1">{s.channel}</span>
                                        <span className="text-[10px] text-slate-500 shrink-0">{s.users} users</span>
                                        <span className={`text-xs font-black ${colors[i % colors.length]} shrink-0`}>{s.sessions} phiên</span>
                                    </div>
                                );
                            })}
                            {!overview.sources.length && <p className="text-slate-600 text-xs">Chưa có dữ liệu</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* 30-day Summary */}
            {overview && (
                <div className="bg-gradient-to-r from-primary/10 via-slate-900 to-slate-900 border border-primary/20 rounded-2xl p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12">
                        <h3 className="text-white font-bold text-sm whitespace-nowrap">📊 Tổng kết 30 ngày</h3>
                        <div className="flex flex-wrap gap-8 justify-center">
                            <div className="text-center">
                                <p className="text-2xl font-heading font-black text-white">{overview.monthly.users.toLocaleString()}</p>
                                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Người dùng</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-heading font-black text-primary">{overview.monthly.pageViews.toLocaleString()}</p>
                                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Lượt xem</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-heading font-black text-emerald-400">{overview.monthly.sessions.toLocaleString()}</p>
                                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Phiên truy cập</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
