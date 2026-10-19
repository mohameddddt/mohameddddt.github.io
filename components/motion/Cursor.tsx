'use client';

import { useEffect, useRef } from 'react';
import { gsap, finePointer, reduced } from '@/lib/motion';

/*
 * A ring that trails the pointer: it swells over links and buttons, shows a word over anything with
 * data-cursor="…", and [data-magnetic] elements lean toward the pointer. Mouse only; the native cursor stays.
 */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!finePointer() || reduced()) return;
    const el = ring.current!;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' });
    let shown = false, mag: HTMLElement | null = null;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (!shown) { shown = true; gsap.set(el, { x: e.clientX, y: e.clientY }); el.classList.add('on'); }
      xTo(e.clientX); yTo(e.clientY);
      if (mag) {
        const r = mag.getBoundingClientRect(), s = parseFloat(mag.dataset.magnetic || '0.3') || 0.3;
        gsap.to(mag, { x: (e.clientX - r.left - r.width / 2) * s, y: (e.clientY - r.top - r.height / 2) * s, duration: 0.6, ease: 'power3' });
      }
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const tagged = t.closest<HTMLElement>('[data-cursor]');
      const word = tagged?.dataset.cursor || '';
      label.current!.textContent = word;
      el.classList.toggle('label', !!word);
      el.classList.toggle('hover', !word && !!t.closest('a, button, [role="option"], summary, label'));
      const m = t.closest<HTMLElement>('[data-magnetic]');
      if (m !== mag) {
        if (mag) gsap.to(mag, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.35)' });
        mag = m;
      }
    };
    const down = () => el.classList.add('down');
    const up = () => el.classList.remove('down');
    const leave = () => { shown = false; el.classList.remove('on'); };
    addEventListener('pointermove', move, { passive: true });
    addEventListener('pointerover', over, { passive: true });
    addEventListener('pointerdown', down); addEventListener('pointerup', up);
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      removeEventListener('pointermove', move); removeEventListener('pointerover', over);
      removeEventListener('pointerdown', down); removeEventListener('pointerup', up);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, []);

  return <div className="cursor" ref={ring} aria-hidden="true"><span ref={label} /></div>;
}
