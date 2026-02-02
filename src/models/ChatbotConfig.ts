import mongoose, { Schema } from 'mongoose';

const ChatbotConfigSchema = new Schema({
    agentName: { type: String, default: 'Ms. Lan' },
    agentImage: { type: String, default: '/images/consultant.png' },
    statusVi: { type: String, default: 'Sẵn sàng tư vấn' },
    statusEn: { type: String, default: 'Online' },

    welcomeMsgVi: { type: String, default: 'Chào bạn! Mình là Lan từ PTN English. 👋' },
    welcomeMsgEn: { type: String, default: "Hello! I'm Lan from PTN English. 👋" },

    questionVi: { type: String, default: 'Bạn đang quan tâm đến lộ trình học nào để Lan hỗ trợ tư vấn chi tiết nhất nhé?' },
    questionEn: { type: String, default: 'Which learning pathway are you interested in so I can provide the most detailed advice?' },

    options: [{
        vi: { type: String },
        en: { type: String }
    }],

    leadsPromptVi: { type: String, default: 'Dạ tuyệt vời ạ! Để Lan gửi chi tiết lộ trình {interest} và bộ tài liệu độc quyền qua Zalo cho mình, bạn cho Lan xin thông tin nhé:' },
    leadsPromptEn: { type: String, default: "That's wonderful! To send you the details for the {interest} pathway and exclusive materials via Zalo, please provide your information:" },

    thanksMsgVi: { type: String, default: 'Cảm ơn {name}! Lan đã nhận được thông tin. Bạn nhấn nút bên dưới để chat trực tiếp với Lan qua Zalo ngay nhé!' },
    thanksMsgEn: { type: String, default: 'Thank you {name}! Lan has received your information. Click the button below to chat directly with me via Zalo now!' },

    whatsappNumber: { type: String, default: '84902508290' },
    zaloTextVi: { type: String, default: 'CHAT ZALO NGAY' },
    zaloTextEn: { type: String, default: 'CHAT ZALO NOW' },

    floatingPromptVi: { type: String, default: 'Cần Lan giúp gì không ạ? 👋' },
    floatingPromptEn: { type: String, default: 'Need any help? 👋' }
}, { timestamps: true });

export default mongoose.models.ChatbotConfig || mongoose.model('ChatbotConfig', ChatbotConfigSchema);
