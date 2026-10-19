'use client';

import { useEffect, useState } from 'react';
import { scrollToTarget } from '@/lib/motion';

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
    const on = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; setShow(scrollY > innerHeight * 1.2 && scrollY + innerHeight < document.documentElement.scrollHeight - 260); }); };
    addEventListener('scroll', on, { passive: true }); on();
    return () => removeEventListener('scroll', on);
  }, []);
  return (
    <a className={'totop' + (show ? ' show' : '')} href="#top" aria-label="Back to top" tabIndex={show ? 0 : -1} data-magnetic="0.4"
      onClick={e => { e.preventDefault(); scrollToTarget(0); }}>
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
