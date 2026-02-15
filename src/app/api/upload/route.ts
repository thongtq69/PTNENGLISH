import { NextResponse } from 'next/server';
import { uploadFile } from '@/lib/cloudinary';

export const maxDuration = 60; // Tăng thời gian xử lý lên 60 giây
export const dynamic = 'force-dynamic';

// Cấu hình giới hạn body size cho API
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '50mb', // Cho phép upload file lên tới 50mb
        },
    },
};

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

        const url = await uploadFile(fileBase64, `ptn_english/${folder}`);

        if (!url) {
            return NextResponse.json({ error: 'Failed to upload to Cloudinary' }, { status: 500 });
        }

        return NextResponse.json({ url });
    } catch (error: any) {
        console.error('Upload API error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
