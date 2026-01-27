export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Advertisement from '@/models/Advertisement';

export async function GET() {
    try {
        await dbConnect();
        const activeAd = await Advertisement.findOne({ isActive: true });
        return NextResponse.json(activeAd);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
