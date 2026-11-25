# Combined production release

The landing page and LMS now run in one Next.js application. The root page is the landing page; /login, /signup and /register lead to its forms. Dashboard, admin, course, video and auth API routes run in the same deployment.

1. In Vercel project react-template-main, add the Production variables listed in .env.example. Reuse the existing LMS Supabase and VdoCipher settings manually. Never commit secrets.
2. Set LANDING_SITE_URL and MAIN_SITE_URL to https://www.krishfxswinglab.com.
3. In Supabase Auth, allow https://www.krishfxswinglab.com/auth/callback and enable Google. Ensure the Turnstile widget allows www.krishfxswinglab.com and krishfxswinglab.com.
4. Run yarn check:release, yarn type-check and yarn build with the required local environment configured. Deploy the combined project to Vercel Production only after these checks pass.
5. Verify password login with an approved student, Google login, new Google email prefill, registration, approval, dashboard, video playback and logout on the official domain.

The old krish-fx-swing-lab Vercel project remains a fallback. Its database is shared: student registrations and approvals affect the same LMS data. No database reset or migration is part of this release.
