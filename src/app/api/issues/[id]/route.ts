import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Issue from '@/models/Issue';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const { status } = await request.json();
        const { id } = params;

        const updatedIssue = await Issue.findByIdAndUpdate(id, { status }, { new: true });

        if (updatedIssue) {
            return NextResponse.json({ message: 'Status updated' });
        } else {
            return NextResponse.json({ message: 'Issue not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
