import mongoose, { Schema } from 'mongoose';

const EventSchema = new Schema({
    title: String,
    slug: { type: String, unique: true },
    excerpt: String,
    content: String,
    location: String,
    eventDate: String,
    category: { type: String, default: 'Sự kiện' },
    author: { type: String, default: 'PTN English' },
    date: String,
    readTime: String,
    image: String,
    originalImage: String,
    imagePosition: Schema.Types.Mixed,
    gallery: [String],
    tags: [String],
    sourceUrl: String,
    showInBlog: { type: Boolean, default: true },
    featured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
