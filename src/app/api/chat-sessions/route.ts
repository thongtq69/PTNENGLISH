import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ChatSession from '@/models/ChatSession';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { sessionId, name, phone, interest, message } = body;

        let session = await ChatSession.findOne({ sessionId });
        if (!session) {
            session = new ChatSession({ sessionId });
        }

        if (name) session.name = name;
        if (phone) session.phone = phone;
        if (interest) session.interest = interest;

        if (message) {
            session.messages.push(message);
            // If sender is user, admin has unread messages
            if (message.sender === 'user') {
                session.unreadAdmin += 1;
                session.status = 'active'; // Mark as active when user interacts
            } else if (message.sender === 'admin') {
                session.unreadUser += 1;
            }
        }

        await session.save();
        return NextResponse.json({ success: true, session });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('sessionId');

        if (sessionId) {
            // Get single session for user
            const session = await ChatSession.findOne({ sessionId });
            if (session) {
                // User is reading, clear unreadUser
                if (session.unreadUser > 0) {
                    session.unreadUser = 0;
                    await session.save();
                }
            }
            return NextResponse.json(session || { messages: [] });
        } else {
            // Admin lists all sessions
            const sessions = await ChatSession.find({}).sort({ updatedAt: -1 });
            return NextResponse.json(sessions);
        }
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await dbConnect();
        const { sessionId, action } = await req.json();

        if (action === 'readAdmin' && sessionId) {
            await ChatSession.updateOne({ sessionId }, { $set: { unreadAdmin: 0 } });
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false }, { status: 400 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
