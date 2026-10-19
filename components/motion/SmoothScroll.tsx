'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, reduced, setLenis } from '@/lib/motion';

// Lenis inertia scrolling, driven by GSAP's ticker so ScrollTrigger and the scroll stay on the same frame
export default function SmoothScroll() {
  useEffect(() => {
    if (reduced()) return;
    const lenis = new Lenis({ lerp: 0.095, wheelMultiplier: 1, autoRaf: false, anchors: false });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // a modal (command menu, mobile menu) freezes the page underneath
    const sync = () => { if (document.documentElement.classList.contains('locked')) lenis.stop(); else lenis.start(); };
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    sync();
    return () => { mo.disconnect(); gsap.ticker.remove(tick); lenis.destroy(); setLenis(null); };
  }, []);
  return null;
}
