import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';

// Mapping of Vietnamese program names to English (case-insensitive matching)
const programTranslations: Record<string, string> = {
    "tiếng anh trung học cơ sở": "Academic English for Teens",
    "tiếng anh tổng quát": "General English",
    "pte academic": "PTE Academic",
    "luyện thi ielts": "IELTS Preparation",
    "sự kiện học thuật": "Academic Events",
    "academic english for teens": "Academic English for Teens",
    "general english": "General English",
    "ielts preparation": "IELTS Preparation",
    "academic events": "Academic Events"
};

export async function POST() {
    try {
        await dbConnect();

        const settings = await SiteSettings.findOne({});

        if (!settings || !settings.programs || settings.programs.length === 0) {
            return NextResponse.json(
                { error: 'No programs found to update' },
                { status: 404 }
            );
        }

        // Update each program with English name (case-insensitive matching)
        const updatedPrograms = settings.programs.map((prog: any) => {
            const normalizedName = prog.name.toLowerCase().normalize('NFC');
            const englishName = programTranslations[normalizedName] || prog.name;
            return {
                ...prog.toObject(),
                nameEn: englishName
            };
        });

        // Save updated programs
        settings.programs = updatedPrograms;
        await settings.save();

        return NextResponse.json({
            success: true,
            message: `Updated ${updatedPrograms.length} programs with English names`,
            programs: updatedPrograms
        });
    } catch (error: any) {
        console.error('Error updating programs:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update programs' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Use POST to update programs with English names',
        availableTranslations: programTranslations
    });
}
