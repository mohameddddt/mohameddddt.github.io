'use client';

import { useEffect, useRef, useState } from 'react';
import { createPlanner, type Planner } from '@/lib/planner';

// interactive drone-routing planner (in the spirit of Bruno Simon's playable portfolio)
export default function Playground({ seed = 7, label = 'drone-routing' }: { seed?: number; label?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const stops = useRef<HTMLElement>(null), drones = useRef<HTMLElement>(null), energy = useRef<HTMLElement>(null);
  const saved = useRef<HTMLElement>(null), hint = useRef<HTMLSpanElement>(null), live = useRef<HTMLParagraphElement>(null);
  const planner = useRef<Planner | null>(null);
  const [base, setBase] = useState(false);

  useEffect(() => {
    planner.current = createPlanner({
      canvas: canvas.current!, stops: stops.current!, drones: drones.current!, energy: energy.current!,
      saved: saved.current!, hint: hint.current!, live: live.current!,
    }, seed);
    return () => planner.current?.destroy();
  }, [seed]);

  const view = (b: boolean) => { setBase(b); planner.current?.setBase(b); };

  return (
    <div className="pg">
      <div className="pg-bar">
        <div className="pg-title"><span className="dots" aria-hidden="true"><i /><i /><i /></span>{label}<span className="pg-hint" ref={hint}>click to add a stop</span></div>
        <div className="pg-ctrl">
          <div className="seg" role="group" aria-label="Which plan to show">
            <button className="chip" type="button" aria-pressed={!base} onClick={() => view(false)}>Optimised</button>
            <button className="chip" type="button" aria-pressed={base} onClick={() => view(true)}>Nearest-neighbour</button>
          </div>
          <button className="chip ghost" type="button" onClick={() => planner.current?.shuffle()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" /></svg>Shuffle
          </button>
          <button className="chip ghost" type="button" onClick={() => planner.current?.replay()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>Replay
          </button>
          <button className="chip ghost" type="button" onClick={() => planner.current?.clear()}>Clear</button>
        </div>
      </div>
      <canvas ref={canvas} role="img" aria-label="Interactive map: a central hub and delivery stops, with drone routes drawn between them. Click to add or remove stops." />
      <dl className="pg-stats">
        <div><dt>Stops</dt><dd ref={stops}>–</dd></div>
        <div><dt>Drones</dt><dd ref={drones}>–</dd></div>
        <div><dt>Energy</dt><dd ref={energy}>–</dd></div>
        <div><dt>vs. naive</dt><dd ref={saved} className="good">–</dd></div>
      </dl>
      <p className="sr-only" ref={live} aria-live="polite" />
    </div>
  );
}
