import { NextResponse } from 'next/server';
import { getMockTests, saveMockTests } from '@/lib/data';

export async function GET() {
    return NextResponse.json(getMockTests());
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        saveMockTests(data);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
