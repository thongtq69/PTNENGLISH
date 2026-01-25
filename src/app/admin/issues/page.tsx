export const dynamic = "force-dynamic";
import IssueManager from '@/components/admin/IssueManager';

export default function AdminIssuesPage() {
    return (
        <div className="h-full">
            <div className="mb-10">
                <h1 className="text-3xl font-heading font-black text-white tracking-tight">Communication Hub</h1>
                <p className="text-slate-400 mt-2">Manage student inquiries, lead messages, and follow-ups.</p>
            </div>
            <IssueManager />
        </div>
    );
}
