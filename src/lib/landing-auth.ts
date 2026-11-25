import { NextResponse } from 'next/server';

export function landingUrl(
  mode: 'login' | 'register' = 'login',
  error?: string
) {
  const configured = process.env.LANDING_SITE_URL || process.env.MAIN_SITE_URL;
  if (!configured) throw new Error('LANDING_SITE_URL is not configured.');
  const url = new URL(configured);
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    throw new Error('Invalid LANDING_SITE_URL.');
  }
  if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') {
    throw new Error('LANDING_SITE_URL must use HTTPS in production.');
  }
  url.search = '';
  url.hash = mode === 'login' ? 'login' : 'register';
  if (error) url.searchParams.set('auth_error', error);
  return url;
}

export function loginFailure(error: string) {
  const response = NextResponse.redirect(landingUrl('login', error), 303);
  response.headers.set('Cache-Control', 'no-store');
  response.cookies.set('krish_login_pending', '', {
    path: '/auth/complete',
    maxAge: 0,
  });
  return response;
}

export function googleRegistrationUrl(
  result?: 'received' | 'invalid' | 'rejected' | 'unavailable',
  email?: string
) {
  const url = landingUrl('register');
  url.searchParams.set('auth_mode', 'google');
  if (result) url.searchParams.set('application_result', result);
  // The fragment is for display only and is not sent in HTTP requests or referrers.
  // Application identity always comes from the authenticated Google session.
  if (email) url.hash = 'register?' + new URLSearchParams({ email }).toString();
  return url;
}
