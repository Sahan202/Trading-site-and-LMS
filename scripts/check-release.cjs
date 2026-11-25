const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd(), false);
const required = ['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY','SUPABASE_SERVICE_ROLE_KEY','NEXT_PUBLIC_TURNSTILE_SITE_KEY','TURNSTILE_SECRET_KEY','VDOCIPHER_API_SECRET','SMTP_HOST','SMTP_USER','SMTP_PASS'];
const optionalForThisRelease = process.env.ALLOW_MISSING_SMTP === 'true' ? ['SMTP_USER','SMTP_PASS'] : [];
const missing = required.filter(key => !process.env[key]);
const failures = missing.filter(key => !optionalForThisRelease.includes(key)).map(key => `${key}: missing Production variable.`);
for (const key of missing.filter(key => optionalForThisRelease.includes(key))) console.warn(`${key}: missing; confirmation emails unavailable in this explicitly approved release. Registration security remains required.`);
for (const key of ['LANDING_SITE_URL','MAIN_SITE_URL']) {
  try {
    const url = new URL(process.env[key]);
    if (url.protocol !== 'https:' || url.username || url.password || ['localhost','127.0.0.1','[::1]'].includes(url.hostname)) throw new Error();
  } catch { failures.push(`${key}: configure the public HTTPS site URL.`); }
}
if (failures.length) {
  console.error('Release configuration needs attention:\n' + failures.join('\n'));
  process.exitCode = 1;
} else console.log('Combined landing and LMS release configuration passed.');
