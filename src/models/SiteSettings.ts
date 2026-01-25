import mongoose, { Schema } from 'mongoose';

const SiteSettingsSchema = new Schema({
    hero: {
        videoUrl: String,
        title: String,
        subtitle: String,
        primaryCTA: { text: String, link: String },
        secondaryCTA: { text: String, link: String }
    },
    announcement: {
        enabled: { type: Boolean, default: true },
        text: String,
        link: String
    },
    philosophy: String
}, { timestamps: true });

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
