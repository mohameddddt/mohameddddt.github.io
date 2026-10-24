'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { SECTIONS, EMAIL, GITHUB, LINKEDIN } from '@/lib/site';
import { openCommandMenu } from '@/lib/client';
import { gsap, reduced } from '@/lib/motion';
import ThemeToggle from './ThemeToggle';
import Clock from './Clock';
import { KbdMod } from './Effects';
import { SearchIcon } from './Marks';

export default function TopBar() {
  const path = usePathname();
  const home = path === '/';
  const barRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // progress line, hide while scrolling down, come back on the way up
  useEffect(() => {
    let raf = 0, lastY = scrollY;
    const on = () => {
      raf = 0;
      const bar = barRef.current; if (!bar) return;
      const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
      bar.style.setProperty('--p', max > 0 ? Math.min(1, y / max).toFixed(4) : '0');
      bar.classList.toggle('scrolled', y > 8);
      if (Math.abs(y - lastY) > 6) { bar.classList.toggle('away', y > lastY && y > innerHeight * 0.6); lastY = y; }
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

  // the full-screen menu (small screens)
  useEffect(() => {
    const m = menuRef.current; if (!m) return;
    document.documentElement.classList.toggle('locked', open);
    const links = m.querySelectorAll('.mm-link > span, .mm-foot > *');
    if (reduced()) { gsap.set(m, { autoAlpha: open ? 1 : 0 }); return; }
    if (open) {
      gsap.timeline()
        .set(m, { autoAlpha: 1 })
        .fromTo(m, { clipPath: 'circle(0% at 100% 0%)' }, { clipPath: 'circle(150% at 100% 0%)', duration: 0.9, ease: 'expo.inOut' })
        .fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05 }, 0.3);
    } else if (gsap.getProperty(m, 'autoAlpha')) {
      gsap.to(m, { clipPath: 'circle(0% at 100% 0%)', duration: 0.7, ease: 'expo.inOut', onComplete: () => { gsap.set(m, { autoAlpha: 0 }); } });
    }
  }, [open]);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    addEventListener('keydown', key);
    return () => removeEventListener('keydown', key);
  }, [open]);

  return (
    <>
      <header className="topbar" ref={barRef}>
        <div className="bar-in wrap-x">
          <Link className="brand" href="/" aria-label="Mohamed Sahnoune Toubal, home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/portrait.jpg" alt="" width={30} height={30} />
            <span>Mohamed S. Toubal</span>
          </Link>
          <p className="bar-clock" aria-label="Local time in Algiers"><span>Algiers</span><Clock /></p>
          <nav className="links" aria-label="Sections">
            {SECTIONS.map((s, i) => (
              <Link key={s.id} href={`/#${s.id}`} className={active === s.id ? 'active' : undefined} aria-current={active === s.id ? 'true' : undefined}>
                <i aria-hidden="true">0{i + 1}</i>{s.label}
              </Link>
            ))}
          </nav>
          <div className="bar-tools">
            <button className="cmdk-btn" type="button" onClick={openCommandMenu} aria-label="Open command menu">
              <SearchIcon /><span className="l-wide">Search</span><KbdMod />
            </button>
            <ThemeToggle />
            <button className={'menu-btn' + (open ? ' open' : '')} type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(o => !o)}>
              <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span><i /><i />
            </button>
          </div>
        </div>
        <div className="progress" aria-hidden="true" />
      </header>

      <div className="mmenu" id="mobile-menu" ref={menuRef} aria-hidden={!open} inert={!open}>
        {/* scrolls on its own below the bar; data-lenis-prevent so the paused Lenis doesn't eat the wheel */}
        <div className="mm-scroll" data-lenis-prevent>
          <nav aria-label="Sections">
            {SECTIONS.map((s, i) => (
              <Link key={s.id} className="mm-link" href={`/#${s.id}`} onClick={() => setOpen(false)}>
                <span><i>0{i + 1}</i>{s.label}</span>
              </Link>
            ))}
          </nav>
          <div className="mm-foot">
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <span><a href={GITHUB} target="_blank" rel="noopener">GitHub</a> · <a href={LINKEDIN} target="_blank" rel="noopener">LinkedIn</a></span>
          </div>
        </div>
      </div>
    </>
  );
}
