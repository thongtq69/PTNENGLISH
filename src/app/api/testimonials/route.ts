import { NextResponse } from 'next/server';
import { getTestimonials, saveTestimonials } from '@/lib/data';

export async function GET() {
    return NextResponse.json(getTestimonials());
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        saveTestimonials(data);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
