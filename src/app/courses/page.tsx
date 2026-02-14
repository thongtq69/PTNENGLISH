import CoursesContent from "./CoursesContent";
import dbConnect from "@/lib/mongodb";
import Page from "@/models/Page";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Chương trình học - Khóa IELTS, PTE, Tiếng Anh Giao tiếp',
    description: 'Khám phá các khóa học tại PTN English: Luyện thi IELTS, PTE Academic, Tiếng Anh Tổng quát, Tiếng Anh Trung học. Lộ trình cá nhân hoá, cam kết đầu ra, đội ngũ MA.TESOL.',
    keywords: ['khóa học IELTS', 'luyện thi PTE', 'tiếng Anh giao tiếp', 'khóa học tiếng Anh TP.HCM', 'PTN English courses', 'English for Teens', 'Academic English'],
    alternates: {
        canonical: '/courses',
    },
    openGraph: {
        title: 'Chương trình học tại PTN English - IELTS, PTE, General English',
        description: 'Lộ trình cá nhân hoá cho mọi trình độ. Từ IELTS Foundation đến Advanced, PTE Academic, và Tiếng Anh Tổng quát.',
        url: '/courses',
        type: 'website',
    },
};

export default async function CoursesPage() {
    await dbConnect();

    // Load courses page content data (default to Vietnamese on server-side)
    const pageData = await Page.findOne({ slug: 'courses-content-vi' }).lean();

    return <CoursesContent pageData={pageData ? JSON.parse(JSON.stringify(pageData)) : null} />;
}
