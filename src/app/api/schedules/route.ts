import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Schedule from '@/models/Schedule';

export async function GET() {
    await dbConnect();
    const schedules = await Schedule.find({}).sort({ createdAt: 1 });
    return NextResponse.json(schedules);
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();

        await Schedule.deleteMany({});
        await Schedule.insertMany(data);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
