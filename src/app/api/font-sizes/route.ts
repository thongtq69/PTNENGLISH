export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

// Use a simple schema for font sizes - stored as a single document
const FontSizeSchema = new mongoose.Schema({
    data: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true, collection: 'fontsizes' });

const FontSizeModel = mongoose.models.FontSize || mongoose.model('FontSize', FontSizeSchema);

export async function GET() {
    try {
        await dbConnect();
        const doc = await FontSizeModel.findOne({});
        return NextResponse.json(doc?.data || {});
    } catch (e: any) {
        console.error("Error in /api/font-sizes GET:", e.message);
        return NextResponse.json({});
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();

        await FontSizeModel.findOneAndUpdate(
            {},
            { data },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Font size save error:', error);
        return NextResponse.json({ error: 'Failed to save font sizes' }, { status: 500 });
    }
}
