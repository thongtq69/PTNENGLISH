export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';
import { saveBackup } from '@/lib/backupService';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        await dbConnect();
        const events = await Event.find({}).sort({ createdAt: -1 });
        if (events && events.length > 0) {
            return NextResponse.json(events);
        }
        throw new Error("No data in DB");
    } catch (e: any) {
        const filePath = path.join(process.cwd(), 'data', 'events.json');
        if (fs.existsSync(filePath)) {
            try {
                const data = fs.readFileSync(filePath, 'utf8');
                return NextResponse.json(JSON.parse(data));
            } catch {
                return NextResponse.json([]);
            }
        }
        return NextResponse.json([]);
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const events = await request.json();

        if (!Array.isArray(events)) {
            return NextResponse.json({ error: "Invalid format" }, { status: 400 });
        }

        await saveBackup('events', events);

        await Event.deleteMany({});
        if (events.length > 0) {
            const cleaned = events.map(e => {
                const { _id, ...rest } = e;
                if (_id && /^[0-9a-fA-F]{24}$/.test(_id)) {
                    return { ...rest, _id };
                }
                return rest;
            });
            await Event.insertMany(cleaned);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
