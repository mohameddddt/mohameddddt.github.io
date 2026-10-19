'use client';

import { useEffect, useRef, useState } from 'react';
import { GROUPS, ALSO, USES, USED_SKILLS, TOP_SKILLS } from '@/lib/skills';
import { PROJECTS } from '@/lib/projects';
import { filterBySkill, scrollToId } from '@/lib/client';
import SkillIcon from './SkillIcon';
import { KbdMod } from './Effects';

type Tip = { skill: string; x: number; y: number } | null;

// everything the projects are built with, counted from their stacks; hover = where it's used, click = filter
export default function Skills() {
  const [tip, setTip] = useState<Tip>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [hoverable, setHoverable] = useState(false);
  useEffect(() => { setHoverable(matchMedia('(hover: hover) and (pointer: fine)').matches); }, []);
  useEffect(() => {
    if (!tip) return;
    const hide = () => setTip(null);
    addEventListener('scroll', hide, { passive: true });
    return () => removeEventListener('scroll', hide);
  }, [tip]);

  // keep the tooltip inside the viewport once its size is known
  useEffect(() => {
    const t = tipRef.current; if (!t || !tip) return;
    const w = t.offsetWidth, h = t.offsetHeight;
    let x = tip.x - w / 2, y = tip.y - h - 10;
    x = Math.max(8, Math.min(innerWidth - w - 8, x));
    if (y < 72) y = tip.y + 44;
    t.style.left = x + 'px'; t.style.top = y + 'px';
  }, [tip]);

  const show = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    setTip({ skill: el.dataset.skill!, x: r.left + r.width / 2, y: r.top });
  };
  const handlers = {
    onPointerOver: (e: React.PointerEvent) => { if (!hoverable) return; const el = (e.target as HTMLElement).closest<HTMLElement>('[data-skill]'); if (el) show(el); },
    onPointerOut: (e: React.PointerEvent) => { if ((e.target as HTMLElement).closest('[data-skill]')) setTip(null); },
    onFocus: (e: React.FocusEvent) => { const el = (e.target as HTMLElement).closest<HTMLElement>('[data-skill]'); if (el) show(el); },
    onBlur: () => setTip(null),
    onClick: (e: React.MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('[data-skill]'); if (!el) return;
      setTip(null); filterBySkill(el.dataset.skill!); scrollToId('projects');
    },
  };

  const max = USES[TOP_SKILLS[0]].length;
  const groupsUsed = GROUPS.filter(([, l]) => l.some(s => USES[s]));
  const top = new Set(TOP_SKILLS);
  const tipProjects = tip ? USES[tip.skill] || [] : [];

  return (
    <div {...handlers}>
      <div className="sk-top">
        <div className="sk-sum reveal">
          <div><b>{USED_SKILLS.length}</b><span>tools &amp; techniques</span></div>
          <div><b>{PROJECTS.length}</b><span>projects they come from</span></div>
          <div><b>{groupsUsed.length}</b><span>areas</span></div>
          <p>The number on each chip is how many projects use it. <span className="kbd-hint">Tip: type a skill into <KbdMod /> to find its projects.</span></p>
        </div>
        <figure className="bars reveal" style={{ '--d': '.06s' } as React.CSSProperties}>
          <figcaption><span>Most used</span><span>projects</span></figcaption>
          {TOP_SKILLS.map((s, i) => (
            <button key={s} className="bar-row" type="button" data-skill={s} aria-label={`${s}: ${USES[s].length} projects. Show them.`}
              style={{ '--w': (USES[s].length / max).toFixed(3), '--i': i } as React.CSSProperties}>
              <span className="bl"><SkillIcon name={s} size={15} />{s}</span>
              <span className="bt" aria-hidden="true"><span className="bf" /></span>
              <span className="bn" aria-hidden="true">{USES[s].length}</span>
            </button>
          ))}
        </figure>
      </div>

      <div className="sk-grid">
        {groupsUsed.map(([g, l], gi) => {
          const list = l.filter(s => USES[s]).sort((a, b) => USES[b].length - USES[a].length);
          return (
            <div key={g} className="sk-panel reveal" style={{ '--d': `${(gi % 3) * 0.07}s` } as React.CSSProperties}>
              <h3>{g}<span>{list.length}</span></h3>
              <div className="chips">
                {list.map(s => (
                  <button key={s} className={'sk' + (top.has(s) ? ' top' : '')} type="button" data-skill={s}
                    aria-label={`${s}, used in ${USES[s].length} project${USES[s].length > 1 ? 's' : ''}. Show them.`}>
                    <SkillIcon name={s} size={15} />{s}<span className="n" aria-hidden="true">{USES[s].length}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <p className="sk-also reveal">
        Also from coursework and everyday use:{' '}
        {ALSO.map((s, i) => <span key={s} className="also"><SkillIcon name={s} size={14} /><b>{s}</b>{i < ALSO.length - 1 ? ' ·' : ''} </span>)}
      </p>

      <div className={'tip' + (tip ? ' show' : '')} ref={tipRef} role="tooltip" aria-hidden={!tip}>
        {tip && <><b>{tip.skill}</b> · {tipProjects.length} project{tipProjects.length === 1 ? '' : 's'}<span>{tipProjects.map(p => p.title).join(' · ')}</span></>}
      </div>
    </div>
  );
}
