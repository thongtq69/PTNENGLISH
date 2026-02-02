export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';

export async function GET() {
    console.log("GET /api/full-settings - Start");
    try {
        await dbConnect();
        console.log("dbConnect successful in /api/full-settings");
        const settings = await SiteSettings.findOne({});
        console.log("SiteSettings query complete");
        return NextResponse.json(settings || {});
    } catch (e: any) {
        console.error("Error in /api/full-settings:", e.message);
        // Fallback to local JSON file
        try {
            const fs = await import('fs');
            const path = await import('path');
            const filePath = path.default.join(process.cwd(), 'data', 'site-settings.json');
            if (fs.default.existsSync(filePath)) {
                const data = fs.default.readFileSync(filePath, 'utf8');
                return NextResponse.json(JSON.parse(data));
            }
        } catch (fsError) {
            console.error("Failed to read fallback file:", fsError);
        }
        return NextResponse.json({});
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();
        // Remove MongoDB internal fields before saving
        const { _id, __v, createdAt, updatedAt, ...cleanData } = data;

        await SiteSettings.findOneAndUpdate({}, cleanData, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Save error:', error);
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
