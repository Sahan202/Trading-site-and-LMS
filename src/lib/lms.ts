export function lmsUrl(path: string, configured = process.env.LMS_URL) {
  if (!configured) throw new Error('LMS_URL is not configured.');
  const url = new URL(configured);
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    throw new Error(
      'LMS_URL must be an HTTP or HTTPS URL without credentials.'
    );
  }
  if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') {
    throw new Error('LMS URLs must use HTTPS in production.');
  }
  return new URL(path, url.origin);
}
