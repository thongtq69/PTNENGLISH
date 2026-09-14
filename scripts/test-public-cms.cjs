// Run after npm run build. Requires the local MongoDB started by run-local.ps1.
// Uses an isolated disposable database; never connects to the production database.
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const mongoose = require('mongoose');

const database = `ptn_cms_audit_${Date.now()}`;
const localUri = `mongodb://127.0.0.1:27018/${database}`;
const port = 3101;
const origin = `http://127.0.0.1:${port}`;
const routes = ['/about-us', '/courses', '/student-corner'];
let server;
let output = '';

async function stop() {
    if (server && server.exitCode === null) {
        const exited = once(server, 'exit');
        server.kill();
        await exited;
    }
    server = undefined;
}

async function start(uri) {
    output = '';
    server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
        env: { ...process.env, NODE_ENV: 'production', MONGODB_URI: uri },
        stdio: ['ignore', 'pipe', 'pipe'],
    });
    server.stdout.on('data', chunk => { output += chunk; });
    server.stderr.on('data', chunk => { output += chunk; });
    for (let attempt = 0; attempt < 100; attempt++) {
        if (server.exitCode !== null) throw new Error(`Server exited: ${output}`);
        try { if ((await fetch(`${origin}/favicon.png`)).ok) return; } catch {}
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error('Production server did not become ready');
}

async function checkPage(route, language) {
    const response = await fetch(`${origin}${route}`, { headers: { cookie: `ptn_lang=${language}` } });
    const html = await response.text();
    assert.equal(response.status, 200, `${route} ${language}: HTTP status`);
    assert.ok(!html.includes('NEXT_HTTP_ERROR_FALLBACK'), `${route}: error boundary`);
    assert.ok(!/\\"digest\\":\\"\d+/.test(html), `${route}: streamed Server Component exception`);
    assert.ok(html.includes('<h1'), `${route}: rendered page heading`);
    assert.ok(html.includes(`lang="${language}"`), `${route}: language`);
    assert.ok(html.includes('rel="canonical"'), `${route}: metadata`);
    return html;
}

async function checkRoutes(label) {
    for (const language of ['vi', 'en']) {
        for (const route of routes) await checkPage(route, language);
    }
    console.log(`PASS ${label}: all 3 routes, vi/en, SSR and metadata`);
}

(async () => {
    await mongoose.connect(localUri);
    const pages = mongoose.connection.db.collection('pages');
    await start(localUri);
    await checkRoutes('missing CMS documents');

    await pages.insertMany([
        { slug: 'about-us', sections: [{ type: 'about-story', content: { subtitle: 'CMS_ABOUT_AUDIT' } }] },
        { slug: 'courses-content-vi', content: { hero: { title: 'CMS_COURSES_AUDIT' } } },
        { slug: 'student-corner', sections: [{ type: 'student-messages', content: { notes: [] } }] },
    ]);
    assert.ok((await checkPage('/about-us', 'vi')).includes('CMS_ABOUT_AUDIT'));
    assert.ok((await checkPage('/courses', 'vi')).includes('CMS_COURSES_AUDIT'));
    await checkRoutes('valid CMS data and missing optional SiteSettings');

    await pages.updateOne({ slug: 'about-us' }, { $set: { sections: [null, { type: 'about-teachers', content: { items: [null] } }, { type: 'about-differences', content: { items: null } }] } });
    await pages.updateOne({ slug: 'courses-content-vi' }, { $set: { content: { hero: { title: null }, specs: null, pathway: null } } });
    await pages.updateOne({ slug: 'student-corner' }, { $set: { sections: [null, { type: 'student-messages', content: { notes: [null] } }] } });
    await checkRoutes('null CMS sections, items and nested fields');

    await pages.updateOne({ slug: 'about-us' }, { $set: { sections: {} } });
    await pages.updateOne({ slug: 'courses-content-vi' }, { $set: { content: { hero: { title: {} }, specs: 'invalid' } } });
    await pages.updateOne({ slug: 'student-corner' }, { $set: { sections: {} } });
    await checkRoutes('malformed CMS container types');
    await stop();

    await start('mongodb://127.0.0.1:1/unavailable');
    await checkRoutes('database unavailable');
    const vi = await (await fetch(`${origin}/api/courses-page?lang=vi`)).json();
    const en = await (await fetch(`${origin}/api/courses-page?lang=en`)).json();
    assert.notDeepEqual(vi.hero, en.hero, 'English fallback must not return Vietnamese content');
    console.log('PASS Courses API preserves requested fallback language');
    await stop();

    await start('');
    await checkRoutes('missing MONGODB_URI configuration');
    await stop();
})().catch(error => {
    console.error(error);
    console.error(output.slice(-3000));
    process.exitCode = 1;
}).finally(async () => {
    await stop();
    if (mongoose.connection.name === database) await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
});
