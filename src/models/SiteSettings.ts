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
    philosophy: String,
    programs: [{
        name: String,
        image: String,
        color: String
    }],
    partners: [{
        name: String,
        logo: String
    }],
    site: {
        title: String,
        description: String
    },
    contact: {
        phone: String,
        email: String,
        address: String,
        facebook: String,
        instagram: String,
        youtube: String,
        mapsUrl: String
    },
    footer: {
        aboutText: String,
        copyright: String
    }
}, { timestamps: true });

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
