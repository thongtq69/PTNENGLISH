
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || "";

async function checkData() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to DB");

        const Post = mongoose.models.Post || mongoose.model('Post', new mongoose.Schema({}, { strict: false }), 'posts');
        const Page = mongoose.models.Page || mongoose.model('Page', new mongoose.Schema({}, { strict: false }), 'pages');

        const postsCount = await Post.countDocuments();
        console.log("Posts count:", postsCount);

        const blogPage = await Page.findOne({ slug: 'blog' });
        if (blogPage) {
            console.log("Blog page data size (approx bytes):", JSON.stringify(blogPage).length);
        } else {
            console.log("Blog page not found in DB");
        }

        process.exit(0);
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

checkData();
