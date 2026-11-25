'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import './student-recognition.css';

const certificates = [
  {
    src: '/student-recognition/rasika-top-trader.jpeg',
    name: 'Rasika Buddhika',
    award: 'Top Trader',
  },
  {
    src: '/student-recognition/kaviru-second-place.jpeg',
    name: 'Kaviru Mendis',
    award: '2nd Place',
  },
  {
    src: '/student-recognition/roshan-third-place.jpeg',
    name: 'Roshan Dangamuwage',
    award: '3rd Place',
  },
];

export default function StudentRecognition() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) setPaused(true);
    const update = () => setPaused(motion.matches);
    motion.addEventListener('change', update);
    return () => motion.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (paused) return;
    const interval = window.setInterval(() => {
      const element = track.current;
      if (
        !element ||
        document.hidden ||
        element.matches(':hover') ||
        element.parentElement?.contains(document.activeElement)
      )
        return;
      const next =
        (Math.round(element.scrollLeft / element.clientWidth) + 1) %
        certificates.length;
      element.scrollTo({
        left: next * element.clientWidth,
        behavior: 'smooth',
      });
    }, 4500);
    return () => window.clearInterval(interval);
  }, [paused]);

  function show(index: number) {
    const element = track.current;
    if (!element) return;
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    element.scrollTo({
      left: index * element.clientWidth,
      behavior: reduced ? 'instant' : 'smooth',
    });
  }

  return (
    <section
      className="student-recognition"
      aria-labelledby="student-recognition-title"
    >
      <div className="student-recognition-copy">
        <h2 id="student-recognition-title">
          Recognizing Growth.
          <br />
          Celebrating Progress. <span aria-label="Trophy">🏆</span>
        </h2>
        <p>
          Every certificate represents dedication, consistency, and the
          commitment to learning and improving as a trader.
        </p>
        <p>
          At Krish Fx Swing Lab, we believe trading is not just about profits —
          it&apos;s about developing the right knowledge, discipline, and
          mindset.
        </p>
        <p>
          Proud to celebrate the achievements of our students from this batch.
          Their progress is a reflection of the effort they put into learning
          and applying the concepts.
        </p>
        <p className="student-recognition-congratulations">
          Congratulations to all our students!
        </p>
      </div>
      <div
        className="student-recognition-card"
        role="region"
        aria-roledescription="carousel"
        aria-label="Student achievement certificates"
      >
        <div
          className="student-recognition-track"
          ref={track}
          onScroll={() => {
            const element = track.current;
            if (element?.clientWidth)
              setActive(Math.round(element.scrollLeft / element.clientWidth));
          }}
        >
          {certificates.map(({ src, name, award }, index) => (
            <figure
              className="student-recognition-slide"
              key={src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${certificates.length}: ${name}, ${award}`}
            >
              <img
                src={src}
                alt={`${award} certificate of achievement presented to ${name}`}
                width={1280}
                height={853}
                loading="lazy"
              />
            </figure>
          ))}
        </div>
        <div className="student-recognition-controls">
          <div
            className="student-recognition-dots"
            aria-label="Choose a certificate"
          >
            {certificates.map(({ name }, index) => (
              <button
                type="button"
                key={name}
                className={active === index ? 'is-active' : ''}
                aria-label={`Show ${name}'s certificate`}
                aria-pressed={active === index}
                onClick={() => show(index)}
              >
                <span />
              </button>
            ))}
          </div>
          <button
            type="button"
            className="student-recognition-pause"
            onClick={() => setPaused((value) => !value)}
            aria-label={
              paused
                ? 'Play certificate slideshow'
                : 'Pause certificate slideshow'
            }
          >
            {paused ? (
              <Play size={14} aria-hidden="true" />
            ) : (
              <Pause size={14} aria-hidden="true" />
            )}
            {paused ? 'Play' : 'Pause'}
          </button>
        </div>
      </div>
    </section>
  );
}
