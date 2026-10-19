'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap, ScrollTrigger, SplitText, EASE, reduced } from '@/lib/motion';

/*
 * Scroll-in motion for every page, set up from class names so server components can opt in:
 *   .reveal            rises in            .reveal.scale   rises and grows (covers, screenshots)
 *   .reveal.words      each word slides up out of its own mask (the <Words> heading)
 *   .reveal.stagger    children arrive one after another
 *   [data-parallax=N]  drifts N px against the scroll      [data-scrub]  words light up as you scroll
 * Elements also get `.in` when they arrive, for CSS that keys off it (bar charts, cover logos).
 * New elements (client-side navigation, filters) are picked up by a MutationObserver.
 */
const delayOf = (el: HTMLElement) => parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 0;

export default function Reveal() {
  const path = usePathname();
  useEffect(() => {
    const still = reduced();
    const seen = new WeakSet<Element>();
    const ctx = gsap.context(() => {});
    const once = (el: HTMLElement, play: () => void) =>
      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => { el.classList.add('in'); play(); } });

    const scan = () => {
      raf = 0;
      ctx.add(() => {
        document.querySelectorAll<HTMLElement>('.reveal').forEach(el => {
          if (seen.has(el)) return;
          seen.add(el);
          if (still) { el.classList.add('in'); return; }
          const d = delayOf(el);
          if (el.classList.contains('words')) {
            const w = el.querySelectorAll('.w > span');
            gsap.set(w, { yPercent: 115, y: 0, rotate: 5 });
            once(el, () => gsap.to(w, { yPercent: 0, rotate: 0, duration: 1.15, ease: EASE, stagger: 0.055, delay: d }));
          } else if (el.classList.contains('stagger')) {
            const kids = [...el.children];
            gsap.set(kids, { autoAlpha: 0, y: 26 });
            once(el, () => gsap.to(kids, { autoAlpha: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.055, delay: d }));
          } else if (el.classList.contains('scale')) {
            gsap.set(el, { autoAlpha: 0, y: 90, scale: 0.92 });
            once(el, () => gsap.to(el, { autoAlpha: 1, y: 0, scale: 1, duration: 1.5, ease: EASE, delay: d, clearProps: 'transform' }));
          } else {
            gsap.set(el, { autoAlpha: 0, y: 44 });
            once(el, () => gsap.to(el, { autoAlpha: 1, y: 0, duration: 1.2, ease: EASE, delay: d, clearProps: 'transform' }));
          }
        });
        if (still) return;
        document.querySelectorAll<HTMLElement>('[data-parallax]').forEach(el => {
          if (seen.has(el)) return;
          seen.add(el);
          const v = parseFloat(el.dataset.parallax || '60');
          gsap.fromTo(el, { y: -v / 2 }, { y: v / 2, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
        });
        document.querySelectorAll<HTMLElement>('[data-scrub]').forEach(el => {
          if (seen.has(el)) return;
          seen.add(el);
          const split = SplitText.create(el, { type: 'words', wordsClass: 'sw' });
          gsap.fromTo(split.words, { opacity: 0.16 }, {
            opacity: 1, ease: 'none', stagger: 0.1,
            scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 52%', scrub: true },
          });
        });
      });
    };

    let raf = 0;
    scan();
    const mo = new MutationObserver(() => { if (!raf) raf = requestAnimationFrame(scan); });
    mo.observe(document.body, { childList: true, subtree: true });
    // fonts and images change heights; recompute trigger positions once they settle
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    addEventListener('load', refresh);
    return () => { mo.disconnect(); cancelAnimationFrame(raf); removeEventListener('load', refresh); ctx.revert(); };
  }, [path]);
  return null;
}
