import mongoose, { Schema, Document } from 'mongoose';

const CourseSchema = new Schema({
    name: String,
    level: String,
    goal: String,
    duration: String,
    price: String,
    description: String,
    path: [String],
    tag: String,
    image: String
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);
