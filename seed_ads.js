const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const AdItemSchema = new mongoose.Schema({
    icon: { type: String, default: 'Clock' },
    text: String,
    link: { type: String, default: '#' }
});

const AdvertisementSchema = new mongoose.Schema({
    name: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    leftImage: String,
    leftLabel: { type: String, default: 'ADMISSION 2025' },
    leftHeading: String,
    leftSubheading: String,
    rightTitle: { type: String, default: 'LỊCH KHAI GIẢNG' },
    rightSubtitle: String,
    rightSlogan: String,
    items: [AdItemSchema],
    showOnce: { type: Boolean, default: true },
});

const Advertisement = mongoose.models.Advertisement || mongoose.model('Advertisement', AdvertisementSchema);

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding ads...");

    await Advertisement.deleteMany({});

    await Advertisement.create({
        name: 'Chiêu Sinh Tháng 11 & 12',
        isActive: true,
        leftImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop',
        leftLabel: 'ADMISSION 2025',
        leftHeading: 'CHIÊU SINH THÁNG 11 & 12',
        leftSubheading: 'Đồng hành cùng đội ngũ chuyên gia MA.TESOL hàng đầu Việt Nam.',
        rightTitle: 'LỊCH KHAI GIẢNG',
        rightSubtitle: 'Hệ thống đào tạo học thuật chuyên sâu.',
        rightSlogan: '"Quality over speed, mastery over tricks."',
        items: [
            { icon: 'Calendar', text: 'LUYỆN THI IELTS', link: '/courses' },
            { icon: 'MessageSquare', text: 'ENGLISH FOR TEENS', link: '/courses' },
            { icon: 'Clock', text: 'GENERAL ENGLISH', link: '/courses' },
            { icon: 'BookOpen', text: 'KHAI GIẢNG MỚI', link: '/courses' }
        ],
        showOnce: false // Set to false so user can see it immediately on refresh
    });

    console.log("Seeded initial ad successful!");
    process.exit(0);
}

seed();
