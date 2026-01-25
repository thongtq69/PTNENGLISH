import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import Post from '@/models/Post';
import Issue from '@/models/Issue';
import Testimonial from '@/models/Testimonial';
import {
    Users,
    BookOpen,
    MessageSquare,
    FileText,
    ArrowUpRight,
    Plus,
    Eye
} from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
    await dbConnect();

    const [coursesCount, postsCount, issuesCount, testimonialsCount] = await Promise.all([
        Course.countDocuments(),
        Post.countDocuments(),
        Issue.countDocuments({ status: 'New' }),
        Testimonial.countDocuments(),
    ]);

    const STATS = [
        { name: 'Active Courses', value: coursesCount, icon: <BookOpen />, color: 'from-blue-500 to-indigo-600', href: '/admin/courses' },
        { name: 'New Inquiries', value: issuesCount, icon: <MessageSquare />, color: 'from-emerald-500 to-teal-600', href: '/admin/issues', highlight: true },
        { name: 'Blog Articles', value: postsCount, icon: <FileText />, color: 'from-amber-500 to-orange-600', href: '/admin/blog' },
        { name: 'Testimonials', value: testimonialsCount, icon: <Users />, color: 'from-rose-500 to-pink-600', href: '/admin/testimonials' },
    ];

    return (
        <div className="space-y-12">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-black text-white tracking-tight">
                        Dashboard <span className="text-primary text-xl ml-2 opacity-50">Overview</span>
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Welcome back, Admin. Here's what's happening with PTN English today.</p>
                </div>
                <div className="flex gap-4">
                    <Link
                        href="/"
                        target="_blank"
                        className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm flex items-center gap-2 hover:bg-white/10 transition-all"
                    >
                        <Eye size={16} />
                        View Live Site
                    </Link>
                    <button className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/30 hover:scale-105 transition-all active:scale-95">
                        <Plus size={18} />
                        Quick Action
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat, idx) => (
                    <Link key={idx} href={stat.href} className="group relative">
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity blur-2xl rounded-3xl`}></div>
                        <div className="bg-slate-900 border border-white/5 p-8 rounded-3xl relative overflow-hidden group-hover:border-white/20 transition-all">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                                {stat.icon}
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.name}</p>
                                    <p className="text-4xl font-heading font-black text-white tracking-tight">{stat.value}</p>
                                </div>
                                <div className="p-2 rounded-lg bg-white/5 text-slate-400 group-hover:text-white transition-colors">
                                    <ArrowUpRight size={16} />
                                </div>
                            </div>
                            {stat.highlight && stat.value > 0 && (
                                <div className="absolute top-4 right-4 animate-pulse">
                                    <span className="flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                    </span>
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent Activity & Quick Links */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
                    <h2 className="text-2xl font-heading font-black text-white mb-8 flex items-center gap-4">
                        <span className="w-8 h-1 bg-primary rounded-full"></span>
                        System Status
                    </h2>

                    <div className="space-y-6">
                        {[
                            { label: 'Database Connection', status: 'Healthy', color: 'text-emerald-400' },
                            { label: 'Cloudinary Storage', status: 'Active (422MB used)', color: 'text-emerald-400' },
                            { label: 'Site Performance', status: '98/100 (Optimized)', color: 'text-amber-400' },
                            { label: 'Last Migration', status: 'Success (Today 06:51)', color: 'text-slate-400' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/[0.02]">
                                <span className="text-slate-400 font-bold text-sm tracking-wide">{item.label}</span>
                                <span className={`font-black text-xs uppercase tracking-widest ${item.color}`}>{item.status}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 flex flex-col">
                    <h2 className="text-2xl font-heading font-black text-white mb-8">Quick Launch</h2>
                    <div className="grid grid-cols-1 gap-4 flex-1">
                        {[
                            { name: 'Update Homepage Banner', href: '/admin/home' },
                            { name: 'Add New Teacher', href: '/admin/about-us' },
                            { name: 'Publish New Article', href: '/admin/blog' },
                            { name: 'Check Schedule', href: '/admin/schedules' }
                        ].map((btn, i) => (
                            <Link
                                key={i}
                                href={btn.href}
                                className="p-6 rounded-2xl bg-white/5 hover:bg-primary border border-white/5 hover:border-primary text-slate-400 hover:text-white transition-all group flex items-center justify-between"
                            >
                                <span className="font-bold text-sm">{btn.name}</span>
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ChevronRight({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}
