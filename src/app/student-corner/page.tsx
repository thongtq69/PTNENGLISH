"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { BookOpen, ExternalLink, GraduationCap, ClipboardList, ArrowRight } from "lucide-react";
import HallOfFame from "@/components/HallOfFame";
import Link from "next/link";

export default function StudentCorner() {
    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="pt-40 pb-20 bg-accent relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 -skew-x-12 translate-x-1/2"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest mb-6 border border-white/20">
                            <GraduationCap size={14} className="text-primary" />
                            Dành riêng cho học viên <span className="text-primary font-bold">PTN</span> <span className="text-white font-bold">English</span>
                        </div>
                        <h1 className="text-white text-5xl md:text-7xl font-heading font-semibold mb-6 leading-tight">
                            Góc <span className="text-primary font-bold">Học Viên</span>
                        </h1>
                        <p className="text-slate-300 text-lg md:text-xl font-body leading-relaxed max-w-2xl mx-auto opacity-90">
                            Không gian số hội tụ đầy đủ các công cụ, tài liệu và lộ trình học tập tối ưu, giúp bạn bứt phá và làm chủ tri thức mỗi ngày.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Tools Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* Learning Materials Side */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="group relative bg-slate-50 rounded-[3rem] p-10 md:p-14 overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full translate-x-10 -translate-y-10 group-hover:translate-x-5 group-hover:-translate-y-5 transition-transform duration-700"></div>

                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-10 transition-transform group-hover:scale-110 duration-500">
                                <BookOpen size={32} className="text-primary" />
                            </div>

                            <h2 className="text-3xl font-heading font-bold text-accent mb-6">
                                Kho Tài Liệu <br /> <span className="text-primary font-bold">Độc Quyền</span>
                            </h2>

                            <div className="space-y-6 mb-12">
                                <p className="text-slate-600 font-body leading-relaxed text-lg">
                                    Truy cập tức thì vào hệ thống học tập LMS hiện đại của <span className="text-primary font-bold">PTN</span> <span className="text-accent font-bold">English</span>. Nơi lưu trữ hàng ngàn slide bài giảng, bài tập bổ trợ, và giáo trình chuyên sâu được biên soạn riêng cho từng khóa học.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Hệ thống bài tập Online tương tác",
                                        "Thư viện giáo trình MA.TESOL biên soạn",
                                        "Theo dõi lộ trình & kết quả học tập",
                                        "Kho video bài giảng xem lại 24/7"
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-slate-500 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/50"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <motion.a
                                href="https://lms.ptelc.edu.vn/"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ gap: "20px" }}
                                className="inline-flex items-center gap-4 bg-primary text-white px-8 py-5 rounded-full font-bold text-lg shadow-xl shadow-primary/20 transition-all"
                            >
                                Vào cổng học tập
                                <ArrowRight size={20} />
                            </motion.a>
                        </motion.div>

                        {/* Mock Test Side */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="group relative bg-accent rounded-[3rem] p-10 md:p-14 overflow-hidden shadow-2xl shadow-accent/20 hover:shadow-primary/10 transition-all duration-500"
                        >
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-tr-full -translate-x-10 translate-y-10 group-hover:-translate-x-5 group-hover:translate-y-5 transition-transform duration-700"></div>

                            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-10 border border-white/20 transition-transform group-hover:scale-110 duration-500">
                                <ClipboardList size={32} className="text-white" />
                            </div>

                            <h2 className="text-3xl font-heading font-bold text-white mb-6">
                                Luyện Thi Thử <br /> <span className="text-primary font-bold">Chuẩn Quốc Tế</span>
                            </h2>

                            <div className="space-y-6 mb-12">
                                <p className="text-slate-300 font-body leading-relaxed text-lg">
                                    Trải nghiệm hệ thống thi thử trực tuyến mô phỏng 100% môi trường thi thật. Giúp học viên quen với áp lực phòng thi, nắm vững cấu trúc đề and nhận phân tích chi tiết kỹ năng ngay lập tức.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Mock Test IELTS 4 kỹ năng chuẩn IDP/BC",
                                        "Kho đề thi cập nhật mới nhất hàng quý",
                                        "Chấm điểm & Phân tích lỗi sai chi tiết",
                                        "Giao diện chuẩn phòng thi thực tế"
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-slate-400 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/50"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Link
                                href="/test"
                                className="inline-flex items-center gap-4 bg-white text-accent hover:bg-primary hover:text-white px-8 py-5 rounded-full font-bold text-lg transition-all"
                            >
                                Bắt đầu thi thử
                                <ArrowRight size={20} />
                            </Link>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Hall Of Fame Section */}
            <HallOfFame />

            {/* Support Section */}
            <section className="pb-32 bg-white">
                <div className="container mx-auto px-6">
                    <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-12 text-center max-w-4xl mx-auto">
                        <h3 className="text-2xl md:text-3xl font-heading font-bold text-accent mb-6">Bạn gặp khó khăn khi truy cập?</h3>
                        <p className="text-slate-600 mb-8 max-w-2xl mx-auto">Đội ngũ kỹ thuật and bộ phận Academic luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ hotline hoặc gửi tin nhắn cho chúng tôi ngay.</p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <Link href="/contact" className="text-primary font-bold flex items-center gap-2 hover:underline">
                                Trung tâm hỗ trợ <ArrowRight size={16} />
                            </Link>
                            <div className="w-px h-6 bg-slate-300 hidden sm:block"></div>
                            <a href="tel:0902508290" className="text-accent font-bold">Hotline: 0902 508 290</a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
