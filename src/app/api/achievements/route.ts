import { NextResponse } from 'next/server';
import { getAchievements, saveAchievements } from '@/lib/data';

export async function GET() {
    return NextResponse.json(getAchievements());
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        saveAchievements(data);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
