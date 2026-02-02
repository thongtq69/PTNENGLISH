export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { saveBackup } from '@/lib/backupService';
import { Types } from 'mongoose';

export async function GET() {
    try {
        await dbConnect();
        const posts = await Post.find({}).sort({ createdAt: -1 }).lean();

        if (posts && posts.length > 0) {
            return NextResponse.json(posts);
        }
        return NextResponse.json([]);
    } catch (e: any) {
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

        // Convert string IDs to ObjectIds for filtering and operations
        const validHexIds = posts
            .filter(p => p._id && /^[0-9a-fA-F]{24}$/.test(p._id))
            .map(p => new Types.ObjectId(p._id));

        // Delete posts NOT in the incoming list
        await Post.deleteMany({ _id: { $nin: validHexIds } });

        // Map operations
        const ops = posts.map(p => {
            const { _id, ...rest } = p;

            if (_id && /^[0-9a-fA-F]{24}$/.test(_id)) {
                return {
                    updateOne: {
                        filter: { _id: new Types.ObjectId(_id) },
                        update: { $set: rest },
                        upsert: true
                    }
                };
            }

            return {
                insertOne: {
                    document: rest
                }
            };
        });

        if (ops.length > 0) {
            await Post.bulkWrite(ops);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("POST /api/posts error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
