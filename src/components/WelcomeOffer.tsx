'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import './welcome-offer.css';

export default function WelcomeOffer() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    // Keep direct login and registration links immediately accessible.
    if (/^#(login|register)/.test(window.location.hash)) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    const restore = () => {
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
    dialog.addEventListener('close', restore);
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.removeEventListener('close', restore);
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="welcome-offer"
      aria-label="Black Friday mentorship offer"
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
    >
      <div className="welcome-offer-content">
        <img
          src="/black-friday-mentorship-offer.jpeg"
          alt="Black Friday mentorship offer: regular price $170, offer price $135. Contact +971 56 851 5770."
          width={1292}
          height={1600}
        />
        <button
          type="button"
          className="welcome-offer-close"
          aria-label="Close offer"
          onClick={() => dialogRef.current?.close()}
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>
    </dialog>
  );
}
