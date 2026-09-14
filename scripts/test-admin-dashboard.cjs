// Run after npm run build. Read-only checks; no production credentials needed.
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { once } = require('node:events');

(async () => {
    for (const [label, uri, unavailable] of [
        ['healthy local database', 'mongodb://127.0.0.1:27018/ptnenglish', false],
        ['unavailable database', 'mongodb://127.0.0.1:1/unavailable', true],
        ['missing configuration', '', true],
    ]) {
        let output = '';
        const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3101'], {
            env: { ...process.env, NODE_ENV: 'production', MONGODB_URI: uri },
            stdio: ['ignore', 'pipe', 'pipe'],
        });
        server.stdout.on('data', chunk => { output += chunk; });
        server.stderr.on('data', chunk => { output += chunk; });
        try {
            for (let attempt = 0; attempt < 100 && !output.includes('Ready'); attempt++) {
                assert.equal(server.exitCode, null, 'Server must stay running');
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            assert.ok(output.includes('Ready'), 'Production server must start');
            const response = await fetch('http://127.0.0.1:3101/admin');
            const html = await response.text();
            assert.equal(response.status, 200);
            assert.ok(!/\\"digest\\":\\"\d+/.test(html), 'No streamed server exception');
            assert.equal(html.includes('Không tải được số liệu'), unavailable);
            assert.equal(html.includes('Unavailable'), unavailable);
            console.log(`PASS admin: ${label}`);
        } finally {
            if (server.exitCode === null) {
                const exited = once(server, 'exit');
                server.kill();
                await exited;
            }
        }
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
