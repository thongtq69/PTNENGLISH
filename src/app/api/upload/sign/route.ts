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
        if (!apiSecret) {
            return NextResponse.json({ error: 'Cloudinary API Secret not found' }, { status: 500 });
        }

        const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

        return NextResponse.json({ signature });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
