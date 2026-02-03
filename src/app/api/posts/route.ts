export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { saveBackup } from '@/lib/backupService';
import fs from 'fs';
import path from 'path';

export async function GET() {
    console.log("GET /api/posts - Start");
    try {
        console.log("Attempting dbConnect in /api/posts");
        await dbConnect();
        console.log("dbConnect successful in /api/posts");
        const posts = await Post.find({}).sort({ createdAt: -1 });
        console.log(`Found ${posts?.length || 0} posts in DB`);

        if (posts && posts.length > 0) {
            return NextResponse.json(posts);
        }
        console.log("No posts in DB, falling back to JSON file");
        throw new Error("No data in DB");
    } catch (e: any) {
        console.log(`Error in /api/posts GET: ${e.message}. Falling back to FS.`);
        const filePath = path.join(process.cwd(), 'data', 'posts.json');
        if (fs.existsSync(filePath)) {
            try {
                const data = fs.readFileSync(filePath, 'utf8');
                return NextResponse.json(JSON.parse(data));
            } catch (jsonError: any) {
                console.error("Failed to parse posts.json fallback:", jsonError);
                return NextResponse.json({ error: "System Error" }, { status: 500 });
            }
        }
        console.log("No posts.json fallback found");
        return NextResponse.json([]);
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const posts = await request.json();

        if (!Array.isArray(posts)) {
            return NextResponse.json({ error: "Invalid format" }, { status: 400 });
        }

        await saveBackup('posts', posts);

        await Post.deleteMany({});
        if (posts.length > 0) {
            const cleanedPosts = posts.map(p => {
                const { _id, ...rest } = p;
                if (_id && /^[0-9a-fA-F]{24}$/.test(_id)) {
                    return { ...rest, _id };
                }
                return rest;
            });
            await Post.insertMany(cleanedPosts);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
