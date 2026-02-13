/**
 * Import Mindset Test 2 Listening into MongoDB
 * 
 * Usage: node scripts/import_mindset_test2_listening.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = 'mongodb+srv://quocthong1290_db_user:TZzVNqXP9gALfcIq@cluster0.bbs1yqz.mongodb.net/ptn_english?appName=Cluster0';

async function main() {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const data = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../data/sample_tests/mindset_test2_listening.json'), 'utf-8')
    );

    const db = mongoose.connection.db;
    const collection = db.collection('mocktests');

    // Check if Test 2 already exists
    const existing = await collection.findOne({ name: data.name });

    if (existing) {
        // Update listening section
        console.log(`📝 Test "${data.name}" exists — updating listening section...`);
        await collection.updateOne(
            { name: data.name },
            {
                $set: {
                    'listening.pdf': data.listening.pdf,
                    'listening.totalQuestions': data.listening.totalQuestions,
                    'listening.sections': data.listening.sections,
                }
            }
        );
        console.log('✅ Listening section updated successfully!');
    } else {
        // Insert new test with listening section
        console.log(`🆕 Creating new test "${data.name}"...`);
        await collection.insertOne({
            name: data.name,
            category: data.category,
            listening: data.listening,
            reading: { pdf: '', sections: [], totalQuestions: 40 },
            writing: { pdf: '', content: '', tasksCount: 2 },
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        console.log('✅ New test created with listening section!');
    }

    // Verify
    const test = await collection.findOne({ name: data.name });
    console.log('\n📊 Verification:');
    console.log(`  Name: ${test.name}`);
    console.log(`  Listening sections: ${test.listening.sections.length}`);
    test.listening.sections.forEach((sec, idx) => {
        const answerKeys = Object.keys(sec.answers || {});
        console.log(`    Section ${idx + 1}: "${sec.title}" — ${answerKeys.length} answers [${answerKeys.join(', ')}]`);
        console.log(`      Audio: ${sec.audioUrl}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Done!');
}

main().catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
