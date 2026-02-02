import BlogContent from "./BlogContent";
import dbConnect from "@/lib/mongodb";
import Page from "@/models/Page";

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
    let pageData = null;
    try {
        await dbConnect();
        // Set a timeout for the query if possible, or just catch the error
        pageData = await Page.findOne({ slug: 'blog' }).lean();
    } catch (e) {
        console.error("Error loading blog page data from DB:", e);
    }

    // Normalize for client component (handling potential Buffer/Object types from MongoDB)
    const data = pageData ? JSON.parse(JSON.stringify(pageData)) : null;

    return <BlogContent pageData={data} />;
}
