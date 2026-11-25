const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd(), false);

async function main() {
  const checks = [
    [process.env.LMS_URL, '/api/auth/landing-login', [405]],
    [process.env.LMS_REGISTRATION_URL || process.env.LMS_URL, '/api/student-applications', [405]],
    [process.env.LMS_URL, '/auth/google', [302, 303, 307]],
  ];
  let failed = false;
  for (const [origin, pathname, expected] of checks) {
    try {
      const response = await fetch(new URL(pathname, origin), {
        method: 'HEAD', redirect: 'manual', signal: AbortSignal.timeout(15000),
      });
      if (!expected.includes(response.status)) {
        failed = true;
        console.error(`${pathname}: HTTP ${response.status}; expected ${expected.join('/')}. Deploy/configure the updated LMS before release.`);
      } else {
        console.log(`${pathname}: reachable (HTTP ${response.status}).`);
      }
    } catch (error) {
      failed = true;
      console.error(`${pathname}: ${error.message}`);
    }
  }
  if (failed) process.exitCode = 1;
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
