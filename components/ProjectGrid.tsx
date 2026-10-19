'use client';

import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CATS, PROJECTS, projectHref, type Cat, type Project } from '@/lib/projects';
import { USES } from '@/lib/skills';
import { toast } from '@/lib/client';
import SkillIcon from './SkillIcon';
import ProjectIcon from './ProjectIcon';
import { ArrowOut, ArrowRight, CloseIcon, GitHubMark, Lock, LockSolid } from './Marks';

type Filter = { cat: 'all' | Cat; skill: string | null };
const matches = (p: Project, f: Filter) => (f.cat === 'all' || p.cats.includes(f.cat)) && (!f.skill || p.stack.includes(f.skill));

function Card({ p, i, hidden }: { p: Project; i: number; hidden: boolean }) {
  const extra = p.stack.length - p.pills.length;
  return (
    <article className={'card reveal' + (p.featured ? ' feat' : '') + (p.site ? ' is-live' : '')} data-slug={p.slug} hidden={hidden}
      style={{ '--c': `var(--${p.color})`, '--d': `${(i % 3) * 0.07}s` } as React.CSSProperties}>
      <div className="card-main">
        <div className="card-top">
          <ProjectIcon name={p.icon} />
          <span className="card-meta">{p.year}<span>{p.area}</span></span>
          {p.site ? <span className="badge live"><span className="pulse" />Live website</span>
            : p.private ? <span className="badge priv"><Lock />Private</span> : null}
        </div>
        <h3><Link className="open" href={projectHref(p)}>{p.title}</Link></h3>
        <p className="sub">{p.sub}</p>
        <p className="blurb">{p.blurb}</p>
        <ul className="kpis">{p.kpis.slice(0, p.featured ? 3 : 2).map(([b, t]) => <li key={t}><b>{b}</b>{t}</li>)}</ul>
        <ul className="pills" aria-label="Main tools">
          {p.pills.map(s => <li key={s}><SkillIcon name={s} size={13} />{s}</li>)}
          {extra > 0 && <li className="more">+{extra}</li>}
        </ul>
        <div className="card-foot">
          <span className="details" aria-hidden="true">Read more <ArrowRight /></span>
          <span className="card-links">
            {p.site && <a className="live-link" href={p.site} target="_blank" rel="noopener">Visit site<ArrowOut /></a>}
            {p.repo && <a className="ic-link" href={p.repo} target="_blank" rel="noopener" aria-label={`${p.title} source code on GitHub`} title="Source on GitHub"><GitHubMark size={17} /></a>}
          </span>
        </div>
      </div>
      {p.featured && p.shots && (
        <div className="card-shot" aria-hidden="true">
          <div className="shot-bar"><span className="dots"><i /><i /><i /></span><span className="shot-url"><LockSolid />{p.siteLabel}</span></div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.shots[0].src} alt="" width={1200} height={750} loading="lazy" decoding="async" />
        </div>
      )}
    </article>
  );
}

/** filterable project grid: category × skill, with a FLIP reflow when the filter changes */
export default function ProjectGrid() {
  const [f, setF] = useState<Filter>({ cat: 'all', skill: null });
  const grid = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const ind = useRef<HTMLSpanElement>(null);
  const before = useRef<Map<Element, DOMRect> | null>(null);

  const update = (next: Filter) => {
    const m = new Map<Element, DOMRect>();
    grid.current?.querySelectorAll('.card:not([hidden])').forEach(c => m.set(c, c.getBoundingClientRect()));
    before.current = m;
    setF(next);
  };

  // a skill picked in the skills section, or ?skill= from a project page
  useEffect(() => {
    const on = (e: Event) => {
      const s = (e as CustomEvent<string>).detail;
      update({ cat: 'all', skill: s });
      const n = USES[s]?.length || 0;
      toast(`${n} project${n === 1 ? '' : 's'} built with ${s}`);
    };
    addEventListener('filter-skill', on);
    const q = new URLSearchParams(location.search).get('skill');
    if (q && USES[q]) setF({ cat: 'all', skill: q });
    return () => removeEventListener('filter-skill', on);
  }, []);

  useLayoutEffect(() => {
    // slide the pill under the active filter
    const b = bar.current?.querySelector<HTMLElement>('[aria-pressed="true"]'), i = ind.current;
    if (b && i) { i.style.width = b.offsetWidth + 'px'; i.style.transform = `translateX(${b.offsetLeft}px)`; }
    const first = before.current; before.current = null;
    if (!first || !grid.current) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    grid.current.querySelectorAll<HTMLElement>('.card:not([hidden])').forEach(c => {
      c.classList.add('in');
      if (reduce) return;
      const was = first.get(c), now = c.getBoundingClientRect();
      if (!was) c.animate([{ opacity: 0, transform: 'translateY(14px) scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 460, delay: 80, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
      else if (Math.abs(was.left - now.left) > 1 || Math.abs(was.top - now.top) > 1)
        c.animate([{ transform: `translate(${was.left - now.left}px,${was.top - now.top}px)` }, { transform: 'none' }], { duration: 560, easing: 'cubic-bezier(.2,.8,.2,1)' });
    });
  }, [f]);

  useEffect(() => {
    const place = () => {
      const b = bar.current?.querySelector<HTMLElement>('[aria-pressed="true"]'), i = ind.current;
      if (b && i) { i.style.width = b.offsetWidth + 'px'; i.style.transform = `translateX(${b.offsetLeft}px)`; }
    };
    addEventListener('resize', place); document.fonts?.ready.then(place);
    return () => removeEventListener('resize', place);
  }, []);

  // pointer-following glow and border light, plus a gentle tilt on the featured screenshot
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const c = (e.target as HTMLElement).closest<HTMLElement>('.card'); if (!c) return;
    const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    c.style.setProperty('--mx', x + 'px'); c.style.setProperty('--my', y + 'px');
    const s = c.querySelector<HTMLElement>('.card-shot');
    if (s) { s.style.setProperty('--ry', ((x / r.width - 0.5) * 6).toFixed(2) + 'deg'); s.style.setProperty('--rx', ((0.5 - y / r.height) * 4).toFixed(2) + 'deg'); }
  };

  const shown = PROJECTS.filter(p => matches(p, f)).length;
  return (
    <>
      <div className="ptools reveal">
        <div className="filters" role="group" aria-label="Filter projects" ref={bar}>
          <span className="f-ind" ref={ind} aria-hidden="true" />
          {CATS.map(c => (
            <button key={c.id} className="f" type="button" aria-pressed={f.cat === c.id} onClick={() => update({ ...f, cat: c.id })}>
              {c.id === 'live' && <span className="pulse" />}{c.label} <span className="c">{PROJECTS.filter(p => matches(p, { ...f, cat: c.id })).length}</span>
            </button>
          ))}
        </div>
        {f.skill && (
          <div className="skill-filter">
            <SkillIcon name={f.skill} size={15} />Using <b>{f.skill}</b>
            <button type="button" aria-label="Clear skill filter" onClick={() => update({ ...f, skill: null })}><CloseIcon /></button>
          </div>
        )}
      </div>
      <p className="sr-only" aria-live="polite">{shown} project{shown === 1 ? '' : 's'} shown{f.skill ? ' using ' + f.skill : ''}</p>
      <div className="pgrid" ref={grid} onPointerMove={onMove}>
        {/* every card stays mounted (hidden, not removed) so the FLIP step can measure where it was */}
        {PROJECTS.map((p, i) => <Card key={p.slug} p={p} i={i} hidden={!matches(p, f)} />)}
      </div>
    </>
  );
}
