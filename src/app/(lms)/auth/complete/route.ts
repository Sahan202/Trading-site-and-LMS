import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { loginFailure } from '@/lib/landing-auth';
import { POST as registerSession } from '../../api/session/register/route';

export async function GET(request: NextRequest) {
  if (request.cookies.get('krish_login_pending')?.value !== '1')
    return loginFailure('unavailable');
  const supabase = await createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return loginFailure('credentials');
    const { data: profile } = await supabase
      .from('profiles')
      .select('approval_status,role')
      .eq('id', user.id)
      .maybeSingle();
    if (!profile || profile.approval_status !== 'approved') {
      await supabase.auth.signOut();
      return loginFailure(
        profile?.approval_status === 'pending' ? 'pending' : 'removed'
      );
    }
    const session = await registerSession(request);
    if (!session.ok) {
      await supabase.auth.signOut();
      return loginFailure('device');
    }
    const destination = user.user_metadata?.must_change_password
      ? '/change-password'
      : profile.role === 'admin'
        ? '/super-admin'
        : '/dashboard';
    const response = NextResponse.redirect(
      new URL(destination, request.url),
      303
    );
    for (const cookie of session.cookies.getAll()) response.cookies.set(cookie);
    response.cookies.set('krish_login_pending', '', {
      path: '/auth/complete',
      maxAge: 0,
    });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch {
    await supabase.auth.signOut();
    return loginFailure('unavailable');
  }
}
