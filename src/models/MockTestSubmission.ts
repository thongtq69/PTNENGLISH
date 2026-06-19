import mongoose, { Schema } from 'mongoose';

const SkillResultSchema = new Schema({
    band: String,
    score: Number,
    total: Number,
    pct: Number,
    hasAnswerKey: Boolean,
    details: { type: Schema.Types.Mixed, default: [] }
}, { _id: false });

const MockTestSubmissionSchema = new Schema({
    testId: { type: Schema.Types.ObjectId, ref: 'MockTest' },
    testName: String,
    contact: {
        name: String,
        phone: String,
        email: String
    },
    answers: {
        listening: { type: Schema.Types.Mixed, default: {} },
        reading: { type: Schema.Types.Mixed, default: {} },
        writing: { type: Schema.Types.Mixed, default: {} }
    },
    results: {
        listening: SkillResultSchema,
        reading: SkillResultSchema,
        writing: {
            status: { type: String, default: 'pending' },
            score: String,
            feedback: String
        }
    },
    status: { type: String, default: 'completed' },
    adminNotes: String,
    submittedAt: { type: Date, default: Date.now },
    timeSpentSeconds: Number
}, { timestamps: true });

export default mongoose.models.MockTestSubmission || mongoose.model('MockTestSubmission', MockTestSubmissionSchema);
