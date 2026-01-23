import { NextResponse } from 'next/server';
import { updateIssueStatus, Issue } from '@/lib/data';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { status } = await request.json();
    const { id } = await params;
    const success = updateIssueStatus(id, status);

    if (success) {
        return NextResponse.json({ message: 'Status updated' });
    } else {
        return NextResponse.json({ message: 'Issue not found' }, { status: 404 });
    }
}
