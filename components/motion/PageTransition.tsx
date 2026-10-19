'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { gsap, ScrollTrigger, reduced, scrollToTarget } from '@/lib/motion';
import { BY_SLUG } from '@/lib/projects';
import { NAME } from '@/lib/site';

const titleFor = (path: string) => {
  const m = path.match(/^\/work\/([^/]+)/);
  return (m && BY_SLUG[m[1]]?.title) || NAME;
};

/*
 * Internal links run through a curtain: it rises over the page, the route changes underneath, then it lifts
 * away. Same-page hash links scroll smoothly instead. Back/forward and reduced motion use plain navigation.
 */
export default function PageTransition() {
  const router = useRouter();
  const path = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const pending = useRef<string | null>(null);
  const [label, setLabel] = useState('');

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a');
      if (!a || !a.href || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || /\.(pdf|png|jpe?g|webp|wav)$/i.test(url.pathname)) return;

      if (url.pathname === location.pathname && url.search === location.search) {
        e.preventDefault();
        const el = url.hash ? document.getElementById(decodeURIComponent(url.hash.slice(1))) : null;
        scrollToTarget(el ?? 0);
        history.replaceState(null, '', url.hash || location.pathname);
        return;
      }
      // only a route change gets the curtain (the effect below lifts it once the pathname changes)
      if (reduced() || pending.current || url.pathname === location.pathname) return;
      e.preventDefault();
      const href = url.pathname + url.search + url.hash;
      pending.current = href;
      setLabel(titleFor(url.pathname));
      const c = curtain.current!;
      gsap.timeline()
        .set(c, { display: 'flex', clipPath: 'inset(100% 0% 0% 0%)' })
        .to(c, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'expo.inOut' })
        .fromTo(c.querySelector('.ct-label > span'), { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: 'expo.out' }, '-=0.35')
        .call(() => router.push(href, { scroll: false }));
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router]);

  // the new route has rendered: put the scroll where it belongs, then lift the curtain
  useEffect(() => {
    const href = pending.current;
    if (!href) { ScrollTrigger.refresh(); return; }
    const hash = href.split('#')[1];
    requestAnimationFrame(() => {
      scrollToTarget(0, true);
      ScrollTrigger.refresh();
      const el = hash ? document.getElementById(hash) : null;
      if (el) scrollToTarget(el, true);
      const c = curtain.current!;
      gsap.timeline({ delay: 0.1, onComplete: () => { pending.current = null; gsap.set(c, { display: 'none' }); } })
        .to(c.querySelector('.ct-label > span'), { yPercent: -110, duration: 0.5, ease: 'expo.in' })
        .to(c, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'expo.inOut' }, '-=0.2');
    });
  }, [path]);

  return (
    <div className="curtain" ref={curtain} aria-hidden="true">
      <span className="ct-label"><span>{label}</span></span>
    </div>
  );
}
