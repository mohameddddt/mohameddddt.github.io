'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, getLenis, markIntroDone } from '@/lib/motion';
import { NAME } from '@/lib/site';

/*
 * First visit of the session: a 000 → 100 counter, then the panel lifts off the page and the hero plays.
 * The inline script in layout.tsx adds `no-intro` (repeat visit or reduced motion) before first paint,
 * so the panel never flashes when it isn't going to run.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (html.classList.contains('no-intro')) { setGone(true); markIntroDone(); return; }
    try { sessionStorage.setItem('intro', '1'); } catch { /* private mode */ }
    html.classList.add('locked');
    const count = { v: 0 };
    const tl = gsap.timeline({ onComplete: () => setGone(true) });
    tl.from('.pl-line > span', { yPercent: 110, duration: 0.9, ease: 'expo.out', stagger: 0.08 })
      .to(count, {
        v: 100, duration: 1.7, ease: 'power3.inOut',
        onUpdate: () => { if (num.current) num.current.textContent = String(Math.round(count.v)).padStart(3, '0'); },
      }, 0.1)
      .fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, duration: 1.7, ease: 'power3.inOut' }, 0.1)
      .to('.pl-line > span, .pl-num', { yPercent: -110, duration: 0.6, ease: 'expo.in', stagger: 0.04 }, '+=0.1')
      .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'expo.inOut' }, '-=0.15')
      .call(() => { html.classList.remove('locked'); getLenis()?.start(); markIntroDone(); }, [], '-=0.6');
    return () => { tl.kill(); html.classList.remove('locked'); };
  }, []);

  if (gone) return null;
  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="pl-top">
        <span className="pl-line"><span>{NAME}</span></span>
        <span className="pl-line"><span>AI Engineer · ENSIA ’28 · Algiers</span></span>
      </div>
      <div className="pl-bottom">
        <span className="pl-bar"><span ref={bar} /></span>
        <span className="pl-num-wrap"><span className="pl-num" ref={num}>000</span></span>
      </div>
    </div>
  );
}
