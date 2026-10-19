'use client';

import { useEffect, useRef, useState } from 'react';
import { copyEmail, toast } from '@/lib/client';

// "Copy email" with the check-mark swap (after Rauno Freiberg)
export function CopyEmailButton({ className = 'btn copy' }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button className={className + (copied ? ' copied' : '')} type="button"
      onClick={async () => { if (await copyEmail()) { setCopied(true); setTimeout(() => setCopied(false), 1800); } }}>
      <span className="idle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>Copy email</span>
      <span className="ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>Copied</span>
    </button>
  );
}

export function CopyEmailInline() {
  return <button className="link-btn" type="button" onClick={async () => { if (await copyEmail()) toast('Email copied'); }}>Copy</button>;
}

const NUM = /^([+≈~−-]?)([\d,]*\.?\d+)(%| ?MB)?$/;

/**
 * Counts a number up the first time it scrolls into view. Values that aren't a plain number
 * ("29/33", "p = 2×10⁻⁸", "Append-only") render as written.
 */
export function CountUp({ value, accent = false }: { value: string; accent?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const m = value.match(NUM);
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (!m || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const [, pre, raw, suf = ''] = m;
    const to = parseFloat(raw.replace(/,/g, '')), dec = (raw.split('.')[1] || '').length, commas = raw.includes(',');
    const fmt = (v: number) => pre + (commas ? Math.round(v).toLocaleString('en-US') : v.toFixed(dec)) + suf;
    const el = ref.current!;
    let raf = 0;
    const io = new IntersectionObserver(es => {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      let t0 = 0;
      const step = (t: number) => {
        if (!t0) t0 = t;
        const p = Math.min((t - t0) / 1400, 1);
        setShown(fmt(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      setShown(fmt(0));
      raf = requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (accent && m && m[3]) {
    const body = shown.slice(0, shown.length - m[3].length);
    return <span ref={ref}>{body}<i>{m[3]}</i></span>;
  }
  return <span ref={ref}>{shown}</span>;
}
