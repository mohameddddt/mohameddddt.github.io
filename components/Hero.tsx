'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, EASE, onIntro, reduced } from '@/lib/motion';
import { CopyEmailButton } from './Bits';
import { ArrowDown, DownloadIcon, GitHubMark, LinkedInMark, MailIcon } from './Marks';
import { CV, EMAIL, GITHUB, LINKEDIN } from '@/lib/site';

// a word split into characters, each in its own mask so it can rise into place
const Chars = ({ t }: { t: string }) => (
  <span className="wd">{[...t].map((c, i) => <span className="ch" key={i}>{c}</span>)}</span>
);

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (reduced()) return;
    const q = gsap.utils.selector(root);
    gsap.set(q('.ch'), { yPercent: 112, y: 0 }); // y: 0 drops the px offset GSAP would read from the CSS pre-state
    gsap.set(q('.rule'), { scaleX: 0 });
    gsap.set(q('.hero-in'), { autoAlpha: 0, y: 24 });
    const off = onIntro(() => {
      gsap.timeline()
        .to(q('.ch'), { yPercent: 0, duration: 1.4, ease: EASE, stagger: 0.035 })
        .to(q('.rule'), { scaleX: 1, duration: 1.6, ease: 'expo.inOut' }, 0.2)
        .to(q('.hero-in'), { autoAlpha: 1, y: 0, duration: 1.1, ease: EASE, stagger: 0.08 }, 0.45);
    });
    // as the hero leaves, the two lines of the name slide apart
    const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
    gsap.to(q('.nl-1'), { xPercent: -9, ease: 'none', scrollTrigger: st });
    gsap.to(q('.nl-2'), { xPercent: 12, ease: 'none', scrollTrigger: st });
    gsap.to(q('.hero-top, .hero-aside, .socials'), { y: -60, autoAlpha: 0, ease: 'none', scrollTrigger: { ...st, end: '60% top' } });
    return off;
  }, { scope: root });

  return (
    <section className="hero" id="intro" aria-label="Introduction" data-field="hero" ref={root}>
      <div className="hero-top wrap-x">
        <div className="id hero-in">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="avatar" src="/assets/portrait.jpg" alt="Portrait of Mohamed Sahnoune Toubal" width={56} height={56} />
          <span className="status"><span className="pulse" />Open to internships</span>
        </div>
        <p className="role hero-in">AI Engineer <span>·</span> ENSIA ’28 <span>·</span> Algiers</p>
      </div>

      <div className="hero-mid wrap-x">
        <div className="hero-aside">
          <p className="tag hero-in">I build machine-learning systems <em>end to end</em> — from PyTorch training runs to inference on a phone.</p>
          <div className="cta hero-in">
            <a className="btn primary" href="#projects" data-magnetic="0.25">See the projects<ArrowDown className="arr dn" /></a>
            <a className="btn" href={CV} download data-magnetic="0.25"><DownloadIcon />Download CV</a>
            <CopyEmailButton />
          </div>
        </div>
      </div>

      <div className="hero-bottom wrap-x">
        <h1 className="name" aria-label="Mohamed Sahnoune Toubal">
          <span className="nl nl-1" aria-hidden="true"><Chars t="Mohamed" /><span className="rule" /><Chars t="Sahnoune" /></span>
          <span className="nl nl-2" aria-hidden="true"><Chars t="Toubal" /></span>
        </h1>
        <ul className="socials hero-in">
          <li><a className="icon-btn" href={GITHUB} target="_blank" rel="noopener" aria-label="GitHub" data-magnetic="0.4"><GitHubMark size={19} /></a></li>
          <li><a className="icon-btn" href={LINKEDIN} target="_blank" rel="noopener" aria-label="LinkedIn" data-magnetic="0.4"><LinkedInMark size={19} /></a></li>
          <li><a className="icon-btn" href={`mailto:${EMAIL}`} aria-label="Email" data-magnetic="0.4"><MailIcon /></a></li>
        </ul>
      </div>
    </section>
  );
}
