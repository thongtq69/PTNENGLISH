export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MockTest from '@/models/MockTest';
import listeningSample from '../../../../data/sample_tests/mindset_test2_listening.json';
import readingSample from '../../../../data/sample_tests/mindset_test1_reading.json';

type AnswerSection = {
    answers?: Record<string, string | undefined>;
};

type AnswerFallback = {
    listening?: AnswerSection[];
    reading?: AnswerSection[];
};

type AnswerSkill = {
    sections?: AnswerSection[];
    [key: string]: unknown;
};

type MockTestWithAnswers = {
    name?: string;
    listening?: AnswerSkill;
    reading?: AnswerSkill;
    [key: string]: unknown;
};

const fallbackAnswerKeys: Record<string, AnswerFallback> = {
    'Academic Mock Test 1': {
        listening: listeningSample.listening.sections,
        reading: readingSample.reading.sections
    },
    'Mindset for IELTS Practice Tests: Test 2': {
        listening: listeningSample.listening.sections
    }
};

const withFallbackAnswers = (test: MockTestWithAnswers) => {
    const fallback = test.name ? fallbackAnswerKeys[test.name] : undefined;
    if (!fallback) return test;

    const skills = ['listening', 'reading'] as const;
    skills.forEach((skill) => {
        const fallbackSections = fallback[skill];
        const skillData = test[skill];
        if (!fallbackSections || !Array.isArray(skillData?.sections)) return;

        skillData.sections = skillData.sections.map((section: AnswerSection, idx: number) => {
            if (Object.keys(section.answers || {}).length > 0) return section;
            const answers = fallbackSections[idx]?.answers;
            return answers ? { ...section, answers } : section;
        });
    });

    return test;
};

export async function GET() {
    await dbConnect();
    const tests = await MockTest.find({}).sort({ createdAt: 1 });
    return NextResponse.json(tests.map(test => withFallbackAnswers(test.toObject({ flattenMaps: true }) as MockTestWithAnswers)));
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const tests = await request.json();

        await MockTest.deleteMany({});
        await MockTest.insertMany(tests);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
