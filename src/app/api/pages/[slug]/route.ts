import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Page from '@/models/Page';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    await dbConnect();
    try {
        const { slug } = await params;
        const page = await Page.findOne({ slug });
        if (!page) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }
        return NextResponse.json(page);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
