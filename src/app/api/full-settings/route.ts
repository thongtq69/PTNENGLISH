export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';

export async function GET() {
    await dbConnect();
    const settings = await SiteSettings.findOne({});
    return NextResponse.json(settings);
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();
        await SiteSettings.findOneAndUpdate({}, data, { upsert: true });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
