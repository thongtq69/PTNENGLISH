export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Page from '@/models/Page';
import { translations } from "@/data/translations";

const getDefaultData = (lang: string = 'vi') => {
    const t = lang === 'en' ? translations.en : translations.vi;
    const c = t.courses;

    return {
        hero: c.hero,
        targetAudience: c.targetAudience,
        specs: c.specs,
        schedules: c.schedules,
        pathway: c.pathway,
        levels: c.levels,
        placement: c.placement,
        levelModal: c.levelModal,
        bottomCta: c.bottomCta
    };
};

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const lang = searchParams.get('lang') || 'vi';
        const slug = `courses-content-${lang}`;

        const page = await Page.findOne({ slug }).lean();

        if (page && (page as any).content) {
            return NextResponse.json((page as any).content);
        }

        // Return default data if not found in DB
        return NextResponse.json(getDefaultData(lang));
    } catch (error: any) {
        return NextResponse.json(getDefaultData());
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const lang = searchParams.get('lang') || 'vi';
        const data = await request.json();
        const slug = `courses-content-${lang}`;

        const page = await Page.findOneAndUpdate(
            { slug },
            {
                $set: {
                    slug,
                    title: `Courses Page Content (${lang.toUpperCase()})`,
                    content: data,
                    lastModified: new Date()
                }
            },
            { upsert: true, new: true }
        ).lean();

        return NextResponse.json({ success: true, data: (page as any).content });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
