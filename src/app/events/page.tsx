import EventsContent from "./EventsContent";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Sự kiện - PTN English',
    description: 'Các sự kiện, hoạt động nổi bật và hành trình đồng hành cùng cộng đồng của PTN English - Trung tâm Ngoại ngữ Phú Tài Năng.',
    keywords: ['sự kiện PTN English', 'Vietnam Young Lions', 'Debate Competition', 'Top Universities', 'hoạt động PTN'],
    alternates: {
        canonical: '/events',
    },
    openGraph: {
        title: 'Sự kiện PTN English',
        description: 'Cập nhật các sự kiện và hoạt động nổi bật của PTN English.',
        url: '/events',
        type: 'website',
    },
};

export default function EventsPage() {
    return <EventsContent />;
}
