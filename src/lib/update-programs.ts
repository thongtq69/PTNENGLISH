// Script to update existing programs with English names
// Run this once to add nameEn field to existing programs

const programTranslations: Record<string, string> = {
    "TIẾNG ANH TRUNG HỌC CƠ SỞ": "Academic English for Teens",
    "TIẾNG ANH TỔNG QUÁT": "General English",
    "PTE ACADEMIC": "PTE Academic",
    "LUYỆN THI IELTS": "IELTS Preparation",
    "SỰ KIỆN HỌC THUẬT": "Academic Events",
    "Academic English for Teens": "Academic English for Teens",
    "General English": "General English",
    "PTE Academic": "PTE Academic",
    "IELTS Preparation": "IELTS Preparation",
    "Academic Events": "Academic Events"
};

export async function updateProgramsWithEnglishNames() {
    try {
        const response = await fetch('/api/site-settings');
        const settings = await response.json();

        if (!settings.programs || settings.programs.length === 0) {
            console.log('No programs found');
            return;
        }

        const updatedPrograms = settings.programs.map((prog: any) => {
            const englishName = programTranslations[prog.name] || prog.name;
            return {
                ...prog,
                nameEn: englishName
            };
        });

        const saveResponse = await fetch('/api/site-settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...settings,
                programs: updatedPrograms
            })
        });

        if (saveResponse.ok) {
            console.log('Successfully updated programs with English names');
            return updatedPrograms;
        } else {
            throw new Error('Failed to save updated programs');
        }
    } catch (error) {
        console.error('Error updating programs:', error);
        throw error;
    }
}

// For use in browser console or component
if (typeof window !== 'undefined') {
    (window as any).updateProgramsWithEnglishNames = updateProgramsWithEnglishNames;
}
