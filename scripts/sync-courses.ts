import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// Define Page Model (Simplified)
const PageSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true },
    title: String,
    content: mongoose.Schema.Types.Mixed,
    lastModified: Date
});

const Page = mongoose.models.Page || mongoose.model('Page', PageSchema);

// The hardcoded data from CoursesContent.tsx
const HARDCODED_LEVELS: Record<string, any[]> = {
    ie: [
        { id: 'foundation', name: "Foundation", cefr: "A1 / Pre-A1", exit: "Ready for IELTS" },
        { id: 'starter', name: "IELTS Starter", cefr: "A2", exit: "IELTS 4.0" },
        { id: 'standard', name: "IELTS Standard", cefr: "B1", exit: "IELTS 5.0" },
        { id: 'booster', name: "IELTS Booster", cefr: "B2", exit: "IELTS 6.0" },
        { id: 'master', name: "IELTS Master", cefr: "C1", exit: "IELTS 7.0+" },
        { id: 'elite', name: "IELTS Elite", cefr: "C2", exit: "IELTS 8.0+" }
    ],
    eft: [
        { id: 'foundation', name: "EfT Foundation", cefr: "A1", exit: "Ready for Teens" },
        { id: 'starter', name: "EfT Starter", cefr: "A2", exit: "Starter Pro" },
        { id: 'standard', name: "EfT Standard", cefr: "B1", exit: "Academic Ready" },
        { id: 'booster', name: "EfT Booster", cefr: "B2", exit: "IELTS Path" },
        { id: 'master', name: "EfT Master", cefr: "C1", exit: "Fluent Scholar" },
        { id: 'elite', name: "EfT Elite", cefr: "C2", exit: "Elite Academic" }
    ],
    ge: [
        { id: 'foundation', name: "GE Foundation", cefr: "A1", exit: "Everyday Basic" },
        { id: 'starter', name: "Everyday English", cefr: "A2", exit: "Social Basic" },
        { id: 'standard', name: "Confident Communicator", cefr: "B1", exit: "Effective Speaker" },
        { id: 'booster', name: "Fluent Transitions", cefr: "B2", exit: "Fluent Speaker" },
        { id: 'master', name: "English for Real Life", cefr: "C1", exit: "Proficient User" },
        { id: 'elite', name: "Proficient English Skills", cefr: "C2", exit: "Native-like Skills" }
    ]
};

async function sync() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined');
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const lang of ['vi', 'en']) {
            const slug = `courses-content-${lang}`;
            const page = await Page.findOne({ slug });

            if (!page) {
                console.log(`Page ${slug} not found, skipping sync.`);
                continue;
            }

            const content = page.content || {};
            if (!content.levels) content.levels = {};

            let updated = false;

            for (const [pathway, levels] of Object.entries(HARDCODED_LEVELS)) {
                if (!content.levels[pathway]) content.levels[pathway] = {};

                for (const level of levels) {
                    if (!content.levels[pathway][level.id]) {
                        content.levels[pathway][level.id] = {
                            target: '',
                            benefits: [],
                            fullDesc: ''
                        };
                    }

                    // Always set these if they don't exist in DB to ensure management is available
                    if (!content.levels[pathway][level.id].name) {
                        content.levels[pathway][level.id].name = level.name;
                        updated = true;
                    }
                    if (!content.levels[pathway][level.id].cefr) {
                        content.levels[pathway][level.id].cefr = level.cefr;
                        updated = true;
                    }
                    if (!content.levels[pathway][level.id].exit) {
                        content.levels[pathway][level.id].exit = level.exit;
                        updated = true;
                    }
                }
            }

            if (updated) {
                await Page.updateOne({ slug }, { $set: { content } });
                console.log(`Updated ${slug} with name, cefr, and exit fields.`);
            } else {
                console.log(`${slug} already has the fields or no updates needed.`);
            }
        }

        console.log('Sync complete');
        process.exit(0);
    } catch (err) {
        console.error('Error syncing:', err);
        process.exit(1);
    }
}

sync();

export { };
