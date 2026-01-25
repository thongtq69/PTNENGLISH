export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Page from '@/models/Page';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();
        const { slug, title, sections } = data;

        const page = await Page.findOneAndUpdate(
            { slug },
            { slug, title, sections },
            { upsert: true, new: true }
        );

        return NextResponse.json(page);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    await dbConnect();
    const pages = await Page.find({});
    return NextResponse.json(pages);
}
