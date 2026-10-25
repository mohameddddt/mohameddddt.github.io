import type { IconName } from '@/lib/projects';

// each project's tile icon; every one has a small hover animation in globals.css (whimsy after Josh W. Comeau)
const ICONS: Record<IconName, string> = {
  chart: '<svg class="ic-chart" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="12" width="4" height="8" rx="1.2"/><rect x="10" y="7.5" width="4" height="12.5" rx="1.2"/><rect x="16" y="3.5" width="4" height="16.5" rx="1.2"/></svg>',
  wave: '<svg class="ic-wave" viewBox="0 0 24 24" aria-hidden="true"><rect x="2.2" y="9" width="2.6" height="6" rx="1.3"/><rect x="6.6" y="5" width="2.6" height="14" rx="1.3"/><rect x="11" y="7.5" width="2.6" height="9" rx="1.3"/><rect x="15.4" y="3.5" width="2.6" height="17" rx="1.3"/><rect x="19.8" y="8.5" width="2.6" height="7" rx="1.3"/></svg>',
  route: '<svg class="ic-route" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path class="rt" d="M5.5 18.5C9 18 7 12 12 11.5s5-6 6.5-6"/><rect x="2.5" y="16" width="5" height="5" rx="1.2" fill="currentColor" stroke="none"/><circle cx="18.5" cy="5.5" r="2.6"/></svg>',
  pin: '<svg class="ic-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 20.5h18" opacity=".5"/><g class="pin"><path d="M12 19s-6-5.2-6-10a6 6 0 0 1 12 0c0 4.8-6 10-6 10z"/><circle cx="12" cy="9" r="2.2"/></g></svg>',
  shield: '<svg class="ic-shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.8 4.5 5.6v5.6c0 4.6 3.1 8.4 7.5 10 4.4-1.6 7.5-5.4 7.5-10V5.6z"/><path class="tick" d="m8.6 12 2.4 2.4 4.6-4.8"/></svg>',
  doc: '<svg class="ic-doc" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2.8H6.5a2 2 0 0 0-2 2v14.4a2 2 0 0 0 2 2h4M14 2.8l5 5V10M14 2.8v5h5M8 9h3M8 13h3"/><g class="lens"><circle cx="16.5" cy="16" r="3.4"/><path d="m19 18.5 2.3 2.3"/></g></svg>',
  note: '<svg class="ic-note" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><g class="nt"><path d="M9 18V5.5l11-2.3V16"/><circle cx="6.5" cy="18" r="2.5" fill="currentColor"/><circle cx="17.5" cy="16" r="2.5" fill="currentColor"/></g></svg>',
  play: '<svg class="ic-play" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="3.5"/><path class="tri" d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" stroke="none"/></svg>',
  scan: '<svg class="ic-scan" viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor"><rect x="4" y="5" width="1.7" height="14" rx=".4"/><rect x="7" y="5" width="1" height="14" rx=".4"/><rect x="9.3" y="5" width="2.3" height="14" rx=".4"/><rect x="13" y="5" width="1" height="14" rx=".4"/><rect x="15.3" y="5" width="1.7" height="14" rx=".4"/><rect x="18.3" y="5" width="1.7" height="14" rx=".4"/></g><rect class="beam" x="2" y="11.3" width="20" height="1.4" rx=".7"/></svg>',
  queue: '<svg class="ic-queue" viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="13" r="2.6"/><circle cx="12" cy="13" r="2.6"/><circle cx="19" cy="13" r="2.6"/></svg>',
  pulse: '<svg class="ic-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path class="ecg" pathLength="1" d="M2 12h4.5l2-5 3.5 11 2.5-8 1.5 2H22"/></svg>',
  image: '<svg class="ic-image" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><circle class="sun" cx="15.5" cy="9" r="1.9" fill="currentColor" stroke="none"/><path d="m3.5 18 5.5-6 4 4.5 2-2 5 4.5"/></svg>',
};

export default function ProjectIcon({ name, className = 'ic-tile' }: { name: IconName; className?: string }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: ICONS[name] }} />;
}
