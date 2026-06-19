export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import MockTestSubmission from '@/models/MockTestSubmission';

export async function GET() {
    try {
        await dbConnect();
        const submissions = await MockTestSubmission.find({})
            .sort({ submittedAt: -1, createdAt: -1 })
            .lean();
        return NextResponse.json(submissions);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        if (!body?.testName && !body?.testId) {
            return NextResponse.json({ error: "Missing test information" }, { status: 400 });
        }

        const submission = await MockTestSubmission.create({
            testId: mongoose.Types.ObjectId.isValid(body.testId) ? body.testId : undefined,
            testName: body.testName,
            contact: body.contact || {},
            answers: body.answers || {},
            results: body.results || {},
            status: body.status || 'completed',
            adminNotes: body.adminNotes || '',
            submittedAt: body.submittedAt ? new Date(body.submittedAt) : new Date(),
            timeSpentSeconds: body.timeSpentSeconds
        });

        return NextResponse.json({ success: true, data: submission });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { _id, id, ...updates } = body || {};
        const submissionId = _id || id;

        if (!submissionId || !mongoose.Types.ObjectId.isValid(submissionId)) {
            return NextResponse.json({ error: "Invalid submission ID" }, { status: 400 });
        }

        const allowedUpdates = {
            contact: updates.contact,
            answers: updates.answers,
            results: updates.results,
            status: updates.status,
            adminNotes: updates.adminNotes,
            submittedAt: updates.submittedAt,
            timeSpentSeconds: updates.timeSpentSeconds
        };

        const sanitized = Object.fromEntries(
            Object.entries(allowedUpdates).filter(([, value]) => value !== undefined)
        );

        const submission = await MockTestSubmission.findByIdAndUpdate(
            submissionId,
            sanitized,
            { new: true }
        );

        if (!submission) {
            return NextResponse.json({ error: "Submission not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: submission });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid submission ID" }, { status: 400 });
        }

        await MockTestSubmission.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
