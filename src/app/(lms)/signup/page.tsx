import { redirect } from 'next/navigation';
import { landingUrl } from '@/lib/landing-auth';

export const dynamic = 'force-dynamic';

export default function SignupPage() {
  redirect(landingUrl('register').toString());
}
