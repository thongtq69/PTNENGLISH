// Run against an isolated local test server, never against production:
// PTN_TEST_ORIGIN=http://127.0.0.1:3100 node scripts/test-home-content.cjs
const assert = require('node:assert/strict');
const origin = process.env.PTN_TEST_ORIGIN || 'http://127.0.0.1:3100';
const target = new URL(origin);
assert.ok(['127.0.0.1', 'localhost'].includes(target.hostname), 'Use an isolated local test server');

async function read(route) {
    const response = await fetch(`${origin}${route}`);
    assert.equal(response.status, 200, route);
    return response.json();
}

async function save(route, body) {
    return fetch(`${origin}${route}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
}

(async () => {
    const original = await read('/api/site-settings');
    for (const source of ['blog', 'events']) {
        const updated = {
            ...original, homeNewsSource: source,
            homeEvents: { badge: 'PTN', title: 'Sự kiện & Hoạt động', viewAll: 'Xem sự kiện' },
        };
        assert.equal((await save('/api/site-settings', updated)).status, 200);
        const stored = await read('/api/site-settings');
        assert.equal(stored.homeNewsSource, source, 'Source persists');
        assert.deepEqual(stored.homeBlog, original.homeBlog, 'Blog labels preserved');
        assert.deepEqual(stored.hero, original.hero, 'Other homepage content preserved');
        assert.deepEqual(stored.homeEvents, updated.homeEvents, 'Event labels persist');
    }
    assert.equal((await save('/api/site-settings', { homeNewsSource: 'invalid' })).status, 400);
    assert.equal((await read('/api/site-settings')).homeNewsSource, 'events');
    console.log('PASS Blog/Event selection persists, labels remain independent, invalid selection rejected');

    for (const collection of ['events', 'posts']) {
        const items = await read(`/api/${collection}`);
        assert.ok(items.length, 'Seed local fixtures first');
        const originalContent = items[0].content;
        const content = '<p>BEFORE_IMAGE</p><img src="/news/workshop.png" alt="PTN image"><p>AFTER_IMAGE</p>';
        const updated = items.map((item, i) => i === 0 ? { ...item, content } : item);
        assert.equal((await save(`/api/${collection}`, updated)).status, 200);
        const stored = await read(`/api/${collection}`);
        const article = stored.find(item => item.slug === items[0].slug);
        assert.equal(article.content, content, 'Inline image survives save and reload');
        const route = collection === 'events' ? 'events' : 'blog';
        const response = await fetch(`${origin}/${route}/${article.slug}`);
        assert.equal(response.status, 200);
        const html = await response.text();
        assert.ok(html.includes('BEFORE_IMAGE') && html.includes('AFTER_IMAGE'));
        assert.ok(html.includes('alt="PTN image"'), 'Inline image rendered on public page');
        assert.ok(html.includes('article-content'), 'Responsive article image styles enabled');
        await save(`/api/${collection}`, stored.map(item => item.slug === article.slug ? { ...item, content: originalContent } : item));
        console.log(`PASS ${route}: image between paragraphs persists and renders publicly`);
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
