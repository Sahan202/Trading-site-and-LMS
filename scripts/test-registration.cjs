const fs = require('node:fs');
const ts = require('typescript');
const assert = require('node:assert/strict');
const { NextRequest } = require('next/server');
function load(file, overrides = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', code)(name => overrides[name] || require(name), mod, mod.exports);
  return mod.exports;
}
async function main() {
  const helper = load('src/lib/lms.ts');
  const api = load('src/app/api/student-applications/route.ts', { '@/lib/lms': helper });
  process.env.LMS_URL = 'http://localhost:3001';
  process.env.LMS_REGISTRATION_URL = 'https://www.krishfxswinglab.com';
  const body = { fullName: 'Test Student', email: 'test@example.invalid', whatsappNumber: '+94711234567', badge: 5, turnstileToken: 'test-token', extra: 'ignored' };
  const request = (value = body) => new NextRequest('https://landing.example/api/student-applications', {
    method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': '192.0.2.1' }, body: JSON.stringify(value),
  });
  let calls = 0;
  global.fetch = async (url, options) => {
    calls++;
    assert.equal(url.toString(), 'https://www.krishfxswinglab.com/api/student-applications');
    const forwarded = JSON.parse(options.body);
    assert.equal(forwarded.badge, 5);
    assert.equal(forwarded.turnstileToken, 'test-token');
    assert.equal(forwarded.extra, undefined);
    assert.equal(options.headers['x-forwarded-for'], '192.0.2.1');
    return Response.json({ success: true, emailWarning: '' });
  };
  assert.equal((await api.POST(request({ ...body, badge: 4 }))).status, 400);
  assert.equal(calls, 0);
  assert.deepEqual(await (await api.POST(request())).json(), { success: true, emailWarning: '' });
  global.fetch = async () => Response.json({ error: 'Already pending.' }, { status: 409 });
  assert.equal((await api.POST(request())).status, 409);
  global.fetch = async () => { throw Error('Offline'); };
  assert.equal((await api.POST(request())).status, 502);
  process.env.LMS_REGISTRATION_URL = 'https://landing.example';
  assert.equal((await api.POST(request())).status, 503);
  process.env.NODE_ENV = 'production';
  assert.throws(() => helper.lmsUrl('/', 'http://localhost:3001'), /HTTPS/);
  assert.equal(helper.lmsUrl('/', 'https://www.krishfxswinglab.com').protocol, 'https:');
  console.log('Passed: separate live registration target, Batch 5 validation, allowed fields, security token/IP forwarding, success/duplicate/network responses, recursive target rejection, production HTTPS.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
