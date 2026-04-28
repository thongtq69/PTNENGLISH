export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Advertisement from '@/models/Advertisement';

export async function GET() {
    try {
        await dbConnect();
        const activeAds = await Advertisement.find({ isActive: true }).sort({ displayOrder: -1, createdAt: -1 });
        return NextResponse.json(activeAds);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
