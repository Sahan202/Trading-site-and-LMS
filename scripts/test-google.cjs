const fs = require('node:fs');
const ts = require('typescript');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
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
  let profile = { approval_status: 'approved', role: 'student' };
  let exchangeError = false, allowed = true, sessionError = false, mustChange = false;
  let clientCalls = 0, deviceCalls = 0;
  const callback = load('src/app/(lms)/auth/callback/route.ts', {
    '@/lib/landing-auth': helper,
    '@/lib/audit': { recordCurrentUserEvent: async () => {} },
    '@supabase/ssr': { createServerClient: (_url, _key, options) => {
      clientCalls++;
      return {
        auth: {
          exchangeCodeForSession: async () => {
            options.cookies.setAll([{ name: 'sb-test', value: 'mock-session', options: { path: '/' } }]);
            return { data: { user: { id: 'test', email: 'student+alias@gmail.com', user_metadata: { must_change_password: mustChange } } }, error: exchangeError ? {} : null };
          },
          signOut: async () => {},
        },
        from: table => table === 'profiles'
          ? { select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: profile }) }) }) }
          : { upsert: async () => ({ error: sessionError ? {} : null }) },
        rpc: async (_name, args) => {
          deviceCalls++;
          assert.equal(args.p_device_hash, createHash('sha256').update('existing-device').digest('hex'));
          return { data: allowed, error: null };
        },
      };
    } },
  });
  const request = query => new Request('http://localhost:3001/auth/callback' + query, { headers: { cookie: 'krish_device_id=existing-device' } });
  let response = await callback.GET(request('?error=access_denied'));
  assert.match(response.headers.get('location'), /localhost:3000\/\?auth_error=google-cancelled#login$/);
  response = await callback.GET(request(''));
  assert.match(response.headers.get('location'), /auth_error=google-callback#login$/);
  assert.equal(clientCalls, 0);
  exchangeError = true;
  response = await callback.GET(request('?code=test-code'));
  assert.match(response.headers.get('location'), /auth_error=google-session#login$/);
  assert.equal(response.cookies.get('sb-test').value, 'mock-session');
  exchangeError = false;
  profile = null;
  response = await callback.GET(request('?code=test-code'));
  assert.equal(response.headers.get('location'), helper.googleRegistrationUrl(undefined, 'student+alias@gmail.com').toString());
  assert.equal(deviceCalls, 0);
  profile = { approval_status: 'pending', role: 'student' };
  response = await callback.GET(request('?code=test-code'));
  assert.equal(response.headers.get('location'), helper.googleRegistrationUrl(undefined, 'student+alias@gmail.com').toString());
  profile = { approval_status: 'rejected', role: 'student' };
  response = await callback.GET(request('?code=test-code'));
  assert.match(response.headers.get('location'), /auth_error=rejected#login$/);
  profile = { approval_status: 'approved', role: 'student' };
  response = await callback.GET(request('?code=test-code'));
  assert.equal(response.headers.get('location'), 'http://localhost:3001/dashboard');
  assert.equal(response.cookies.get('krish_device_id').value, 'existing-device');
  assert.ok(response.cookies.get('krish_session_id').httpOnly);
  mustChange = true;
  response = await callback.GET(request('?code=test-code'));
  assert.equal(response.headers.get('location'), 'http://localhost:3001/change-password');
  mustChange = false;
  allowed = false;
  response = await callback.GET(request('?code=test-code'));
  assert.equal(new URL(response.headers.get('location')).origin, 'http://localhost:3000');
  allowed = true;
  sessionError = true;
  response = await callback.GET(request('?code=test-code'));
  assert.match(response.headers.get('location'), /auth_error=unavailable#login$/);
  const onboarding = fs.readFileSync(root + 'src/app/(lms)/google-onboarding/page.tsx', 'utf8');
  assert.ok(!onboarding.includes('<form'));
  assert.match(onboarding, /googleRegistrationUrl/);
  assert.ok(!onboarding.includes('option value="1"'));
  assert.match(fs.readFileSync(root + 'src/app/(lms)/api/google-onboarding/route.ts', 'utf8'), /badge !== 5/);
  const prefilled = helper.googleRegistrationUrl(undefined, 'student+alias@gmail.com');
  assert.equal(prefilled.searchParams.get('email'), null);
  assert.equal(new URLSearchParams(prefilled.hash.split('?')[1]).get('email'), 'student+alias@gmail.com');
  console.log('Passed: OAuth cancel/missing code/exchange errors return to landing, new/pending Google users reach registration, rejected users stay blocked, approved users reach dashboard with device/session cookies, forced password change, device/session rejection, Batch 5 Google registration.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
