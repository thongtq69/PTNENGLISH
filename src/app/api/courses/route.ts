export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import { saveBackup } from '@/lib/backupService';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        await dbConnect();
        const courses = await Course.find({}).sort({ order: 1 });
        if (courses && courses.length > 0) return NextResponse.json(courses);
        throw new Error("No data");
    } catch (e) {
        const filePath = path.join(process.cwd(), 'data', 'courses.json');
        if (fs.existsSync(filePath)) {
            return NextResponse.json(JSON.parse(fs.readFileSync(filePath, 'utf8')));
        }
        return NextResponse.json([]);
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const courses = await request.json();

        await saveBackup('courses', courses);

        await Course.deleteMany({});
        await Course.insertMany(courses);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
