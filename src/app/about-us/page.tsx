import AboutUsContent from './AboutUsContent';
import dbConnect from '@/lib/mongodb';
import Page from '@/models/Page';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Về chúng tôi - Trung tâm Anh ngữ Học thuật TP.HCM',
    description: 'PTN English (Phú Tài Năng) - Trung tâm đào tạo Anh văn Học thuật, IELTS, PTE tại Quận 1, TP.HCM. Đội ngũ giảng viên MA.TESOL từ ACET-IDP, hơn 25 năm kinh nghiệm.',
    keywords: ['PTN English', 'trung tâm tiếng anh quận 1', 'học IELTS TP.HCM', 'Anh văn học thuật', 'Phú Tài Năng', 'ACET IDP', 'luyện thi IELTS'],
    alternates: {
        canonical: '/about-us',
    },
    openGraph: {
        title: 'Về PTN English - Trung tâm Anh ngữ Học thuật hàng đầu',
        description: 'Đội ngũ sáng lập từ ACET-IDP, British Council với hơn 25 năm kinh nghiệm. Cam kết chất lượng giáo dục Anh văn Học thuật bài bản.',
        url: '/about-us',
        type: 'website',
    },
};

export default async function AboutUsPage() {
    await dbConnect();
    const pageData = await Page.findOne({ slug: 'about-us' }).lean();

    return <AboutUsContent pageData={JSON.parse(JSON.stringify(pageData))} />;
}
