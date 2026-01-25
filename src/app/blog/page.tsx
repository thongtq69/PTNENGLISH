import BlogContent from "./BlogContent";

async function getPageData() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/pages/blog`, {
        next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    return res.json();
}

export default async function BlogPage() {
    const pageData = await getPageData();

    return <BlogContent pageData={pageData} />;
}
