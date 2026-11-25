const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const assert = require('node:assert/strict');
const { NextRequest, NextResponse } = require('next/server');
const root = process.cwd() + '/';
function load(relative, overrides = {}) {
  const code = ts.transpileModule(fs.readFileSync(path.join(root, relative), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', code)(
    name => overrides[name] || require(name), mod, mod.exports,
  );
  return mod.exports;
}
async function main() {
  process.env.LANDING_SITE_URL = 'http://localhost:3000';
  const helper = load('src/lib/landing-auth.ts');
  let signIns = 0, signOuts = 0, sessionCalls = 0;
  let approval = 'approved', role = 'student', passwordChange = false, credentialError = false, deviceAllowed = true;
  const supabase = {
    auth: {
      signInWithPassword: async ({ email, password }) => {
        signIns++;
        assert.equal(email, 'student@example.com');
        assert.equal(password, 'secret-test-password');
        return { data: { user: { id: 'student' } }, error: credentialError ? {} : null };
      },
      signOut: async () => { signOuts++; },
      getUser: async () => ({ data: { user: { id: 'student', user_metadata: { must_change_password: passwordChange } } } }),
      signInWithOAuth: async ({ options }) => {
        assert.equal(options.redirectTo, 'http://localhost:3001/auth/callback');
        return { data: { url: 'https://provider.example/authorize' }, error: null };
      },
    },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: approval === 'missing' ? null : { approval_status: approval, role } }) }) }) }),
  };
  const overrides = {
    '@/lib/landing-auth': helper,
    '@/lib/supabase/server': { createClient: async () => supabase },
    '../../api/session/register/route': { POST: async () => {
      sessionCalls++;
      const response = NextResponse.json({}, { status: deviceAllowed ? 200 : 403 });
      response.cookies.set('krish_session_id', 'session-test', { httpOnly: true });
      response.cookies.set('krish_device_id', 'device-test', { httpOnly: true });
      return response;
    } },
  };
  const login = load('src/app/(lms)/api/auth/landing-login/route.ts', overrides);
  const req = (origin = 'http://localhost:3000') => new NextRequest('http://localhost:3001/api/auth/landing-login', {
    method: 'POST', headers: { origin, 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ email: 'Student@example.com', password: 'secret-test-password' }),
  });
  let response = await login.POST(req('https://attacker.example'));
  assert.match(response.headers.get('location'), /auth_error=origin/);
  assert.equal(signIns, 0);
  credentialError = true;
  response = await login.POST(req());
  assert.match(response.headers.get('location'), /auth_error=credentials/);
  credentialError = false;
  for (const status of ['pending', 'rejected', 'missing']) {
    approval = status;
    response = await login.POST(req());
    assert.match(response.headers.get('location'), /#login$/);
    assert.equal(response.cookies.get('krish_login_pending').value, '');
  }
  assert.equal(signOuts, 3);
  approval = 'approved';
  response = await login.POST(req());
  assert.equal(response.status, 303);
  assert.equal(response.headers.get('location'), 'http://localhost:3001/auth/complete');
  assert.equal(response.cookies.get('krish_login_pending').httpOnly, true);
  assert.ok(!response.headers.get('location').includes('secret-test-password'));
  const complete = load('src/app/(lms)/auth/complete/route.ts', overrides);
  const completion = (marker = true) => new NextRequest('http://localhost:3001/auth/complete', {
    headers: marker ? { cookie: 'krish_login_pending=1; krish_device_id=existing-device' } : {},
  });
  await complete.GET(completion(false));
  assert.equal(sessionCalls, 0);
  for (const [testRole, change, destination] of [
    ['student', false, '/dashboard'], ['admin', false, '/super-admin'], ['student', true, '/change-password'],
  ]) {
    role = testRole; passwordChange = change;
    response = await complete.GET(completion());
    assert.equal(response.headers.get('location'), 'http://localhost:3001' + destination);
    assert.equal(response.cookies.get('krish_session_id').value, 'session-test');
    assert.equal(response.cookies.get('krish_device_id').value, 'device-test');
    assert.equal(response.cookies.get('krish_login_pending').maxAge, 0);
  }
  deviceAllowed = false;
  response = await complete.GET(completion());
  assert.match(response.headers.get('location'), /auth_error=device/);
  const google = load('src/app/(lms)/auth/google/route.ts', overrides);
  response = await google.GET(new NextRequest('http://localhost:3001/auth/google'));
  assert.equal(response.headers.get('location'), 'https://provider.example/authorize');
  let redirected;
  const pageOverrides = { ...overrides, 'next/navigation': { redirect: url => { redirected = url; } } };
  await load('src/app/(lms)/login/page.tsx', pageOverrides).default({ searchParams: Promise.resolve({ reason: 'other-device' }) });
  assert.equal(redirected, 'http://localhost:3000/?reason=other-device#login');
  load('src/app/(lms)/signup/page.tsx', pageOverrides).default();
  assert.equal(redirected, 'http://localhost:3000/#register');
  console.log('Passed: origin protection, credential errors, pending/rejected/removed accounts, login handoff, required handoff cookie, student/admin/password-change destinations, session/device cookies, device rejection, Google callback, old login/signup redirects.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
