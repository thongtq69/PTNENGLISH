import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Achievement from '@/models/Achievement';

export async function GET() {
    await dbConnect();
    const achievements = await Achievement.find({}).sort({ createdAt: -1 });
    return NextResponse.json(achievements);
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const achievements = await request.json();

        await Achievement.deleteMany({});
        await Achievement.insertMany(achievements);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
