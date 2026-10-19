import Link from 'next/link';
import Hero from '@/components/Hero';
import ProjectGrid from '@/components/ProjectGrid';
import Playground from '@/components/Playground';
import Skills from '@/components/Skills';
import Words from '@/components/Words';
import Marquee from '@/components/Marquee';
import SkillIcon from '@/components/SkillIcon';
import { CountUp, CopyEmailButton } from '@/components/Bits';
import { KbdMod } from '@/components/Effects';
import { ArrowOut, DownloadIcon, MailIcon } from '@/components/Marks';
import { projectHref } from '@/lib/projects';
import { USED_SKILLS } from '@/lib/skills';
import { CV, EMAIL, PHONE } from '@/lib/site';

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
      <Hero />

      {/* ================= BY THE NUMBERS ================= */}
      <section className="numbers" aria-labelledby="h-numbers" data-field="stats">
        <div className="wrap-x">
          <div className="hs-head reveal"><span id="h-numbers">By the numbers</span><span>tap one to open</span></div>
          <div className="stats reveal stagger">
            {STATS.map((s, i) => (
              <Link key={s.slug} className="stat" href={projectHref(s.slug)} data-cursor="Open">
                <span className="stat-i" aria-hidden="true">0{i + 1}</span>
                <span className="n"><CountUp value={s.v} accent /></span>
                <span className="t">{s.t}</span>
                <span className="src">{s.src}<ArrowOut /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 01 ABOUT ================= */}
      <section className="sec" id="about" aria-labelledby="h-about" data-field="about">
        <div className="wrap-x">
          <header className="sec-head"><Kicker n="01" label="About" /><Words id="h-about" text="Models that leave the" em="notebook." /></header>
          <div className="about-grid">
            <div className="prose">
              <p className="lead" data-scrub>I’m a fourth-year AI engineering student at <b>ENSIA</b>, the National Higher School of Artificial Intelligence in Algiers. What I enjoy most is the whole path a model takes: shaping the dataset, training it, then shipping it somewhere real — a Flask API, a Flutter app, or a phone with no signal.</p>
              <p className="reveal">Most of my work starts with a baseline I have to beat. My <Link href={projectHref('fpl-assistant')}>FPL model</Link> is measured against “average of the last five games”, my <Link href={projectHref('speech-emotion')}>speech-emotion model</Link> against human listeners, and my <Link href={projectHref('drone-delivery')}>drone solvers</Link> against proven optima. I hold out whole seasons, unseen speakers and published benchmarks so the numbers mean something.</p>
              <p className="reveal">Outside coursework I build tools I actually use: an Android music player, a desktop streamer, and an offline-first stock app for small shops. <span className="kbd-hint">Press <KbdMod /> to jump anywhere.</span></p>
            </div>
            <aside className="about-side">
              <figure className="portrait reveal scale">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/portrait.jpg" alt="" width={392} height={505} loading="lazy" data-parallax="-50" />
              </figure>
              <dl className="glance reveal stagger" style={{ '--d': '.08s' } as React.CSSProperties}>
                <div><dt>Studying</dt><dd>AI Engineering, fourth year<span>ENSIA · graduating 2028</span></dd></div>
                <div><dt>Looking for</dt><dd>Internships<span>AI research, computer vision or full-stack ML</span></dd></div>
                <div><dt>Based in</dt><dd>Algiers, Algeria</dd></div>
                <div><dt>Speaks</dt><dd>Arabic, French, English<span>French C2 (TCF)</span></dd></div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* ================= 02 PROJECTS ================= */}
      <section className="sec" id="projects" aria-labelledby="h-projects" data-field="projects">
        <div className="wrap-x">
          <header className="sec-head split">
            <div><Kicker n="02" label="Projects" /><Words id="h-projects" text="Things I’ve built." /></div>
            <p className="reveal">From research pipelines to apps on a phone. Every project has its own page with the full story, the numbers and the complete tech stack.</p>
          </header>
          <ProjectGrid />
        </div>
      </section>

      {/* ================= 03 PLAYGROUND ================= */}
      <section className="sec" id="playground" aria-labelledby="h-pg" data-field="playground">
        <div className="wrap-x">
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

      {/* ================= the stack, running past ================= */}
      <Marquee className="mq-skills" speed={70}>
        {USED_SKILLS.map(s => <span className="mq-item" key={s}><SkillIcon name={s} size={34} />{s}</span>)}
      </Marquee>

      {/* ================= 04 SKILLS ================= */}
      <section className="sec" id="skills" aria-labelledby="h-skills" data-field="skills">
        <div className="wrap-x">
          <header className="sec-head split">
            <div><Kicker n="04" label="Skills" /><Words id="h-skills" text="Everything the projects are" em="built with." /></div>
            <p className="reveal">Counted straight from the projects, not from a wish list. Hover a skill to see where it’s used; click it to filter the projects.</p>
          </header>
          <Skills />
        </div>
      </section>

      {/* ================= 05 BACKGROUND ================= */}
      <section className="sec" id="background" aria-labelledby="h-bg">
        <div className="wrap-x">
          <header className="sec-head"><Kicker n="05" label="Background" /><Words id="h-bg" text="Education & languages." /></header>
          <div className="bg-grid">
            <div className="panel reveal">
              <div className="panel-k">Education</div>
              <div className="edu-role">AI Engineering · fourth year</div>
              <div className="edu-where">ENSIA — National Higher School of Artificial Intelligence</div>
              <div className="edu-when">Algiers · expected 2028</div>
              <ul className="courses stagger reveal" aria-label="Relevant coursework">
                {['Machine Learning', 'Data Mining', 'Artificial Intelligence', 'Data Structures & Algorithms I/II', 'Database Systems', 'OOP', 'Web Dev', 'Mobile Dev', 'Linux'].map(c => <li key={c}>{c}</li>)}
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
      <section className="sec contact" id="contact" aria-labelledby="h-ct" data-field="contact">
        <div className="wrap-x">
          <header className="sec-head"><Kicker n="06" label="Contact" /></header>
          <Words as="h3" id="h-ct" className="ct-title" text="Let’s build something" em="measurable." />
          <div className="ct-grid">
            <a className="ct-orb reveal scale" href={`mailto:${EMAIL}`} data-magnetic="0.3" data-cursor="">
              <span><MailIcon />Say hello</span>
            </a>
            <div className="ct-body reveal">
              <p>I’m looking for internships in AI research, computer vision or full-stack ML. I reply to every message.</p>
              <div className="actions">
                <CopyEmailButton />
                <a className="btn" href={CV} download data-magnetic="0.25"><DownloadIcon />Download CV</a>
              </div>
              <div className="reach">
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                <a href={`tel:${PHONE.replace(/\s/g, '')}`}>{PHONE}</a>
                <span>Algiers, Algeria</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
