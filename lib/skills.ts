import { PROJECTS, type Project } from './projects';

// Every skill a project lists belongs to exactly one group. The skills section, the project pages
// and the search all read this, so a skill is only ever named one way.
export const GROUPS: [string, string[]][] = [
  ['Languages', ['Python', 'TypeScript', 'JavaScript', 'Dart', 'Kotlin', 'Java', 'SQL']],
  ['Machine learning', ['PyTorch', 'scikit-learn', 'LightGBM', 'XGBoost', 'Hugging Face Transformers', 'WavLM', 'MedCPT', 'MobileNetV3', 'TensorFlow Lite', 'Ensemble learning', 'librosa', 'pandas', 'NumPy', 'SciPy', 'Matplotlib', 'Jupyter']],
  ['LLMs & retrieval', ['RAG', 'Embeddings', 'pgvector', 'Gemini API']],
  ['Optimization', ['Integer programming', 'PuLP', 'Branch & Bound', 'Genetic algorithms', 'Simulated annealing', 'ALNS', 'Dynamic programming']],
  ['Backend & APIs', ['FastAPI', 'Flask', 'Node.js', 'Express', 'SQLAlchemy', 'JWT', 'Gunicorn']],
  ['Web & desktop', ['React', 'Next.js', 'Tailwind CSS', 'MapLibre', 'Electron', 'Vite']],
  ['Mobile', ['Flutter', 'BLoC', 'Provider', 'GetIt', 'SQLite', 'Hive', 'Firebase Cloud Messaging']],
  ['Data & cloud', ['PostgreSQL', 'PostGIS', 'Supabase', 'Vercel', 'Render']],
  ['Media', ['ffmpeg', 'WebTorrent', 'yt-dlp', 'Chromaprint']],
  ['Quality & DevOps', ['Docker', 'GitHub Actions', 'pytest', 'Playwright', 'Sentry']],
  ['Domains', ['Computer vision', 'NLP', 'Audio', 'Geospatial', 'Sports analytics', 'Security']],
];

export const ALSO = ['C', 'C++', 'Bash', 'Linux', 'Git'];

export const GROUP_OF: Record<string, string> = Object.fromEntries(GROUPS.flatMap(([g, list]) => list.map(s => [s, g])));

export const USES: Record<string, Project[]> = {};
for (const p of PROJECTS) for (const s of p.stack) (USES[s] ||= []).push(p);

/** skills that at least one project uses, in group order */
export const USED_SKILLS = GROUPS.flatMap(([, l]) => l).filter(s => USES[s]);

/** a project's stack split into the shared groups, in group order */
export function groupedStack(p: Project): [string, string[]][] {
  return GROUPS.map(([g, l]) => [g, l.filter(s => p.stack.includes(s))] as [string, string[]]).filter(([, l]) => l.length);
}

export const TOP_SKILLS = USED_SKILLS.slice().sort((a, b) => USES[b].length - USES[a].length).slice(0, 8);
