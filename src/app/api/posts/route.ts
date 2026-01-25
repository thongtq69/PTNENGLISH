import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export async function GET() {
    await dbConnect();
    const posts = await Post.find({}).sort({ createdAt: -1 });
    return NextResponse.json(posts);
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const posts = await request.json();

        // Sync the whole array (be careful with this in production!)
        await Post.deleteMany({});
        await Post.insertMany(posts);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
