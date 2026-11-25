import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  landingUrl,
  loginFailure,
  googleRegistrationUrl,
} from '@/lib/landing-auth';
import { POST as submitApplication } from '../../api/google-onboarding/route';

const COOKIE = 'krish_google_application';
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/auth/google-register',
  maxAge: 120,
};

function result(
  status: 'received' | 'invalid' | 'rejected' | 'unavailable',
  email?: string
) {
  const response = NextResponse.redirect(
    googleRegistrationUrl(status, email),
    303
  );
  response.cookies.set(COOKIE, '', { ...cookieOptions, maxAge: 0 });
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

export async function POST(request: NextRequest) {
  if (
    request.headers.get('origin') !== request.nextUrl.origin &&
    request.headers.get('origin') !== landingUrl().origin
  )
    return loginFailure('origin');
  try {
    if (Number(request.headers.get('content-length')) > 8192)
      return result('invalid');
    const form = await request.formData();
    const fullName = form.get('fullName');
    const whatsappNumber = form.get('whatsapp');
    const badge = Number(form.get('batch'));
    if (
      typeof fullName !== 'string' ||
      fullName.trim().length < 2 ||
      fullName.length > 100 ||
      typeof whatsappNumber !== 'string' ||
      !/^[0-9+()\-\s]{7,25}$/.test(whatsappNumber) ||
      badge !== 5
    )
      return result('invalid');
    // A top-level GET restores Lax LMS authentication cookies after a form
    // submitted from a different site. This cookie contains only form fields;
    // identity always comes from the verified LMS session on GET.
    const response = NextResponse.redirect(
      new URL('/auth/google-register', request.url),
      303
    );
    response.cookies.set(
      COOKIE,
      Buffer.from(JSON.stringify({ fullName, whatsappNumber, badge })).toString(
        'base64url'
      ),
      cookieOptions
    );
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch {
    return result('invalid');
  }
}

export async function GET(request: NextRequest) {
  const value = request.cookies.get(COOKIE)?.value;
  if (!value) return result('invalid');
  try {
    const body = JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const google =
      user?.app_metadata?.providers?.includes('google') ||
      user?.identities?.some((identity) => identity.provider === 'google');
    if (!user || !google) {
      const response = loginFailure('google-session');
      response.cookies.set(COOKIE, '', { ...cookieOptions, maxAge: 0 });
      return response;
    }
    const apiRequest = new NextRequest(
      new URL('/api/google-onboarding', request.url),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: body.fullName,
          whatsappNumber: body.whatsappNumber,
          badge: body.badge,
        }),
      }
    );
    const submitted = await submitApplication(apiRequest);
    if (!submitted.ok) {
      return result(
        submitted.status === 403
          ? 'rejected'
          : submitted.status === 400
            ? 'invalid'
            : 'unavailable',
        user.email
      );
    }
    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch {
      /* Application was already saved. */
    }
    return result('received', user.email);
  } catch {
    return result('unavailable');
  }
}
