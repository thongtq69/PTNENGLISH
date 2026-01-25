import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import fs from 'fs';
import path from 'path';
import cloudinary from '@/lib/cloudinary';

// Models
import Course from '@/models/Course';
import Post from '@/models/Post';
import Achievement from '@/models/Achievement';
import MockTest from '@/models/MockTest';
import Page from '@/models/Page';
import SiteSettings from '@/models/SiteSettings';
import Testimonial from '@/models/Testimonial';

async function uploadToCloudinary(url: string, folder: string) {
    if (!url) return "";

    // If already a cloudinary URL, skip
    if (url.includes('cloudinary.com')) return url;

    try {
        let uploadPath = url;

        // If it's a local public path (starts with /)
        if (url.startsWith('/')) {
            uploadPath = path.join(process.cwd(), 'public', url);
        }

        const result = await cloudinary.uploader.upload(uploadPath, {
            folder: `ptn_english/${folder}`,
        });
        return result.secure_url;
    } catch (error) {
        console.error(`Failed to upload ${url}:`, error);
        return url; // Fallback to original URL
    }
}

export async function GET() {
    await dbConnect();

    const results: any = {};

    try {
        // 1. Courses
        const coursesPath = path.join(process.cwd(), 'data/courses.json');
        if (fs.existsSync(coursesPath)) {
            const courses = JSON.parse(fs.readFileSync(coursesPath, 'utf8'));
            for (let course of courses) {
                if (course.image) {
                    course.image = await uploadToCloudinary(course.image, 'courses');
                }
                await Course.findOneAndUpdate({ name: course.name }, course, { upsert: true });
            }
            results.courses = "Migrated";
        }

        // 2. Posts
        const postsPath = path.join(process.cwd(), 'data/posts.json');
        if (fs.existsSync(postsPath)) {
            const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
            for (let post of posts) {
                if (post.image) {
                    post.image = await uploadToCloudinary(post.image, 'posts');
                }
                // Assuming models/Post.ts will be created or use Page for now
                await Post.findOneAndUpdate({ title: post.title }, post, { upsert: true });
            }
            results.posts = "Migrated";
        }

        // 3. Achievements
        const achPath = path.join(process.cwd(), 'data/achievements.json');
        if (fs.existsSync(achPath)) {
            const achievements = JSON.parse(fs.readFileSync(achPath, 'utf8'));
            for (let ach of achievements) {
                if (ach.url) {
                    ach.url = await uploadToCloudinary(ach.url, 'achievements');
                }
                await Achievement.findOneAndUpdate({ student: ach.student, score: ach.score }, ach, { upsert: true });
            }
            results.achievements = "Migrated";
        }

        // 4. Mock Tests (Handle PDFs and Audios if needed - though Cloudinary is better for images)
        // Cloudinary also supports PDF and raw files.
        const testsPath = path.join(process.cwd(), 'data/mock-tests.json');
        if (fs.existsSync(testsPath)) {
            const tests = JSON.parse(fs.readFileSync(testsPath, 'utf8'));
            for (let test of tests) {
                // Upload PDFs to Cloudinary
                if (test.listening.pdf) test.listening.pdf = await uploadToCloudinary(test.listening.pdf, 'tests/listening');
                if (test.reading.pdf) test.reading.pdf = await uploadToCloudinary(test.reading.pdf, 'tests/reading');
                if (test.writing.pdf) test.writing.pdf = await uploadToCloudinary(test.writing.pdf, 'tests/writing');

                // Upload Audio
                for (let audio of test.listening.audio) {
                    if (audio.url) audio.url = await uploadToCloudinary(audio.url, 'tests/audio');
                }

                await MockTest.findOneAndUpdate({ name: test.name }, test, { upsert: true });
            }
            results.mock_tests = "Migrated";
        }

        // 4.5 Testimonials
        const testPath = path.join(process.cwd(), 'data/testimonials.json');
        if (fs.existsSync(testPath)) {
            const testimonials = JSON.parse(fs.readFileSync(testPath, 'utf8'));
            for (let t of testimonials) {
                if (t.image) t.image = await uploadToCloudinary(t.image, 'testimonials');
                await Testimonial.findOneAndUpdate({ name: t.name }, {
                    name: t.name,
                    role: t.sub || "",
                    content: t.text || "",
                    image: t.image
                }, { upsert: true });
            }
            results.testimonials = "Migrated";
        }

        // 5. About Us (Migrate to Page model)
        const aboutPath = path.join(process.cwd(), 'data/about-us.json');
        if (fs.existsSync(aboutPath)) {
            const about = JSON.parse(fs.readFileSync(aboutPath, 'utf8'));
            // Migrate teacher images
            if (about.teachers) {
                for (let t of about.teachers) {
                    if (t.image) t.image = await uploadToCloudinary(t.image, 'teachers');
                }
            }

            const sections = [
                { id: 'about-hero', type: 'about-hero', content: about.hero, order: 1, isVisible: true },
                { id: 'about-story', type: 'about-story', content: about.story, order: 2, isVisible: true },
                { id: 'about-teachers', type: 'about-teachers', content: { title: "Experts", subtitle: "Đội ngũ Giảng viên MA.TESOL hàng đầu", items: about.teachers }, order: 3, isVisible: true },
                { id: 'about-philosophy', type: 'about-philosophy', content: { title: "Triết lý Giáo dục", items: about.philosophy }, order: 4, isVisible: true },
                { id: 'about-values', type: 'about-values', content: { title: "Giá trị Cốt lõi", items: about.values }, order: 5, isVisible: true },
                { id: 'about-differences', type: 'about-differences', content: { title: "The PTN Difference", items: about.differences }, order: 6, isVisible: true }
            ];

            await Page.findOneAndUpdate(
                { slug: 'about-us' },
                { title: 'About Us', slug: 'about-us', sections },
                { upsert: true }
            );
            results.about_us = "Migrated to Page model";
        }

        // 6. Home Page (Migrate static sections)
        const siteSettingsPath = path.join(process.cwd(), 'data/site-settings.json');
        const programsPath = path.join(process.cwd(), 'data/programs.json');
        const partnersPath = path.join(process.cwd(), 'data/partners.json');

        if (fs.existsSync(siteSettingsPath)) {
            const settings = JSON.parse(fs.readFileSync(siteSettingsPath, 'utf8'));

            const programs = fs.existsSync(programsPath) ? JSON.parse(fs.readFileSync(programsPath, 'utf8')) : [];
            for (let p of programs) {
                if (p.image) p.image = await uploadToCloudinary(p.image, 'home/programs');
            }

            const partners = fs.existsSync(partnersPath) ? JSON.parse(fs.readFileSync(partnersPath, 'utf8')) : [];
            for (let p of partners) {
                if (p.logo) p.logo = await uploadToCloudinary(p.logo, 'home/partners');
            }

            const homeSections = [
                { id: 'home-hero', type: 'hero', content: settings.hero, order: 1, isVisible: true },
                { id: 'home-philosophy', type: 'philosophy', content: { text: "Xuất phát từ niềm tin của các nhà sáng lập vào giáo dục có chiều sâu..." }, order: 2, isVisible: true },
                { id: 'home-programs', type: 'programs', content: { title: "Hệ Thống Đào Tạo Academic Master", items: programs }, order: 3, isVisible: true },
                { id: 'home-hall-of-fame', type: 'hall-of-fame', content: {}, order: 4, isVisible: true },
                { id: 'home-study-mock', type: 'study-mock', content: { title: "Hệ Thống Học Thuật & Thi Thử" }, order: 5, isVisible: true },
                { id: 'home-faculty', type: 'faculty-highlight', content: { title: "Expert Faculty" }, order: 6, isVisible: true },
                { id: 'home-testimonials', type: 'testimonials', content: {}, order: 7, isVisible: true },
                { id: 'home-news', type: 'news', content: { title: "Tin tức & Học thuật" }, order: 8, isVisible: true },
                { id: 'home-partners', type: 'partners', content: { title: "Đối tác chiến lược & Khảo thí", items: partners }, order: 9, isVisible: true }
            ];

            await Page.findOneAndUpdate(
                { slug: 'home' },
                { title: 'Home Page', slug: 'home', sections: homeSections },
                { upsert: true }
            );

            const globalSettingsPath = path.join(process.cwd(), 'data/global-settings.json');
            const globalSettings = fs.existsSync(globalSettingsPath) ? JSON.parse(fs.readFileSync(globalSettingsPath, 'utf8')) : {};

            const fullSettings = { ...settings, ...globalSettings };

            await SiteSettings.findOneAndUpdate({}, fullSettings, { upsert: true });
            results.home = "Migrated to Page & SiteSettings (Full) models";
        }

        return NextResponse.json({ success: true, results });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
