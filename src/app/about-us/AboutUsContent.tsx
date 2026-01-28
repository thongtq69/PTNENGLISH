"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Users, Compass, ShieldCheck, FileText, Lock, UserCheck, GraduationCap, Heart, MessageSquare, Laptop, Globe, ClipboardCheck, ArrowRight } from "lucide-react";
import React, { useState } from "react";

const TEACHERS = [
    {
        name: "Thầy Đặng Trần Phong (MA.TESOL)",
        image: "https://ptelc.edu.vn/wp-content/uploads/2022/07/gv-1-1-203x203.png",
        certs: "Thủ khoa Sư phạm Anh & MA.TESOL (Australia)",
        exp: "25+ năm kinh nghiệm giảng dạy tại ACET-IDP, ĐH Bách Khoa.",
        desc: "Nguyên HS chuyên Lê Hồng Phong, truyền cảm hứng học thuật sâu sắc."
    },
    {
        name: "Cô Nguyễn Lê Quỳnh Trâm (MA.TESOL)",
        image: "https://ptelc.edu.vn/wp-content/uploads/2022/07/gv2-1-1-203x203.png",
        certs: "Cử nhân Sư phạm Anh & MA.TESOL (Australia)",
        exp: "20+ năm kinh nghiệm tại ACET-IDP, ĐH Bách Khoa, Học viện Hàng không.",
        desc: "Kinh nghiệm quốc tế đa dạng, từng hỗ trợ SV quốc tế tại ĐH Adelaide."
    },
    {
        name: "Thầy Nguyễn Trí Nhân (MA.TESOL)",
        image: "http://ptelc.edu.vn/wp-content/uploads/2024/10/Thầy-Nhân-website-1-164x203.jpg",
        certs: "MA.TESOL (Uni of Sydney), Học bổng ADS - AUSAID",
        exp: "25+ năm kinh nghiệm, nguyên Trưởng phòng HTQT ĐH Hồng Bàng.",
        desc: "Từng giảng dạy tại UTS College & ĐH Deakin (Melbourne)."
    },
    {
        name: "Cô Đoàn Như Thục Quyên (MA.TESOL)",
        image: "http://ptelc.edu.vn/wp-content/uploads/2025/06/Ms.-Quyên-1-199x203.jpg",
        certs: "MA.TESOL (University of Canberra)",
        exp: "15+ năm kinh nghiệm, Cố vấn Học vụ tại ACET-IDP.",
        desc: "Chuyên gia đào tạo Anh ngữ cho bác sĩ BV 175 và lực lượng gìn giữ hòa bình."
    }
];

const PHILOSOPHY = [
    {
        title: "Học thuật",
        desc: "Dạy học có chiều sâu, chú trọng nền tảng vững thay vì các mẹo làm bài ngắn hạn.",
        icon: <BookOpen className="w-8 h-8" />
    },
    {
        title: "Nhân văn",
        desc: "Tôn trọng nhịp tiến bộ riêng, lắng nghe và thấu hiểu nhu cầu của từng học viên.",
        icon: <Users className="w-8 h-8" />
    },
    {
        title: "Đồng hành",
        desc: "Partner To Navigate - không chỉ là giáo viên, chúng tôi là người dẫn đường tận tâm.",
        icon: <Compass className="w-8 h-8" />
    }
];

const POLICIES = [
    { title: "Thông tin công khai", icon: <ShieldCheck className="w-5 h-5 text-primary" /> },
    { title: "Điều khoản & Quy định", icon: <FileText className="w-5 h-5 text-primary" /> },
    { title: "Chính sách bảo mật", icon: <Lock className="w-5 h-5 text-primary" /> },
    { title: "Quy định học viên", icon: <UserCheck className="w-5 h-5 text-primary" /> }
];

