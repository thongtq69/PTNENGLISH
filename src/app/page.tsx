import HomeContent from './HomeContent';
import dbConnect from '@/lib/mongodb';
import Page from '@/models/Page';
import SiteSettings from '@/models/SiteSettings';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export default async function Home() {
    let pageData = null;
    let siteSettings = null;

    try {
        await dbConnect();
        // Fetch data from MongoDB
        pageData = await Page.findOne({ slug: 'home' }).lean();
        siteSettings = await SiteSettings.findOne({}).lean();
    } catch (e) {
        console.error("Error loading home page data from DB:", e);
        // Try fallback from local JSON files
        try {
            const settingsPath = path.join(process.cwd(), 'data', 'site-settings.json');
            if (fs.existsSync(settingsPath)) {
                siteSettings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
            }
        } catch (fsError) {
            console.error("Failed to load fallback settings:", fsError);
        }
    }

    return <HomeContent pageData={pageData ? JSON.parse(JSON.stringify(pageData)) : null} siteSettings={siteSettings ? JSON.parse(JSON.stringify(siteSettings)) : null} />;
}
