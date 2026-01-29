export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Issue from '@/models/Issue';

export async function GET() {
    await dbConnect();
    const issues = await Issue.find({}).sort({ createdAt: -1 });
    return NextResponse.json(issues);
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const newIssue = await Issue.create({
            ...body,
            status: 'New'
        });
        return NextResponse.json(newIssue, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
