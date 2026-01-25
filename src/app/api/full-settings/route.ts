import { NextResponse } from 'next/server';
import { getFullGlobalSettings, saveFullGlobalSettings } from '@/lib/data';

export async function GET() {
    return NextResponse.json(getFullGlobalSettings());
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        saveFullGlobalSettings(data);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
