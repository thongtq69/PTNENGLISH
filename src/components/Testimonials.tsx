"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const TESTIMONIALS = [
    {
        name: "Mai Thuy",
        sub: "Phụ huynh Trần Thành Lộc",
        text: "Tôi rất hài lòng cách dạy của thầy cô và cách theo sát việc học của từng học viên ở đây. Lúc đầu tôi lo lắng phần kỹ năng Writing và cách học của con, nhưng nhờ sự tận tâm giảng dạy nhiệt tình của thầy Phong và Cô Trâm mà bé nhà tôi đã tiến bộ nhiều, đợt thi IELTS vừa rồi bé đạt điểm tốt, cảm ơn thầy Phong, cô Trâm và Cô Tâm theo chăm từng bước học viên rất nhiều !",
        image: "https://www.ptelc.edu.vn/wp-content/uploads/2025/01/Mai-Thuy-e1736174781558.jpg"
    },
    {
        name: "Phuong Thao Nguyen",
        sub: "Du học sinh Finland",
        text: "PTelc là trung tâm anh ngữ tốt nhất mà mình từng theo học và mình sẵn sàng giới thiệu cho bạn bè, người thân của mình. Thầy cô không những có chuyên môn cao mà còn siêu dễ thương và nhiệt tình. Dù mình đã sang Finland, khi mình gặp khó khăn hay trở ngại trong việc viết essays, assignments thậm chí tài liệu anh ngữ liên quan đến chuyên ngành, chỉ cần inbox cho chị admin dễ thương là mình ngay lập tức nhận được hỗ trợ. Xin thả “ngàn tim” PTelc, cảm ơn thầy cô đã giúp mình từ một người “dốt” thành “tốt” tiếng anh, trao cho mình cơ hội để tự tin “nhìn ra thế giới”",
        image: "https://www.ptelc.edu.vn/wp-content/uploads/2025/01/Screenshot_42-e1736169103224.png"
    },
    {
        name: "Vy Ton",
        sub: "Du học sinh ĐH Oklahoma, USA",
        text: "Sau khoá học tại PTelc, em đã đạt được mục tiêu đi du học của mình cùng với số điểm IELTS mà em mong muốn. Điều làm em ấn tượng nhất ở PTelc là phương pháp giảng dạy của các thầy cô, em được học từ cơ bản cho đến nâng cao phù hợp với trình độ của mình. Tuy là trung tâm học thi IELTS nhưng thầy cô không đơn thuần chú trọng vào việc “giải đề” mà thực sự chuyên sâu những “kiến thức” giúp ích cho việc thi IELTS. Đối với em 2 kĩ năng khó nhất là writing và speaking, những gì thầy Phong dạy không chỉ có ích trong việc thi IELTS mà còn có thể ứng dụng vào các bài luận khi em đi du học. Cô Trâm lại rất chuyên về speaking, cô có rất nhiều hoạt động giúp em tăng sự tự tin trong việc nói tiếng Anh. Em còn có cơ hội được học cùng với thầy Nhân. Thầy giảng dạy theo phương pháp “active learning” giúp em tiếp thu và sử dụng kiến thức vừa được học ngay trong lớp thông qua “peer teaching” và ‘debate”. Theo em thầy có kiến thức rất sâu rộng về rất nhiều lĩnh vực không chỉ riêng IELTS và điều đó làm em cảm thấy rất hứng thú mỗi khi đến tiết học của thầy. Em thật sự cảm ơn thầy cô và trung tâm đã giúp đỡ em đạt được nguyện vọng mà em mong muốn.",
        image: "https://www.ptelc.edu.vn/wp-content/uploads/2025/01/Tuong-Vy-666x888.jpg"
    },
    {
        name: "Anh Vy Tran",
        sub: "Du học sinh PTTH Melbourne, Australia",
        text: "Điều đầu tiên là em cảm thấy rất thoải mái khi tham gia mỗi buổi học ở Ptelc, ngoài việc học thêm được những kiến thức thì em còn được làm quen thêm nhiều bạn mới, giúp em học hỏi được nhiều điều hơn từ những bạn ấy. Ngoài ra thì thầy Phong và cô Trâm vừa là một người thầy vừa là người truyền lửa cho em, giúp em vượt qua những khó khăn mà em đang mắc phải trước khi học trung tâm. Thầy cô rất tận tâm, tâm lý, nhiệt tình giúp đỡ em khi em không hiểu bài, chấm bài rất kỹ và chỉ ra từng lỗi sai để em sửa. Thầy Phong là người giúp em rất nhiều trong các bài Writing và thầy luôn đưa ra những lời khuyên bổ ích giúp cho em ngày càng phát triển hơn. Còn cô Trâm là người giúp em tự tin hơn trong việc giao tiếp và cả trong phần Speaking nữa. Khi học ở trung tâm, em cảm thấy là mình đang dần tiến bộ hơn và học được rất nhiều điều thú vị từ thầy cô. Em thật sự cảm ơn tất cả mọi người ở trung tâm, cảm ơn những bạn học viên rất đáng iu ở trung tâm, cảm ơn thầy Phong, cô Trâm, cô Tâm đã giúp đỡ em trên hành trình gian nan này.",
        image: "https://www.ptelc.edu.vn/wp-content/uploads/2025/01/Anh-Vy-Oz-e1736169002306.jpg"
    },
    {
        name: "Minh Tri Truong",
        sub: "Học viên tiêu biểu",
        text: "Sau 14 tuần học và luyện kỹ năng Reading, Writing với thầy Phong, em thấy cải thiện nhiều hơn về cách đọc và học và nhớ Vocabs bằng collation cũng như chỉnh lại ngữ pháp cùng cấu trúc câu qua nhiều dạng, hỗ trợ cho Writing task 1 & 2 rất nhiều (phần graph, process và essay là phần em đã từng khuyết nhiều nhất). Phần listening với cô Trâm giúp e nâng cao kỹ năng nghe rất nhiều so với trước đây ở phần multiple choice (một trong những phần yếu điểm của em), cách nghe và chọn câu ra câu trả lời đúng. Speaking đầy đủ và chỉnh chu hơn với cách phát âm cùng colloquial language để đạt được band score mong muốn. Điều đặc biệt là Thầy và Cô hiểu được từng điểm ưu và khuyết điểm của học viên để phát triển và chỉnh sửa kịp thời mọi thứ trước ngày thi IELTS.",
        image: "https://www.ptelc.edu.vn/wp-content/uploads/2022/10/h%C3%ACnh-7.png"
    },
    {
        name: "Thanh Son Nguyen",
        sub: "Du học sinh Green River College - Hoa Kỳ",
        text: "Cảm ơn thầy cô đã truyền cho em động lực học tiếng anh ạ em rất thích cách thầy cô giảng bài ạ thầy cô nói rất rõ ràng giảng dạy rất dễ hiểu.",
        image: "https://www.ptelc.edu.vn/wp-content/uploads/2025/01/Thanh-Son-e1736175039641.jpg"
    }
];

