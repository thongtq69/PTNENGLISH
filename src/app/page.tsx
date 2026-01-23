"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import { motion } from "framer-motion";
import { BookOpen, ExternalLink, ChevronRight } from "lucide-react";
import PromoPopup from "@/components/PromoPopup";
import HallOfFame from "@/components/HallOfFame";

const PROGRAMS = [
  {
    name: "Academic English for Teens",
    image: "https://www.ptelc.edu.vn/wp-content/uploads/2025/06/EfT-Mimi-4-340x480.jpg",
    color: "bg-primary",
  },
  {
    name: "General English",
    image: "https://www.ptelc.edu.vn/wp-content/uploads/2022/10/h%C3%ACnh-6-340x480.png",
    color: "bg-accent",
  },
  {
    name: "PTE Academic",
    image: "/pte-academic.png",
    color: "bg-blue-600",
  },
  {
    name: "IELTS Preparation",
    image: "https://www.ptelc.edu.vn/wp-content/uploads/2022/10/h%C3%ACnh-7-340x480.png",
    color: "bg-secondary",
  },
  {
    name: "Academic Events",
    image: "https://www.ptelc.edu.vn/wp-content/uploads/2025/06/debate1-340x480.jpg",
    color: "bg-slate-900",
  }
];

const PARTNERS = [
  { name: "AIM Academy", logo: "http://ptelc.edu.vn/wp-content/uploads/2024/05/LOGO-AIM-211x203.png" },
  { name: "IDP IELTS", logo: "http://ptelc.edu.vn/wp-content/uploads/2025/05/Logo-IELTS-IDP-CMYK-_Official-test-centre-Kh%C3%B4ng-n%E1%BB%81n-360x185.png" },
  { name: "IAU", logo: "http://ptelc.edu.vn/wp-content/uploads/2024/05/LOGO-IAU-360x152.png" },
  { name: "SIEC", logo: "http://ptelc.edu.vn/wp-content/uploads/2024/05/LOGO-SIEC-360x167.png" }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />

      {/* Philosophy Section */}
      <section className="py-12 md:py-16 bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-xl md:text-2xl font-serif text-accent leading-relaxed not-italic font-medium border-l-4 border-primary pl-8 py-2">
              “Xuất phát từ niềm tin của các nhà sáng lập vào giáo dục có chiều sâu và sự đồng hành bền bỉ, <span className="text-primary font-bold">PTN</span> <span className="text-accent font-bold">English</span> hướng tới việc xây dựng cho người học nền tảng vững chắc, tư duy học tập rõ ràng và sự tự tin cần thiết để định hướng con đường học tập và cuộc sống lâu dài.”
            </p>
            <div className="mt-6 flex justify-center items-center gap-4">
              <div className="h-px w-12 bg-primary/30"></div>
              <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px]">PTN Philosophy</span>
              <div className="h-px w-12 bg-primary/30"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-primary font-heading text-lg font-bold uppercase tracking-[0.3em] mb-3">
              Hệ Thống Đào Tạo Academic Master
            </h2>
            <h3 className="text-3xl md:text-4xl font-heading font-semibold mb-6 text-accent leading-tight">
              TTNN PHÚ TÀI NĂNG <br />
              (PTelc - PT English Language Centre)
            </h3>
            <p className="text-lg text-slate-600 font-body leading-relaxed mb-10 mx-auto max-w-4xl">
              Là trung tâm đào tạo tiếng Anh Học thuật dành cho thiếu niên và người lớn, luyện thi chứng chỉ IELTS chuyên nghiệp và uy tín. Khung chương trình Sáu Cấp Độ (A1-C2) được thiết kế phù hợp với mục đích học và trình độ của từng học viên.
            </p>
          </motion.div>


          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {PROGRAMS.map((prog, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="relative h-72 rounded-2xl overflow-hidden mb-6 shadow-2xl transition-all group-hover:-translate-y-2">
                  <img src={prog.image} alt={prog.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  {prog.name === "PTE Academic" && (
                    <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest z-20">New</div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-8 pt-16 bg-gradient-to-t from-slate-900/90 to-transparent">
                    <p className="text-white font-heading font-bold text-lg leading-tight">{prog.name}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hall Of Fame - Student Success - Moved higher as requested */}
      <HallOfFame />

      <PromoPopup />

      {/* Compact Study & Mock Test Section */}
      <section className="py-12 bg-accent relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary rounded-full blur-[150px]"></div>
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[150px]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-10 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

              {/* Left Side: Consolidated Info */}
              <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest leading-none">
                    Digital Campus
                  </div>
                  <div className="h-px w-12 bg-white/20"></div>
                  <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">PTELC Academic System</span>
                </div>

                <h3 className="text-2xl md:text-4xl font-heading font-semibold mb-4 leading-tight text-white">
                  Hệ Thống <span className="text-primary font-bold">Học Thuật</span> & Thi Thử
                </h3>

                <p className="text-slate-400 text-sm md:text-base font-body leading-relaxed">
                  Bứt phá giới hạn với kho tài liệu độc quyền và hệ thống thi thử IELTS chuẩn quốc tế. Mọi công cụ bạn cần đều tập trung tại đây.
                </p>
              </div>


              {/* Right Side: Refined Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-5 w-full lg:w-auto shrink-0">
                <motion.a
                  href="https://lms.ptelc.edu.vn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 lg:min-w-[280px] group relative bg-primary px-8 py-5 rounded-2xl flex items-center gap-4 text-white shadow-xl shadow-primary/20 transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <BookOpen size={24} className="group-hover:rotate-12 transition-transform" />
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-0.5 leading-none">LMS Portal</p>
                    <p className="font-heading font-bold text-[17px] leading-tight uppercase">Vào cổng học tập</p>
                  </div>
                </motion.a>

                <motion.a
                  href="/test"
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 lg:min-w-[280px] group relative bg-white/5 border border-white/10 px-8 py-5 rounded-2xl flex items-center gap-4 text-white backdrop-blur-md hover:bg-white/10 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <ExternalLink size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-0.5 leading-none">Practice Test</p>
                    <p className="font-heading font-bold text-[17px] leading-tight uppercase">Thi thử IELTS</p>
                  </div>
                </motion.a>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Faculty Highlight */}
      <section className="py-20 bg-slate-900 relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-primary/20 -skew-x-12 translate-x-1/2"></div>
        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          <h2 className="text-primary font-heading font-bold text-lg uppercase tracking-widest mb-4">Expert Faculty</h2>
          <h3 className="text-white text-3xl md:text-5xl font-heading font-semibold mb-6 leading-tight">
            Đội Ngũ Sáng Lập <br />& Giảng Viên MA.TESOL
          </h3>
          <p className="text-slate-200 text-base md:text-lg mb-8 leading-relaxed font-body">
            "Từng giảng dạy tại Trung tâm Giáo dục Úc (ACET – IDP), giàu kinh nghiệm, nhiệt huyết, với phương pháp giảng dạy hiệu quả và tài liệu biên soạn tỉ mỉ."
          </p>
          <button className="bg-primary hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105">
            Gặp gỡ đội ngũ chuyên gia
          </button>
        </div>
      </section>


      {/* Testimonials */}
      <Testimonials />

      {/* Partners */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-8">Đối tác chiến lược & Khảo thí</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
            {PARTNERS.map((p, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center group"
              >
                <img src={p.logo} alt={p.name} className="h-12 md:h-16 object-contain grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      <Footer />
    </main>
  );
}
