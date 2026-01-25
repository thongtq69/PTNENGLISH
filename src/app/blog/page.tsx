import BlogContent from "./BlogContent";
import dbConnect from "@/lib/mongodb";
import Page from "@/models/Page";

export default async function BlogPage() {
    await dbConnect();
    const pageData = await Page.findOne({ slug: 'blog' }).lean();

    // Normalize for client component (handling potential Buffer/Object types from MongoDB)
    const data = pageData ? JSON.parse(JSON.stringify(pageData)) : null;

    return <BlogContent pageData={data} />;
}
