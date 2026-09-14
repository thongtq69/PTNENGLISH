import StudentCornerContent from "./StudentCornerContent";
import { loadCmsData } from "@/lib/load-cms-data";
import Page from "@/models/Page";
import SiteSettings from "@/models/SiteSettings";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Góc Học Viên - Tài liệu & Thi thử IELTS Online',
    description: 'Không gian dành riêng cho học viên PTN English: truy cập LMS, kho tài liệu học thuật, bài thi thử IELTS miễn phí, và lộ trình học tập cá nhân hoá.',
    keywords: ['góc học viên', 'LMS PTN English', 'tài liệu IELTS', 'thi thử IELTS online', 'kho tài liệu tiếng Anh'],
    alternates: {
        canonical: '/student-corner',
    },
    openGraph: {
        title: 'Góc Học Viên PTN English',
        description: 'Truy cập tức thì vào hệ thống học tập, kho tài liệu và bài thi thử chuẩn quốc tế.',
        url: '/student-corner',
        type: 'website',
    },
};

export default async function StudentCornerPage() {
    const [pageData, siteSettings] = await Promise.all([
        loadCmsData('student-corner', () => Page.findOne({ slug: 'student-corner' }).lean().exec()),
        loadCmsData('student-corner/settings', () => SiteSettings.findOne({}).lean().exec()),
    ]);

    return <StudentCornerContent pageData={pageData} siteSettings={siteSettings} />;
}
