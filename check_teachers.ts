import dbConnect from './src/lib/mongodb';
import Page from './src/models/Page';

async function run() {
    await dbConnect();
    const page = await Page.findOne({ slug: 'about-us' });
    if (page) {
        const teachers = page.sections.find((s: any) => s.type === 'about-teachers')?.content.items;
        console.log(JSON.stringify(teachers, null, 2));
    }
    process.exit(0);
}
run();
