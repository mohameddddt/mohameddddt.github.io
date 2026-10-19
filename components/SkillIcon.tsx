import type { CSSProperties } from 'react';
import {
  siPython, siTypescript, siJavascript, siDart, siKotlin, siOpenjdk, siPytorch, siScikitlearn, siHuggingface, siTensorflow,
  siPandas, siNumpy, siScipy, siJupyter, siGooglegemini, siFastapi, siFlask, siNodedotjs, siExpress, siSqlalchemy,
  siJsonwebtokens, siGunicorn, siReact, siNextdotjs, siTailwindcss, siMaplibre, siElectron, siVite, siFlutter, siSqlite,
  siFirebase, siPostgresql, siSupabase, siVercel, siRender, siFfmpeg, siDocker, siGithubactions, siPytest, siSentry,
  siC, siCplusplus, siGnubash, siLinux, siGit,
} from 'simple-icons';
import {
  Trees, ChartLine, MapPinned, Magnet, Download, Drama, Boxes, Archive, Waypoints, Share2, Plug, AudioWaveform, Stethoscope,
  ScanEye, Layers, AudioLines, FileSearch, Orbit, Database, Sigma, Calculator, GitBranch, Dna, Thermometer, Shuffle, Grid3x3,
  Fingerprint, Eye, MessageSquareText, Music, Globe, Trophy, ShieldCheck, Code, type LucideIcon,
} from 'lucide-react';

type Brand = { path: string; hex: string };

// official marks (Simple Icons, CC0) for the tools that have one
const BRAND: Record<string, Brand> = {
  Python: siPython, TypeScript: siTypescript, JavaScript: siJavascript, Dart: siDart, Kotlin: siKotlin, Java: siOpenjdk,
  PyTorch: siPytorch, 'scikit-learn': siScikitlearn, 'Hugging Face Transformers': siHuggingface, 'TensorFlow Lite': siTensorflow,
  pandas: siPandas, NumPy: siNumpy, SciPy: siScipy, Jupyter: siJupyter, 'Gemini API': siGooglegemini, FastAPI: siFastapi,
  Flask: siFlask, 'Node.js': siNodedotjs, Express: siExpress, SQLAlchemy: siSqlalchemy, JWT: siJsonwebtokens, Gunicorn: siGunicorn,
  React: siReact, 'Next.js': siNextdotjs, 'Tailwind CSS': siTailwindcss, MapLibre: siMaplibre, Electron: siElectron, Vite: siVite,
  Flutter: siFlutter, SQLite: siSqlite, 'Firebase Cloud Messaging': siFirebase, PostgreSQL: siPostgresql, Supabase: siSupabase,
  Vercel: siVercel, Render: siRender, ffmpeg: siFfmpeg, Docker: siDocker, 'GitHub Actions': siGithubactions, pytest: siPytest,
  Sentry: siSentry, C: siC, 'C++': siCplusplus, Bash: siGnubash, Linux: siLinux, Git: siGit,
};

// no official mark (or a concept, not a product): a plain glyph that says what it is
const GENERIC: Record<string, LucideIcon> = {
  LightGBM: Trees, XGBoost: Trees, Matplotlib: ChartLine, PostGIS: MapPinned, WebTorrent: Magnet, 'yt-dlp': Download,
  Playwright: Drama, BLoC: Boxes, Hive: Archive, pgvector: Waypoints, Provider: Share2, GetIt: Plug, WavLM: AudioWaveform,
  MedCPT: Stethoscope, MobileNetV3: ScanEye, 'Ensemble learning': Layers, librosa: AudioLines, RAG: FileSearch,
  Embeddings: Orbit, SQL: Database, 'Integer programming': Sigma, PuLP: Calculator, 'Branch & Bound': GitBranch,
  'Genetic algorithms': Dna, 'Simulated annealing': Thermometer, ALNS: Shuffle, 'Dynamic programming': Grid3x3,
  Chromaprint: Fingerprint, 'Computer vision': Eye, NLP: MessageSquareText, Audio: Music, Geospatial: Globe,
  'Sports analytics': Trophy, Security: ShieldCheck,
};

const lum = (hex: string) => {
  const c = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const DARK_SURFACE = lum('12151B'), LIGHT_SURFACE = lum('FFFFFF');

// brand colour per theme; a mark that would vanish on the surface (black on dark, yellow on white)
// keeps its hue but is mixed toward the text colour
function brandColors(hex: string) {
  const l = lum(hex);
  return {
    '--bd': contrast(l, DARK_SURFACE) < 1.9 ? `color-mix(in oklab, #${hex} 35%, var(--ink))` : `#${hex}`,
    '--bl': contrast(l, LIGHT_SURFACE) < 1.9 ? `color-mix(in oklab, #${hex} 55%, var(--ink))` : `#${hex}`,
  } as CSSProperties;
}

export const hasBrand = (name: string) => name in BRAND;

/** logo for a skill; `mono` draws it in the current text colour (for tinted covers) */
export default function SkillIcon({ name, size = 16, mono = false }: { name: string; size?: number; mono?: boolean }) {
  const b = BRAND[name];
  if (b) {
    return (
      <svg className={mono ? 'si' : 'si si-brand'} viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false" style={mono ? undefined : brandColors(b.hex)}>
        <path d={b.path} fill="currentColor" />
      </svg>
    );
  }
  const G = GENERIC[name] ?? Code;
  return <G className="si si-glyph" size={size} strokeWidth={1.9} aria-hidden="true" focusable="false" />;
}
