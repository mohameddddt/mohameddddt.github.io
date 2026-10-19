// GSAP set-up shared by every animated component: plugins are registered once, the Lenis instance lives here so
// any component can scroll with it, and the hero waits on `onIntro` until the preloader has lifted.

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import type Lenis from 'lenis';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

export { gsap, ScrollTrigger, SplitText, Flip };

export const EASE = 'expo.out';
export const reduced = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = () => typeof window !== 'undefined' && matchMedia('(hover: hover) and (pointer: fine)').matches;

let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => { lenis = l; };
export const getLenis = () => lenis;

/**
 * Smooth-scroll to an element or y offset (Lenis when it runs, the browser otherwise). A menu that is still
 * closing keeps Lenis stopped, and restarting it cancels any scroll in flight, so wait for the restart first.
 */
export function scrollToTarget(target: HTMLElement | number, immediate = false) {
  if (lenis) {
    const l = lenis;
    const go = () => l.scrollTo(target, { offset: typeof target === 'number' ? 0 : -72, immediate, duration: 1.4, force: true });
    if (!l.isStopped) { go(); return; }
    let frames = 0;
    const wait = () => { if (!l.isStopped || ++frames > 45) go(); else requestAnimationFrame(wait); };
    requestAnimationFrame(wait);
    return;
  }
  const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + scrollY - 72;
  scrollTo({ top, behavior: immediate || reduced() ? 'auto' : 'smooth' });
}

// the hero plays its entrance once the preloader is gone (or straight away when there isn't one)
let introDone = false;
export function markIntroDone() {
  if (introDone) return;
  introDone = true;
  dispatchEvent(new Event('intro-done'));
}
export function onIntro(cb: () => void) {
  if (introDone) { cb(); return () => {}; }
  const on = () => cb();
  addEventListener('intro-done', on, { once: true });
  return () => removeEventListener('intro-done', on);
}
