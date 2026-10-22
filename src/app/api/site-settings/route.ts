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
        const { _id, __v, createdAt, updatedAt, ...cleanData } = data;

        if (cleanData.homeNewsSource !== undefined && !['blog', 'events'].includes(cleanData.homeNewsSource)) {
            return NextResponse.json({ error: 'Nguồn nội dung trang chủ phải là Blog hoặc Sự kiện.' }, { status: 400 });
        }

        await SiteSettings.findOneAndUpdate({}, cleanData, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
            runValidators: true
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Save error:', error);
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
