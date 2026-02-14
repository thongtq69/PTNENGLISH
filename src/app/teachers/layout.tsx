import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Đội ngũ Giảng viên - Chuyên gia IELTS & Academic English',
    description: 'Gặp gỡ đội ngũ giảng viên MA.TESOL từ ĐH Canberra, Adelaide, Sydney. Nguyên giảng viên ACET-IDP, British Council với hơn 25 năm kinh nghiệm đào tạo IELTS và Tiếng Anh Học thuật.',
    keywords: ['giảng viên IELTS', 'giáo viên tiếng Anh', 'MA TESOL', 'ACET IDP', 'đội ngũ PTN English', 'giảng viên chuyên gia'],
    alternates: {
        canonical: '/teachers',
    },
    openGraph: {
        title: 'Đội ngũ Giảng viên Chuyên gia - PTN English',
        description: 'Thầy cô MA.TESOL từ các trường đại học danh tiếng tại Úc, giàu kinh nghiệm giảng dạy tại ACET-IDP và British Council.',
        url: '/teachers',
        type: 'website',
    },
};

export default function TeachersLayout({ children }: { children: React.ReactNode }) {
    return children;
}
