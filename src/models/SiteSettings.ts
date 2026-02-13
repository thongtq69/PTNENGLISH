import mongoose, { Schema } from 'mongoose';

const SiteSettingsSchema = new Schema({
    hero: {
        videoUrl: String,
        title: String,
        titleEn: String,
        subtitle: String,
        subtitleEn: String,
        primaryCTA: { text: String, link: String },
        secondaryCTA: { text: String, link: String }
    },
    announcement: {
        enabled: { type: Boolean, default: true },
        text: String,
        link: String
    },
    philosophy: String,
    philosophyTitle: String,
    intro: {
        badge: String,
        title: String,
        description: String,
        aboutBtn: String
    },
    campus: {
        badge: String,
        system: String,
        title: String,
        description: String,
        lmsBtn: String,
        testBtn: String
    },
    faculty: {
        badge: String,
        title: String,
        description: String,
        btn: String
    },
    homeBlog: {
        badge: String,
        title: String,
        viewAll: String
    },
    hallOfFame: {
        badge: String,
        title: String,
        titleHighlight: String,
        titleEnd: String,
        description: String,
        descriptionHighlight: String,
        descriptionEnd: String
    },
    partnersSection: {
        badge: String
    },
    programs: [{
        name: String,
        nameEn: String,
        image: String,
        color: String,
        link: String
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
        tiktok: String,
        mapsUrl: String
    },
    footer: {
        aboutText: String,
        copyright: String
    }
}, { timestamps: true });

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
