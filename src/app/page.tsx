import HomeContent from './HomeContent';
import dbConnect from '@/lib/mongodb';
import Page from '@/models/Page';
import SiteSettings from '@/models/SiteSettings';

export default async function Home() {
    await dbConnect();

    // Fetch data from MongoDB
    const pageData = await Page.findOne({ slug: 'home' }).lean();
    const siteSettings = await SiteSettings.findOne({}).lean();

    // If no data in DB, we'll let HomeContent use its hardcoded defaults or handle it
    // But our migration was successful, so data should be there

    return <HomeContent pageData={JSON.parse(JSON.stringify(pageData))} siteSettings={JSON.parse(JSON.stringify(siteSettings))} />;
}
