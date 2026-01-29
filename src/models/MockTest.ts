import mongoose, { Schema } from 'mongoose';

const TestSectionSchema = new Schema({
    title: String,
    content: String,
    answers: { type: Map, of: String },
    questionsCount: Number,
    // For Listening
    audioUrl: String
});

const MockTestSchema = new Schema({
    name: String,
    category: { type: String, default: 'IELTS' },
    listening: {
        pdf: String,
        sections: [TestSectionSchema],
        totalQuestions: { type: Number, default: 40 }
    },
    reading: {
        pdf: String,
        sections: [TestSectionSchema],
        totalQuestions: { type: Number, default: 40 }
    },
    writing: {
        pdf: String,
        content: String, // Tasks description
        tasksCount: { type: Number, default: 2 }
    }
}, { timestamps: true });

export default mongoose.models.MockTest || mongoose.model('MockTest', MockTestSchema);
