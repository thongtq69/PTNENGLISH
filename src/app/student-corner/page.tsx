import StudentCornerContent from "./StudentCornerContent";

async function getPageData() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/pages/student-corner`, {
        next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    return res.json();
}

export default async function StudentCornerPage() {
    const pageData = await getPageData();

    return <StudentCornerContent pageData={pageData} />;
}
