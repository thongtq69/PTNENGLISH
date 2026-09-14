import dbConnect from './mongodb';

/** CMS content is optional: public pages can render their bundled defaults. */
export async function loadCmsData<T>(label: string, query: () => Promise<T>): Promise<T | null> {
    try {
        await dbConnect();
        const data = await query();
        // Convert MongoDB values before passing them to Client Components.
        return data == null ? null : JSON.parse(JSON.stringify(data));
    } catch (error) {
        // Do not include connection strings or credentials in runtime logs.
        console.error(`[CMS] ${label}: using default content`, {
            name: error instanceof Error ? error.name : 'UnknownError',
            code: error && typeof error === 'object' && 'code' in error ? error.code : undefined,
        });
        return null;
    }
}
