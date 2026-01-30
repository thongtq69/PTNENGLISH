"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Target, ArrowRight, GraduationCap, Clock,
    BookOpen, Layers, CheckCircle2, ChevronRight, X,
    Maximize2, Zap, Trophy, MessageCircle, Calendar,
    UserCheck, FileText, Globe
} from "lucide-react";
import Link from "next/link";

const PATHWAY_DATA = {
    ie: {
        id: "ie",
        name: "Luyện thi IELTS (IE)",
        subtitle: "IELTS Preparation",
        color: "primary",
        theme: "from-primary to-accent",
        bgLight: "bg-primary/5",
        description: "Lộ trình luyện thi chuyên biệt từ nền tảng đến chuyên sâu, giúp học viên làm chủ kỹ thuật làm bài và đạt mục tiêu Band 7.0+.",
        levels: [
            {
                id: "ie-foundation",
                name: "Foundation",
                cefr: "A1 / Pre-A1",
                exit: "Ready for IELTS",
                target: "Học viên mất gốc hoặc cần củng cố kiến thức.",
                benefits: [
                    "Xây dựng nền tảng Tiếng Anh Học thuật vững chắc",
                    "Chuẩn bị tâm thế & kiến thức cho lộ trình IELTS",
                    "Cải thiện phát âm & phản xạ cơ bản"
                ],
                fullDesc: "Dành cho học viên trình độ cơ bản, hoặc cần củng cố lại kiến thức. Xây dựng nền tảng Tiếng Anh Học thuật vững chắc đáp ứng nhu cầu sử dụng chuẩn Tiếng Anh trong học tập và giao tiếp, sẵn sàng cho lộ trình học thi IELTS."
            },
            {
                id: "ie-starter",
                name: "IELTS Starter",
                cefr: "A2",
                exit: "IELTS 4.0",
                target: "Học viên có trình độ sơ cấp.",
                benefits: [
                    "Hệ thống hóa toàn bộ văn phạm & từ vựng cần thiết",
                    "Chỉnh sửa phát âm chuẩn xác",
                    "Làm quen cấu trúc bài thi & tiêu chí chấm điểm",
                    "Luyện tập kỹ năng viết học thuật cơ bản"
                ],
                fullDesc: "Khóa học IELTS Starter cung cấp kiến thức nền tảng ở cả 04 kỹ năng. Đặc biệt, học viên được hệ thống hóa văn phạm & từ vựng cần thiết, hướng dẫn chỉnh sửa phát âm và làm quen với cách viết học thuật."
            },
            {
                id: "ie-standard",
                name: "IELTS Standard",
                cefr: "B1",
                exit: "IELTS 5.0",
                target: "Học viên cần đạt Band 5.0.",
                benefits: [
                    "Kỹ năng giải quyết các dạng câu hỏi thường gặp",
                    "Các kỹ thuật Paraphrasing trong cả 4 kỹ năng",
                    "Tăng cường sự tự tin khi truyền đạt ý tưởng"
                ],
                fullDesc: "Khóa học IELTS Standard giúp học viên nắm bắt các kỹ năng giải quyết các dạng câu hỏi thường gặp một cách tự tin, đồng thời áp dụng kỹ thuật Paraphrasing hiệu quả trong cả 4 kỹ năng."
            },
            {
                id: "ie-booster",
                name: "IELTS Booster",
                cefr: "B2",
                exit: "IELTS 6.0",
                target: "Học viên chuẩn bị thi trong tương lai gần.",
                benefits: [
                    "Luyện tập với Practice Tests chuẩn cấu trúc đề thật",
                    "Quen với áp lực thời gian trong phòng thi",
                    "Nhận phản hồi chi tiết & gợi ý cải thiện nốt điểm yếu"
                ],
                fullDesc: "Cung cấp các bài Practice Tests theo đúng cấu trúc đề thi IELTS nhằm giúp Học Viên quen với việc làm bài dưới áp lực thời gian. Học Viên sẽ nhận phản hồi chi tiết và gợi ý cách cải thiện để tối ưu hóa điểm số."
            },
            {
                id: "ie-master",
                name: "IELTS Master",
                cefr: "C1",
                exit: "IELTS 7.0+",
                target: "Mục tiêu Band 7.0+ và du học.",
                benefits: [
                    "Nâng tầm từ vựng cấp độ CEFR-C1",
                    "Sử dụng linh hoạt cấu trúc ngữ pháp nâng cao",
                    "Rèn luyện diễn đạt ý tưởng mạch lạc (Nói/Viết)",
                    "Tiếp cận tài liệu học thuật chuyên sâu"
                ],
                fullDesc: "Giúp Học Viên nâng tầm từ vựng C1, sử dụng linh hoạt ngữ pháp nâng cao, rèn luyện diễn đạt ý tưởng mạch lạc trong Speaking & Writing đáp ứng tiêu chí Band 7.0+. Duy trì phong độ Nghe-Đọc bằng tài liệu chuyên sâu."
            },
            {
                id: "ie-elite",
                name: "IELTS Elite",
                cefr: "C2",
                exit: "IELTS 8.0+",
                target: "Mục tiêu học thuật cao cấp.",
                benefits: [
                    "Sử dụng tiếng Anh như người bản ngữ (C2 level)",
                    "Đạt chuẩn IELTS Band 8.0+ (IELTS Band Descriptors)",
                    "Phân tích & Thảo luận chủ đề phức tạp",
                    "Làm chủ Academic English ở mức độ cao nhất"
                ],
                fullDesc: "Khóa học IELTS Elite giúp học viên nâng tầm từ vựng cấp độ C2, sử dụng tiếng Anh như người bản ngữ, đáp ứng tiêu chí Band 8.0+. Tập trung vào việc duy trì phong độ và xử lý các tài liệu học thuật cực khó."
            }
        ]
    },
    eft: {
        id: "eft",
        name: "Học thuật Thiếu niên (EfT)",
        subtitle: "Academic English for Teens",
        color: "primary",
        theme: "from-primary to-secondary",
        bgLight: "bg-primary/5",
        description: "Thiết kế riêng cho học sinh 12-15 tuổi, kết hợp kiến thức học thuật, kỹ năng sống và tư duy phản biện qua TED Talks.",
        levels: [
            {
                id: "eft-foundation",
                name: "EfT Foundation",
                cefr: "A1",
                exit: "Ready for Teens",
                target: "Học sinh chuẩn bị tốt kiến thức cho kỳ thi cuối cấp.",
                benefits: [
                    "Xây dựng nền tảng ngữ âm & từ vựng cơ bản",
                    "Giao tiếp cơ bản trong tình huống học đường",
                    "Làm quen với các cấu trúc câu đơn giản"
                ],
                fullDesc: "Chương trình được thiết kế nhằm giúp các em khai phá tiềm năng, lồng ghép kỹ năng sống phù hợp độ tuổi. Tập trung vào việc sử dụng ngữ pháp trong ngữ cảnh một cách tự nhiên."
            },
            {
                id: "eft-starter",
                name: "EfT Starter",
                cefr: "A2",
                exit: "Starter Pro",
                target: "Củng cố nền tảng học thuật vững vàng.",
                benefits: [
                    "Hệ thống hóa kiến thức văn phạm cốt yếu",
                    "Phát triển 4 kỹ năng ngôn ngữ toàn diện",
                    "Xây dựng kỹ năng tự học & ghi chép"
                ],
                fullDesc: "Sự kết hợp độc đáo giữa kỹ năng ngôn ngữ và tài liệu truyền cảm hứng. Học sinh bắt đầu làm quen với việc ghi chú (note-taking) hiệu quả khi nghe giảng."
            },
            {
                id: "eft-standard",
                name: "EfT Standard",
                cefr: "B1",
                exit: "Academic Ready",
                target: "Chuẩn bị cho lộ trình IELTS sớm.",
                benefits: [
                    "Phát triển tư duy học thuật & phản biện",
                    "Viết đoạn văn theo cấu trúc chuẩn",
                    "Đọc hiểu & phân tích văn bản dài hơn"
                ],
                fullDesc: "Giáo trình toàn diện từ Cambridge CUP giúp khai phá tiềm năng. Chú trọng việc sử dụng ngữ pháp trong ngữ cảnh (grammar in context) gần với văn phong bản xứ."
            },
            {
                id: "eft-booster",
                name: "EfT Booster",
                cefr: "B2",
                exit: "IELTS Path",
                target: "Tự tin chinh phục tương lai.",
                benefits: [
                    "Tiếp cận tiếng Anh thực tế qua TED Talks",
                    "Thảo luận & Phản biện các chủ đề thú vị",
                    "Kỹ năng thuyết trình logic & thuyết phục"
                ],
                fullDesc: "Sử dụng TED Talks như nội dung giảng dạy chính giúp học viên tiếp cận tiếng Anh thực tế, truyền cảm hứng tư duy và mở rộng vốn từ vựng học thuật."
            },
            {
                id: "eft-master",
                name: "EfT Master",
                cefr: "C1",
                exit: "Fluent Scholar",
                target: "Thành thạo kỹ năng học thuật cao cấp.",
                benefits: [
                    "Viết bài luận học thuật phức tạp",
                    "Phân tích văn bản nghiên cứu chuyên sâu",
                    "Làm chủ các cấu trúc ngữ pháp nâng cao"
                ],
                fullDesc: "Chương trình học thuật chuyên sâu giúp học sinh THCS đạt kết quả cao trong các kỳ thi ngôn ngữ của Cambridge và sẵn sàng cho môi trường học tập quốc tế."
            },
            {
                id: "eft-elite",
                name: "EfT Elite",
                cefr: "C2",
                exit: "Elite Academic",
                target: "Trình độ tương đương người bản ngữ.",
                benefits: [
                    "Thảo luận học thuật & thời sự phức tạp",
                    "Sử dụng tiếng Anh linh hoạt trong mọi ngữ cảnh",
                    "Chuẩn bị hoàn hảo cho môi trường du học"
                ],
                fullDesc: "Cấp độ cao nhất của hành trình EfT, giúp học sinh sở hữu nền tảng Anh ngữ học thuật vững vàng, tự tin dẫn đầu trong mọi môi trường học tập chuyên nghiệp."
            }
        ]
    },
    ge: {
        id: "ge",
        name: "Tiếng Anh Giao tiếp (GE)",
        subtitle: "General English",
        color: "primary",
        theme: "from-accent to-primary",
        bgLight: "bg-primary/5",
        description: "Chuẩn giao tiếp quốc tế, tập trung vào tính ứng dụng thực tiễn và phản xạ tự nhiên trong môi trường sống & làm việc.",
        levels: [
            {
                id: "ge-foundation",
                name: "GE Foundation",
                cefr: "A1",
                exit: "Everyday Basic",
                target: "Người mới bắt đầu hoặc cần lấy lại căn bản.",
                benefits: [
                    "Làm quen bảng chữ cái, âm thanh, từ vựng",
                    "Giao tiếp chào hỏi, giới thiệu bản thân",
                    "Hình thành nền tảng ngữ âm & ngữ pháp đơn giản"
                ],
                fullDesc: "Khóa học giúp học viên vượt qua rào cản ban đầu, làm quen với ngôn ngữ qua các tình huống hàng ngày như hỏi đường, mua sắm và thời gian biểu."
            },
            {
                id: "ge-starter",
                name: "Everyday English",
                cefr: "A2",
                exit: "Social Basic",
                target: "Xây dựng nền tảng giao tiếp thực tế.",
                benefits: [
                    "Mở rộng vốn từ vựng sinh hoạt hằng ngày",
                    "Rèn luyện kỹ năng nghe nói qua hội thoại",
                    "Tăng khả năng đọc hiểu & viết câu hoàn chỉnh"
                ],
                fullDesc: "Tập trung vào các tình huống thực tế như đặt lịch hẹn, gọi món, mô tả nơi chốn. Củng cố các thì tương lai và câu điều kiện đơn giản."
            },
            {
                id: "ge-standard",
                name: "Confident Communicator",
                cefr: "B1",
                exit: "Effective Speaker",
                target: "Phát triển khả năng xử lý tình huống linh hoạt.",
                benefits: [
                    "Tự tin trình bày quan điểm & kể chuyện",
                    "Nghe hiểu tin tức & bài thuyết trình đơn giản",
                    "Viết đoạn văn logic sử dụng đúng liên từ"
                ],
                fullDesc: "Giúp học viên tăng cường phản xạ giao tiếp trong môi trường học tập, du lịch hoặc làm việc. Biết cách duy trì hội thoại dài và mạch lạc."
            },
            {
                id: "ge-booster",
                name: "Fluent Transitions",
                cefr: "B2",
                exit: "Fluent Speaker",
                target: "Tăng tốc độ & độ trôi chảy khi sử dụng.",
                benefits: [
                    "Làm chủ cấu trúc ngữ pháp nâng cao",
                    "Phát âm & ngữ điệu chuẩn xác, tự nhiên",
                    "Biết cách viết email, bài luận & tường thuật"
                ],
                fullDesc: "Khóa học giúp học viên làm chủ mệnh đề quan hệ, câu điều kiện hỗn hợp. Phát triển kỹ năng đọc hiểu văn bản dài và có cấu trúc rõ ràng."
            },
            {
                id: "ge-master",
                name: "English for Real Life",
                cefr: "C1",
                exit: "Proficient User",
                target: "Tiếp cận trình độ thành thạo nâng cao.",
                benefits: [
                    "Thành thạo trong học tập & làm việc",
                    "Giao tiếp trôi chảy các chủ đề trừu tượng",
                    "Sử dụng từ vựng học thuật cơ bản linh hoạt"
                ],
                fullDesc: "Chuẩn bị nền tảng chuyển tiếp sang IELTS hoặc Business English. Tự tin thảo luận về công nghệ, giáo dục, môi trường và xã hội."
            },
            {
                id: "ge-elite",
                name: "Proficient English Skills",
                cefr: "C2",
                exit: "Native-like Skills",
                target: "Sử dụng tiếng Anh thông thạo như người bản ngữ.",
                benefits: [
                    "Phân tích chuyên sâu tài liệu nghiên cứu",
                    "Viết báo cáo & phản hồi phức tạp chuyên nghiệp",
                    "Tự tin tham gia các môi trường quốc tế"
                ],
                fullDesc: "Nâng cao kỹ năng đến mức thông thạo, có khả năng thảo luận các chủ đề thời sự phức tạp, đọc hiểu báo chí chuyên ngành và viết luận nâng cao."
            }
        ]
    }
};

