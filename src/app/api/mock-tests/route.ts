import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MockTest from '@/models/MockTest';

export async function GET() {
    await dbConnect();
    const tests = await MockTest.find({}).sort({ createdAt: 1 });
    return NextResponse.json(tests);
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const tests = await request.json();

        await MockTest.deleteMany({});
        await MockTest.insertMany(tests);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
