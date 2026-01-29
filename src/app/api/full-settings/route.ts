export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';

export async function GET() {
    await dbConnect();
    const settings = await SiteSettings.findOne({});
    return NextResponse.json(settings || {});
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
