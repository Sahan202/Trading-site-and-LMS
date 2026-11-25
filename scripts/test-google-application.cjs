const fs = require('node:fs');
const ts = require('typescript');
const assert = require('node:assert/strict');
const { NextRequest } = require('next/server');
const root = process.cwd() + '/';
function load(file, overrides = {}) {
  const js = ts.transpileModule(fs.readFileSync(root + file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', js)(name => overrides[name] || require(name), mod, mod.exports);
  return mod.exports;
}
async function main() {
  process.env.LANDING_SITE_URL = 'http://localhost:3000';
  const helper = load('src/lib/landing-auth.ts');
  let authenticated = true, google = true, status = 200, saves = 0, signOuts = 0;
  const route = load('src/app/(lms)/auth/google-register/route.ts', {
    '@/lib/landing-auth': helper,
    '@/lib/supabase/server': { createClient: async () => ({ auth: {
      getUser: async () => ({ data: { user: authenticated ? { id: 'test', app_metadata: { providers: google ? ['google'] : ['email'] } } : null } }),
      signOut: async () => { signOuts++; },
    } }) },
    '../../api/google-onboarding/route': { POST: async request => {
      saves++;
      const body = await request.json();
      assert.deepEqual(body, { fullName: 'Student Test', whatsappNumber: '+94711234567', badge: 5 });
      return Response.json({ success: status === 200 }, { status });
    } },
  });
  const post = (origin = 'http://localhost:3000', batch = '5') => new NextRequest('http://localhost:3001/auth/google-register', {
    method: 'POST', headers: { origin, 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ fullName: 'Student Test', whatsapp: '+94711234567', batch, email: 'ignored@example.invalid' }),
  });
  let response = await route.POST(post('https://untrusted.example'));
  assert.match(response.headers.get('location'), /auth_error=origin#login/);
  assert.equal(saves, 0);
  response = await route.POST(post('http://localhost:3000', '4'));
  assert.match(response.headers.get('location'), /application_result=invalid#register/);
  response = await route.POST(post());
  assert.equal(response.status, 303);
  assert.equal(response.headers.get('location'), 'http://localhost:3001/auth/google-register');
  const cookie = response.cookies.get('krish_google_application');
  assert.ok(cookie.httpOnly);
  assert.equal(cookie.path, '/auth/google-register');
  assert.equal(JSON.parse(Buffer.from(cookie.value, 'base64url')).email, undefined);
  const get = () => new NextRequest('http://localhost:3001/auth/google-register', { headers: { cookie: 'krish_google_application=' + cookie.value } });
  authenticated = false;
  response = await route.GET(get());
  assert.match(response.headers.get('location'), /auth_error=google-session#login/);
  authenticated = true; google = false;
  await route.GET(get()); assert.equal(saves, 0);
  google = true;
  response = await route.GET(get());
  assert.equal(response.headers.get('location'), 'http://localhost:3000/?auth_mode=google&application_result=received#register');
  assert.equal(response.cookies.get('krish_google_application').maxAge, 0);
  assert.equal(signOuts, 1);
  status = 403;
  response = await route.GET(get());
  assert.match(response.headers.get('location'), /application_result=rejected#register/);
  status = 500;
  response = await route.GET(get());
  assert.match(response.headers.get('location'), /application_result=unavailable#register/);
  console.log('Passed: trusted-origin form POST, Batch 5 validation, cross-site cookie handoff, verified Google identity required, submitted email ignored, existing application API reused, success/rejection/error return to landing form, one-time form cookie cleared.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
