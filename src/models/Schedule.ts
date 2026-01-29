import mongoose, { Schema } from 'mongoose';

const ScheduleSchema = new Schema({
    courseId: String,
    title: String,
    time: String,
    date: String,
    link: String
}, { timestamps: true });

export default mongoose.models.Schedule || mongoose.model('Schedule', ScheduleSchema);
