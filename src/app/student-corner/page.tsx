"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { BookOpen, ExternalLink, GraduationCap, ClipboardList, ArrowRight, Phone, MessageCircle } from "lucide-react";
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

            {/* Student Playground - Bento Grid Layout */}
            <section className="py-24 bg-slate-50 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-primary font-heading text-lg font-bold uppercase tracking-[0.3em] mb-4">
                            PTN Playground
                        </h2>
                        <h3 className="text-4xl md:text-5xl font-heading font-black text-accent leading-tight">
                            Hoạt động thường nhật <br /> & <span className="text-primary">Sân chơi</span> học viên
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[800px]">
                        {/* Main Workshop - Large Box */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="md:col-span-2 md:row-span-2 relative group rounded-[2rem] overflow-hidden shadow-2xl h-[400px] md:h-auto"
                        >
                            <img
                                src="https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-6/600349560_811824385145541_924529116167773166_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=WrY3AmzobhsQ7kNvwEn4CKw&_nc_oc=Adnmgkplx_LTyk9c-hUbzVarhTwhrLUBSzCD0uiDfoAXYzTQw_bz849RWOQUl3hK3O8&_nc_zt=23&_nc_ht=scontent.fsgn2-6.fna&_nc_gid=x3LbkFcIHWTpcw3xM-kfCA&oh=00_AfprMZKVjjgaBCy1Nvm9AmHxJLbSdtEzmcB6F_9igPgNfw&oe=697937FB"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                alt="Main Workshop"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                            <div className="absolute bottom-10 left-10 text-white pr-10">
                                <span className="bg-primary px-4 py-1.5 rounded-none text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Featured Workshop</span>
                                <h4 className="text-2xl md:text-3xl font-heading font-black leading-tight uppercase tracking-tighter">Academic Mastery <br />& Debate Skills</h4>
                            </div>
                        </motion.div>

                        {/* Chill Corner 1 */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="md:col-span-2 relative group rounded-[2rem] overflow-hidden shadow-xl h-[250px] md:h-auto"
                        >
                            <img
                                src="https://scontent.fsgn2-11.fna.fbcdn.net/v/t39.30808-6/512614209_670142242647090_8961518773189171975_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=86c6b0&_nc_ohc=cK75sFRaF_IQ7kNvwGgDA4g&_nc_oc=AdkHowDUM1ksA7R5SgNBUWuiG1MPWNh1t0fAnY6wm923yDIJcRtP1WIwS5AlEXRVzD0&_nc_zt=23&_nc_ht=scontent.fsgn2-11.fna&_nc_gid=gcezZhlCLo3osHQGtAfGfw&oh=00_AfrpDGP0UUafCpx4SFhKepmE1W2SL-Yy-ONQ5-kg3f1BPw&oe=6979550A"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                alt="Chill Corner"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-slate-900/60 to-transparent">
                                <p className="text-white font-heading font-bold uppercase tracking-widest text-sm">PTN Chill Room</p>
                            </div>
                        </motion.div>

                        {/* Workshop secondary */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="relative group rounded-[2rem] overflow-hidden shadow-xl h-[200px] md:h-auto"
                        >
                            <img
                                src="https://scontent.fsgn2-4.fna.fbcdn.net/v/t39.30808-6/604346724_815746011420045_1980336211823099106_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=qkLGV5Y5KSgQ7kNvwGJsDoK&_nc_oc=AdntDpZoz4yfKEI0j-Hv878q7mWIWTW5oGmMn9F5fPSS-SlIgkoN1lDvE0yvWJH6q0k&_nc_zt=23&_nc_ht=scontent.fsgn2-4.fna&_nc_gid=u7onphvhD4Z99P4LGaRv_A&oh=00_AfriXULs8DInaQCLKejSaQtSojNbi4ZUTHCZWT2iMQltzQ&oe=69794BE7"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                alt="Workshop 2"
                            />
                        </motion.div>

                        {/* Tea Break / Cafe */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="relative group rounded-[2rem] overflow-hidden shadow-xl h-[200px] md:h-auto"
                        >
                            <img
                                src="https://scontent.fsgn2-5.fna.fbcdn.net/v/t39.30808-6/597251461_806720128989300_4899544521814172881_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=2Oq8wx-fJf4Q7kNvwGJ5r1V&_nc_oc=AdlXmd5w0vZ38pDbd51romsYEKcLIWmebDEnj6yNjGJucDFJWhOoMzt-mwq8kmDkIHI&_nc_zt=23&_nc_ht=scontent.fsgn2-5.fna&_nc_gid=TL2nZsVgFS8B57vSeDOb2A&oh=00_AfqzWqpezjeU14LZv63tB7HOg2tGplHMYcwE60k48sTt9w&oe=69793FC0"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                alt="Cafe Time"
                            />
                        </motion.div>
                    </div>

                    {/* Secondary Grid for more photos + Video Placeholder */}
                    <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-4 mt-4 pb-4 md:pb-0 hide-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
                        {[
                            "https://scontent.fsgn2-11.fna.fbcdn.net/v/t39.30808-6/605711185_815745994753380_1350455286566131952_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=bbbY55kwlk0Q7kNvwHRa7RP&_nc_oc=Admy6SDvlmTH1Tr72HAjNa_G7eGPNHMK5CIgrYqEbKRjh5Uj_cF6eoZ6aLdvE4K0SDA&_nc_zt=23&_nc_ht=scontent.fsgn2-11.fna&_nc_gid=xoPy26A-wxyUkCQVcUWUkQ&oh=00_AfpKY0mVKSDuTmkccf8YXyg-FWzGwwhpRTVo2XCmpz9O7w&oe=69793079",
                            "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/542167879_726034340391213_5658940871196288765_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=St8AHxsrVR0Q7kNvwFwOmLn&_nc_oc=Adl4Lp49qB-RMMmxbPGKygiUPbK8J1w-4Hf5eStBm49VtwgCm4qhQQNbOZiMwoz3N2Y&_nc_zt=23&_nc_ht=scontent.fsgn2-7.fna&_nc_gid=4g6YCtrOndWcVU0oKj0sfg&oh=00_AfprlDPBuc_MyGOygUib5r29YCf4W16wniEBLf1aVvsM8w&oe=69791B83",
                            "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/525214975_697220113272636_4528856525560068367_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=3vVyVZowSvMQ7kNvwFRwTUp&_nc_oc=AdnRBw0O3ICn3o11Kj3zLnOOG2-emM1DfG1cgc8mnw7C_Ru9NI0suh4t-EGZLWhiaMw&_nc_zt=23&_nc_ht=scontent.fsgn2-7.fna&_nc_gid=jjHX8Hxw9nv6VMh6HDCS8g&oh=00_Afqr46-YmMLLOuFiGyfotdQCfenqJ6hs8HjaxMMCjANu-g&oe=69793F31"
                        ].map((src, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="w-40 md:w-auto flex-shrink-0 aspect-square rounded-2xl overflow-hidden shadow-lg group relative"
                            >
                                <img src={src} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={`Student Life ${i + 1}`} />
                            </motion.div>
                        ))}

                        {/* Video Placeholder Card */}
                        <motion.a
                            href="https://www.facebook.com/100089539590679/videos/pcb.683230831338231/1234526698354766"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ y: -5 }}
                            className="w-40 md:w-auto flex-shrink-0 aspect-square rounded-2xl overflow-hidden shadow-lg group relative bg-accent"
                        >
                            <img
                                src="https://scontent.fsgn2-4.fna.fbcdn.net/v/t39.30808-6/503126116_651142867880361_4587213466788932149_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=JwCQsjroqCIQ7kNvwEe3I67&_nc_oc=Adl9pgY9ZbbM8XDTi2IRRtQVpS-EnI2AiGApOF0adVTLk8y0l8DnORpMwmG_XdG1XTE&_nc_zt=23&_nc_ht=scontent.fsgn2-4.fna&_nc_gid=S-dStxBKkC4PjgNayZw-BQ&oh=00_Afq66Dxbl0GpuLOKUMSasJQLaQV7xiefRXktJjMQ3ZhXBA&oe=69795068"
                                className="w-full h-full object-cover opacity-60 transition-all group-hover:scale-110 group-hover:opacity-40"
                                alt="Student Life 4 - Video"
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/90 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500">
                                    <svg className="w-6 h-6 md:w-8 md:h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                                <span className="mt-2 md:mt-4 text-white font-heading font-black text-[8px] md:text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Xem Video</span>
                            </div>
                        </motion.a>
                    </div>
                </div>
            </section>

            {/* Hall Of Fame Section */}
            <HallOfFame />

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

            {/* Support Section - Enhanced UI */}
            <section className="pb-32 bg-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-slate-900 rounded-[3rem] p-12 md:p-16 text-center max-w-5xl mx-auto relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10">
                            <h3 className="text-3xl md:text-5xl font-heading font-black text-white mb-6">
                                Bạn gặp khó khăn <br className="md:hidden" /> <span className="text-primary">khi truy cập?</span>
                            </h3>
                            <p className="text-slate-400 mb-12 max-w-2xl mx-auto text-lg">
                                Đội ngũ kỹ thuật and bộ phận Academic luôn sẵn sàng hỗ trợ bạn 24/7. Hãy chọn phương thức liên hệ thuận tiện nhất.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                                <Link
                                    href="/contact"
                                    className="flex items-center justify-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white p-6 rounded-2xl transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <MessageCircle size={24} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-lg">Trung tâm hỗ trợ</p>
                                        <p className="text-xs text-slate-500">Gửi yêu cầu hỗ trợ trực tuyến</p>
                                    </div>
                                </Link>

                                <a
                                    href="tel:0902508290"
                                    className="flex items-center justify-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white p-6 rounded-2xl transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Phone size={24} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-lg">0902 508 290</p>
                                        <p className="text-xs text-slate-500">Hotline hỗ trợ kỹ thuật</p>
                                    </div>
                                </a>
                            </div>

                            <div className="mt-12 pt-12 border-t border-white/5">
                                <p className="text-slate-500 text-sm font-medium uppercase tracking-[0.2em]">
                                    Partner To Navigate · PTN English
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
