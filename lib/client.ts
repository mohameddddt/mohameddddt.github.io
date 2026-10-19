// Small browser-only helpers shared by client components. Components talk through window events,
// so the top bar, the command menu, the skills section and the project grid stay independent.

import { EMAIL } from './site';

export const toast = (msg: string) => dispatchEvent(new CustomEvent('toast', { detail: msg }));
export const openCommandMenu = () => dispatchEvent(new Event('open-cmdk'));
export const filterBySkill = (skill: string) => dispatchEvent(new CustomEvent('filter-skill', { detail: skill }));

export function setTheme(t: 'light' | 'dark', save: boolean) {
  const root = document.documentElement;
  root.setAttribute('data-theme', t);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'light' ? '#F7F6F2' : '#0B0D11');
  if (save) { try { localStorage.setItem('theme', t); } catch { /* private mode */ } }
  dispatchEvent(new Event('themechange'));
}
export const toggleTheme = () => setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light', true);

export async function copyEmail(): Promise<boolean> {
  try { await navigator.clipboard.writeText(EMAIL); return true; }
  catch { location.href = 'mailto:' + EMAIL; return false; }
}

export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(null, '', '#' + id);
  return true;
}
