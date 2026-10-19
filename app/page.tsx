import Link from 'next/link';
import ProjectGrid from '@/components/ProjectGrid';
import Playground from '@/components/Playground';
import Skills from '@/components/Skills';
import Words from '@/components/Words';
import { CountUp, CopyEmailButton } from '@/components/Bits';
import { KbdMod } from '@/components/Effects';
import { ArrowDown, ArrowOut, DownloadIcon, GitHubMark, LinkedInMark, MailIcon } from '@/components/Marks';
import { projectHref } from '@/lib/projects';
import { CV, EMAIL, GITHUB, LINKEDIN, PHONE } from '@/lib/site';

const STATS = [
  { v: '98%', t: 'ROC-AUC on live ransomware threats', src: 'Ransomware', slug: 'ransomware' },
  { v: '74.2%', t: 'emotion accuracy on unseen speakers', src: 'Speech · SER', slug: 'speech-emotion' },
  { v: '+481', t: 'FPL points over the baseline in a season', src: 'FPL Assistant', slug: 'fpl-assistant' },
  { v: '624', t: 'tests behind the drone-routing solvers', src: 'Drone routing', slug: 'drone-delivery' },
];

const Kicker = ({ n, label }: { n: string; label: string }) => <p className="kicker reveal"><span>{n}</span>{label}</p>;

