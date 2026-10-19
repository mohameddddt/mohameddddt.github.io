import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BY_SLUG, PROJECTS, nextProject, projectHref, type Project } from '@/lib/projects';
import { USES, groupedStack } from '@/lib/skills';
import SkillIcon, { hasBrand } from '@/components/SkillIcon';
import ProjectIcon from '@/components/ProjectIcon';
import Playground from '@/components/Playground';
import AudioSamples from '@/components/AudioSamples';
import LogoOrbit from '@/components/LogoOrbit';
import Words from '@/components/Words';
import { CountUp } from '@/components/Bits';
import { ArrowLeft, ArrowOut, ArrowRight, GitHubMark, GlobeIcon, Lock, LockSolid } from '@/components/Marks';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() { return PROJECTS.map(p => ({ slug: p.slug })); }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = BY_SLUG[(await params).slug];
  if (!p) return {};
  return {
    title: `${p.title}: ${p.sub}`,
    description: p.blurb,
    alternates: { canonical: projectHref(p) },
    openGraph: { title: p.title, description: p.blurb, url: projectHref(p), ...(p.shots ? { images: [{ url: p.shots[0].src, width: 1200, height: 750 }] } : {}) },
  };
}

const Browser = ({ src, label, alt, lazy = true }: { src: string; label: string; alt: string; lazy?: boolean }) => (
  <div className="frame">
    <div className="shot-bar"><span className="dots"><i /><i /><i /></span><span className="shot-url"><LockSolid />{label}</span></div>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={src} alt={alt} width={1200} height={750} loading={lazy ? 'lazy' : 'eager'} decoding="async" />
  </div>
);

function CoverVisual({ p }: { p: Project }) {
  if (p.slug === 'drone-delivery') return <div className="cover-app"><Playground seed={11} label="drone-routing" /></div>;
  if (p.audio) return <div className="cover-app"><AudioSamples clips={p.audio} /></div>;
  if (p.shots) {
    return (
      <div className="shot-stack">
        <div className="parallax"><Browser src={p.shots[0].src} label={p.siteLabel || ''} alt={`${p.title}: ${p.shots[0].caption}`} lazy={false} /></div>
        {p.shots[2] && <div className="shot-back"><Browser src={p.shots[2].src} label={p.siteLabel || ''} alt="" lazy={false} /></div>}
      </div>
    );
  }
  return <LogoOrbit p={p} />;
}

function Links({ p }: { p: Project }) {
  return (
    <>
      {p.site && <a className="btn live" href={p.site} target="_blank" rel="noopener"><GlobeIcon />Visit the live site<ArrowOut className="arr" /></a>}
      {p.repo && <a className="btn" href={p.repo} target="_blank" rel="noopener"><GitHubMark size={16} />Source code<ArrowOut className="arr" /></a>}
      {p.links?.map(l => <a key={l.href} className="btn" href={l.href} target="_blank" rel="noopener">{l.label}<ArrowOut className="arr" /></a>)}
      {p.private && <span className="pp-private"><Lock />Private repository · write-up coming soon</span>}
    </>
  );
}

