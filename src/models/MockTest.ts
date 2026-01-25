import mongoose, { Schema } from 'mongoose';

const MockTestSchema = new Schema({
    name: String,
    listening: {
        pdf: String,
        audio: [{ section: Number, url: String }],
        questionsCount: { type: Number, default: 40 },
        content: String // Added for interactive content
    },
    reading: {
        pdf: String,
        questionsCount: { type: Number, default: 40 },
        content: String // Added for interactive content
    },
    writing: {
        pdf: String,
        questionsCount: { type: Number, default: 2 },
        content: String // Added for interactive content
    }
}, { timestamps: true });

export default mongoose.models.MockTest || mongoose.model('MockTest', MockTestSchema);
