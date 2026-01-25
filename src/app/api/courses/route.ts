export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';

export async function GET() {
    await dbConnect();
    const courses = await Course.find({}).sort({ createdAt: 1 });
    return NextResponse.json(courses);
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const courses = await request.json();

        await Course.deleteMany({});
        await Course.insertMany(courses);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
