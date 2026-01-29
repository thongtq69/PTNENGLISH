import mongoose, { Schema } from 'mongoose';

const IssueSchema = new Schema({
    name: String,
    phone: String,
    email: String,
    course: String,
    description: String,
    type: { type: String, default: 'Inquiry' },
    status: { type: String, enum: ['New', 'In Progress', 'Resolved', 'Closed'], default: 'New' }
}, { timestamps: true });

export default mongoose.models.Issue || mongoose.model('Issue', IssueSchema);
