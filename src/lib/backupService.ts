import fs from 'fs';
import path from 'path';

export const saveBackup = async (slug: string, data: any) => {
    try {
        const backupDir = path.join(process.cwd(), 'data', 'backups');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        const fileName = `${slug}_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
        const filePath = path.join(backupDir, fileName);

        // Keep only latest file as main mirror, plus timestamped backup
        const mirrorPath = path.join(process.cwd(), 'data', `${slug}.json`);

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        fs.writeFileSync(mirrorPath, JSON.stringify(data, null, 2));

        // Cleanup old backups (keep last 5)
        const files = fs.readdirSync(backupDir)
            .filter(f => f.startsWith(slug))
            .map(f => ({ name: f, time: fs.statSync(path.join(backupDir, f)).mtime.getTime() }))
            .sort((a, b) => b.time - a.time);

        if (files.length > 5) {
            files.slice(5).forEach(f => fs.unlinkSync(path.join(backupDir, f.name)));
        }

        return true;
    } catch (e) {
        console.error("Backup failed for", slug, e);
        return false;
    }
};
