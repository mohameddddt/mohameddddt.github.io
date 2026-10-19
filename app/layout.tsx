import type { Metadata, Viewport } from 'next';
import { Anton, Fragment_Mono, Geist, Newsreader } from 'next/font/google';
import './globals.css';
import TopBar from '@/components/TopBar';
import CommandMenu from '@/components/CommandMenu';
import Footer from '@/components/Footer';
import Field from '@/components/three/Field';
import SmoothScroll from '@/components/motion/SmoothScroll';
import Reveal from '@/components/motion/Reveal';
import Preloader from '@/components/motion/Preloader';
import Cursor from '@/components/motion/Cursor';
import PageTransition from '@/components/motion/PageTransition';
import { BackToTop, Toaster } from '@/components/Effects';
import { EMAIL, GITHUB, LINKEDIN, NAME, SITE_URL } from '@/lib/site';

const sans = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const display = Anton({ subsets: ['latin'], weight: '400', variable: '--font-display', display: 'swap' });
const mono = Fragment_Mono({ subsets: ['latin'], weight: '400', variable: '--font-mono', display: 'swap' });
const serif = Newsreader({ subsets: ['latin'], style: ['italic'], axes: ['opsz'], variable: '--font-serif', display: 'swap' });

const DESCRIPTION = 'AI engineering student at ENSIA building machine-learning systems end to end: FPL points prediction, speech emotion recognition, drone routing, medical RAG, and on-device computer vision.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${NAME} — AI Engineer`, template: `%s · ${NAME}` },
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile', siteName: NAME, title: `${NAME} — AI Engineer`, url: '/',
    description: 'Machine-learning systems, end to end — from PyTorch training runs to inference on a phone.',
    images: [{ url: '/assets/og.png', width: 1200, height: 630, alt: 'Mohamed Sahnoune Toubal, AI Engineer at ENSIA: 74.2% emotion accuracy on unseen speakers, +481 FPL points over the baseline, 74 published routing optima reproduced.' }],
  },
  twitter: { card: 'summary_large_image' },
  icons: { apple: '/assets/apple-touch-icon.png' },
};

export const viewport: Viewport = { themeColor: '#0A0A0B' };

// runs before first paint: picks the saved or system theme so there is no flash, marks JS as available,
// and skips the preloader on a repeat visit in the same session or when motion is reduced
const BOOT_SCRIPT = `(function(){var d=document.documentElement,t=null,s=null;d.classList.add('js');try{t=localStorage.getItem('theme')}catch(e){}if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';d.setAttribute('data-theme',t);try{s=sessionStorage.getItem('intro')}catch(e){}if(s||matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('no-intro')})();`;

const PERSON = {
  '@context': 'https://schema.org', '@type': 'Person', name: NAME, url: SITE_URL + '/',
  image: SITE_URL + '/assets/portrait.jpg', jobTitle: 'AI Engineering student', email: 'mailto:' + EMAIL,
  address: { '@type': 'PostalAddress', addressLocality: 'Algiers', addressCountry: 'DZ' },
  affiliation: { '@type': 'CollegeOrUniversity', name: 'ENSIA — National Higher School of Artificial Intelligence' },
  knowsAbout: ['Machine learning', 'Computer vision', 'Natural language processing', 'Speech emotion recognition', 'Combinatorial optimization', 'Flutter'],
  sameAs: [GITHUB, LINKEDIN],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON) }} />
      </head>
      <body>
        <div id="top" />
        <a className="skip" href="#content">Skip to content</a>
        <SmoothScroll />
        <Field />
        <div className="grain" aria-hidden="true" />
        <TopBar />
        {children}
        <Footer />
        <BackToTop />
        <CommandMenu />
        <Toaster />
        <Cursor />
        <PageTransition />
        <Preloader />
        <Reveal />
      </body>
    </html>
  );
}
