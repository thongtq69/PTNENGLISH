import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string || 'uploads';

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileBase64 = `data:${file.type};base64,${buffer.toString('base64')}`;

        const url = await uploadImage(fileBase64, `ptn_english/${folder}`);

        if (!url) {
            return NextResponse.json({ error: 'Failed to upload to Cloudinary' }, { status: 500 });
        }

        return NextResponse.json({ url });
    } catch (error: any) {
        console.error('Upload API error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
