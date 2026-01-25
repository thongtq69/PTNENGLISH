import mongoose, { Schema } from 'mongoose';

const AchievementSchema = new Schema({
    student: String,
    score: String,
    url: String, // Cloudinary Image URL
    title: String
}, { timestamps: true });

export default mongoose.models.Achievement || mongoose.model('Achievement', AchievementSchema);
