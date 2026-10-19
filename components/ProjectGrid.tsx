'use client';

import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CATS, PROJECTS, projectHref, type Cat, type Project } from '@/lib/projects';
import { USES } from '@/lib/skills';
import { toast } from '@/lib/client';
import { gsap, Flip, ScrollTrigger, finePointer, reduced } from '@/lib/motion';
import SkillIcon from './SkillIcon';
import ProjectIcon from './ProjectIcon';
import { ArrowOut, ArrowRight, CloseIcon, GitHubMark, Lock } from './Marks';

type Filter = { cat: 'all' | Cat; skill: string | null };
const matches = (p: Project, f: Filter) => (f.cat === 'all' || p.cats.includes(f.cat)) && (!f.skill || p.stack.includes(f.skill));

function Row({ p, i, hidden, onShow }: { p: Project; i: number; hidden: boolean; onShow: (i: number | null) => void }) {
  const extra = p.stack.length - p.pills.length;
  return (
    <article className={'row reveal' + (p.featured ? ' feat' : '') + (p.site ? ' is-live' : '')} data-slug={p.slug} hidden={hidden}
      data-cursor="View" style={{ '--c': `var(--${p.color})` } as React.CSSProperties}>
      <span className="row-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
      <div className="row-main" onPointerEnter={e => { if (e.pointerType === 'mouse') onShow(i); }} onPointerLeave={() => onShow(null)}>
        <div className="row-meta">
          <ProjectIcon name={p.icon} />
          <span className="card-meta">{p.year}<span>{p.area}</span></span>
          {p.site ? <span className="badge live"><span className="pulse" />Live website</span>
            : p.private ? <span className="badge priv"><Lock />Private</span> : null}
        </div>
        <h3><Link className="open" href={projectHref(p)}>{p.title}</Link></h3>
        <p className="sub">{p.sub}</p>
      </div>
      <div className="row-body">
        <p className="blurb">{p.blurb}</p>
        <ul className="kpis">{p.kpis.slice(0, p.featured ? 3 : 2).map(([b, t]) => <li key={t}><b>{b}</b>{t}</li>)}</ul>
        <ul className="pills" aria-label="Main tools">
          {p.pills.map(s => <li key={s}><SkillIcon name={s} size={13} />{s}</li>)}
          {extra > 0 && <li className="more">+{extra}</li>}
        </ul>
        <div className="card-foot">
          <span className="details" aria-hidden="true">Read more <ArrowRight /></span>
          <span className="card-links">
            {p.site && <a className="live-link" href={p.site} target="_blank" rel="noopener" data-cursor="">Visit site<ArrowOut /></a>}
            {p.repo && <a className="ic-link" href={p.repo} target="_blank" rel="noopener" data-cursor="" aria-label={`${p.title} source code on GitHub`} title="Source on GitHub"><GitHubMark size={17} /></a>}
          </span>
        </div>
      </div>
      {p.featured && p.shots && (
        <div className="row-shot" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.shots[0].src} alt="" width={1200} height={750} loading="lazy" decoding="async" />
        </div>
      )}
    </article>
  );
}

/** a window that follows the cursor over the project titles; its reel slides to the hovered project */
function Preview({ index }: { index: number | null }) {
  const box = useRef<HTMLDivElement>(null);
  const reel = useRef<HTMLDivElement>(null);
  const last = useRef(0);
  useEffect(() => {
    if (!finePointer() || reduced()) return;
    const el = box.current!;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3' }), yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3' });
    const move = (e: PointerEvent) => { xTo(e.clientX); yTo(e.clientY); };
    addEventListener('pointermove', move, { passive: true });
    return () => removeEventListener('pointermove', move);
  }, []);
  useEffect(() => {
    if (!finePointer() || reduced()) return;
    const el = box.current!;
    if (index === null) { gsap.to(el, { scale: 0, autoAlpha: 0, duration: 0.45, ease: 'power3.in' }); return; }
    gsap.to(el, { scale: 1, autoAlpha: 1, duration: 0.6, ease: 'expo.out' });
    gsap.to(reel.current, { yPercent: -100 * index, duration: last.current === index ? 0 : 0.8, ease: 'expo.inOut' });
    last.current = index;
  }, [index]);
  return (
    <div className="preview" ref={box} aria-hidden="true">
      <div className="pv-reel" ref={reel}>
        {PROJECTS.map(p => (
          <div className="pv-panel" key={p.slug} style={{ '--c': `var(--${p.color})` } as React.CSSProperties}>
            {p.shots
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={p.shots[0].src} alt="" loading="lazy" decoding="async" />
              : <><ProjectIcon name={p.icon} className="ic-tile big" /><p>{p.headline}</p></>}
          </div>
        ))}
      </div>
    </div>
  );
}

/** filterable project index: category × skill, rows slide to their new places with GSAP Flip */
export default function ProjectGrid() {
  const [f, setF] = useState<Filter>({ cat: 'all', skill: null });
  const [hover, setHover] = useState<number | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const ind = useRef<HTMLSpanElement>(null);
  const flip = useRef<Flip.FlipState | null>(null);

  const update = (next: Filter) => {
    if (grid.current && !reduced()) flip.current = Flip.getState(grid.current.querySelectorAll('.row'));
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

  const placeInd = () => {
    const b = bar.current?.querySelector<HTMLElement>('[aria-pressed="true"]'), i = ind.current;
    if (b && i) { i.style.width = b.offsetWidth + 'px'; i.style.transform = `translateX(${b.offsetLeft}px)`; }
  };

  useLayoutEffect(() => {
    placeInd();
    const rows = grid.current?.querySelectorAll<HTMLElement>('.row:not([hidden])');
    const state = flip.current; flip.current = null;
    if (!state || !rows) return;
    gsap.set(rows, { autoAlpha: 1, y: 0 }); // rows that were waiting below the fold are shown now
    rows.forEach(r => r.classList.add('in'));
    Flip.from(state, {
      duration: 0.8, ease: 'expo.inOut', prune: true,
      onEnter: els => gsap.fromTo(els, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.7, delay: 0.2, ease: 'expo.out', stagger: 0.05 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, [f]);

  useEffect(() => {
    addEventListener('resize', placeInd); document.fonts?.ready.then(placeInd);
    return () => removeEventListener('resize', placeInd);
  }, []);

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
      <div className="plist" ref={grid}>
        {/* every row stays mounted (hidden, not removed) so Flip can measure where it was */}
        {PROJECTS.map((p, i) => <Row key={p.slug} p={p} i={i} hidden={!matches(p, f)} onShow={setHover} />)}
      </div>
      <Preview index={hover} />
    </>
  );
}
