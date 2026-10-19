'use client';

import { useEffect, useState } from 'react';

const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Algiers', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

/** local time in Algiers, ticking (rendered after hydration so the server HTML matches) */
export default function Clock({ className = '' }: { className?: string }) {
  const [now, setNow] = useState('');
  useEffect(() => {
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  return <time className={className} suppressHydrationWarning>{now || '--:--:--'}</time>;
}
