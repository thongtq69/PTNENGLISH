"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { GraduationCap, Award, Star, MessageCircle } from "lucide-react";

const TEACHERS = [
    {
        id: 1,
        name: "Thầy Đặng Trần Phong",
        role: "Lead Portfolio / Founder",
        degree: "MA.TESOL (University of Canberra)",
        exp: "25+ Năm",
        specialty: "Chiến thuật IELTS, Academic Leadership",
        bio: "Nguyên Thủ khoa ngành Sư phạm Anh (ĐH Sư phạm TP.HCM) với hơn 25 năm kinh nghiệm giảng dạy tại các tổ chức uy tín như ACET, IDP và British Council.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600",
        stats: { students: "5k", rating: "5.0" },
    },
    {
        id: 2,
        name: "Cô Nguyễn Lê Quỳnh Trâm",
        role: "Lead Teacher / Advisor",
        degree: "MA.TESOL (University of Adelaide)",
        exp: "20+ Năm",
        specialty: "English for Teens, Academic English",
        bio: "Chuyên gia trong việc xây dựng lộ trình học thuật cho lứa tuổi phổ thông, từng là giảng viên tại ACET-IDP và Học viện Hàng không Quốc tế.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600",
        stats: { students: "3k", rating: "5.0" },
    },
    {
        id: 3,
        name: "Thầy Nguyễn Trí Nhân",
        role: "Academic Expert",
        degree: "MA.TESOL (University of Sydney)",
        exp: "25+ Năm",
        specialty: "Giao tiếp, Hợp tác Quốc tế",
        bio: "Học bổng Chính phủ Australia (Australia Awards), nguyên Trưởng phòng Hợp tác Quốc tế tại ĐH Quốc tế Hồng Bàng. Giảng viên tại UTS College và Deakin University.",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600",
        stats: { students: "4k", rating: "4.9" },
    },
    {
        id: 4,
        name: "Cô Đoàn Như Thục Quyên",
        role: "Senior Partner",
        degree: "MA.TESOL",
        exp: "15+ Năm",
        specialty: "IELTS Intensive, Foundation",
        bio: "Cố vấn học thuật tại ACET-IDP, từng giảng dạy các chương trình Tiếng Anh cao cấp cho đội ngũ Y bác sĩ và sĩ quan quân đội.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
        stats: { students: "2k", rating: "4.9" },
    }
];

export default function TeachersPage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <section className="pt-48 pb-32 bg-white border-b border-slate-100 text-center">
                <div className="container mx-auto px-6 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-block px-4 py-1.5 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-widest mb-8">
                            Your World-Class Academic Partners
                        </div>
                        <h1 className="text-5xl md:text-7xl font-heading font-semibold mb-10 text-accent leading-tight">
                            Đội Ngũ Giảng Viên <br />
                            Tâm Huyết & Chuyên Môn
                        </h1>
                        <p className="text-slate-500 text-xl font-body leading-relaxed mx-auto max-w-3xl">
                            "Mọi sự thành công của học viên đều bắt đầu từ sự dẫn dắt của những người thầy đủ Tâm và đủ Tầm."
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Teachers Grid */}
            <section className="py-32">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        {TEACHERS.map((teacher, idx) => (
                            <motion.div
                                key={teacher.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all group border border-slate-100 flex flex-col lg:flex-row"
                            >
                                {/* Image */}
                                <div className="w-full lg:w-72 h-80 lg:h-auto overflow-hidden relative">
                                    <img
                                        src={teacher.image}
                                        alt={teacher.name}
                                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>

                                {/* Content */}
                                <div className="p-10 lg:p-12 flex-1 flex flex-col text-center lg:text-left">
                                    <div className="mb-8">
                                        <div className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest w-fit mb-4 mx-auto lg:mx-0">
                                            {teacher.role}
                                        </div>
                                        <h3 className="text-3xl font-heading font-bold text-accent group-hover:text-primary transition-colors leading-tight">{teacher.name}</h3>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <p className="text-primary text-sm font-bold flex items-center justify-center lg:justify-start">
                                            <GraduationCap size={18} className="mr-3" /> {teacher.degree}
                                        </p>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center lg:justify-start">
                                            <Award size={16} className="mr-3 text-primary" /> Kinh nghiệm: {teacher.exp}
                                        </p>
                                    </div>

                                    <p className="text-slate-500 font-body text-sm leading-relaxed mb-10">
                                        "{teacher.bio}"
                                    </p>

                                    <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center text-accent font-bold text-xs uppercase tracking-widest">
                                            <Star size={14} className="mr-2 fill-accent" /> {teacher.stats.rating} | {teacher.stats.students}+ Students
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-colors cursor-pointer">
                                            <MessageCircle size={20} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Recruitment CTA */}
            <section className="py-32 bg-slate-900 overflow-hidden relative text-center">
                <div className="absolute top-0 right-0 w-1/4 h-full bg-secondary/20 -skew-x-12 translate-x-1/2"></div>
                <div className="container mx-auto px-6 relative z-10 max-w-4xl">
                    <h2 className="text-white text-3xl md:text-5xl font-heading font-semibold mb-10 leading-tight">Trở thành "Navigation Partner" tiếp theo?</h2>
                    <p className="text-slate-400 max-w-2xl mb-12 text-lg mx-auto leading-relaxed">
                        Chúng tôi luôn tìm kiếm những chuyên gia giáo dục sở hữu tâm huyết và chuyên môn cao để cùng cộng tác định hướng tương lai cho thế hệ học viên Việt Nam vươn xa toàn cầu.
                    </p>
                    <button className="bg-primary hover:bg-red-700 text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl shadow-red-500/20">
                        Ứng tuyển giảng viên ngay
                    </button>
                </div>
            </section>

            <Footer />
        </main>
    );
}
