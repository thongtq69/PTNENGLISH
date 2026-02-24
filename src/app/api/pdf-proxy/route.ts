import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Proxy endpoint for Cloudinary PDFs that may be access-restricted.
 * 
 * Tries multiple resource_types (image, raw) with signed URLs
 * to find and serve the PDF.
 * 
 * Usage: /api/pdf-proxy?url=<cloudinary_url>
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    // Extract the public_id from the Cloudinary URL
    // Format: https://res.cloudinary.com/<cloud>/[image|raw|video]/upload/[v123/]<folder>/<public_id>.<ext>
    const cloudMatch = url.match(
        /cloudinary\.com\/[^/]+\/(image|raw|video)\/upload\/(?:v\d+\/)?(.+)$/i
    );

    if (!cloudMatch) {
        // Not a Cloudinary URL, just proxy it directly
        try {
            const resp = await fetch(url);
            if (!resp.ok) {
                return NextResponse.json({ error: `Upstream returned ${resp.status}` }, { status: resp.status });
            }
            const buffer = await resp.arrayBuffer();
            return new NextResponse(buffer, {
                headers: {
                    'Content-Type': resp.headers.get('Content-Type') || 'application/pdf',
                    'Cache-Control': 'public, max-age=3600',
                },
            });
        } catch (e: any) {
            return NextResponse.json({ error: e.message }, { status: 500 });
        }
    }

    const fullPath = cloudMatch[2]; // e.g. "ptn_english/tests/writing/ksahm1pnqv7qjveoevp4.pdf"
    const publicId = fullPath.replace(/\.[^.]+$/, ''); // strip extension

    // Try to generate a signed URL for both resource types
    const resourceTypes: Array<'image' | 'raw'> = ['image', 'raw'];

    for (const resourceType of resourceTypes) {
        try {
            // Generate a signed URL that bypasses ACL
            const signedUrl = cloudinary.url(publicId, {
                resource_type: resourceType,
                type: 'upload',
                sign_url: true,
                secure: true,
                format: 'pdf',
            });

            const resp = await fetch(signedUrl);
            if (resp.ok) {
                const buffer = await resp.arrayBuffer();
                return new NextResponse(buffer, {
                    headers: {
                        'Content-Type': 'application/pdf',
                        'Cache-Control': 'public, max-age=3600',
                        'Content-Disposition': 'inline',
                    },
                });
            }
        } catch {
            // Try next resource type
            continue;
        }
    }

    // If signed URLs didn't work, try direct fetch with both resource types
    for (const resourceType of resourceTypes) {
        const directUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/${resourceType}/upload/${fullPath}`;
        try {
            const resp = await fetch(directUrl);
            if (resp.ok) {
                const buffer = await resp.arrayBuffer();
                return new NextResponse(buffer, {
                    headers: {
                        'Content-Type': 'application/pdf',
                        'Cache-Control': 'public, max-age=3600',
                        'Content-Disposition': 'inline',
                    },
                });
            }
        } catch {
            continue;
        }
    }

    return NextResponse.json(
        { error: 'PDF not found on any resource type. Please re-upload the file.' },
        { status: 404 }
    );
}
