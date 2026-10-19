'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { SECTIONS } from '@/lib/site';
import { openCommandMenu } from '@/lib/client';
import ThemeToggle from './ThemeToggle';
import { KbdMod } from './Effects';
import { SearchIcon } from './Marks';

export default function TopBar() {
  const path = usePathname();
  const home = path === '/';
  const barRef = useRef<HTMLElement>(null);
  const indRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [active, setActive] = useState<string | null>(null);

  // scroll progress line, bottom border once scrolled
  useEffect(() => {
    let raf = 0;
    const on = () => {
      raf = 0;
      const bar = barRef.current; if (!bar) return;
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.setProperty('--p', max > 0 ? Math.min(1, scrollY / max).toFixed(4) : '0');
      bar.classList.toggle('scrolled', scrollY > 8);
    };
    const req = () => { if (!raf) raf = requestAnimationFrame(on); };
    addEventListener('scroll', req, { passive: true }); addEventListener('resize', req);
    on();
    return () => { removeEventListener('scroll', req); removeEventListener('resize', req); cancelAnimationFrame(raf); };
  }, [path]);

  // scroll-spy on the home page
  useEffect(() => {
    if (!home) { setActive(null); return; }
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) setActive(e.target.id === 'intro' ? null : e.target.id);
    }), { rootMargin: '-40% 0px -55% 0px' });
    ['intro', ...SECTIONS.map(s => s.id)].forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [home]);

  // the pill that slides under the active link
  useLayoutEffect(() => {
    const ind = indRef.current; if (!ind) return;
    const place = () => {
      const a = active ? linkRefs.current[active] : null;
      if (!a) { ind.style.opacity = '0'; return; }
      ind.style.opacity = '1'; ind.style.width = a.offsetWidth + 'px'; ind.style.transform = `translateX(${a.offsetLeft}px)`;
    };
    place();
    addEventListener('resize', place);
    document.fonts?.ready.then(place);
    return () => removeEventListener('resize', place);
  }, [active]);

  return (
    <header className="topbar" ref={barRef}>
      <div className="wrap bar-in">
        <Link className="brand" href="/" aria-label="Mohamed Sahnoune Toubal, home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/portrait.jpg" alt="" width={30} height={30} />
          <span>Mohamed S. Toubal</span>
        </Link>
        <nav className="links" aria-label="Sections">
          <span className="ind" ref={indRef} aria-hidden="true" />
          {SECTIONS.map(s => (
            <Link key={s.id} href={`/#${s.id}`} ref={el => { linkRefs.current[s.id] = el; }}
              className={active === s.id ? 'active' : undefined} aria-current={active === s.id ? 'true' : undefined}>
              {s.label}
            </Link>
          ))}
        </nav>
        <div className="bar-tools">
          <button className="cmdk-btn" type="button" onClick={openCommandMenu} aria-label="Open command menu">
            <SearchIcon /><span className="l-wide">Search</span><span className="l-narrow">Menu</span><KbdMod />
          </button>
          <ThemeToggle />
        </div>
      </div>
      <div className="progress" aria-hidden="true" />
    </header>
  );
}
