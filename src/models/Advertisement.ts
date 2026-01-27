import mongoose, { Schema } from 'mongoose';

const AdItemSchema = new Schema({
    icon: { type: String, default: 'Clock' },
    text: String,
    link: { type: String, default: '#' }
});

const AdvertisementSchema = new Schema({
    name: { type: String, required: true }, // Internal name for admin
    isActive: { type: Boolean, default: false },

    // Left side
    leftImage: String,
    leftLabel: { type: String, default: 'ADMISSION 2025' },
    leftHeading: String,
    leftSubheading: String,

    // Right side
    rightTitle: { type: String, default: 'LỊCH KHAI GIẢNG' },
    rightSubtitle: String,
    rightSlogan: String,
    items: [AdItemSchema],

    // Display logic
    showOnce: { type: Boolean, default: true }, // Show only once per session
}, { timestamps: true });

export default mongoose.models.Advertisement || mongoose.model('Advertisement', AdvertisementSchema);
