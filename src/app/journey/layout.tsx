import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Hành trình Học viên - Lộ trình thành công',
    description: 'Khám phá hành trình từ phân tích năng lực đến chinh phục IELTS/PTE. Câu chuyện thành công từ các học viên du học Úc, Mỹ, Phần Lan cùng PTN English.',
    keywords: ['lộ trình học IELTS', 'hành trình học tiếng Anh', 'câu chuyện thành công', 'du học Úc', 'PTN English journey'],
    alternates: {
        canonical: '/journey',
    },
    openGraph: {
        title: 'Hành trình Học viên PTN English',
        description: 'Từ phân tích năng lực đến chinh phục đích đến. Câu chuyện thành công của các thế hệ học viên PTN English.',
        url: '/journey',
        type: 'website',
    },
};

export default function JourneyLayout({ children }: { children: React.ReactNode }) {
    return children;
}