const VALUES = [
    { title: "Tận tâm", desc: "Luôn đặt sự tiến bộ của học viên làm ưu tiên hàng đầu." },
    { title: "Chuyên nghiệp", desc: "Đội ngũ MA.TESOL với phương pháp sư phạm chuẩn quốc tế." },
    { title: "Minh bạch", desc: "Quy trình đào tạo và đánh giá rõ ràng, trung thực." },
    { title: "Đổi mới", desc: "Cập nhật tài liệu và phương pháp dạy học theo xu hướng mới nhất." }
];

const NEW_DIFFERENCES = [
    {
        id: 1,
        title: "Teacher‑led",
        fullTitle: "Trung tâm được dẫn dắt bởi giáo viên",
        desc: "PTN English được xây dựng và vận hành bởi đội ngũ giáo viên, không phải bởi mô hình kinh doanh. Mọi quyết định về chương trình, phương pháp và lộ trình học tập đều xuất phát từ trải nghiệm giảng dạy thực tế trong lớp học và nhu cầu thật của người học.\nChúng tôi tin rằng chất lượng giáo dục bền vững chỉ có thể được dẫn dắt bởi những người trực tiếp đứng lớp, hiểu người học và chịu trách nhiệm cho sự tiến bộ của họ.",
        icon: <UserCheck className="w-6 h-6" />
    },
    {
        id: 2,
        title: "Academic Focus",
        fullTitle: "Nền tảng học thuật đi trước kỹ thuật làm bài",
        desc: "PTN English không tiếp cận tiếng Anh như một tập hợp mẹo thi. Chúng tôi đặt trọng tâm vào:\n• Nền tảng ngôn ngữ\n• Tư duy học thuật\n• Khả năng lập luận và diễn đạt rõ ràng\nKỹ thuật làm bài IELTS hay PTE được xây dựng trên nền tảng đó, giúp học viên sử dụng tiếng Anh hiệu quả trong học tập và cuộc sống.",
        icon: <GraduationCap className="w-6 h-6" />
    },
    {
        id: 3,
        title: "Local Insight",
        fullTitle: "Am hiểu sâu người học Việt Nam",
        desc: "Đội ngũ giảng viên PTN English trưởng thành từ các môi trường học thuật quốc tế như ACET và các trường đại học Úc. Chúng tôi hiểu rõ:\n• Vì sao học viên gặp khó khăn khi viết và nói\n• Lỗi nằm ở tư duy và cấu trúc diễn đạt\n• Cách hướng dẫn để học viên tiến bộ bền vững, không phụ thuộc vào khuôn mẫu.",
        icon: <Heart className="w-6 h-6" />
    },
    {
        id: 4,
        title: "Personal Feedback",
        fullTitle: "Phản hồi cá nhân hóa từng người học",
        desc: "Một trong những khác biệt lớn nhất tại PTN English là feedback chi tiết và có định hướng. Bài viết và phần nói được nhận xét cụ thể, không chung chung. Học viên được chỉ ra vì sao sai, cần cải thiện điều gì, và làm thế nào để tốt hơn. Sự tiến bộ được theo dõi qua từng giai đoạn.",
        icon: <MessageSquare className="w-6 h-6" />
    },
    {
        id: 5,
        title: "Small Classes",
        fullTitle: "Lớp học quy mô nhỏ & lộ trình rõ ràng",
        desc: "PTN English duy trì quy mô lớp học phù hợp để đảm bảo giáo viên có thể theo sát từng học viên, tạo không gian trao đổi và được lắng nghe. Mỗi học viên đều có lộ trình học tập rõ ràng, được điều chỉnh linh hoạt thay vì học theo một khuôn cố định cho tất cả.",
        icon: <Users className="w-6 h-6" />
    },
    {
        id: 6,
        title: "Blended Learning",
        fullTitle: "Học tập liên tục trong & ngoài lớp",
        desc: "Việc học tại PTN English không dừng lại khi buổi học kết thúc:\n• Trên lớp: Hướng dẫn, thảo luận và phản hồi trực tiếp\n• Ngoài lớp: Luyện tập qua hệ thống LMS, Google Classroom và Cambridge One\nCách học này giúp duy trì nhịp học đều đặn và phát triển năng lực tự học.",
        icon: <Laptop className="w-6 h-6" />
    },
    {
        id: 7,
        title: "Global Connect",
        fullTitle: "Kết nối học thuật quốc tế luôn cập nhật",
        desc: "Chúng tôi duy trì kết nối chặt chẽ với cộng đồng giáo dục quốc tế qua:\n• Sử dụng 100% giáo trình gốc của Cambridge University Press\n• Hợp tác theo chuẩn của các tổ chức khảo thí IELTS và PTE\n• Đội ngũ giảng viên tham gia tích cực các hoạt động học thuật quốc tế.",
        icon: <Globe className="w-6 h-6" />
    },
    {
        id: 8,
        title: "Partner To Navigate",
        fullTitle: "Đồng hành để định hướng tương lai",
        desc: "PTN English lựa chọn vai trò đối tác đồng hành, hỗ trợ người học hiểu mình đang ở đâu, xác định hướng đi phù hợp và tự tin bước tiếp trên con đường học tập lâu dài. Thành công không chỉ là điểm số, mà là năng lực và sự tự tin sau khi rời lớp học.",
        icon: <Compass className="w-6 h-6" />
    },
    {
        id: 9,
        title: "Academic Advising",
        fullTitle: "Tư vấn học thuật cá nhân hóa 1:1",
        desc: "Mỗi học viên có buổi tư vấn riêng với giáo viên để:\n• Giải đáp thắc mắc chuyên sâu về Writing/Speaking\n• Xây dựng chiến lược và định hướng học thuật\n• Rà soát tiến độ và điều chỉnh lộ trình cá nhân hóa\nGiúp học viên hiểu rõ vị thế bản thân và cách thức tối ưu để tiến bộ.",
        icon: <ClipboardCheck className="w-6 h-6" />
    }
];

