export const dynamic = "force-dynamic";
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

        if (!Array.isArray(posts)) {
            return NextResponse.json({ error: "Invalid data format. Expected an array." }, { status: 400 });
        }

        // 1. Wipe current posts (destructive sync approach as per current architecture)
        await Post.deleteMany({});

        // 2. Clean posts for insertion
        // We strip _id from new posts (temporary string IDs) to let Mongo generate real ObjectIds
        const cleanedPosts = posts.map(p => {
            const { _id, ...rest } = p;
            // If _id looks like a valid MongoDB ObjectId (24 chars hex), keep it to preserve identity
            if (_id && /^[0-9a-fA-F]{24}$/.test(_id)) {
                return { ...rest, _id };
            }
            // Otherwise, it's a new post or has an invalid ID, skip it and let Mongo generate one
            return rest;
        });

        await Post.insertMany(cleanedPosts);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Post save error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
