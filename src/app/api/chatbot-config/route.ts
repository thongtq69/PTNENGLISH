import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ChatbotConfig from '@/models/ChatbotConfig';

export async function GET() {
    try {
        await dbConnect();
        let config = await ChatbotConfig.findOne({});

        if (!config) {
            // Create default config if none exists
            config = await ChatbotConfig.create({
                options: [
                    { vi: 'Luyện thi IELTS', en: 'IELTS Preparation' },
                    { vi: 'Luyện thi PTE Phản xạ', en: 'PTE Reflective' },
                    { vi: 'Tiếng Anh giao tiếp', en: 'Communicative English' }
                ]
            });
        }

        return NextResponse.json(config);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        let config = await ChatbotConfig.findOne({});

        if (config) {
            config = await ChatbotConfig.findOneAndUpdate({}, body, { new: true });
        } else {
            config = await ChatbotConfig.create(body);
        }

        return NextResponse.json({ success: true, data: config });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
