import { redirect } from 'next/navigation';
import { landingUrl } from '@/lib/landing-auth';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const url = landingUrl();
  for (const key of ['reason', 'error', 'auth_error']) {
    const value = params[key];
    if (typeof value === 'string')
      url.searchParams.set(key, value.slice(0, 300));
  }
  redirect(url.toString());
}
