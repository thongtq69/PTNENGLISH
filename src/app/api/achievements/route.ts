export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Achievement from '@/models/Achievement';
import { saveBackup } from '@/lib/backupService';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        await dbConnect();
        const achievements = await Achievement.find({}).sort({ createdAt: -1 });
        if (achievements && achievements.length > 0) return NextResponse.json(achievements);
        throw new Error("No data");
    } catch (e) {
        const filePath = path.join(process.cwd(), 'data', 'achievements.json');
        if (fs.existsSync(filePath)) {
            return NextResponse.json(JSON.parse(fs.readFileSync(filePath, 'utf8')));
        }
        return NextResponse.json([]);
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const achievements = await request.json();

        await saveBackup('achievements', achievements);

        await Achievement.deleteMany({});
        await Achievement.insertMany(achievements);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
