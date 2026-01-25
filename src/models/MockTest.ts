import mongoose, { Schema } from 'mongoose';

const MockTestSchema = new Schema({
    name: String,
    listening: {
        pdf: String,
        audio: [{ section: Number, url: String }],
        questionsCount: { type: Number, default: 40 }
    },
    reading: {
        pdf: String,
        questionsCount: { type: Number, default: 40 }
    },
    writing: {
        pdf: String,
        questionsCount: { type: Number, default: 2 }
    }
}, { timestamps: true });

export default mongoose.models.MockTest || mongoose.model('MockTest', MockTestSchema);
