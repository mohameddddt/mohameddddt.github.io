'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Scroll-in loading: every `.reveal` element starts hidden and animates in the first time it scrolls into view
 * (variants in globals.css: plain rise, `.scale` for covers and screenshots, `.words` for headings,
 * `.stagger` for lists). Rescans after client-side navigation and when new content mounts.
 */
export function RevealObserver() {
  const path = usePathname();
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    let raf = 0;
    const scan = () => { raf = 0; document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el)); };
    scan();
    const mo = new MutationObserver(() => { if (!raf) raf = requestAnimationFrame(scan); });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); cancelAnimationFrame(raf); };
  }, [path]);
  return null;
}

/** cursor spotlight (after Brittany Chiang) */
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0, x = 0, y = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      if (!raf) raf = requestAnimationFrame(() => { ref.current?.style.setProperty('--x', x + 'px'); ref.current?.style.setProperty('--y', y + 'px'); raf = 0; });
    };
    addEventListener('pointermove', move, { passive: true });
    return () => removeEventListener('pointermove', move);
  }, []);
  return <div className="spotlight" ref={ref} aria-hidden="true" />;
}

export function Toaster() {
  const [msg, setMsg] = useState('');
  const [show, setShow] = useState(false);
  useEffect(() => {
    let t = 0;
    const on = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail); setShow(true);
      clearTimeout(t); t = window.setTimeout(() => setShow(false), 2200);
    };
    addEventListener('toast', on);
    return () => { removeEventListener('toast', on); clearTimeout(t); };
  }, []);
  return (
    <div className={'toast' + (show ? ' show' : '')} role="status" aria-live="polite">
      {msg && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>}
      {msg}
    </div>
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let raf = 0;
    const on = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; setShow(scrollY > innerHeight * 1.2); }); };
    addEventListener('scroll', on, { passive: true }); on();
    return () => removeEventListener('scroll', on);
  }, []);
  return (
    <a className={'totop' + (show ? ' show' : '')} href="#top" aria-label="Back to top" tabIndex={show ? 0 : -1}
      onClick={e => { e.preventDefault(); scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
    </a>
  );
}

/** ⌘K on Apple devices, Ctrl K elsewhere (decided after hydration so the server HTML matches) */
export function KbdMod({ className = '' }: { className?: string }) {
  const [mac, setMac] = useState(false);
  useEffect(() => { setMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)); }, []);
  return <kbd className={className}>{mac ? '⌘K' : 'Ctrl K'}</kbd>;
}
