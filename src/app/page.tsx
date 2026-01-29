import HomeContent from './HomeContent';
import dbConnect from '@/lib/mongodb';
import Page from '@/models/Page';
import SiteSettings from '@/models/SiteSettings';

export const dynamic = 'force-dynamic';

export default async function Home() {
    await dbConnect();

    // Fetch data from MongoDB
    const pageData = await Page.findOne({ slug: 'home' }).lean();
    const siteSettings = await SiteSettings.findOne({}).lean();

    return <HomeContent pageData={JSON.parse(JSON.stringify(pageData))} siteSettings={JSON.parse(JSON.stringify(siteSettings))} />;
}
