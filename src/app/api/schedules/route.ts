import { NextResponse } from 'next/server';
import { getSchedules, saveSchedules } from '@/lib/data';

export async function GET() {
    return NextResponse.json(getSchedules());
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        saveSchedules(data);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
