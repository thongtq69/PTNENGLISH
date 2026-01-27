export const convertScannedText = (text: string, startRange: number, endRange: number): string => {
    if (!text) return "";

    // 1. Remove obvious junk: recurrences of "Test X", "Listening", "Reading", isolated page numbers
    let lines = text.split('\n');
    lines = lines.filter(line => {
        const trimmed = line.trim();
        // Remove page numbers (isolated numbers usually < 100 and not followed by dots)
        if (/^\d{1,2}$/.test(trimmed)) return false;
        // Remove "Test X" or "Listening/Reading" headers
        if (/^Test \d+$/i.test(trimmed)) return false;
        if (/^(Listening|Reading|SECTION \d+|READING PASSAGE \d+)$/i.test(trimmed)) return false;
        return true;
    });

    let cleaned = lines.join('\n');

    // 2. Convert "1 ..........." or "10 *******" to [Q1] or [Q10]
    // Matches number + 2 or more dots/stars
    cleaned = cleaned.replace(/(\d+)\s*[\.\*]{2,}\s*/g, (match, num) => {
        const n = parseInt(num);
        if (n >= startRange && n <= endRange) {
            return `[Q${num}] `;
        }
        return match;
    });

    // 3. Handle cases where question numbers are alone on a line followed by content on next line
    // e.g. "23\nGeographical Location" -> "[Q23] Geographical Location"
    // We only do this if the number is in the specific range for the section
    const linesArr = cleaned.split('\n');
    for (let i = 0; i < linesArr.length - 1; i++) {
        const current = linesArr[i].trim();
        const next = linesArr[i + 1].trim();
        if (/^\d+$/.test(current)) {
            const num = parseInt(current);
            if (num >= startRange && num <= endRange) {
                linesArr[i] = `[Q${current}] ${next}`;
                linesArr[i + 1] = ""; // Mark for deletion
            }
        }
    }
    cleaned = linesArr.filter(l => l !== "").join('\n');

    // 4. Clean up multiple dots without numbers (e.g. trailing lines)
    cleaned = cleaned.replace(/\s*\.\.+\s*/g, ' ... ');

    // 5. Wrap lines that look like headings in <strong> or similar? 
    // For now, just clean whitespace
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

    return cleaned;
};
