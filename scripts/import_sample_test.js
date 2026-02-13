/**
 * Script to import sample test JSON into MongoDB
 * Usage: node scripts/import_sample_test.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB URI from .env.local
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
}

// Define schema matching the MockTest model
const TestSectionSchema = new mongoose.Schema({
    title: String,
    passage: String,
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

const MockTest = mongoose.model('MockTest', MockTestSchema);

async function main() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Read sample test JSON
        const jsonPath = path.join(__dirname, '..', 'data', 'sample_tests', 'mindset_test1_reading.json');
        const testData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

        // Check if test already exists
        const existing = await MockTest.findOne({ name: testData.name });
        
        if (existing) {
            console.log(`📝 Test "${testData.name}" already exists. Updating reading sections...`);
            existing.reading = {
                pdf: '',
                sections: testData.reading.sections,
                totalQuestions: 40
            };
            await existing.save();
            console.log(`✅ Updated test: ${testData.name}`);
        } else {
            // Check current tests
            const currentTests = await MockTest.find({});
            console.log(`📊 Current tests in DB: ${currentTests.length}`);
            currentTests.forEach(t => console.log(`   - ${t.name} (${t.category})`));

            // Create new test
            const newTest = new MockTest({
                name: testData.name,
                category: testData.category || 'ielts-academic',
                listening: {
                    pdf: '',
                    sections: [],
                    totalQuestions: 40
                },
                reading: {
                    pdf: '',
                    sections: testData.reading.sections,
                    totalQuestions: 40
                },
                writing: {
                    pdf: '',
                    content: '',
                    tasksCount: 2
                }
            });

            await newTest.save();
            console.log(`✅ Created new test: ${testData.name}`);
        }

        // Verify
        const allTests = await MockTest.find({});
        console.log(`\n📊 All tests in DB after import: ${allTests.length}`);
        allTests.forEach(t => {
            const readingSections = t.reading?.sections?.length || 0;
            const listeninSections = t.listening?.sections?.length || 0;
            console.log(`   - ${t.name} | Reading: ${readingSections} sections | Listening: ${listeninSections} sections`);
        });

        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
        console.log('🎉 Done! Refresh your browser at localhost:3000/test to see the updated test.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        await mongoose.disconnect();
        process.exit(1);
    }
}

main();
