'use client';

import { useEffect } from 'react';
import { setTheme, toggleTheme } from '@/lib/client';

// sun ↔ moon morph (after Josh W. Comeau); the theme itself is set before first paint by the script in layout.tsx
export default function ThemeToggle() {
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: light)');
    const follow = (e: MediaQueryListEvent) => {
      let saved: string | null = null;
      try { saved = localStorage.getItem('theme'); } catch { /* private mode */ }
      if (!saved) setTheme(e.matches ? 'light' : 'dark', false);
    };
    mq.addEventListener('change', follow);
    return () => mq.removeEventListener('change', follow);
  }, []);

  return (
    <button className="icon-btn theme-btn" type="button" onClick={toggleTheme} aria-label="Toggle light and dark theme">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <mask id="moon-mask"><rect x="-6" y="-6" width="36" height="36" fill="#fff" /><circle className="cut" cx="17" cy="7" r="6.5" fill="#000" /></mask>
        <circle className="core" cx="12" cy="12" r="8.5" fill="currentColor" mask="url(#moon-mask)" />
        <g className="rays" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 1.5v2M12 20.5v2M1.5 12h2M20.5 12h2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M4.6 19.4 6 18M18 6l1.4-1.4" />
        </g>
      </svg>
    </button>
  );
}
