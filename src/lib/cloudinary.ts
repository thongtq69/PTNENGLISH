import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export const uploadImage = async (file: string, folder: string = 'ptn_english') => {
    try {
        const response = await cloudinary.uploader.upload(file, {
            folder,
        });
        return response.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return null;
    }
};
