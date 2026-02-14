import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Thi thử IELTS Online miễn phí - Mock Test chuẩn quốc tế',
    description: 'Thi thử IELTS online miễn phí tại PTN English. Hệ thống mock test Listening, Reading, Writing chuẩn IDP/British Council. Chấm điểm tự động, phân tích chi tiết từng kỹ năng.',
    keywords: ['thi thử IELTS online', 'mock test IELTS', 'IELTS practice test', 'thi IELTS miễn phí', 'luyện đề IELTS', 'PTN English test'],
    alternates: {
        canonical: '/test',
    },
    openGraph: {
        title: 'Thi thử IELTS Online miễn phí - PTN English',
        description: 'Mock test IELTS chuẩn quốc tế: Listening, Reading, Writing. Chấm điểm tự động và phân tích chi tiết.',
        url: '/test',
        type: 'website',
    },
};

export default function TestLayout({ children }: { children: React.ReactNode }) {
    return children;
}