export default function AboutUsContent({ pageData }: { pageData: any }) {
    const sections = pageData?.sections || [];
    const storyData = sections.find((s: any) => s.type === 'about-story')?.content || {};
    const teacherFromDB = sections.find((s: any) => s.type === 'about-teachers')?.content?.items;
    const teachersToDisplay = (teacherFromDB && teacherFromDB.length > 0) ? teacherFromDB : TEACHERS;

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section - Fixed overlap and adjusted padding */}
            <section className="pt-48 pb-16 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl"
                    >
                        <h1 className="text-primary font-heading font-bold text-sm uppercase tracking-[0.4em] mb-4">
                            Về Chúng Tôi
                        </h1>
                        <h2 className="text-4xl md:text-6xl font-heading font-medium text-accent mb-6 leading-tight">
                            Kiến tạo hành trình <br /> tri thức cùng <span className="text-primary font-bold">PTN</span> <span className="text-accent font-bold">English</span>
                        </h2>
                        <p className="text-lg md:text-xl text-slate-600 font-serif leading-relaxed max-w-2xl not-italic border-l-4 border-primary pl-6 py-1">
                            "Đồng hành – Tận tâm – Bền vững: Để mỗi người học đều có một hành trình tiếng Anh của riêng mình."
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Story Section - Compacted */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex flex-col h-full justify-center"
                        >
                            <h3 className="text-3xl font-heading font-black text-accent mb-8 flex items-center gap-4">
                                <span className="w-12 h-1.5 bg-primary" />
                                Câu Chuyện Hình Thành
                            </h3>
                            <div className="space-y-6 text-lg text-slate-700 font-body leading-relaxed">
                                <p className="text-xl leading-snug">
                                    <span className="text-primary font-bold">PTN</span> <span className="text-accent font-bold">English</span> bắt đầu từ những lớp học tâm huyết của ba người thầy: <br />
                                    <span className="font-black text-accent border-b-2 border-primary/20">Phong – Trâm – Nhân</span>.
                                </p>
                                <p>
                                    Chúng tôi hiểu người học thực sự cần nền tảng vững chắc, sự dẫn dắt tận tâm và một lộ trình có ý nghĩa lâu dài thay vì những mẹo làm bài ngắn hạn.
                                </p>
                                <div className="bg-primary/5 p-8 border-l-[6px] border-primary rounded-r-2xl text-base shadow-sm">
                                    <p className="mb-3"><strong>PTN</strong> là viết tắt của ba người sáng lập.</p>
                                    <p><strong>PTN</strong> là tinh thần <strong>Partner To Navigate</strong> – đồng hành để định hướng.</p>
                                </div>
                                <p className="text-accent font-medium italic">
                                    "Thành công là sự tự tin khi học viên tự mình bước tiếp trên con đường học tập và cuộc sống."
                                </p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-xl">
                                <img
                                    src={storyData?.image || "https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-6/592696975_798019503192696_5381097215126223627_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=y7qZy0WgaVAQ7kNvwHVmX2S&_nc_oc=Adn0UnxILVl60OrEolmTkLzH8Mz93_7A2My7jQn7Ug6yVBkJwSxXoGxc8tNZvOUb5sA&_nc_zt=23&_nc_ht=scontent.fsgn2-6.fna&_nc_gid=HOFT5BaX3DDhVoFuNh3deQ&oh=00_AfrLYWdG1RSv7hkuK8s7RAlVQe-oJ3NdxoD9iS0RLdltPA&oe=69793819"}
                                    alt="Founder Story"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-[1.5rem] shadow-lg border border-slate-100 hidden md:block">
                                <p className="text-3xl font-heading font-black text-primary mb-0.5">25+</p>
                                <p className="uppercase tracking-widest text-[10px] font-bold text-accent">Năm Kinh Nghiệm</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Differences Hub Section - More Contrast, Compact */}
            <section className="py-20 bg-slate-100 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-accent rounded-full" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-primary font-heading font-black text-sm uppercase tracking-[0.3em] mb-4">The PTN Difference</h2>
                        <h3 className="text-3xl md:text-4xl font-heading font-extrabold mb-4 text-accent leading-tight">
                            Tại sao chọn <span className="text-primary">PTN</span> <span className="text-accent">English</span>?
                        </h3>
                        <p className="text-slate-600 font-body text-base">Hệ thống đào tạo học thuật chuyên sâu, đồng hành cùng sự phát triển của từng cá nhân.</p>
                    </div>

                    <DifferencesHub />
                </div>
            </section>

            {/* Combined Philosophy & Core Values Section - Improved Contrast */}
            <section className="py-20 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="bg-slate-100 rounded-[2.5rem] p-8 md:p-12 border border-slate-200 flex flex-col lg:grid lg:grid-cols-12 gap-10 items-stretch">

                        {/* Left: Philosophy */}
                        <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-center">
                            <div className="mb-8 lg:mb-0">
                                <h2 className="text-primary font-heading font-black text-xs uppercase tracking-[0.4em] mb-3">Philosophy</h2>
                                <h3 className="text-3xl font-heading font-black text-accent mb-6 italic">Triết lý Giáo dục</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-1 gap-4">
                                    {PHILOSOPHY.map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex gap-4 p-4 rounded-2xl bg-white/50 border border-slate-200 group hover:bg-white transition-all shadow-sm"
                                        >
                                            <div className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                {React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-5 h-5" })}
                                            </div>
                                            <div>
                                                <h4 className="font-heading font-bold text-accent text-base mb-0.5">{item.title}</h4>
                                                <p className="text-slate-600 text-[13px] leading-relaxed">{item.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: Core Values */}
                        <div className="lg:col-span-12 xl:col-span-7 flex flex-col justify-center">
                            <h2 className="text-primary font-heading font-black text-xs uppercase tracking-[0.4em] mb-3">Core Values</h2>
                            <h3 className="text-3xl font-heading font-black text-accent mb-6 italic">Giá trị Cốt lõi</h3>
                            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-2 gap-3">
                                {VALUES.map((val, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ y: -3 }}
                                        className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all group"
                                    >
                                        <div className="text-[10px] font-black text-primary/40 group-hover:text-primary transition-colors mb-1">0{idx + 1}</div>
                                        <h4 className="text-accent font-heading font-black mb-1.5 text-base uppercase tracking-tight">{val.title}</h4>
                                        <p className="text-slate-600 text-[12px] leading-snug font-medium line-clamp-2">{val.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Teachers Section - Hierarchical Layout */}
            <section id="teachers" className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-primary font-heading font-bold text-xs uppercase tracking-[0.4em] mb-4">The Leadership</h2>
                        <h3 className="text-3xl md:text-5xl font-heading font-extrabold text-accent leading-tight">
                            Hội đồng Sáng lập & <br /> Ban Giám đốc Học thuật
                        </h3>
                    </div>

                    {/* PTN Founders (First 3) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">
                        {teachersToDisplay.slice(0, 3).map((teacher: any, idx: number) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group"
                            >
                                <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl bg-white border border-slate-100">
                                    <img
                                        src={teacher.image}
                                        alt={teacher.name}
                                        className="w-full h-full object-cover transition-all duration-700 scale-105 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-accent via-accent/20 to-transparent opacity-0 group-hover:opacity-95 transition-all duration-500" />

                                    <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="w-12 h-1 bg-primary mb-6" />
                                        <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-3">Qualifications</p>
                                        <p className="text-white text-sm leading-relaxed mb-6 font-medium whitespace-pre-line">{teacher.certs}</p>
                                        <p className="text-white/70 text-xs leading-relaxed italic border-l-2 border-primary/50 pl-4 whitespace-pre-line">{teacher.desc}</p>
                                    </div>
                                    <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 text-white text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all shadow-xl">
                                        Founder / Board Member
                                    </div>
                                </div>
                                <div className="mt-8 text-center group-hover:text-primary transition-colors">
                                    <h4 className="font-heading font-bold text-2xl text-accent group-hover:text-primary transition-colors duration-300">{teacher.name}</h4>
                                    <div className="flex items-center justify-center gap-4 mt-3 opacity-60">
                                        <span className="h-px w-8 bg-slate-400" />
                                        <p className="text-[11px] text-accent font-black uppercase tracking-widest">{teacher.exp}</p>
                                        <span className="h-px w-8 bg-slate-400" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Academic Faculty (Others) */}
                    {teachersToDisplay.length > 3 && (
                        <div>
                            <div className="flex items-center gap-8 mb-16">
                                <div className="h-px flex-1 bg-slate-200" />
                                <h3 className="text-2xl font-heading font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                                    Đội ngũ Giảng viên Chuyên gia
                                </h3>
                                <div className="h-px flex-1 bg-slate-200" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {teachersToDisplay.slice(3).map((teacher: any, idx: number) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        className="group"
                                    >
                                        <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-lg bg-white border border-slate-100 transition-all duration-500">
                                            <img
                                                src={teacher.image}
                                                alt={teacher.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-accent/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <p className="text-white text-[10px] font-bold leading-tight line-clamp-3 whitespace-pre-line">
                                                    {teacher.certs}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-6 text-center">
                                            <h4 className="font-heading font-bold text-lg text-accent group-hover:text-primary transition-colors">{teacher.name}</h4>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 opacity-70 group-hover:opacity-100 transition-opacity">{teacher.exp}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Policies Section - Compacted */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="bg-slate-100 rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-200">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-2xl font-heading font-bold text-accent mb-4">Cam kết của <span className="text-primary font-bold">PTN</span> <span className="text-accent font-bold">English</span></h3>
                                <p className="text-slate-600 font-body mb-8 leading-relaxed text-base">
                                    Quyền lợi học viên được đảm bảo qua các chính sách minh bạch và tiêu chuẩn học thuật cao nhất.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {POLICIES.map((p, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:border-primary/30 cursor-pointer transition-all shadow-sm">
                                            {p.icon}
                                            <span className="text-[13px] font-bold text-slate-700">{p.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white rounded-[2rem] p-8 shadow-md border border-slate-200 ring-1 ring-primary/5">
                                <h4 className="text-primary font-heading font-black text-xl mb-4 text-center">Bạn cần tư vấn?</h4>
                                <button className="w-full bg-primary hover:bg-black text-white py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 transform">
                                    Đăng ký kiểm tra trình độ miễn phí
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main >
    );
}

function DifferencesHub() {
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <div className="relative min-h-[550px] flex items-center justify-center scale-100 md:scale-110">
            {/* Desktop Radial Layout */}
            <div className="hidden lg:block relative w-[750px] h-[750px]">
                {/* Connecting Lines and decorative rings */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                        <radialGradient id="lineGradient" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.05" />
                        </radialGradient>
                    </defs>
                    {/* Decorative circles removed as per request */}
                    {NEW_DIFFERENCES.map((_, idx) => {
                        const angle = (idx * 360) / NEW_DIFFERENCES.length;
                        const x2 = 375 + Math.cos((angle - 90) * (Math.PI / 180)) * 280;
                        const y2 = 375 + Math.sin((angle - 90) * (Math.PI / 180)) * 280;
                        return (
                            <motion.line
                                key={idx}
                                x1="375" y1="375" x2={x2} y2={y2}
                                stroke="url(#lineGradient)"
                                strokeWidth={hovered === NEW_DIFFERENCES[idx].id ? "2" : "1"}
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: hovered === NEW_DIFFERENCES[idx].id ? 0.8 : 0.2 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        );
                    })}
                </svg>

                {/* Center Content Area */}
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <div className="relative w-80 h-80 flex items-center justify-center pointer-events-auto">
                        <AnimatePresence mode="wait">
                            {hovered !== null ? (
                                <motion.div
                                    key={`detail-${hovered}`}
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 1.1, y: -10 }}
                                    transition={{ type: "spring", damping: 25, stiffness: 350 }}
                                    className="text-center p-10 bg-white rounded-full w-[440px] h-[440px] flex flex-col items-center justify-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] border border-slate-100/80 z-30"
                                >
                                    <motion.div
                                        initial={{ scale: 0.5 }}
                                        animate={{ scale: 1 }}
                                        className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner"
                                    >
                                        {React.cloneElement(NEW_DIFFERENCES.find(d => d.id === hovered)?.icon as React.ReactElement<any>, { className: "w-8 h-8" })}
                                    </motion.div>
                                    <h4 className="text-xl font-heading font-black mb-4 text-accent leading-tight max-w-[300px]">
                                        {NEW_DIFFERENCES.find(d => d.id === hovered)?.fullTitle}
                                    </h4>
                                    <p className="text-slate-500 font-body text-[13px] leading-relaxed max-w-[340px] whitespace-pre-line text-left px-6">
                                        {NEW_DIFFERENCES.find(d => d.id === hovered)?.desc}
                                    </p>
                                    <div className="mt-8 flex gap-1.5">
                                        {[...Array(3)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ opacity: [0.3, 1, 0.3] }}
                                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                                className="w-1.5 h-1.5 rounded-full bg-primary"
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="logo-center"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    className="flex flex-col items-center"
                                >
                                    {/* OFFICIAL PTN LOGO FORMAT */}
                                    <div className="flex flex-col items-center group">
                                        <span className="text-5xl font-heading font-extrabold tracking-tight">
                                            <span className="text-primary uppercase">PTN</span>
                                            <span className="text-accent uppercase"> English</span>
                                        </span>
                                        <div className="flex justify-between w-full mt-3 border-t border-slate-200 pt-3 text-accent/60">
                                            {"PARTNER TO NAVIGATE".split("").map((char, index) => (
                                                <span key={index} className="text-[11px] font-bold uppercase leading-none tracking-[0.1em]">
                                                    {char === " " ? "\u00A0" : char}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <motion.div
                                        animate={{ y: [0, 8, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                        className="mt-16 flex flex-col items-center"
                                    >
                                        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-400 mb-3">Explore our core values</span>
                                        <div className="w-px h-16 bg-gradient-to-b from-primary/60 to-transparent"></div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Orbiting Items */}
                {NEW_DIFFERENCES.map((item, idx) => {
                    const angle = (idx * 360) / NEW_DIFFERENCES.length;
                    const radius = 280; // Adjusted radius for better compactness
                    const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius;
                    const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius;

                    return (
                        <motion.div
                            key={item.id}
                            className="absolute top-1/2 left-1/2 z-30 cursor-pointer"
                            initial={false}
                            animate={{
                                x: `calc(${x}px - 50%)`,
                                y: `calc(${y}px - 50%)`,
                                scale: hovered === item.id ? 1.2 : 1,
                                opacity: hovered === null || hovered === item.id ? 1 : 0.5
                            }}
                            onMouseEnter={() => setHovered(item.id)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <div className="relative flex flex-col items-center group w-44">
                                {/* The Icon Button - Glassmorphism Style */}
                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 backdrop-blur-md ${hovered === item.id ? "bg-primary border-2 border-primary shadow-[0_0_40px_8px_rgba(199,0,43,0.4)] text-white" : "bg-accent border-2 border-white/10 text-white shadow-[0_12px_40px_-8px_rgba(0,0,0,0.3)] group-hover:border-primary/50 group-hover:shadow-[0_12px_40px_-4px_rgba(199,0,43,0.2)]"}`}>
                                    {React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-9 h-9" })}
                                </div>

                                {/* Always Visible Label */}
                                <div className={`mt-5 text-center px-2 transition-all duration-300 ${hovered === item.id ? "opacity-100 scale-105" : "opacity-90"}`}>
                                    <p className={`text-[12px] font-black uppercase tracking-wider leading-tight transition-colors ${hovered === item.id ? "text-primary" : "text-accent"}`}>
                                        {item.title}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

            </div>

            {/* Mobile Optimized Layout (Interactive Tabs) */}
            <div className="lg:hidden w-full flex flex-col gap-8">
                {/* Icon Tabs */}
                <div className="flex overflow-x-auto gap-5 pb-4 hide-scrollbar -mx-6 px-6">
                    {NEW_DIFFERENCES.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setHovered(item.id)}
                            className={`w-18 h-18 shrink-0 rounded-2xl flex items-center justify-center transition-all backdrop-blur-md ${hovered === item.id || (hovered === null && item.id === 1) ? "bg-primary border-2 border-primary text-white shadow-[0_0_30px_6px_rgba(199,0,43,0.35)]" : "bg-accent border-2 border-white/10 text-white shadow-[0_8px_32px_-4px_rgba(0,0,0,0.25)]"}`}
                            style={{ width: '72px', height: '72px' }}
                        >
                            {React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-8 h-8" })}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="bg-white border-2 border-slate-100 p-8 rounded-[2rem] shadow-xl relative min-h-[300px]">
                    <AnimatePresence mode="wait">
                        {(() => {
                            const activeItem = NEW_DIFFERENCES.find(d => d.id === (hovered || 1));
                            return (
                                <motion.div
                                    key={activeItem?.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-col"
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            {activeItem?.icon}
                                        </div>
                                        <h4 className="text-xl font-heading font-black text-accent uppercase leading-tight tracking-tighter">
                                            {activeItem?.title}
                                        </h4>
                                    </div>
                                    <h5 className="text-sm font-bold text-primary mb-3 uppercase tracking-widest">{activeItem?.fullTitle}</h5>
                                    <p className="text-slate-600 font-body text-sm leading-relaxed whitespace-pre-line">
                                        {activeItem?.desc}
                                    </p>
                                </motion.div>
                            );
                        })()}
                    </AnimatePresence>
                    {/* Architectural accent */}
                    <div className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-bl-2xl"></div>
                </div>

                <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-[0.3em]">
                    Click icons to explore differences
                </p>
            </div>
        </div>
    );
}
