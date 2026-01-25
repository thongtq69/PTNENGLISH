import { NextResponse } from 'next/server';
import { getPosts, savePosts } from '@/lib/data';

export async function GET() {
    return NextResponse.json(getPosts());
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        savePosts(data);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
