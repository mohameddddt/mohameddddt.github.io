'use client';

import { useEffect, useRef, useState } from 'react';
import type { Project } from '@/lib/projects';

type Clip = NonNullable<Project['audio']>[number];

// a few CREMA-D clips you can play, labelled with the emotion the actor was asked to convey
export default function AudioSamples({ clips }: { clips: Clip[] }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const [playing, setPlaying] = useState<number | null>(null);

  useEffect(() => {
    const a = new Audio();
    a.preload = 'none';
    audio.current = a;
    const end = () => setPlaying(null);
    a.addEventListener('ended', end); a.addEventListener('pause', end);
    return () => { a.pause(); a.removeEventListener('ended', end); a.removeEventListener('pause', end); audio.current = null; };
  }, []);

  // smooth progress while a clip plays
  useEffect(() => {
    if (playing === null) return;
    let raf = 0;
    const tick = () => {
      const a = audio.current, b = bars.current[playing];
      if (a && b) b.style.transform = `scaleX(${a.duration ? a.currentTime / a.duration : 0})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); const b = bars.current[playing]; if (b) b.style.transform = 'scaleX(0)'; };
  }, [playing]);

  const toggle = (i: number) => {
    const a = audio.current; if (!a) return;
    if (playing === i) { a.pause(); return; }
    a.pause();
    a.src = clips[i].src; a.currentTime = 0;
    a.play().then(() => setPlaying(i)).catch(() => setPlaying(null));
  };

  return (
    <div className="audio">
      <div className="audio-head"><span className="dots" aria-hidden="true"><i /><i /><i /></span>Listen to the data</div>
      <ul>
        {clips.map((c, i) => (
          <li key={c.src} className={playing === i ? 'on' : undefined}>
            <button type="button" className="play" onClick={() => toggle(i)} aria-label={`${playing === i ? 'Pause' : 'Play'}: ${c.speaker}, ${c.emotion.toLowerCase()}, “${c.sentence}”`}>
              {playing === i
                ? <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
                : <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>}
            </button>
            <div className="clip">
              <p className="line">“{c.sentence}”</p>
              <p className="who"><span className={'emo emo-' + c.emotion.toLowerCase()}>{c.emotion}</span>{c.speaker}</p>
              <span className="track" aria-hidden="true"><span ref={el => { bars.current[i] = el; }} /></span>
            </div>
            <span className="eq" aria-hidden="true"><i /><i /><i /><i /></span>
          </li>
        ))}
      </ul>
      <p className="audio-note">Clips from the CREMA-D dataset (ODbL). Labels are the emotion each actor was asked to convey.</p>
    </div>
  );
}
