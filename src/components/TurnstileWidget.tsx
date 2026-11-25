'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: Record<string, unknown>
      ) => string;
      remove: (id: string) => void;
    };
  }
}

export default function TurnstileWidget({
  onToken,
}: {
  onToken: (token: string) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !container.current) return;
    let widgetId: string | undefined;
    let disposed = false;
    const render = () => {
      if (
        disposed ||
        !container.current ||
        !window.turnstile ||
        widgetId !== undefined
      )
        return;
      widgetId = window.turnstile.render(container.current, {
        sitekey: siteKey,
        theme: 'dark',
        size: 'flexible',
        callback: onToken,
        'expired-callback': () => onToken(''),
        'error-callback': () => onToken(''),
      });
    };
    let script = document.getElementById(
      'cloudflare-turnstile'
    ) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'cloudflare-turnstile';
      script.src =
        'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', render);
    render();
    return () => {
      disposed = true;
      script.removeEventListener('load', render);
      if (widgetId !== undefined) window.turnstile?.remove(widgetId);
    };
  }, [onToken, siteKey]);

  if (!siteKey)
    return (
      <p role="alert">
        Registration security is not configured. Please contact support.
      </p>
    );
  return <div ref={container} aria-label="Security verification" />;
}
