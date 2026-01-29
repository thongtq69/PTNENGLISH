const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Mock Test Model
const TestSectionSchema = new mongoose.Schema({
    title: String,
    content: String,
    answers: { type: Map, of: String },
    questionsCount: Number,
    audioUrl: String
});

const MockTestSchema = new mongoose.Schema({
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
        content: String,
        tasksCount: { type: Number, default: 2 }
    }
}, { timestamps: true });

const MockTest = mongoose.models.MockTest || mongoose.model('MockTest', MockTestSchema);

// Advanced Cleanup & Conversion
const convertScannedText = (text, startRange, endRange) => {
    if (!text) return "";

    // 1. Initial cleanup of headers and footers
    let lines = text.split('\n');
    lines = lines.filter(line => {
        const trimmed = line.trim();
        // Skip common junk
        if (/^(Test \d+|LISTENING|READING|SECTION \d+|READING PASSAGE \d+|Reading|Listening)$/i.test(trimmed)) return false;
        // Skip line numbers that look like page numbers (isolated digits 10-99 without dots)
        if (/^\d{1,2}$/.test(trimmed)) {
            const num = parseInt(trimmed);
            // Only keep if it's within the specific question range for this section
            if (num < startRange || num > endRange) return false;
        }
        return true;
    });

    let cleaned = lines.join('\n');

    // 2. Multi-stage Question Marker Detection

    // Stage A: Number + Dot/Star (Gap Fill)
    // "1 ......................." -> "[Q1]"
    cleaned = cleaned.replace(/(\d+)\s*[\.\*]{2,}\s*/g, (match, num) => {
        const n = parseInt(num);
        if (n >= startRange && n <= endRange) return `[Q${num}] `;
        return match;
    });

    // Stage B: Isolated numbers at start of line (MCQ/Matching)
    // "11 PS Camping..." -> "[Q11] PS Camping..."
    const linesArr = cleaned.split('\n');
    for (let i = 0; i < linesArr.length; i++) {
        const line = linesArr[i].trim();
        // Match numbers 1-40 at the start of a line
        const match = line.match(/^(\d{1,2})(\s+.*|$)/);
        if (match) {
            const num = parseInt(match[1]);
            const rest = match[2];
            if (num >= startRange && num <= endRange) {
                // Check if it's already tagged or is a part of a list
                if (!line.includes(`[Q${num}]`)) {
                    linesArr[i] = `[Q${num}]${rest}`;
                }
            }
        }

        // Stage C: Roman numerals for Headings (i, ii, iii, iv...)
        // Only if we are in the matching headings range
        if (startRange >= 14 && endRange <= 20) { // Specific to Test 1 Reading Passage 2
            const romanMatch = line.match(/^(i|ii|iii|iv|v|vi|vii|viii|ix|x|xi)(\s+.*|$)/i);
            if (romanMatch) {
                // We don't tag Roman numerals as Qs, but we keep them clean
            }
        }
    }

    cleaned = linesArr.filter(l => l.trim() !== "").join('\n');

    // 3. Structural Cleanup
    cleaned = cleaned.replace(/\s*\.\.+\s*/g, ' ... '); // Normalize multi-dots
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n'); // Limit blank lines

    // 4. Wrap with some basic HTML for better rendering
    // Convert lines starting with [Qx] into a nice block
    cleaned = cleaned.split('\n').map(line => {
        if (line.trim().startsWith('[Q')) {
            return `<div class="question-row my-4">${line}</div>`;
        }
        return line;
    }).join('\n');

    return cleaned;
};

async function migrate() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🚀 Starting Academic Migration v2...");

    await MockTest.deleteMany({});

    for (let i = 1; i <= 1; i++) { // Starting with Test 1 as requested
        const testFolder = `test_0${i}`;
        const testId = `test_0${i}`;
        const testName = `Academic Mock Test ${i}`;

        console.log(`\n📦 Processing ${testName} from ${testFolder}...`);

        // 1. Reading Sections
        const readingFile = path.join(process.cwd(), `data/academic_tests/${testFolder}/reading`, `academic_test${i}_reading.txt`);
        let readingSections = [];
        if (fs.existsSync(readingFile)) {
            const raw = fs.readFileSync(readingFile, 'utf8');
            // Strict split: line must be exactly READING PASSAGE X
            const parts = raw.split(/^READING PASSAGE \d+$/im);
            console.log(`   - Found ${parts.length} potential Reading parts`);

            const contentParts = parts.slice(1, 4); // Only takes the first 3 passages

            contentParts.forEach((content, idx) => {
                const start = idx === 0 ? 1 : (idx === 1 ? 14 : 27);
                const end = idx === 0 ? 13 : (idx === 1 ? 26 : 40);

                readingSections.push({
                    title: `Reading Passage ${idx + 1}`,
                    content: convertScannedText(content, start, end),
                    questionsCount: idx === 2 ? 14 : 13,
                    answers: {}
                });
            });
        }

        // 2. Listening Sections
        const listeningFile = path.join(process.cwd(), `data/academic_tests/${testFolder}/listening`, `academic_test${i}_listening.txt`);
        let listeningSections = [];
        if (fs.existsSync(listeningFile)) {
            const raw = fs.readFileSync(listeningFile, 'utf8');
            // Improved split: look for SECTION X markers
            const parts = raw.split(/^SECTION \d+.*$/im);
            console.log(`   - Found ${parts.length} potential Listening parts`);

            // If file doesn't start with SECTION 1, parts[0] is Section 1
            const contentParts = parts[0].includes('Question') ? parts : parts.slice(1);

            contentParts.slice(0, 4).forEach((content, idx) => {
                const start = (idx * 10) + 1;
                const end = (idx + 1) * 10;

                const filename = `section0${idx + 1}.mp3`;
                const localPath = path.join(process.cwd(), `public/academic_tests/${testId}/listening/audio`, filename);
                const audioUrl = fs.existsSync(localPath)
                    ? `/academic_tests/${testId}/listening/audio/${filename}`
                    : null;

                listeningSections.push({
                    title: `Section ${idx + 1}`,
                    content: convertScannedText(content, start, end),
                    questionsCount: 10,
                    audioUrl: audioUrl,
                    answers: {}
                });
            });
        }

        const newTest = new MockTest({
            name: testName,
            category: 'IELTS Academic',
            listening: {
                pdf: `/academic_tests/${testId}/listening/listening.pdf`,
                sections: listeningSections,
                totalQuestions: 40
            },
            reading: {
                pdf: `/academic_tests/${testId}/reading/reading.pdf`,
                sections: readingSections,
                totalQuestions: 40
            },
            writing: {
                pdf: `/academic_tests/${testId}/writing/writing.pdf`,
                content: `<h3>Writing Task 1</h3><p>You should spend about 20 minutes on this task.</p><h3>Writing Task 2</h3><p>You should spend about 40 minutes on this task.</p>`,
                tasksCount: 2
            }
        });

        await newTest.save();
        console.log(`✅ Saved ${testName} with ${listeningSections.length} listening and ${readingSections.length} reading sections.`);
    }

    console.log("\n✨ Migration v2 Complete!");
    process.exit(0);
}

migrate();
