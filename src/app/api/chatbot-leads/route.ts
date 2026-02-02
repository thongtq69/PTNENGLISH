import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ChatbotLead from '@/models/ChatbotLead';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { name, phone, interest } = body;

        if (!name || !phone) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const lead = await ChatbotLead.create({
            name,
            phone,
            interest,
            source: 'Chatbot'
        });

        return NextResponse.json({ success: true, data: lead });
    } catch (error: any) {
        console.error("Chatbot lead error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        await dbConnect();
        const leads = await ChatbotLead.find({}).sort({ createdAt: -1 });
        return NextResponse.json(leads);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

        await ChatbotLead.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

