import StudentCornerContent from "./StudentCornerContent";
import dbConnect from "@/lib/mongodb";
import Page from "@/models/Page";

export default async function StudentCornerPage() {
    await dbConnect();
    const pageData = await Page.findOne({ slug: 'student-corner' }).lean();

    // Normalize for client component
    const data = pageData ? JSON.parse(JSON.stringify(pageData)) : null;

    return <StudentCornerContent pageData={data} />;
}
