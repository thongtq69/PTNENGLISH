import { NextResponse } from 'next/server';
import { getSiteSettings, saveSiteSettings } from '@/lib/data';

export async function GET() {
    return NextResponse.json(getSiteSettings());
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        saveSiteSettings(data);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
