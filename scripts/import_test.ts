import MockTest from '../src/models/MockTest';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
import dbConnect from '../src/lib/mongodb';

async function importTests() {
    await dbConnect();

    const reading1 = fs.readFileSync(path.join(process.cwd(), 'data/academic_tests/test_scan/reading/academic_test1_reading.txt'), 'utf-8');

    // Simple replacement of question numbers with tags for the first test
    // This is just a demonstration
    let interactiveReading = reading1
        .replace(/1 /g, '[Q1] ')
        .replace(/2 /g, '[Q2] ')
        .replace(/3 /g, '[Q3] ')
        .replace(/4 /g, '[Q4] ')
        .replace(/5 /g, '[Q5] ')
        .replace(/6 \.+/g, '[Q6] ')
        .replace(/7 \.+/g, '[Q7] ')
        .replace(/8 \.+/g, '[Q8] ')
        .replace(/9 \.+/g, '[Q9] ')
        .replace(/10 /g, '[Q10] ')
        .replace(/11 /g, '[Q11] ')
        .replace(/12 /g, '[Q12] ')
        .replace(/13 /g, '[Q13] ');

    const sampleTest = {
        name: "IELTS Academic Test 1",
        listening: {
            pdf: "",
            audio: [{ section: 1, url: "https://res.cloudinary.com/demo/video/upload/v1612345678/sample_audio.mp3" }],
            content: "Section 1\nListen and answer questions [Q1] to [Q10]..."
        },
        reading: {
            pdf: "",
            content: interactiveReading
        },
        writing: {
            pdf: "",
            content: "Writing Task 1\n[Q1]\n\nWriting Task 2\n[Q2]"
        }
    };

    await MockTest.deleteMany({});
    await MockTest.create(sampleTest);
    console.log("Sample test imported successfully!");
    process.exit(0);
}

importTests();
