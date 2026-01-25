export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { saveBackup } from '@/lib/backupService';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        await dbConnect();
        const posts = await Post.find({}).sort({ createdAt: -1 });
        if (posts && posts.length > 0) {
            return NextResponse.json(posts);
        }
        throw new Error("No data in DB");
    } catch (e) {
        const filePath = path.join(process.cwd(), 'data', 'posts.json');
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return NextResponse.json(JSON.parse(data));
        }
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