const COMMON_INFO = [
    {
        icon: <Clock size={24} />,
        title: "60 Giờ / Khóa",
        desc: "Thời lượng chuẩn tối ưu kiến thức."
    },
    {
        icon: <Calendar size={24} />,
        title: "Lịch Học Linh Hoạt",
        desc: "Lớp Sáng / Chiều / Tối / Cuối tuần."
    },
    {
        icon: <BookOpen size={24} />,
        title: "Giáo Trình Cambridge",
        desc: "CUP chính hãng & Cambridge One."
    },
    {
        icon: <Zap size={24} />,
        title: "Lưu Chuyển Linh Hoạt",
        desc: "Chuyển ngang giữa GE ↔ IE ↔ EfT."
    }
];

const SCHEDULES = [
    { label: "Lớp Sáng – Chiều", time: "Sáng: 8:00 - 12:20 | Chiều: 13:00 - 17:20", duration: "5 tuần/khóa" },
    { label: "Lớp Buổi Tối", time: "18:15 - 20:45", duration: "8 tuần/khóa" },
    { label: "Lớp Cuối Tuần", time: "Thiết kế linh hoạt theo mục tiêu", duration: "7.5 tuần/khóa" },
];

export default function CoursesContent({ pageData }: { pageData: any }) {
    const [activeTab, setActiveTab] = useState<"ie" | "eft" | "ge">("ie");
    const [selectedLevel, setSelectedLevel] = useState<any>(null);

    const currentPathway = PATHWAY_DATA[activeTab];

    return (
        <main className="min-h-screen bg-slate-50">
            <Header />

            {/* HERO SECTION */}
            <section className="relative pt-24 pb-12 bg-accent overflow-hidden">
                {/* Visual Background Elements */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 -skew-x-12 translate-x-1/2 blur-3xl opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-500/10 skew-x-12 -translate-x-1/2 blur-[120px] opacity-20"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
                        >
                            <Target size={14} className="text-primary" />
                            Academic Navigation Roadmap
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-white text-3xl md:text-8xl font-heading font-semibold mb-4 md:mb-10 leading-[1.1]"
                        >
                            Khung Chương <br />
                            <span className="text-primary font-black">Trình Học</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-400 text-xs md:text-2xl font-body leading-relaxed max-w-2xl mb-8 md:mb-12"
                        >
                            Sáu cấp độ từ Căn bản đến Thông thạo (A1 → C2) thiết kế tinh gọn, phù hợp với mục tiêu du học, định cư và học thuật chuyên sâu.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap justify-center gap-4"
                        >
                            <Link href="/contact" className="bg-primary hover:bg-black text-white px-10 py-5 rounded-full font-bold shadow-2xl shadow-primary/20 transition-all transform hover:-translate-y-1">
                                Kiểm tra trình độ miễn phí
                            </Link>
                            <a href="#pathway" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-md px-10 py-5 rounded-full font-bold transition-all">
                                Khám phá lộ trình
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* SHARED INFO & TARGET AUDIENCE */}
            <section className="py-8 md:py-16 bg-white border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
                        {/* Target Audience */}
                        <div className="space-y-10">
                            <div>
                                <h2 className="text-accent font-heading text-xl md:text-4xl font-black mb-4 md:mb-6 text-center lg:text-left">Đối tượng phù hợp</h2>
                                <p className="text-slate-500 text-[10px] md:text-lg max-w-lg mb-6 md:mb-8 text-center lg:text-left mx-auto lg:mx-0">Chúng tôi cá nhân hóa lộ trình dựa trên từng nấc thang sự nghiệp and học tập của bạn.</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { text: "Sinh viên & Người đi làm", sub: "Du học, Định cư, IELTS" },
                                    { text: "Học sinh 12-15 tuổi", sub: "Lộ trình EfT chuyên sâu" },
                                    { text: "Học sinh cuối cấp", sub: "Xét tuyển ĐH & Tốt nghiệp" },
                                    { text: "Người cần giao tiếp", sub: "General Academic English" }
                                ].map((item, i) => (
                                    <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all group">
                                        <CheckCircle2 size={24} className="text-primary mb-4 opacity-50 group-hover:opacity-100" />
                                        <h4 className="font-heading font-black text-slate-800 mb-1">{item.text}</h4>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{item.sub}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Common Specs Table-like cards */}
                        <div className="bg-accent rounded-[3rem] p-8 md:p-10 relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                            <h3 className="text-white font-heading text-2xl font-bold mb-10 flex items-center gap-4">
                                <Zap className="text-primary" /> Tiêu chuẩn PTelc
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {COMMON_INFO.map((info, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                                            {info.icon}
                                        </div>
                                        <div>
                                            <h5 className="text-white font-bold mb-1">{info.title}</h5>
                                            <p className="text-slate-400 text-sm">{info.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 pt-10 border-t border-white/5 space-y-4">
                                {SCHEDULES.map((s, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400 font-bold">{s.label}</span>
                                        <span className="text-white opacity-80">{s.time}</span>
                                        <span className="text-primary font-black text-[10px] uppercase tracking-widest">{s.duration}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PATHWAY SECTION */}
            <section id="pathway" className="py-12 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    {/* Tab Navigation */}
                    <div className="flex flex-col items-center mb-12">
                        <h2 className="text-accent font-heading text-3xl md:text-5xl font-black mb-8 text-center">Lựa chọn lộ trình mục tiêu</h2>
                        <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-wrap justify-center gap-2">
                            {(Object.values(PATHWAY_DATA)).map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`
                                        px-8 md:px-12 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all
                                        ${activeTab === tab.id
                                            ? `bg-accent text-white shadow-xl`
                                            : `text-slate-400 hover:bg-slate-50`}
                                    `}
                                >
                                    {tab.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active Pathway Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="relative"
                        >
                            {/* Short Summary */}
                            <div className="mb-16 text-center max-w-3xl mx-auto">
                                <p className={`text-sm font-black uppercase tracking-[0.4em] mb-4 text-primary`}>
                                    {currentPathway.subtitle}
                                </p>
                                <p className="text-slate-500 text-lg leading-relaxed">
                                    {currentPathway.description}
                                </p>
                            </div>

                            {/* Pathway Map - Vertical on Mobile, Horizontal on Desktop */}
                            <div className="relative pb-8 pt-4 md:pt-10 px-4 md:px-10">
                                {/* The Connection Line - Hidden on Mobile, Horizontal on Desktop */}
                                <div className={`
                                    absolute bg-slate-200 rounded-full
                                    left-1/2 -translate-x-1/2 w-1 h-full md:w-full md:h-2 
                                    md:top-[164px] md:left-10 md:right-10 md:translate-x-0
                                    hidden md:block
                                `}>
                                    <motion.div
                                        className={`absolute bg-accent rounded-full w-full h-full md:w-full md:h-full`}
                                        initial={{ scaleY: 0, scaleX: 0 }}
                                        whileInView={{ scaleY: 1, scaleX: 1 }}
                                        transition={{ duration: 1.5 }}
                                        style={{ originY: 0, originX: 0 }}
                                    />
                                </div>

                                {/* Pathway Elements Container */}
                                <div className="grid grid-cols-2 md:flex md:flex-row md:justify-between gap-4 md:gap-6 relative max-w-[340px] mx-auto md:max-w-none px-2 md:px-0">
                                    {currentPathway.levels.map((level, i) => (
                                        <motion.div
                                            key={level.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.05 }}
                                            className="flex flex-col items-center group cursor-pointer"
                                            onClick={() => setSelectedLevel(level)}
                                        >
                                            {/* Level Header */}
                                            <div className="mb-3 md:mb-10 text-center">
                                                <div className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 md:mb-1">CEFR {level.cefr}</div>
                                                <div className="text-slate-800 font-heading font-black text-[10px] md:text-base leading-tight">{level.name}</div>
                                            </div>

                                            {/* Milestone Node */}
                                            <div className="relative mb-4 md:mb-8 z-10">
                                                <div className={`
                                                    w-7 h-7 md:w-14 md:h-14 rounded-full bg-white border-[3px] md:border-8 border-slate-200 
                                                    flex items-center justify-center transition-all group-hover:border-accent group-hover:bg-accent group-hover:scale-110
                                                    shadow-md md:shadow-lg
                                                `}>
                                                    <div className="w-1 md:w-3 h-1 md:h-3 rounded-full bg-slate-400 group-hover:bg-white" />
                                                </div>
                                                <div className="absolute -top-1 -right-1 bg-primary text-white text-[6px] md:text-[8px] font-bold px-1 rounded shadow-sm opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    L{i + 1}
                                                </div>
                                            </div>

                                            {/* Summary Card */}
                                            <div className="bg-white p-3 md:p-5 rounded-xl md:rounded-2xl shadow-md md:shadow-lg border border-slate-100 w-full hover:shadow-2xl hover:border-accent/10 transition-all text-center h-full flex flex-col justify-between">
                                                <div>
                                                    <div className="bg-slate-50 text-[8px] md:text-[10px] font-black text-slate-500 p-1.5 md:p-2 rounded-lg mb-2 md:mb-4 uppercase tracking-wider">
                                                        {level.exit}
                                                    </div>
                                                    <p className="hidden md:block text-[11px] leading-relaxed text-slate-400 font-medium group-hover:text-slate-600 transition-colors">
                                                        {level.target}
                                                    </p>
                                                </div>
                                                <div className="text-accent flex items-center justify-center gap-1 text-[8px] md:text-[10px] font-black uppercase md:opacity-0 group-hover:opacity-100 transition-opacity pt-2">
                                                    Chi tiết <ArrowRight size={10} className="md:w-3 md:h-3" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            {/* PLACEMENT TEST - THE DIFFERENCE */}
            <section className="py-12 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="bg-white rounded-[4rem] p-8 md:p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1 space-y-8">
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
                                <Trophy size={16} /> The PTelc Standard
                            </div>
                            <h2 className="text-xl md:text-6xl font-heading font-black text-accent leading-tight text-center lg:text-left">
                                Kiểm tra trình độ <br /> chuẩn <span className="text-primary">IELTS Quốc Tế</span>
                            </h2>
                            <p className="text-slate-500 text-[10px] md:text-lg leading-relaxed text-center lg:text-left mx-auto lg:mx-0">
                                Đừng bắt đầu lộ trình dựa trên những bài Test nhanh 15 phút. Tại PTelc, chúng tôi cam kết chất lượng ngay từ khâu đầu vào bằng quy trình kiểm tra nghiêm ngặt.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-black">1</div>
                                    <h4 className="font-heading font-black text-slate-800">Kiểm tra thực tế 3.5h</h4>
                                    <p className="text-sm text-slate-400">Trải nghiệm bài thi IELTS thật 4 kỹ năng trong môi trường áp lực tiêu chuẩn.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-black">2</div>
                                    <h4 className="font-heading font-black text-slate-800">Tư vấn trực tiếp</h4>
                                    <p className="text-sm text-slate-400">Giáo viên chấm bài and phản hồi trực tiếp phương án, lộ trình cá nhân hóa.</p>
                                </div>
                            </div>

                            <div className="flex justify-center lg:justify-start">
                                <button className="w-full sm:w-auto bg-accent hover:bg-black text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-bold transition-all shadow-xl text-sm md:text-base">
                                    Đặt lịch kiểm tra đầu vào ngay
                                </button>
                            </div>
                        </div>

                        <div className="w-full md:w-80 h-[500px] bg-accent rounded-[3rem] relative overflow-hidden shrink-0 shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2670&auto=format&fit=crop"
                                className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
                                alt="IELTS Testing Environment"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-accent via-transparent to-transparent" />
                            <div className="absolute bottom-10 left-10 right-10">
                                <div className="text-white text-4xl font-black font-heading mb-2">3.5h</div>
                                <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">Standardized Proctored Test</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* LEVEL DETAILS MODAL */}
            <AnimatePresence>
                {selectedLevel && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-accent/80 backdrop-blur-md p-4"
                        onClick={() => setSelectedLevel(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: "100%" }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="bg-white max-w-2xl w-full rounded-2xl md:rounded-[3rem] shadow-2xl relative overflow-hidden my-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header Grid */}
                            <div className={`p-5 md:p-10 pb-8 md:pb-20 bg-accent relative text-white border-b-4 border-primary`}>
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    {/* Handle for Mobile */}
                                    <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4 md:hidden"></div>

                                    <button
                                        onClick={() => setSelectedLevel(null)}
                                        className="absolute top-0 right-0 p-2 text-white/50 hover:text-white transition-colors"
                                    >
                                        <X size={18} className="md:w-6 md:h-6" />
                                    </button>

                                    <div className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-2 md:mb-4 opacity-70">Course Details</div>
                                    <h3 className="text-2xl md:text-5xl font-heading font-black mb-3 md:mb-6 leading-tight">{selectedLevel.name}</h3>

                                    <div className="flex gap-2 md:gap-4 justify-center">
                                        <div className="bg-white/10 backdrop-blur-md px-2.5 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-xs font-bold border border-white/20 flex flex-col">
                                            <span className="opacity-60 text-[6px] md:text-[8px] uppercase">CEFR</span>
                                            {selectedLevel.cefr}
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-md px-2.5 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-xs font-bold border border-white/20 flex flex-col">
                                            <span className="opacity-60 text-[6px] md:text-[8px] uppercase">EXIT</span>
                                            {selectedLevel.exit}
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute bottom-0 right-5 md:right-10 translate-y-1/2 w-14 h-14 md:w-24 md:h-24 bg-white rounded-full shadow-xl flex items-center justify-center text-primary z-20 transition-all">
                                    <Trophy className="w-6 h-6 md:w-10 md:h-10" />
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-5 md:p-10 pt-10 md:pt-16 max-h-[65vh] overflow-y-auto">
                                <div className="mb-6 md:mb-10">
                                    <h5 className="text-accent font-heading font-black text-base md:text-xl mb-2 md:mb-4">Mô tả khóa học</h5>
                                    <p className="text-slate-500 leading-relaxed text-xs md:text-base">{selectedLevel.fullDesc}</p>
                                </div>

                                <div className="mb-6">
                                    <h5 className="text-accent font-heading font-black text-sm md:text-lg mb-2 md:mb-4 flex items-center gap-2">
                                        <Trophy size={14} className="text-primary md:w-[18px] md:h-[18px]" /> Lợi ích
                                    </h5>
                                    <div className="grid grid-cols-1 gap-2 md:gap-3">
                                        {selectedLevel.benefits.map((b: string, i: number) => (
                                            <div key={i} className="flex gap-2 md:gap-3 items-start p-2 md:p-3 bg-slate-50 rounded-lg md:rounded-xl">
                                                <CheckCircle2 size={12} className="text-primary mt-0.5 shrink-0 md:w-4 md:h-4" />
                                                <span className="text-[10px] md:text-sm text-slate-600 font-medium">{b}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-8 md:mt-12 flex flex-col md:flex-row gap-2.5 md:gap-4">
                                    <Link href="/contact" className="w-full md:flex-1 bg-accent text-white py-3.5 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] text-center hover:bg-black transition-all">
                                        Đăng ký ngay
                                    </Link>
                                    <button
                                        onClick={() => setSelectedLevel(null)}
                                        className="w-full md:w-auto px-6 py-3.5 md:py-0 border border-slate-200 rounded-xl md:rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all text-[9px] uppercase tracking-widest"
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom CTA */}
            <section className="py-20 bg-accent overflow-hidden relative text-center">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(199,0,43,0.1),transparent)]"></div>
                <div className="container mx-auto px-6 relative z-10 max-w-4xl">
                    <h2 className="text-white text-3xl md:text-5xl font-heading font-semibold mb-8 leading-tight">Bản đồ học thuật của bạn đang chờ</h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed font-body">
                        "Navigation Partner" sẽ giúp bạn định vị chính xác trình độ và vẽ lại con đường ngắn nhất đến mục tiêu học thuật quốc tế.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link href="/contact" className="bg-primary hover:bg-black text-white px-10 py-5 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl shadow-primary/20">
                            Yêu cầu tư vấn 1-1
                        </Link>
                        <button className="bg-white/5 hover:bg-white/10 text-white border border-white/20 backdrop-blur-md px-10 py-5 rounded-full font-bold transition-all">
                            Xem lịch khai giảng mới nhất
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
