export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import { saveBackup } from '@/lib/backupService';
import fs from 'fs';
import path from 'path';

export async function GET() {
    console.log("GET /api/testimonials - Start");
    try {
        await dbConnect();
        console.log("dbConnect successful in /api/testimonials");
        const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
        console.log(`Found ${testimonials?.length || 0} testimonials`);
        if (testimonials && testimonials.length > 0) {
            return NextResponse.json(testimonials);
        }
        throw new Error("No data in DB");
    } catch (e: any) {
        console.log(`Error in /api/testimonials: ${e.message}. Falling back to FS.`);
        // Fallback to JSON
        const filePath = path.join(process.cwd(), 'data', 'testimonials.json');
        if (fs.existsSync(filePath)) {
            try {
                const data = fs.readFileSync(filePath, 'utf8');
                return NextResponse.json(JSON.parse(data));
            } catch (fsError) {
                console.error("Failed to read testimonials.json fallback:", fsError);
            }
        }
        return NextResponse.json([]);
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();

        if (!Array.isArray(data)) {
            return NextResponse.json({ error: "Invalid format" }, { status: 400 });
        }

        // Always save to JSON backup first
        await saveBackup('testimonials', data);

        await Testimonial.deleteMany({});
        if (data.length > 0) {
            await Testimonial.insertMany(data);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
