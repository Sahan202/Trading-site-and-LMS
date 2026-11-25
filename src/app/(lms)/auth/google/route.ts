import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { landingUrl, loginFailure } from '@/lib/landing-auth';

export async function GET(request: NextRequest) {
  try {
    const canonical = landingUrl().origin;
    if (
      process.env.NODE_ENV === 'production' &&
      request.nextUrl.origin !== canonical
    ) {
      return NextResponse.redirect(new URL('/auth/google', canonical));
    }
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: new URL('/auth/callback', request.url).toString(),
        skipBrowserRedirect: true,
      },
    });
    if (error || !data.url) return loginFailure('unavailable');
    const response = NextResponse.redirect(data.url);
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch {
    return loginFailure('unavailable');
  }
}
