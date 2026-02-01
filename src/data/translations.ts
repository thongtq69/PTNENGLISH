export type Language = "vi" | "en";

export const translations = {
    vi: {
        nav: {
            home: "Trang chủ",
            about: "Về chúng tôi",
            courses: "Chương trình học",
            studentCorner: "Góc học viên",
            blog: "Blog",
            lms: "Cổng LMS",
            register: "Đăng ký ngay",
            close: "Đóng"
        },
        topbar: {
            followUs: "Theo dõi:",
            contact: "Liên hệ"
        },
        home: {
            hero: {
                title: "Kiến tạo hành trình \n tri thức",
                subtitle: "Partner to navigate your learning journey",
                primaryCTA: "Đăng ký học thử ngay",
                secondaryCTA: "Tìm hiểu phương pháp"
            },
            philosophy: {
                title: "Triết lý PTN",
                text: "“Xuất phát từ niềm tin của các nhà sáng lập vào giáo dục có chiều sâu...”"
            },
            intro: {
                badge: "Hệ Thống Đào Tạo Academic Master",
                title: "TTNN PHÚ TÀI NĂNG",
                desc: "Là trung tâm đào tạo tiếng Anh Học thuật dành cho thiếu niên và người lớn, luyện thi chứng chỉ IELTS chuyên nghiệp và uy tín."
            },
            campus: {
                badge: "Digital Campus",
                system: "PTELC Academic System",
                title: "Hệ Thống Học Thuật & Thi Thử",
                desc: "Bứt phá giới hạn với kho tài liệu độc quyền và hệ thống thi thử IELTS chuẩn quốc tế.",
                lmsBtn: "Vào cổng học tập",
                testBtn: "Thi thử IELTS"
            }
        },
        common: {
            loading: "Đang tải...",
            retry: "Thử lại",
            successful: "Thành công"
        }
    },
    en: {
        nav: {
            home: "Home",
            about: "About Us",
            courses: "Courses",
            studentCorner: "Student Corner",
            blog: "Blog",
            lms: "LMS Portal",
            register: "Enroll Now",
            close: "Close"
        },
        topbar: {
            followUs: "Follow us:",
            contact: "Contact"
        },
        home: {
            hero: {
                title: "Shaping Your \n Knowledge Journey",
                subtitle: "Partner to navigate your learning journey",
                primaryCTA: "Book a Trial Class",
                secondaryCTA: "Our Methodology"
            },
            philosophy: {
                title: "PTN Philosophy",
                text: "“Based on the founders' belief in deep education...”"
            },
            intro: {
                badge: "Academic Master Education System",
                title: "PHU TAI NANG LANGUAGE CENTER",
                desc: "A center for Academic English training for teens and adults, professional and prestigious IELTS test preparation."
            },
            campus: {
                badge: "Digital Campus",
                system: "PTELC Academic System",
                title: "Academic & Mock Test System",
                desc: "Break boundaries with exclusive materials and international standard IELTS mock testing.",
                lmsBtn: "Enter Learning Portal",
                testBtn: "IELTS Mock Test"
            }
        },
        common: {
            loading: "Loading...",
            retry: "Retry",
            successful: "Successful"
        }
    }
};

export type TranslationKeys = typeof translations.vi;