export default async function ProjectPage({ params }: Params) {
  const p = BY_SLUG[(await params).slug];
  if (!p) notFound();
  const next = nextProject(p);
  const logos = p.stack.filter(hasBrand).slice(0, 7);
  const groups = groupedStack(p);
  const tint = { '--c': `var(--${p.color})` } as CSSProperties;

  return (
    <main id="content" className="pp" style={tint}>
      <div className="wrap">
        <Link className="back reveal" href="/#projects"><ArrowLeft />All projects</Link>

        <header className="pp-head">
          <Words as="h1" text={p.title} className="pp-title" />
          <p className="pp-sub reveal" style={{ '--d': '.15s' } as CSSProperties}>{p.sub}</p>
        </header>

        {/* ---------- cover: the project at a glance, with something to look at or play with ---------- */}
        <section className={'pp-cover reveal scale' + (p.slug === 'drone-delivery' || p.audio ? ' interactive' : '')} aria-label={`${p.title} cover`}>
          <div className="cover-text">
            <div className="cover-badges">
              <ProjectIcon name={p.icon} className="ic-tile cover-ic" />
              {p.site && <span className="badge live"><span className="pulse" />Live website</span>}
              {p.private && <span className="badge priv"><Lock />Private</span>}
              <span className="badge priv">{p.year}</span>
            </div>
            <p className="cover-title">{p.title}</p>
            <p className="cover-tag">{p.headline}</p>
            <p className="cover-blurb">{p.blurb}</p>
            <ul className="cover-logos" aria-label="Main tools">
              {logos.map(s => <li key={s} title={s}><SkillIcon name={s} size={20} mono /></li>)}
            </ul>
          </div>
          <div className="cover-visual"><CoverVisual p={p} /></div>
        </section>

        {/* ---------- story + facts ---------- */}
        <section className="pp-intro">
          <div className="pp-story">
            <Words text={p.headline} className="pp-h2" />
            {p.overview.map((t, i) => <p key={i} className="reveal" dangerouslySetInnerHTML={{ __html: t }} />)}
            <h3 className="pp-k reveal">Highlights</h3>
            <ul className="pp-hl reveal stagger">
              {p.highlights.map((t, i) => <li key={i} style={{ '--i': i } as CSSProperties} dangerouslySetInnerHTML={{ __html: t }} />)}
            </ul>
          </div>
          <aside className="pp-meta reveal" style={{ '--d': '.1s' } as CSSProperties} aria-label="Project facts">
            <dl>
              <div><dt>Year</dt><dd>{p.year}</dd></div>
              <div><dt>Area</dt><dd>{p.area}</dd></div>
              {p.role && <div><dt>Role</dt><dd>{p.role}</dd></div>}
              <div><dt>Platform</dt><dd>{p.platform}</dd></div>
              <div><dt>Status</dt><dd>{p.site ? <span className="badge live"><span className="pulse" />Live website</span> : p.private ? 'Private repository' : 'Open source'}</dd></div>
              <div><dt>Built with</dt><dd className="mini-logos">{p.pills.map(s => <span key={s}><SkillIcon name={s} size={14} />{s}</span>)}</dd></div>
            </dl>
            <div className="pp-links"><Links p={p} /></div>
          </aside>
        </section>

        {/* ---------- the numbers ---------- */}
        <section className="pp-kpis reveal stagger" aria-label="Key numbers">
          {p.kpis.map(([b, t], i) => <div key={t} style={{ '--i': i } as CSSProperties}><b><CountUp value={b} /></b><span>{t}</span></div>)}
        </section>

        {/* ---------- screenshots ---------- */}
        {p.shots && (
          <section className="pp-gallery" aria-label="Screenshots">
            {p.shots.map((s, i) => (
              <figure key={s.src} className={'reveal scale' + (i === 0 ? ' wide' : '')} style={{ '--d': `${(i % 2) * 0.08}s` } as CSSProperties}>
                <div className="gallery-panel"><Browser src={s.src} label={p.siteLabel || ''} alt={`${p.title}: ${s.caption}`} /></div>
                <figcaption>{s.caption}</figcaption>
              </figure>
            ))}
          </section>
        )}

        {/* ---------- tech stack, with logos; each one links to every project that uses it ---------- */}
        <section className="pp-stack" aria-labelledby="h-stack">
          <p className="kicker reveal"><span>{p.stack.length}</span>tools</p>
          <Words id="h-stack" text="Built with" em="all of this." />
          <div className="pp-stack-grid">
            {groups.map(([g, l], gi) => (
              <div key={g} className="sg reveal" style={{ '--d': `${(gi % 3) * 0.06}s` } as CSSProperties}>
                <h4>{g}</h4>
                <div className="chips">
                  {l.map(s => (
                    <Link key={s} className="chip-s" href={`/?skill=${encodeURIComponent(s)}#projects`} title={`See every project built with ${s}`}>
                      <SkillIcon name={s} size={15} />{s}<span className="n">{USES[s].length}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="pp-hint reveal">The number is how many of my projects use it. Click one to see them all.</p>
        </section>

        {/* ---------- next ---------- */}
        <nav className="pp-next reveal" aria-label="Next project">
          <Link className="next-link" href={projectHref(next)} style={{ '--c': `var(--${next.color})` } as CSSProperties}>
            <span className="next-k">Next project</span>
            <span className="next-title">{next.title}<ArrowRight /></span>
            <span className="next-sub">{next.sub}</span>
            <ProjectIcon name={next.icon} className="ic-tile next-ic" />
          </Link>
        </nav>
      </div>
    </main>
  );
}
