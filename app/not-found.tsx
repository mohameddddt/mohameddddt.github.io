import Link from 'next/link';
import { ArrowLeft } from '@/components/Marks';

export const metadata = { title: 'Page not found', robots: { index: false } };

export default function NotFound() {
  return (
    <main id="content" className="nf" data-field="lost">
      <div className="wrap">
        {/* a delivery route that leaves the map: the hub, two served stops, then a leg to nowhere */}
        <svg className="nf-map" viewBox="0 0 320 120" aria-hidden="true">
          <g className="grid">
            {[20, 60, 100].flatMap(y => [20, 60, 100, 140, 180, 220].map(x => <circle key={`${x}-${y}`} cx={x} cy={y} r="1" />))}
          </g>
          <path className="route served" d="M28 84 L96 36 L168 78" />
          <path className="route lost" d="M168 78 L300 30" />
          <rect className="hub" x="20" y="76" width="16" height="16" rx="4" />
          <circle className="stop" cx="96" cy="36" r="6" />
          <circle className="stop" cx="168" cy="78" r="6" />
          <circle className="nowhere" cx="300" cy="30" r="7" />
          <text className="nowhere-q" x="300" y="34.5" textAnchor="middle">?</text>
        </svg>
        <p className="kicker"><span>404</span>off-route</p>
        <h1>This page isn’t on <em>any route.</em></h1>
        <p className="nf-p">The link may be old, or the address mistyped. The way back is short.</p>
        <div className="actions">
          <Link className="btn primary" href="/"><ArrowLeft />Back to the portfolio</Link>
          <Link className="btn" href="/#projects">Projects</Link>
          <Link className="btn" href="/#contact">Contact</Link>
        </div>
      </div>
    </main>
  );
}
