import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema({
    id: { type: String, required: true },
    text: { type: String, required: true },
    sender: { type: String, enum: ['bot', 'user', 'admin'], required: true },
    timestamp: { type: Date, default: Date.now },
});

const ChatSessionSchema = new Schema({
    sessionId: { type: String, required: true, unique: true },
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    interest: { type: String, default: "" },
    messages: [MessageSchema],
    unreadAdmin: { type: Number, default: 0 },
    unreadUser: { type: Number, default: 0 },
    status: { type: String, enum: ['new', 'active', 'closed'], default: 'new' }
}, { timestamps: true });

export default mongoose.models.ChatSession || mongoose.model('ChatSession', ChatSessionSchema);
