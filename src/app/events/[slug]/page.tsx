import Header from "@/components/Header";
import Footer from "@/components/Footer";
import dbConnect from "@/lib/mongodb";
import Event from "@/models/Event";
import { notFound } from "next/navigation";
import { Metadata } from 'next';
import EventDetailContent from "./EventDetailContent";
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

async function loadEvent(slug: string): Promise<{ event: any | null; related: any[] }> {
    try {
        await dbConnect();
        const event = await Event.findOne({ slug }).lean();
        if (event) {
            const related = await Event.find({ slug: { $ne: slug } })
                .sort({ createdAt: -1 })
                .limit(8)
                .lean();
            return { event, related };
        }
    } catch (e) {
        console.error("Event detail DB lookup failed", e);
    }

    try {
        const filePath = path.join(process.cwd(), 'data', 'events.json');
        if (fs.existsSync(filePath)) {
            const all = JSON.parse(fs.readFileSync(filePath, 'utf8')) as any[];
            const event = all.find(e => e.slug === slug) || null;
            const related = all.filter(e => e.slug !== slug).slice(0, 8);
            return { event, related };
        }
    } catch (e) {
        console.error("Event detail JSON fallback failed", e);
    }
    return { event: null, related: [] };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const { event } = await loadEvent(slug);

    if (!event) return { title: 'Event Not Found' };

    return {
        title: `${event.title} - PTN English`,
        description: event.excerpt || event.content?.substring(0, 160).replace(/<[^>]*>/g, ''),
        openGraph: {
            title: event.title,
            description: event.excerpt,
            images: event.image ? [event.image] : [],
            type: 'article',
            publishedTime: event.createdAt,
            authors: [event.author],
        },
        twitter: {
            card: 'summary_large_image',
            title: event.title,
            description: event.excerpt,
            images: event.image ? [event.image] : [],
        }
    };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { event, related } = await loadEvent(slug);

    if (!event) {
        notFound();
    }

    const eventData = JSON.parse(JSON.stringify({
        title: event.title,
        category: event.category,
        date: event.date,
        eventDate: event.eventDate,
        location: event.location,
        author: event.author,
        image: event.image,
        originalImage: event.originalImage,
        content: event.content,
        excerpt: event.excerpt,
        gallery: event.gallery || [],
        tags: event.tags || [],
        sourceUrl: event.sourceUrl,
    }));

    const relatedData = JSON.parse(JSON.stringify(related));

    return (
        <main className="min-h-screen bg-white overflow-x-hidden">
            <Header />
            <EventDetailContent event={eventData} related={relatedData} />
            <Footer />
        </main>
    );
}
