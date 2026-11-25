'use client';

import { useEffect, useRef, useState } from 'react';

const images = [
  {
    src: '/mentor-ftmo-challenge.jpeg',
    alt: 'Mentor FTMO dashboard showing completed challenge trading objectives',
  },
  {
    src: '/mentor-ftmo-verification.jpeg',
    alt: 'Mentor FTMO dashboard showing completed verification trading objectives',
  },
];

export default function MentorResults() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (selected === null) return;
    const modal = dialog.current;
    modal?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      modal?.close();
      document.body.style.overflow = previous;
    };
  }, [selected]);

  useEffect(() => {
    if (
      paused ||
      selected !== null ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % images.length),
      2500
    );
    return () => window.clearInterval(timer);
  }, [paused, selected]);

  return (
    <div
      className="mentor-results"
      role="region"
      aria-roledescription="carousel"
      aria-label="Mentor trading results"
    >
      <div className="mentor-result-stage">
        <div
          className="mentor-result-track"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {images.map((image, index) => (
            <button
              type="button"
              key={image.src}
              className="mentor-result-card"
              onClick={() => setSelected(index)}
              tabIndex={index === active ? 0 : -1}
              aria-hidden={index !== active}
              aria-label="View trading results at full size"
            >
              <img
                src={image.src}
                alt={image.alt}
                width={1280}
                height={660}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>
      {selected !== null && (
        <dialog
          ref={dialog}
          className="mentor-result-modal"
          aria-label="Mentor trading result"
          onClose={() => setSelected(null)}
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <div className="mentor-result-modal-content">
            <button
              type="button"
              className="mentor-result-modal-close"
              aria-label="Close image"
              onClick={() => setSelected(null)}
            >
              &times;
            </button>
            <img
              src={images[selected].src}
              alt={images[selected].alt}
              width={1280}
              height={660}
            />
          </div>
        </dialog>
      )}
      <div className="mentor-result-controls">
        <button
          type="button"
          aria-label="Previous result"
          onClick={() =>
            setActive((active + images.length - 1) % images.length)
          }
        >
          ←
        </button>
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            className="mentor-result-dot"
            aria-label={`Show result ${index + 1}`}
            aria-pressed={active === index}
            onClick={() => setActive(index)}
          />
        ))}
        <button
          type="button"
          aria-label="Next result"
          onClick={() => setActive((active + 1) % images.length)}
        >
          →
        </button>
        <button
          type="button"
          className="mentor-result-pause"
          aria-pressed={paused}
          onClick={() => setPaused(!paused)}
        >
          {paused ? 'Play' : 'Pause'}
        </button>
      </div>
    </div>
  );
}
