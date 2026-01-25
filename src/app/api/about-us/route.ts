import { NextResponse } from 'next/server';
import { getAboutUs, saveAboutUs } from '@/lib/data';

export async function GET() {
    const data = getAboutUs();
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        saveAboutUs(data);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
