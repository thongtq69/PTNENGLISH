import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema({
    title: String,
    slug: { type: String, unique: true },
    excerpt: String,
    content: String,
    category: String,
    author: String,
    date: String,
    readTime: String,
    image: String
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
