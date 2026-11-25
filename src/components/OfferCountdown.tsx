'use client';

import { useEffect, useState } from 'react';
import './offer-countdown.css';

// This promotion ends at the end of November in Sri Lanka, not the viewer's timezone.
const offerEndsAt = Date.parse('2026-12-01T00:00:00+05:30');

export default function OfferCountdown() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setRemaining(Math.max(0, offerEndsAt - Date.now()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (remaining === 0)
    return <p className="offer-countdown-ended">Offer countdown ended</p>;

  const seconds = Math.floor((remaining ?? 0) / 1000);
  const units = [
    ['Days', Math.floor(seconds / 86400)],
    ['Hours', Math.floor((seconds % 86400) / 3600)],
    ['Minutes', Math.floor((seconds % 3600) / 60)],
    ['Seconds', seconds % 60],
  ] as const;

  return (
    <div
      className="offer-countdown"
      aria-label="Offer ends November 30, 2026 at midnight Sri Lanka time"
    >
      <span className="offer-countdown-heading">Offer ends in</span>
      <div className="offer-countdown-units" role="timer" aria-live="off">
        {units.map(([label, value]) => (
          <span className="offer-countdown-unit" key={label}>
            <strong>
              {remaining === null ? '--' : String(value).padStart(2, '0')}
            </strong>
            <span>{label}</span>
          </span>
        ))}
      </div>
      <span className="offer-countdown-deadline">
        Ends 30 Nov · Sri Lanka time
      </span>
    </div>
  );
}
