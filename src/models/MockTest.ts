import mongoose, { Schema } from 'mongoose';

const TestSectionSchema = new Schema({
    title: String,
    passage: String, // Rich text reading passage (HTML) - for split-view display
    content: String, // Interactive questions content with [Q1], [Q2] tags
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
