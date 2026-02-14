import BlogContent from "./BlogContent";
import dbConnect from "@/lib/mongodb";
import Page from "@/models/Page";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Blog - Tin tức & Kiến thức Tiếng Anh',
    description: 'Cập nhật tin tức, mẹo học IELTS, ngữ pháp tiếng Anh, từ vựng học thuật và các bài viết chia sẻ kinh nghiệm luyện thi từ đội ngũ PTN English.',
    keywords: ['blog tiếng Anh', 'mẹo học IELTS', 'ngữ pháp tiếng Anh', 'từ vựng IELTS', 'kinh nghiệm luyện thi', 'PTN English blog', 'học tiếng Anh online'],
    alternates: {
        canonical: '/blog',
    },
    openGraph: {
        title: 'Blog PTN English - Tin tức & Kiến thức Tiếng Anh',
        description: 'Khám phá kho tàng kiến thức Tiếng Anh học thuật, mẹo thi IELTS/PTE và cập nhật tin tức giáo dục mới nhất.',
        url: '/blog',
        type: 'website',
    },
};

export default async function BlogPage() {
    let pageData = null;
    try {
        await dbConnect();
        pageData = await Page.findOne({ slug: 'blog' }).lean();
    } catch (e) {
        console.error("Error loading blog page data from DB:", e);
    }

    // Normalize for client component (handling potential Buffer/Object types from MongoDB)
    const data = pageData ? JSON.parse(JSON.stringify(pageData)) : null;

    return <BlogContent pageData={data} />;
}
