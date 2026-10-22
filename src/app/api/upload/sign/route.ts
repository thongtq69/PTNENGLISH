import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    try {
        const { paramsToSign } = await request.json();

        const apiSecret = process.env.CLOUDINARY_API_SECRET;
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        if (!apiSecret || !cloudName || !apiKey) {
            return NextResponse.json({ error: 'Chưa cấu hình đầy đủ kho ảnh Cloudinary.' }, { status: 500 });
        }

        const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

        return NextResponse.json({ signature, cloudName, apiKey });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
