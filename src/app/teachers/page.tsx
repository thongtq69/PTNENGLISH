"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { GraduationCap, Award, Star, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const TEACHERS = [
    {
        id: 1,
        nameVi: "Thầy Đặng Trần Phong",
        nameEn: "Mr. Dang Tran Phong",
        role: "Lead Portfolio / Founder",
        degree: "MA.TESOL (University of Canberra)",
        expVi: "25+ Năm",
        expEn: "25+ Years",
        specialtyVi: "Chiến thuật IELTS, Academic Leadership",
        specialtyEn: "IELTS Strategy, Academic Leadership",
        bioVi: "Nguyên Thủ khoa ngành Sư phạm Anh (ĐH Sư phạm TP.HCM) với hơn 25 năm kinh nghiệm giảng dạy tại các tổ chức uy tín như ACET, IDP và British Council.",
        bioEn: "Former valedictorian in English Education (HCMC University of Education) with over 25 years of teaching at reputable institutions including ACET, IDP and British Council.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600",
        stats: { students: "5k", rating: "5.0" },
    },
    {
        id: 2,
        nameVi: "Cô Nguyễn Lê Quỳnh Trâm",
        nameEn: "Ms. Nguyen Le Quynh Tram",
        role: "Lead Teacher / Advisor",
        degree: "MA.TESOL (University of Adelaide)",
        expVi: "20+ Năm",
        expEn: "20+ Years",
        specialtyVi: "English for Teens, Academic English",
        specialtyEn: "English for Teens, Academic English",
        bioVi: "Chuyên gia trong việc xây dựng lộ trình học thuật cho lứa tuổi phổ thông, từng là giảng viên tại ACET-IDP và Học viện Hàng không Quốc tế.",
        bioEn: "Specialist in designing academic pathways for secondary learners. Formerly an instructor at ACET-IDP and the International Aviation Academy.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600",
        stats: { students: "3k", rating: "5.0" },
    },
    {
        id: 3,
        nameVi: "Thầy Nguyễn Trí Nhân",
        nameEn: "Mr. Nguyen Tri Nhan",
        role: "Academic Expert",
        degree: "MA.TESOL (University of Sydney)",
        expVi: "25+ Năm",
        expEn: "25+ Years",
        specialtyVi: "Giao tiếp, Hợp tác Quốc tế",
        specialtyEn: "Communication, International Cooperation",
        bioVi: "Học bổng Chính phủ Australia (Australia Awards), nguyên Trưởng phòng Hợp tác Quốc tế tại ĐH Quốc tế Hồng Bàng. Giảng viên tại UTS College và Deakin University.",
        bioEn: "Australia Awards scholar, former Head of International Cooperation at Hong Bang International University. Lecturer at UTS College and Deakin University.",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600",
        stats: { students: "4k", rating: "4.9" },
    },
    {
        id: 4,
        nameVi: "Cô Đoàn Như Thục Quyên",
        nameEn: "Ms. Doan Nhu Thuc Quyen",
        role: "Senior Partner",
        degree: "MA.TESOL",
        expVi: "15+ Năm",
        expEn: "15+ Years",
        specialtyVi: "IELTS Intensive, Foundation",
        specialtyEn: "IELTS Intensive, Foundation",
        bioVi: "Cố vấn học thuật tại ACET-IDP, từng giảng dạy các chương trình Tiếng Anh cao cấp cho đội ngũ Y bác sĩ và sĩ quan quân đội.",
        bioEn: "Academic advisor at ACET-IDP, formerly taught advanced English programs for medical professionals and military officers.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
        stats: { students: "2k", rating: "4.9" },
    }
];

export default function TeachersPage() {
    const { t, language } = useLanguage();
    const tp = t.teachersPage;
    const pick = (vi: string, en: string) => (language === "en" && en ? en : vi);

    return (
        <main className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-16 md:pt-48 md:pb-32 bg-white border-b border-slate-100 text-center">
                <div className="container mx-auto px-6 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-block px-4 py-1.5 rounded-full bg-accent text-white text-xs md:text-[10px] font-bold uppercase tracking-widest mb-6 md:mb-8">
                            {tp.heroBadge}
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-7xl font-heading font-semibold mb-6 md:mb-10 text-accent leading-tight">
                            {tp.heroTitle1} <br />
                            {tp.heroTitle2}
                        </h1>
                        <p className="text-slate-500 text-base md:text-xl font-body leading-relaxed mx-auto max-w-3xl">
                            {tp.heroQuote}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Teachers Grid */}
            <section className="py-16 md:py-32">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
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
                                        alt={pick(teacher.nameVi, teacher.nameEn)}
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
                                        <h3 className="text-3xl font-heading font-bold text-accent group-hover:text-primary transition-colors leading-tight">{pick(teacher.nameVi, teacher.nameEn)}</h3>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <p className="text-primary text-sm font-bold flex items-center justify-center lg:justify-start">
                                            <GraduationCap size={18} className="mr-3" /> {teacher.degree}
                                        </p>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center lg:justify-start">
                                            <Award size={16} className="mr-3 text-primary" /> {tp.experienceLabel}: {pick(teacher.expVi, teacher.expEn)}
                                        </p>
                                    </div>

                                    <p className="text-slate-500 font-body text-sm leading-relaxed mb-10">
                                        "{pick(teacher.bioVi, teacher.bioEn)}"
                                    </p>

                                    <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center text-accent font-bold text-xs uppercase tracking-widest">
                                            <Star size={14} className="mr-2 fill-accent" /> {teacher.stats.rating} | {teacher.stats.students}+ {tp.studentsSuffix}
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
            <section className="py-32 bg-accent overflow-hidden relative text-center">
                <div className="absolute top-0 right-0 w-1/4 h-full bg-secondary/20 -skew-x-12 translate-x-1/2"></div>
                <div className="container mx-auto px-6 relative z-10 max-w-4xl">
                    <h2 className="text-white text-3xl md:text-5xl font-heading font-semibold mb-10 leading-tight">{tp.ctaTitle}</h2>
                    <p className="text-slate-400 max-w-2xl mb-12 text-lg mx-auto leading-relaxed">
                        {tp.ctaDesc}
                    </p>
                    <button className="bg-primary hover:bg-red-700 text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl shadow-red-500/20">
                        {tp.ctaButton}
                    </button>
                </div>
            </section>

            <Footer />
        </main>
    );
}
