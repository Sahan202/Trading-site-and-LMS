'use client';

import { useEffect, useRef } from 'react';

/** Shared pixel reveal for the page background and the CTA surfaces. */
export function PixelField({ background = false }: { background?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = background
      ? canvas?.closest<HTMLElement>('.home')
      : canvas?.closest('button');
    const drawingContext = canvas?.getContext('2d');
    if (!canvas || !host || !drawingContext) return;
    const context = drawingContext;

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastTime = 0;
    let visible = true;
    let active = false;
    let focused = false;
    let reveal = 0;
    let pointerX = 0;
    let pointerY = 0;
    let smoothX = 0;
    let smoothY = 0;
    let hasPointer = false;
    let ripple: { x: number; y: number; time: number } | null = null;
    let points: {
      x: number;
      y: number;
      phase: number;
      size: number;
      tint: number;
    }[] = [];

    const setActive = (value: boolean) => {
      active = value;
      if (!background) host.dataset.pixelActive = String(value || focused);
    };

    function schedule() {
      if (!frame && visible && !document.hidden)
        frame = requestAnimationFrame(draw);
    }

    function draw(time: number) {
      frame = 0;
      const dt = Math.min((time - lastTime) / 1000 || 0.016, 0.05);
      lastTime = time;
      const reduced = preference.matches;
      const target = (active || focused) && !reduced ? 1 : 0;
      reveal += (target - reveal) * (1 - Math.exp(-dt * (target ? 8 : 4.5)));
      smoothX += (pointerX - smoothX) * (1 - Math.exp(-dt * 16));
      smoothY += (pointerY - smoothY) * (1 - Math.exp(-dt * 16));
      context.clearRect(0, 0, width, height);

      const cx = background ? smoothX : width / 2;
      const cy = background ? smoothY : height / 2;
      const radius = background ? 95 : Math.hypot(width, height) * 0.6;
      if (reveal > 0.005) {
        const glow = context.createRadialGradient(cx, cy, 0, cx, cy, radius);
        glow.addColorStop(
          0,
          `rgba(28,55,245,${reveal * (background ? 0.1 : 0.11)})`
        );
        glow.addColorStop(
          0.6,
          `rgba(23,42,190,${reveal * (background ? 0.1 : 0.035)})`
        );
        glow.addColorStop(1, 'rgba(2,8,36,0)');
        context.fillStyle = glow;
        context.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
      }

      for (const point of points) {
        const distance = Math.hypot(point.x - cx, point.y - cy);
        const edge = Math.max(
          0,
          Math.min(1, (radius * reveal - distance) / (background ? 50 : 16))
        );
        const shimmer = reduced
          ? 0.5
          : 0.5 + Math.sin(time * 0.003 + point.phase) * 0.5;
        const ambient = point.tint > 0.94 ? (background ? 0.065 : 0.07) : 0.005;
        let alpha = ambient + edge * reveal * (0.3 + shimmer * 0.6);
        let displacement = 0;
        if (ripple && !reduced) {
          const age = (time - ripple.time) / 750;
          if (age >= 1) ripple = null;
          else {
            const waveDistance = Math.hypot(
              point.x - ripple.x,
              point.y - ripple.y
            );
            const wave =
              Math.exp(-Math.pow((waveDistance - age * radius * 2) / 9, 2)) *
              (1 - age);
            alpha += wave * 0.55;
            displacement = wave * 2;
          }
        }
        // Dim the center behind the label so the particle field stays readable.
        if (!background) {
          const halo = Math.exp(
            -Math.pow((point.x - width / 2) / (width * 0.3), 4) -
              Math.pow((point.y - height / 2) / 8, 4)
          );
          alpha *= 1 - halo * 0.78;
        }
        if (alpha < 0.012) continue;
        const bright = point.tint > 0.83;
        context.fillStyle = bright
          ? `rgba(115,163,255,${alpha})`
          : `rgba(39,74,255,${alpha})`;
        const size = point.size * (0.6 + shimmer * 0.4) + displacement * 0.3;
        context.fillRect(
          point.x - size / 2,
          point.y - size / 2 - displacement,
          size,
          size
        );
      }

      if (!reduced) schedule();
    }

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      width = Math.max(1, Math.round(bounds.width));
      height = Math.max(1, Math.round(bounds.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const step = background ? 7 : 3;
      points = [];
      for (let y = 2; y < height; y += step) {
        for (let x = 2; x < width; x += step) {
          const seed =
            Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
          points.push({
            x,
            y,
            phase: seed * Math.PI * 2,
            size: background ? 0.8 + seed * 1.2 : 0.6 + seed * 1.3,
            tint: seed,
          });
        }
      }
      schedule();
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const rect = host.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      setActive(inside);
      if (inside) {
        pointerX = event.clientX - rect.left;
        pointerY = event.clientY - rect.top;
        if (!hasPointer) {
          smoothX = pointerX;
          smoothY = pointerY;
          hasPointer = true;
        }
      }
      schedule();
    };
    const leave = () => {
      setActive(false);
      hasPointer = false;
      schedule();
    };
    const down = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )
        return;
      ripple = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        time: performance.now(),
      };
      schedule();
    };
    const focus = () => {
      focused = true;
      setActive(active);
      schedule();
    };
    const blur = () => {
      focused = false;
      leave();
    };
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else schedule();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    intersectionObserver.observe(host);
    window.addEventListener('pointermove', move, {
      passive: true,
      capture: true,
    });
    window.addEventListener('pointerdown', down, {
      passive: true,
      capture: true,
    });
    window.addEventListener('blur', blur);
    document.documentElement.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', visibility);
    preference.addEventListener('change', schedule);
    if (!background) {
      host.addEventListener('focus', focus);
      host.addEventListener('blur', blur);
    }
    resize();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('pointermove', move, true);
      window.removeEventListener('pointerdown', down, true);
      window.removeEventListener('blur', blur);
      document.documentElement.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', visibility);
      preference.removeEventListener('change', schedule);
      host.removeEventListener('focus', focus);
      host.removeEventListener('blur', blur);
      delete host.dataset.pixelActive;
    };
  }, [background]);

  return (
    <canvas
      ref={canvasRef}
      className={background ? 'page-pixels' : 'pixel-field'}
      aria-hidden="true"
    />
  );
}
