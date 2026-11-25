import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { landingUrl, googleRegistrationUrl } from '@/lib/landing-auth';

export const dynamic = 'force-dynamic';

export default async function GoogleOnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(landingUrl('login', 'google-session').toString());
  redirect(googleRegistrationUrl(undefined, user.email).toString());
}
