export const SITE_URL = 'https://mohameddddt.github.io';
export const NAME = 'Mohamed Sahnoune Toubal';
export const EMAIL = 'mohamed.sahnoune.toubal@ensia.edu.dz';
export const PHONE = '+213 794 324 012';
export const GITHUB = 'https://github.com/mohameddddt';
export const LINKEDIN = 'https://www.linkedin.com/in/mohamed-sahnoune-toubal/';
export const CV = '/assets/Mohamed_Sahnoune_Toubal_CV.pdf';

// colour palette: 'tide' (navy + cyan) or 'ember' (the previous off-black + orange), see the tokens in app/globals.css
export const PALETTE: 'tide' | 'ember' = 'tide';
export const BG = { tide: { dark: '#0B1020', light: '#F7F9FC' }, ember: { dark: '#0A0A0B', light: '#ECEAE4' } }[PALETTE];

export const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'playground', label: 'Playground' },
  { id: 'skills', label: 'Skills' },
  { id: 'background', label: 'Background' },
  { id: 'contact', label: 'Contact' },
] as const;
