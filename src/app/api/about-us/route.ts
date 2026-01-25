import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Page from '@/models/Page';

export async function GET() {
    await dbConnect();
    const page = await Page.findOne({ slug: 'about-us' });
    if (!page) return NextResponse.json({});

    // Map sections back to the old about-us.json format
    const data: any = {};
    page.sections.forEach((s: any) => {
        if (s.type === 'about-hero') data.hero = s.content;
        if (s.type === 'about-story') data.story = s.content;
        if (s.type === 'about-teachers') data.teachers = s.content.items;
        if (s.type === 'about-philosophy') data.philosophy = s.content.items;
        if (s.type === 'about-values') data.values = s.content.items;
        if (s.type === 'about-differences') data.differences = s.content.items;
    });
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();

        // Map back to sections
        const sections = [
            { id: 'about-hero', type: 'about-hero', content: data.hero, order: 1, isVisible: true },
            { id: 'about-story', type: 'about-story', content: data.story, order: 2, isVisible: true },
            { id: 'about-teachers', type: 'about-teachers', content: { items: data.teachers }, order: 3, isVisible: true },
            { id: 'about-philosophy', type: 'about-philosophy', content: { items: data.philosophy }, order: 4, isVisible: true },
            { id: 'about-values', type: 'about-values', content: { items: data.values }, order: 5, isVisible: true },
            { id: 'about-differences', type: 'about-differences', content: { items: data.differences }, order: 6, isVisible: true }
        ];

        await Page.findOneAndUpdate(
            { slug: 'about-us' },
            { title: 'About Us', slug: 'about-us', sections },
            { upsert: true }
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
