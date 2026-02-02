import mongoose, { Schema } from 'mongoose';

const ChatbotLeadSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    interest: String,
    source: { type: String, default: 'Chatbot' },
    status: { type: String, default: 'new' }, // new, contacted, interested, closed
    notes: String
}, { timestamps: true });

export default mongoose.models.ChatbotLead || mongoose.model('ChatbotLead', ChatbotLeadSchema);
