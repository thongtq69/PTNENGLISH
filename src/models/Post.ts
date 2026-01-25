import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema({
    title: String,
    excerpt: String,
    category: String,
    author: String,
    date: String,
    readTime: String,
    image: String
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
