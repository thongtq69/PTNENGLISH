import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Liên hệ - Đăng ký học thử miễn phí',
    description: 'Liên hệ PTN English tại 146 Bis Nguyễn Văn Thủ, Q.1, TP.HCM. Hotline: 0902 508 290. Đăng ký tư vấn và học thử miễn phí các khóa IELTS, PTE, Tiếng Anh Giao tiếp.',
    keywords: ['liên hệ PTN English', 'đăng ký học IELTS', 'học thử tiếng Anh', 'trung tâm tiếng Anh quận 1', 'tư vấn khóa học IELTS'],
    alternates: {
        canonical: '/contact',
    },
    openGraph: {
        title: 'Liên hệ PTN English - Tư vấn & Đăng ký',
        description: 'Đăng ký tư vấn miễn phí. Địa chỉ: 146 Bis Nguyễn Văn Thủ, Q.1, TP.HCM. Hotline: 0902 508 290.',
        url: '/contact',
        type: 'website',
    },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children;
}
