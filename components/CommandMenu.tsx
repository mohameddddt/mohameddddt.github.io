'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Hash, ArrowUpRight, LayoutGrid, Globe, Copy, SunMoon, FileDown, Mail, User, Code2, type LucideIcon } from 'lucide-react';
import { PROJECTS, projectHref } from '@/lib/projects';
import { SECTIONS, CV, EMAIL, GITHUB, LINKEDIN } from '@/lib/site';
import { copyEmail, scrollToId, toast, toggleTheme } from '@/lib/client';

type Cmd = { g: string; t: string; k: string; I: LucideIcon; h?: string; live?: boolean; run: () => void };

// ⌘K menu (after Paco Coursey): sections, every project page, each project's stack, and a few actions
export default function CommandMenu() {
  const router = useRouter();
  const path = usePathname();
  const dlg = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);

  const cmds = useMemo<Cmd[]>(() => {
    const go = (id: string) => () => { if (path === '/' && scrollToId(id)) return; router.push('/#' + id); };
    const open = (href: string) => () => window.open(href, '_blank', 'noopener');
    return [
      ...SECTIONS.map(s => ({ g: 'Go to', t: s.label, k: '', I: Hash, run: go(s.id) })),
      ...PROJECTS.filter(p => p.site).map(p => ({ g: 'Projects', t: `${p.title} — visit the live site`, k: 'website demo live ' + p.siteLabel, I: Globe, h: 'live', live: true, run: open(p.site!) })),
      ...PROJECTS.map(p => ({ g: 'Projects', t: p.title, k: `${p.sub} ${p.area} ${p.stack.join(' ')}`, I: LayoutGrid, h: 'page', run: () => router.push(projectHref(p)) })),
      { g: 'Actions', t: 'Copy email address', k: 'contact', I: Copy, run: async () => { if (await copyEmail()) toast('Email copied'); } },
      { g: 'Actions', t: 'Toggle light / dark theme', k: 'mode dark light', I: SunMoon, run: toggleTheme },
      { g: 'Actions', t: 'Download CV', k: 'resume pdf', I: FileDown, h: 'pdf', run: () => { const a = document.createElement('a'); a.href = CV; a.download = ''; document.body.appendChild(a); a.click(); a.remove(); } },
      { g: 'Elsewhere', t: 'GitHub', k: 'code profile', I: Code2, run: open(GITHUB) },
      { g: 'Elsewhere', t: 'LinkedIn', k: 'profile', I: User, run: open(LINKEDIN) },
      { g: 'Elsewhere', t: 'Send an email', k: 'mail contact', I: Mail, run: () => { location.href = 'mailto:' + EMAIL; } },
    ];
  }, [path, router]);

  const view = useMemo(() => {
    const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return cmds.filter(c => { const hay = `${c.t} ${c.k} ${c.g}`.toLowerCase(); return terms.every(t => hay.includes(t)); });
  }, [cmds, q]);
  const act = Math.min(active, Math.max(0, view.length - 1));

  useEffect(() => {
    const openMenu = () => {
      const d = dlg.current; if (!d || d.open) return;
      setQ(''); setActive(0); d.showModal(); input.current?.focus();
      document.documentElement.classList.add('locked');
    };
    const closed = () => document.documentElement.classList.remove('locked');
    dlg.current?.addEventListener('close', closed);
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (dlg.current?.open) dlg.current.close(); else openMenu(); return; }
      const t = document.activeElement as HTMLElement | null;
      if (e.key === '/' && !dlg.current?.open && !/INPUT|TEXTAREA|SELECT/.test(t?.tagName || '') && !t?.isContentEditable) { e.preventDefault(); openMenu(); }
    };
    addEventListener('open-cmdk', openMenu); addEventListener('keydown', key);
    const d = dlg.current;
    return () => { removeEventListener('open-cmdk', openMenu); removeEventListener('keydown', key); d?.removeEventListener('close', closed); };
  }, []);

  useEffect(() => { list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' }); }, [act]);

  const run = (n: number) => { const c = view[n]; if (!c) return; dlg.current?.close(); c.run(); };
  const onKey = (e: React.KeyboardEvent) => {
    const move = (n: number) => { e.preventDefault(); if (view.length) setActive((n + view.length) % view.length); };
    if (e.key === 'ArrowDown') move(act + 1);
    else if (e.key === 'ArrowUp') move(act - 1);
    else if (e.key === 'Home') move(0);
    else if (e.key === 'End') move(view.length - 1);
    else if (e.key === 'Enter') { e.preventDefault(); run(act); }
  };

  let group = '';
  return (
    <dialog className="cmdk" ref={dlg} aria-label="Command menu" data-lenis-prevent onClick={e => { if (e.target === dlg.current) dlg.current?.close(); }}>
      <div className="cmdk-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <input ref={input} value={q} onChange={e => { setQ(e.target.value); setActive(0); }} onKeyDown={onKey}
          placeholder="Search projects, skills, sections…" autoComplete="off" spellCheck={false}
          role="combobox" aria-expanded="true" aria-controls="cmdkList" aria-autocomplete="list" aria-label="Search commands"
          aria-activedescendant={view.length ? `cmd-${act}` : undefined} />
        <kbd>Esc</kbd>
      </div>
      <ul className="cmdk-list" id="cmdkList" role="listbox" aria-label="Commands" ref={list}>
        {view.length === 0 && <li className="cmdk-empty" role="presentation">No results for “{q}”</li>}
        {view.flatMap((c, n) => {
          const out = [];
          if (c.g !== group) { group = c.g; out.push(<li key={'g-' + c.g} className="cmdk-group" role="presentation">{c.g}</li>); }
          out.push(
            <li key={c.g + c.t} id={`cmd-${n}`} className="cmdk-item" role="option" aria-selected={n === act}
              onClick={() => run(n)} onPointerMove={() => { if (n !== act) setActive(n); }}>
              <c.I size={16} strokeWidth={2} aria-hidden="true" /><span className="t">{c.t}</span>{c.h && <span className={'h' + (c.live ? ' live' : '')}>{c.h}</span>}
            </li>,
          );
          return out;
        })}
      </ul>
      <div className="cmdk-foot"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>↵</kbd> open</span><span><kbd>Esc</kbd> close</span></div>
    </dialog>
  );
}