export default function Home() {
  return (
    <main id="content">
      {/* ================= HERO ================= */}
      <section className="hero" id="intro" aria-label="Introduction">
        <div className="wrap hero-grid">
          <div>
            <div className="id hero-in" style={{ '--i': 0 } as React.CSSProperties}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="avatar" src="/assets/portrait.jpg" alt="Portrait of Mohamed Sahnoune Toubal" width={68} height={68} />
              <span className="status"><span className="pulse" />Open to internships</span>
            </div>
            <h1 className="name">
              {['Mohamed', 'Sahnoune', 'Toubal'].map((w, i) => <span key={w}><span className="w"><span style={{ '--i': i + 1 } as React.CSSProperties}>{w}</span></span>{i < 2 ? ' ' : ''}</span>)}
            </h1>
            <p className="role hero-in" style={{ '--i': 4 } as React.CSSProperties}>AI Engineer <span>·</span> ENSIA ’28 <span>·</span> Algiers</p>
            <p className="tag hero-in" style={{ '--i': 5 } as React.CSSProperties}>I build machine-learning systems <em>end to end</em> — from PyTorch training runs to inference on a phone.</p>
            <div className="cta hero-in" style={{ '--i': 6 } as React.CSSProperties}>
              <a className="btn primary" href="#projects">See the projects<ArrowDown className="arr dn" /></a>
              <a className="btn" href={CV} download><DownloadIcon />Download CV</a>
              <CopyEmailButton />
            </div>
            <ul className="socials hero-in" style={{ '--i': 7 } as React.CSSProperties}>
              <li><a className="icon-btn" href={GITHUB} target="_blank" rel="noopener" aria-label="GitHub"><GitHubMark size={19} /></a></li>
              <li><a className="icon-btn" href={LINKEDIN} target="_blank" rel="noopener" aria-label="LinkedIn"><LinkedInMark size={19} /></a></li>
              <li><a className="icon-btn" href={`mailto:${EMAIL}`} aria-label="Email"><MailIcon /></a></li>
            </ul>
          </div>

          <div className="hero-stats hero-in" style={{ '--i': 5 } as React.CSSProperties}>
            <div className="hs-head"><span>By the numbers</span><span>tap one to open</span></div>
            <div className="stats">
              {STATS.map(s => (
                <Link key={s.slug} className="stat" href={projectHref(s.slug)}>
                  <span className="n"><CountUp value={s.v} accent /></span>
                  <span className="t">{s.t}</span>
                  <span className="src">{s.src}<ArrowOut /></span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 01 ABOUT (text-first, after Lee Robinson) ================= */}
      <section className="sec" id="about" aria-labelledby="h-about">
        <div className="wrap">
          <header className="sec-head"><Kicker n="01" label="About" /><Words id="h-about" text="Models that leave the" em="notebook." /></header>
          <div className="about-grid">
            <div className="prose reveal">
              <p>I’m a fourth-year AI engineering student at <b>ENSIA</b>, the National Higher School of Artificial Intelligence in Algiers. What I enjoy most is the whole path a model takes: shaping the dataset, training it, then shipping it somewhere real — a Flask API, a Flutter app, or a phone with no signal.</p>
              <p>Most of my work starts with a baseline I have to beat. My <Link href={projectHref('fpl-assistant')}>FPL model</Link> is measured against “average of the last five games”, my <Link href={projectHref('speech-emotion')}>speech-emotion model</Link> against human listeners, and my <Link href={projectHref('drone-delivery')}>drone solvers</Link> against proven optima. I hold out whole seasons, unseen speakers and published benchmarks so the numbers mean something.</p>
              <p>Outside coursework I build tools I actually use: an Android music player, a desktop streamer, and an offline-first stock app for small shops. <span className="kbd-hint">Press <KbdMod /> to jump anywhere.</span></p>
            </div>
            <dl className="glance reveal stagger" style={{ '--d': '.08s' } as React.CSSProperties}>
              <div style={{ '--i': 0 } as React.CSSProperties}><dt>Studying</dt><dd>AI Engineering, fourth year<span>ENSIA · graduating 2028</span></dd></div>
              <div style={{ '--i': 1 } as React.CSSProperties}><dt>Looking for</dt><dd>Internships<span>AI research, computer vision or full-stack ML</span></dd></div>
              <div style={{ '--i': 2 } as React.CSSProperties}><dt>Based in</dt><dd>Algiers, Algeria</dd></div>
              <div style={{ '--i': 3 } as React.CSSProperties}><dt>Speaks</dt><dd>Arabic, French, English<span>French C2 (TCF)</span></dd></div>
            </dl>
          </div>
        </div>
      </section>

      {/* ================= 02 PROJECTS ================= */}
      <section className="sec" id="projects" aria-labelledby="h-projects">
        <div className="wrap">
          <header className="sec-head">
            <Kicker n="02" label="Projects" />
            <Words id="h-projects" text="Things I’ve built." />
            <p className="reveal">From research pipelines to apps on a phone. Every project has its own page with the full story, the numbers and the complete tech stack.</p>
          </header>
          <ProjectGrid />
        </div>
      </section>

      {/* ================= 03 PLAYGROUND (after Bruno Simon) ================= */}
      <section className="sec" id="playground" aria-labelledby="h-pg">
        <div className="wrap">
          <header className="sec-head"><Kicker n="03" label="Playground" /><Words id="h-pg" text="Route a drone fleet," em="right here." /></header>
          <div className="pg-layout">
            <div className="pg-side reveal">
              <p>A pocket version of my <Link className="inline-link" href={projectHref('drone-delivery')}>drone-routing project</Link>. The planner routes a fleet under the same load-dependent energy model and flies it on one clock.</p>
              <ul className="pg-tips">
                <li><kbd>click</kbd>drop a delivery stop, or remove one</li>
                <li><kbd>shuffle</kbd>scatter a new city</li>
                <li><kbd>naive</kbd>see what nearest-neighbour costs</li>
              </ul>
              <p className="pg-note">Each leg costs <code>e(d, w) = d · (1 + 0.3·w)</code>, where <code>w</code> is the share of payload still on board, and each drone carries at most 8 kg. The planner runs Clarke–Wright savings, then load-aware 2-opt and relocate moves, all in your browser.</p>
            </div>
            <div className="reveal scale" style={{ '--d': '.06s' } as React.CSSProperties}><Playground /></div>
          </div>
        </div>
      </section>

      {/* ================= 04 SKILLS ================= */}
      <section className="sec" id="skills" aria-labelledby="h-skills">
        <div className="wrap">
          <header className="sec-head">
            <Kicker n="04" label="Skills" />
            <Words id="h-skills" text="Everything the projects are" em="built with." />
            <p className="reveal">Counted straight from the projects, not from a wish list. Hover a skill to see where it’s used; click it to filter the projects.</p>
          </header>
          <Skills />
        </div>
      </section>

      {/* ================= 05 BACKGROUND ================= */}
      <section className="sec" id="background" aria-labelledby="h-bg">
        <div className="wrap">
          <header className="sec-head"><Kicker n="05" label="Background" /><Words id="h-bg" text="Education & languages." /></header>
          <div className="bg-grid">
            <div className="panel reveal">
              <div className="panel-k">Education</div>
              <div className="edu-role">AI Engineering · fourth year</div>
              <div className="edu-where">ENSIA — National Higher School of Artificial Intelligence</div>
              <div className="edu-when">Algiers · expected 2028</div>
              <ul className="courses stagger reveal" aria-label="Relevant coursework">
                {['Machine Learning', 'Data Mining', 'Artificial Intelligence', 'Data Structures & Algorithms I/II', 'Database Systems', 'OOP', 'Web Dev', 'Mobile Dev', 'Linux'].map((c, i) => <li key={c} style={{ '--i': i } as React.CSSProperties}>{c}</li>)}
              </ul>
            </div>
            <div className="panel reveal" style={{ '--d': '.07s' } as React.CSSProperties}>
              <div className="panel-k">Languages</div>
              {[['Arabic', 'Native', 4], ['French', 'C2 · TCF', 4], ['English', 'Professional', 3]].map(([l, lv, n]) => (
                <div className="lang" key={l as string}>
                  <div><div className="l">{l}</div><div className="lv">{lv}</div></div>
                  <span className="meter" role="img" aria-label={`${n} of 4`}>{[0, 1, 2, 3].map(k => <i key={k} className={k < (n as number) ? 'on' : undefined} />)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 06 CONTACT ================= */}
      <section className="sec" id="contact" aria-labelledby="h-ct">
        <div className="wrap">
          <header className="sec-head"><Kicker n="06" label="Contact" /></header>
          <div className="contact-card reveal scale">
            <Words as="h3" id="h-ct" text="Let’s build something" em="measurable." />
            <p>I’m looking for internships in AI research, computer vision or full-stack ML. I reply to every message.</p>
            <div className="actions">
              <a className="btn primary" href={`mailto:${EMAIL}`}><MailIcon />Say hello</a>
              <CopyEmailButton />
              <a className="btn" href={CV} download><DownloadIcon />Download CV</a>
            </div>
            <div className="reach">
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <a href={`tel:${PHONE.replace(/\s/g, '')}`}>{PHONE}</a>
              <span>Algiers, Algeria</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
