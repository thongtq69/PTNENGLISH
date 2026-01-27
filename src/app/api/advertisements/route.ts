export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Advertisement from '@/models/Advertisement';

export async function GET() {
    try {
        await dbConnect();
        const ads = await Advertisement.find({}).sort({ createdAt: -1 });
        return NextResponse.json(ads);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();

        let ad;
        if (data._id) {
            ad = await Advertisement.findByIdAndUpdate(data._id, data, { new: true });
        } else {
            ad = await Advertisement.create(data);
        }

        // If this ad is active, deactivate others
        if (data.isActive) {
            await Advertisement.updateMany({ _id: { $ne: ad._id } }, { isActive: false });
        }

        return NextResponse.json(ad);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (id) {
            await Advertisement.findByIdAndDelete(id);
        }
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
