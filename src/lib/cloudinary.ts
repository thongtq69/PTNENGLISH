import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export const uploadFile = async (file: string, folder: string = 'ptn_english') => {
    try {
        // Detect file type from base64 header
        const isPdf = file.includes('application/pdf');
        const isAudio = file.includes('audio/');
        const isVideo = file.includes('video/');

        // Use 'raw' for PDFs and other non-image files to get correct URL format
        const resourceType = (isPdf || isAudio) ? 'raw' : (isVideo ? 'video' : 'auto');

        const response = await cloudinary.uploader.upload(file, {
            folder,
            resource_type: resourceType,
        });
        return response.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return null;
    }
};
