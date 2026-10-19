'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, getLenis, reduced } from '@/lib/motion';

/**
 * An endless band that runs faster, skews and turns around with the scroll (velocity from Lenis).
 * The content is rendered twice so the loop has no seam; the copy is hidden from assistive tech.
 */
export default function Marquee({ children, speed = 40, reverse = false, className = '', label }: {
  children: ReactNode; speed?: number; reverse?: boolean; className?: string; label?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced()) return;
    const el = track.current!;
    const tween = reverse
      ? gsap.fromTo(el, { xPercent: -50 }, { xPercent: 0, duration: speed, ease: 'none', repeat: -1 })
      : gsap.to(el, { xPercent: -50, duration: speed, ease: 'none', repeat: -1 });
    tween.totalTime(speed * 500); // deep into the repeats, so running backwards never reaches the start
    let dir = 1, skew = 0;
    const tick = () => {
      const v = getLenis()?.velocity ?? 0;
      if (Math.abs(v) > 0.4) dir = v > 0 ? 1 : -1;
      tween.timeScale(dir * (1 + Math.min(Math.abs(v) * 0.12, 6)));
      skew += (Math.max(-8, Math.min(8, v * 0.35)) - skew) * 0.1;
      el.style.setProperty('--skew', skew.toFixed(2) + 'deg');
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); tween.kill(); };
  }, [speed, reverse]);
  return (
    <div className={'marquee ' + className} role={label ? 'region' : undefined} aria-label={label}>
      <div className="mq-track" ref={track}>
        <div className="mq-set">{children}</div>
        <div className="mq-set" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
