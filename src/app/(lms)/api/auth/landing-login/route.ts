import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { landingUrl, loginFailure } from '@/lib/landing-auth';

export async function POST(request: NextRequest) {
  // Accept credentials only from our configured landing page. Never accept a
  // return URL from the browser, or put passwords/tokens into redirect URLs.
  if (
    request.headers.get('origin') !== request.nextUrl.origin &&
    request.headers.get('origin') !== landingUrl().origin
  ) {
    return loginFailure('origin');
  }
  let email: string;
  let password: string;
  try {
    if (Number(request.headers.get('content-length')) > 16384)
      return loginFailure('credentials');
    const form = await request.formData();
    const emailValue = form.get('email');
    const passwordValue = form.get('password');
    if (typeof emailValue !== 'string' || typeof passwordValue !== 'string')
      return loginFailure('credentials');
    email = emailValue.trim().toLowerCase();
    password = passwordValue;
    if (!email || email.length > 254 || !password || password.length > 1024)
      return loginFailure('credentials');
  } catch {
    return loginFailure('credentials');
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.user) return loginFailure('credentials');
    const { data: profile } = await supabase
      .from('profiles')
      .select('approval_status')
      .eq('id', data.user.id)
      .maybeSingle();
    if (!profile || profile.approval_status !== 'approved') {
      await supabase.auth.signOut();
      return loginFailure(
        profile?.approval_status === 'pending'
          ? 'pending'
          : profile?.approval_status === 'rejected'
            ? 'rejected'
            : 'removed'
      );
    }
    // Complete on a top-level GET on the LMS origin. Its existing Lax device
    // cookie is available there even when the form came from a different site.
    const response = NextResponse.redirect(
      new URL('/auth/complete', request.url),
      303
    );
    response.headers.set('Cache-Control', 'no-store');
    response.cookies.set('krish_login_pending', '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/auth/complete',
      maxAge: 120,
    });
    return response;
  } catch {
    return loginFailure('unavailable');
  }
}
