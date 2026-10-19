// GitHub and LinkedIn marks (not in the icon packages we use), plus the small UI glyphs shared across pages.

export const GitHubMark = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 22 12 10 10 0 0 0 12 2z"/></svg>
);

export const LinkedInMark = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 17v-6.6H6.16V17h2.18zM7.25 9.5a1.27 1.27 0 1 0 0-2.54 1.27 1.27 0 0 0 0 2.54zM18 17v-3.62c0-1.94-1.04-2.84-2.42-2.84a2.09 2.09 0 0 0-1.9 1.04V10.4h-2.18V17h2.18v-3.5c0-.92.17-1.8 1.3-1.8 1.12 0 1.13 1.04 1.13 1.86V17H18z"/></svg>
);

const S = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
export const ArrowOut = ({ className = '' }: { className?: string }) => <svg {...S} className={className}><path d="M7 17 17 7M8 7h9v9" /></svg>;
export const ArrowRight = ({ className = '' }: { className?: string }) => <svg {...S} className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
export const ArrowLeft = ({ className = '' }: { className?: string }) => <svg {...S} className={className}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>;
export const ArrowDown = ({ className = '' }: { className?: string }) => <svg {...S} className={className}><path d="M12 5v14M6 13l6 6 6-6" /></svg>;
export const Lock = () => <svg {...S}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>;
export const LockSolid = () => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 10V8a5 5 0 0 1 10 0v2h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm2 0h6V8a3 3 0 0 0-6 0z" /></svg>;
export const GlobeIcon = () => <svg {...S}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>;
export const MailIcon = () => <svg {...S}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3.5 7 8.5 6 8.5-6" /></svg>;
export const DownloadIcon = () => <svg {...S}><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>;
export const SearchIcon = () => <svg {...S}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
export const CloseIcon = () => <svg {...S}><path d="M6 6l12 12M18 6 6 18" /></svg>;