export default function Testimonials() {
    const [index, setIndex] = useState(0);

    const next = () => setIndex((i) => (i + 1) % TESTIMONIALS.length);
    const prev = () => setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

    return (
        <section className="py-16 bg-slate-50 relative overflow-hidden">
            {/* Decorative quotes background */}
            <div className="absolute top-0 left-0 p-10 opacity-[0.03] pointer-events-none">
                <Quote size={300} fill="currentColor" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-primary font-heading font-bold text-lg uppercase tracking-[0.3em] mb-4"
                    >
                        Testimonials
                    </motion.h2>
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-heading font-semibold text-accent"
                    >
                        Cảm nghĩ của phụ huynh & học viên
                    </motion.h3>
                </div>

                <div className="max-w-6xl mx-auto relative group">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center bg-white rounded-[3.5rem] p-8 md:p-16 shadow-2xl shadow-slate-200/60 border border-slate-100"
                        >
                            <div className="lg:col-span-2 relative">
                                <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl transform lg:-rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                    <img
                                        src={TESTIMONIALS[index].image}
                                        alt={TESTIMONIALS[index].name}
                                        className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                                    />
                                </div>
                                {/* Decorative Elements */}
                                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10"></div>
                                <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent/5 rounded-full blur-3xl -z-10"></div>
                            </div>

                            <div className="lg:col-span-3 flex flex-col h-full justify-center">
                                <Quote className="text-primary mb-8 opacity-20" size={48} />
                                <div className="relative">
                                    <p className="text-slate-600 font-serif text-lg md:text-xl leading-relaxed not-italic mb-10 overflow-y-auto max-h-[300px] pr-4 custom-scrollbar border-l-4 border-primary pl-8 py-2">
                                        "{TESTIMONIALS[index].text}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-6 mt-auto">
                                    <div className="h-px flex-1 bg-slate-100"></div>
                                    <div className="text-right">
                                        <h4 className="font-heading font-bold text-2xl text-accent">{TESTIMONIALS[index].name}</h4>
                                        <p className="text-primary font-bold text-sm uppercase tracking-widest mt-1">{TESTIMONIALS[index].sub}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Controls */}
                    <div className="flex justify-center mt-12 gap-4">
                        <button
                            onClick={prev}
                            className="p-4 rounded-full bg-white shadow-lg border border-slate-100 text-slate-400 hover:text-primary hover:scale-110 transition-all active:scale-95"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div className="flex items-center gap-3 px-6">
                            {TESTIMONIALS.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setIndex(i)}
                                    className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-12 bg-primary" : "w-2 bg-slate-200 hover:bg-slate-300"}`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={next}
                            className="p-4 rounded-full bg-white shadow-lg border border-slate-100 text-slate-400 hover:text-primary hover:scale-110 transition-all active:scale-95"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
