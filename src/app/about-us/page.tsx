import AboutUsContent from './AboutUsContent';
import dbConnect from '@/lib/mongodb';
import Page from '@/models/Page';

export const dynamic = 'force-dynamic';

export default async function AboutUsPage() {
    await dbConnect();
    const pageData = await Page.findOne({ slug: 'about-us' }).lean();

    return <AboutUsContent pageData={JSON.parse(JSON.stringify(pageData))} />;
}
