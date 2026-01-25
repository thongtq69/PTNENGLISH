import CoursesContent from "./CoursesContent";
import dbConnect from "@/lib/mongodb";
import Page from "@/models/Page";

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
    await dbConnect();
    const pageData = await Page.findOne({ slug: 'courses' }).lean();

    return <CoursesContent pageData={pageData ? JSON.parse(JSON.stringify(pageData)) : null} />;
}
