import { NextResponse } from 'next/server';
import { getIssues, saveIssue, Issue } from '@/lib/data';

export async function GET() {
    const issues = getIssues();
    return NextResponse.json(issues);
}

export async function POST(request: Request) {
    const body = await request.json();
    const newIssue: Issue = {
        id: Date.now().toString(),
        ...body,
        status: 'New',
        createdAt: new Date().toISOString(),
    };
    saveIssue(newIssue);
    return NextResponse.json(newIssue, { status: 201 });
}
