import { GITHUB } from './site';

const GH = GITHUB + '/';

export type Cat = 'ml' | 'opt' | 'apps' | 'live';
export type IconName = 'chart' | 'wave' | 'route' | 'pin' | 'shield' | 'doc' | 'note' | 'play' | 'scan' | 'queue' | 'pulse';

export type Project = {
  slug: string;
  title: string;
  year: string;
  area: string;
  /** which of the --r1..--r6 tokens tints this project */
  color: 'r1' | 'r2' | 'r3' | 'r4' | 'r5' | 'r6';
  icon: IconName;
  featured?: boolean;
  cats: Cat[];
  /** a live URL turns on the "Live website" highlight everywhere: card, page, filter, search */
  site?: string;
  siteLabel?: string;
  repo?: string;
  private?: boolean;
  links?: { label: string; href: string }[];
  sub: string;
  headline: string;
  blurb: string;
  platform: string;
  /** what I did, for team projects; shown as "Role" on the project page when set */
  role?: string;
  kpis: [string, string][];
  pills: string[];
  stack: string[];
  shots?: { src: string; caption: string }[];
  /** portrait phone screenshots (720×1600), shown in a phone frame instead of a browser window */
  phones?: { src: string; caption: string }[];
  audio?: { src: string; emotion: string; sentence: string; speaker: string }[];
  /** trusted HTML (bold numbers, an Arabic word) */
  overview: string[];
  highlights: string[];
};

export const CATS: { id: 'all' | Cat; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ml', label: 'AI & ML' },
  { id: 'opt', label: 'Optimization' },
  { id: 'apps', label: 'Apps' },
  { id: 'live', label: 'Live sites' },
];

export const PROJECTS: Project[] = [
  {
    slug: 'fpl-assistant', title: 'FPL Assistant', year: '2025 — 26', area: 'ML · Web app', color: 'r4', icon: 'chart', featured: true,
    cats: ['ml', 'opt', 'apps', 'live'],
    site: 'https://fpl-assistant-ten.vercel.app', siteLabel: 'fpl-assistant-ten.vercel.app', repo: GH + 'fpl-assistant',
    sub: 'Points prediction & squad optimiser for Fantasy Premier League',
    headline: 'Turning predictions into a team you can actually pick.',
    blurb: 'Ten seasons of match data, four position-specific LightGBM models and an integer program that picks a legal squad — running live as a full web app with a transfer planner and chip advisor.',
    platform: 'Web app: Next.js on Vercel, Flask API on Render',
    kpis: [['+481', 'pts vs. rolling-5 heuristic'], ['29/33', 'gameweeks won'], ['+0.12–0.15', 'R² over baseline'], ['50,048', 'held-out player-matches']],
    pills: ['Python', 'LightGBM', 'PuLP', 'Next.js', 'Flask'],
    stack: ['Python', 'TypeScript', 'pandas', 'NumPy', 'scikit-learn', 'LightGBM', 'XGBoost', 'Matplotlib', 'Jupyter', 'Integer programming', 'PuLP', 'Flask', 'Gunicorn', 'Next.js', 'React', 'Tailwind CSS', 'Vercel', 'Render', 'Sports analytics'],
    shots: [
      { src: '/assets/projects/fpl-fixtures.webp', caption: 'Fixture Matrix: eight weeks of fixture difficulty for every club.' },
      { src: '/assets/projects/fpl-team.webp', caption: 'My Team: set a legal squad and put the model’s best eleven on the pitch.' },
      { src: '/assets/projects/fpl-comparison.webp', caption: 'Comparison: two players head to head, from your squad or the wider market.' },
    ],
    overview: [
      'Predicts every player’s Fantasy Premier League points for the coming gameweeks, then turns the predictions into decisions: which fifteen players to own, who starts, which transfers are worth a points hit and when to play a chip.',
      'The evaluation is strict on purpose. Training stops at 2022-23, 2023-24 is the validation season, and 2024-25 plus 2025-26 — <b>50,048 player-matches</b> — stay untouched until the end.',
    ],
    highlights: [
      'Four position-specific <b>LightGBM</b> models (66 features for goalkeepers, 74 for outfield players) beat the “average of the last five games” heuristic by <b>+0.12 to +0.15 R²</b> at every position.',
      'R² rewards being close on the many two-point players; picking a team rewards ranking the top correctly. So the same integer program picks an eleven every gameweek of 2025-26 under an £83m budget: <b>1,856 points</b> with the model against 1,375 with the heuristic, winning <b>29 of 33 gameweeks</b> (paired t = 5.64).',
      'The web app has a squad builder, a transfer planner that charges the −4 hit before comparing, chip timing for Bench Boost, Triple Captain, Free Hit and Wildcard, a fixture matrix and player comparison.',
      'Built to run unattended: a refresh pipeline validates new predictions before swapping them in, the last good snapshot keeps serving during a refresh, a readiness check gates traffic and Prometheus metrics expose data age and alerts.',
    ],
  },
  {
    slug: 'speech-emotion', title: 'Speech Emotion Recognition', year: '2026', area: 'Audio ML', color: 'r3', icon: 'wave', cats: ['ml'],
    repo: GH + 'Speech-Emotion-Recognition',
    links: [{ label: 'Run in Colab', href: 'https://colab.research.google.com/github/mohameddddt/Speech-Emotion-Recognition/blob/main/embeddings_colab.ipynb' }],
    sub: 'Six-way emotion classification from a short spoken sentence',
    headline: 'Hearing emotion in voices it has never heard.',
    blurb: 'Evaluated on voices the model has never heard: 74.2% with frozen WavLM embeddings, where human listeners manage about 41%.',
    platform: 'Python package + Colab notebook',
    kpis: [['74.2%', 'accuracy, unseen speakers'], ['0.742', 'macro-F1'], ['≈41%', 'human raters, audio only'], ['16.7%', 'chance']],
    pills: ['PyTorch', 'WavLM', 'scikit-learn', 'librosa'],
    stack: ['Python', 'PyTorch', 'Hugging Face Transformers', 'WavLM', 'scikit-learn', 'XGBoost', 'Ensemble learning', 'librosa', 'NumPy', 'pandas', 'Matplotlib', 'Jupyter', 'Audio'],
    audio: [
      { src: '/assets/projects/ser/1001_TIE_NEU_XX.wav', emotion: 'Neutral', sentence: 'That is exactly what happened.', speaker: 'Actor 1001' },
      { src: '/assets/projects/ser/1001_WSI_SAD_XX.wav', emotion: 'Sad', sentence: 'We’ll stop in a couple of minutes.', speaker: 'Actor 1001' },
      { src: '/assets/projects/ser/1005_DFA_SAD_XX.wav', emotion: 'Sad', sentence: 'Don’t forget a jacket.', speaker: 'Actor 1005' },
    ],
    overview: [
      'Classifies the emotion in a short spoken sentence — angry, disgust, fear, happy, neutral or sad — using CREMA-D’s 7,442 clips from 91 actors.',
      'The number that matters is on voices the model has never heard: <b>19 of the 91 actors are held out</b>, and every model uses the same split.',
    ],
    highlights: [
      'Hand-crafted route: a 422-dimensional acoustic feature vector built with librosa, fed to logistic regression, XGBoost and a soft-voting ensemble that tops out at <b>53.2%</b>.',
      'Self-supervised route: frozen <b>WavLM-base-plus</b> embeddings averaged over layers 5–9 with a linear probe reach <b>74.2% accuracy and 0.742 macro-F1</b>; layers and regularisation are chosen by grouped cross-validation.',
      'For scale: chance is 16.7%, and the CREMA-D authors report human raters identify the intended emotion from audio alone about 41% of the time.',
      'Per-class recall: angry 89%, neutral 88%, fear 75%, happy 69%, sad 66%, disgust 60%.',
      'A Colab notebook caches embeddings to Google Drive and resumes after a disconnect; the saved model is about 56 KB because it stores only the encoder name, the layers and the classifier.',
    ],
  },
  {
    slug: 'drone-delivery', title: 'Drone-Based Delivery', year: '2026', area: 'Optimization', color: 'r2', icon: 'route', cats: ['opt'],
    repo: GH + 'Drone-Based-Delivery-Optimization-Problem',
    links: [{ label: 'Slides', href: 'https://canva.link/15vny3fv09kl44h' }],
    sub: 'Energy-aware routing where cost depends on the load still on board',
    headline: 'Routing drones when weight changes the energy.',
    blurb: 'The order of deliveries changes the energy. Solved exactly with Branch & Bound and with three metaheuristics under one shared objective.',
    platform: 'Python package & CLI with HTML dashboards',
    kpis: [['74', 'CVRPLIB optima reproduced'], ['624', 'tests'], ['5', 'solvers, one objective'], ['p = 2×10⁻⁸', 'ALNS beats the GA']],
    pills: ['Python', 'Branch & Bound', 'ALNS', 'PuLP'],
    stack: ['Python', 'NumPy', 'SciPy', 'pandas', 'Matplotlib', 'Jupyter', 'Integer programming', 'PuLP', 'Branch & Bound', 'Genetic algorithms', 'Simulated annealing', 'ALNS', 'Dynamic programming', 'pytest', 'GitHub Actions'],
    overview: [
      'A drone loads its whole route at the depot and sheds weight at every stop, so the energy of each leg depends on what is still on board — and <b>the order of deliveries changes the cost</b>.',
      'The project models that problem formally and solves it five ways under one shared objective and feasibility check, so the comparison is fair by construction. The planner above is a pocket version that runs in your browser.',
    ],
    highlights: [
      'Two mathematical formulations, one of them a MILP flow model in PuLP, and an NP-hardness proof.',
      'Exact <b>Branch &amp; Bound</b> with symmetry breaking and an anytime dual bound, so a run that times out still reports a real optimality gap.',
      'A genetic algorithm, simulated annealing and <b>ALNS</b> share a giant-tour encoding cut into routes by a Split dynamic program that is brute-force verified; ALNS gives the best average energy.',
      'Visibility-graph detours around polygonal no-fly zones, real latitude/longitude instances, CVRPLIB and Solomon import, and QGroundControl mission export.',
      '<b>624 tests</b>, including brute-force ground truth and <b>74 published CVRPLIB optima reproduced exactly</b> — enough instances to show ALNS beats the GA at p = 2 × 10⁻⁸.',
    ],
  },
  {
    slug: 'streetwatch', title: 'StreetWatch', year: '2026', area: 'Vision · Mobile', color: 'r5', icon: 'pin', cats: ['ml', 'apps'],
    private: true,
    sub: 'Road-damage reporting with on-device computer vision',
    headline: 'Spotting road damage on the phone, offline.',
    blurb: 'Citizens photograph road damage and a 3.1 MB CNN classifies it on the phone, offline. Reports land on a live map for city administrators.',
    platform: 'Android app, public web map & admin dashboard',
    kpis: [['94.6%', 'accuracy, 6 classes'], ['0.930', 'macro-F1'], ['3.1 MB', 'on-device model'], ['99.87%', 'TFLite ↔ PyTorch agreement']],
    pills: ['PyTorch', 'TensorFlow Lite', 'Flutter', 'FastAPI', 'PostGIS'],
    stack: ['Python', 'Dart', 'TypeScript', 'SQL', 'PyTorch', 'MobileNetV3', 'TensorFlow Lite', 'Flutter', 'BLoC', 'Hive', 'FastAPI', 'JWT', 'Next.js', 'React', 'MapLibre', 'PostgreSQL', 'PostGIS', 'Supabase', 'Firebase Cloud Messaging', 'Vercel', 'Docker', 'GitHub Actions', 'pytest', 'Playwright', 'Sentry', 'Computer vision', 'Geospatial'],
    overview: [
      'Citizens photograph road damage — potholes, cracks, broken signs — and the phone classifies it on the spot with no connection needed. Reports are geotagged and land on a public web map, where administrators triage and fix them.',
    ],
    highlights: [
      'Moved from YOLO detection to patch classification on RDD2022 (roads in Japan, India, China, Czechia, Norway and the US), benchmarking ResNet-18, EfficientNet-B0, MobileNetV3 and ConvNeXt-Tiny.',
      'Shipped <b>MobileNetV3-Small: 94.6% accuracy and 0.930 macro-F1</b> across six classes, exported to a <b>3.1 MB FP16 TensorFlow Lite</b> model that agrees with the PyTorch original on 99.87% of test patches.',
      'The app slides a patch window over the photo and aggregates the predictions; a field-evaluation protocol means a new model ships only if it beats the current one on Algerian roads.',
      'FastAPI backend on Supabase Postgres with PostGIS; a Next.js + MapLibre public map and admin dashboard in Arabic, French and English with RTL, axe accessibility tests and a nonce-based CSP.',
      'CI/CD promotes the same backend image from staging to production behind an approval and smoke tests; signed Android builds go to the Play internal track.',
    ],
  },
  {
    slug: 'clinical-rag', title: 'Clinical Evidence RAG', year: '2026', area: 'NLP · RAG', color: 'r6', icon: 'doc', cats: ['ml', 'apps'],
    repo: GH + 'Medical-literature-RAG-system',
    sub: 'Retrieval-augmented question answering over medical literature',
    headline: 'Medical answers that show their sources.',
    blurb: 'Medical answers that cite their sources: MedCPT retrieval over PubMedQA, with an LLM allowed to answer only from what was retrieved.',
    platform: 'Flutter app, Node.js API, FastAPI embedding service',
    kpis: [['MedCPT', 'biomedical embeddings'], ['pgvector', 'vector search'], ['Grounded', 'answers with sources'], ['1,000', 'gold questions for eval']],
    pills: ['MedCPT', 'pgvector', 'Gemini API', 'Node.js', 'Flutter'],
    stack: ['Python', 'JavaScript', 'Dart', 'SQL', 'PyTorch', 'Hugging Face Transformers', 'MedCPT', 'RAG', 'Embeddings', 'pgvector', 'Gemini API', 'FastAPI', 'Node.js', 'Express', 'Flutter', 'PostgreSQL', 'Supabase', 'Docker', 'NLP'],
    overview: [
      'Question answering over medical literature where every answer cites the abstracts it was built from. It retrieves PubMedQA abstracts by meaning rather than keywords, and the LLM may only answer from what was retrieved.',
    ],
    highlights: [
      'A Python ingestion job embeds PubMedQA abstracts with the <b>MedCPT article encoder</b> and stores them in Supabase <b>pgvector</b>.',
      'Questions are embedded with the matching MedCPT query encoder by a FastAPI service running PyTorch and Transformers.',
      'A Node.js / Express API validates input, runs the vector search and has <b>Gemini</b> synthesise an answer grounded in the retrieved abstracts, returned with its sources.',
      'A Flutter client renders the answer as Markdown with a link to every source.',
      'Evaluation scripts measure Recall@k and MRR@k on PubMedQA’s 1,000 expert-labelled questions; the services run together under Docker Compose.',
    ],
  },
  {
    slug: 'ransomware', title: 'Ransomware Detection', year: '2026', area: 'Security ML', color: 'r1', icon: 'shield', cats: ['ml'],
    private: true,
    sub: 'Memory-forensics detection with an automated mitigation engine',
    headline: 'Detection that acts, not just alerts.',
    blurb: 'Hybrid ML models over 70 engineered memory-forensics features, paired with an engine that acts on the alerts.',
    platform: 'Python detection pipeline + mitigation engine',
    kpis: [['98%', 'ROC-AUC'], ['93–95%', 'recall'], ['70', 'engineered features']],
    pills: ['Python', 'scikit-learn', 'Ensemble learning', 'Security'],
    stack: ['Python', 'scikit-learn', 'Ensemble learning', 'Security'],
    overview: [
      'A research-grade pipeline that detects ransomware from memory-forensics evidence and then responds to it automatically, rather than stopping at a score.',
    ],
    highlights: [
      '<b>70 engineered memory-forensics features</b> feeding hybrid ML models and an ensemble tuned for recall on live threats.',
      '<b>98% ROC-AUC</b> with 93–95% recall.',
      'A mitigation engine standardises model alerts and triggers responses: process suspension and termination, network blocking, notifications and event logging.',
    ],
  },
  {
    slug: 'cadence', title: 'Cadence', year: '2026', area: 'Android app', color: 'r1', icon: 'note', cats: ['apps'],
    repo: GH + 'Cadence',
    sub: 'Your music, in rhythm · open-source Android player',
    headline: 'A music library that tags and tidies itself.',
    blurb: 'A music player and library manager that downloads, fingerprints and tags your files, then keeps the library tidy.',
    platform: 'Android: Flutter with native Kotlin/Java plugins',
    kpis: [['~340', 'tests'], ['Weekly', 'CI canary'], ['1,000+', 'download sources']],
    pills: ['Flutter', 'Kotlin', 'SQLite', 'FastAPI'],
    stack: ['Dart', 'Kotlin', 'Java', 'Python', 'Flutter', 'Provider', 'SQLite', 'FastAPI', 'Docker', 'GitHub Actions', 'ffmpeg', 'yt-dlp', 'Chromaprint', 'Audio'],
    overview: [
      'An open-source Android music player and library manager for people who keep their own files, built with Flutter and native Kotlin/Java plugins.',
    ],
    highlights: [
      'Gapless playback with ReplayGain, an equalizer, a sleep timer, and Android Auto / Bluetooth controls.',
      'Downloads from YouTube, SoundCloud, Bandcamp and about 1,000 more sites through <b>yt-dlp</b>, on-device or through a small FastAPI companion server in Docker.',
      'Identifies tracks by AcoustID fingerprint using a <b>Dart port of Chromaprint</b>, then tags them from MusicBrainz — written into the files themselves and tested on real MP3, FLAC, M4A and OGG.',
      'Synced lyrics, plus a dashboard that edits, merges and bulk-fixes artists and albums.',
      'About <b>340 tests</b>; CI builds and tests every push, and a weekly canary checks downloads still work on the key sites.',
    ],
  },
  {
    slug: 'streamline', title: 'Streamline', year: '2026', area: 'Desktop app', color: 'r2', icon: 'play', cats: ['apps'],
    repo: GH + 'Streamline',
    sub: 'Movie & TV streamer for Windows, macOS and Linux',
    headline: 'Play the film before the download finishes.',
    blurb: 'Starts playback long before the torrent finishes, and transcodes only when the browser engine can’t play the file.',
    platform: 'Desktop: Windows, macOS and Linux',
    kpis: [['3', 'desktop platforms'], ['3', 'playback paths']],
    pills: ['Electron', 'React', 'TypeScript', 'ffmpeg'],
    stack: ['TypeScript', 'Electron', 'React', 'Vite', 'WebTorrent', 'ffmpeg'],
    overview: [
      'A desktop movie and TV streamer that speaks the Stremio addon protocol, so it works with Torrentio, Cinemeta, OpenSubtitles and any addon that publishes a manifest. Everything it uses is free: no account, no API key.',
    ],
    highlights: [
      '<b>WebTorrent</b> fetches pieces in order and serves them from a loopback-only HTTP server with range support, so playback starts long before the file is complete.',
      'Downloads run in the background, survive restarts and can be watched while still in progress.',
      'Chromium only decodes H.264/AAC, so <b>ffprobe</b> inspects each file and picks direct play, an AC3→AAC remux that copies the video untouched, or a hardware-accelerated HEVC transcode.',
      'Scrobbles live to Trakt and Simkl, exports to Letterboxd CSV, and updates itself through electron-updater.',
    ],
  },
  {
    slug: 'jerd', title: 'Jerd', year: '2026', area: 'Mobile app', color: 'r6', icon: 'scan', cats: ['apps'],
    repo: GH + 'Jerd',
    sub: 'Offline-first stock control for a small shop',
    headline: 'Stock counts that survive having no signal.',
    blurb: 'Scan a barcode, record “+12 received” or “−1 sold”. Built on an append-only ledger, so phones offline for hours merge cleanly.',
    platform: 'Android app (Flutter) + Flask API',
    kpis: [['Append-only', 'stock ledger'], ['Idempotent', 'offline sync'], ['AR · FR · EN', 'with RTL']],
    pills: ['Flutter', 'BLoC', 'SQLite', 'Flask', 'Supabase'],
    phones: [
      { src: '/assets/projects/jerd/products.webp', caption: 'Products: search by name or barcode, filter what is low or out, and scan from anywhere.' },
      { src: '/assets/projects/jerd/count.webp', caption: 'Stock count: scan the shelf and see only what differs from the ledger.' },
      { src: '/assets/projects/jerd/alerts.webp', caption: 'Alerts: what to restock, most urgent first, with one tap to record a delivery.' },
      { src: '/assets/projects/jerd/sync.webp', caption: 'Sync: whether the outbox has reached the server, with a manual push for when signal returns.' },
      { src: '/assets/projects/jerd/settings.webp', caption: 'Settings: Arabic, French or English, light or dark, and staff accounts.' },
      { src: '/assets/projects/jerd/drawer.webp', caption: 'Today at a glance: what came in, what sold and what was adjusted.' },
    ],
    stack: ['Dart', 'Python', 'SQL', 'Flutter', 'BLoC', 'GetIt', 'SQLite', 'Flask', 'SQLAlchemy', 'JWT', 'PostgreSQL', 'Supabase', 'Firebase Cloud Messaging', 'Gemini API', 'Render', 'GitHub Actions', 'pytest', 'Sentry'],
    overview: [
      'Offline-first stock control for a small shop — <span lang="ar" dir="rtl">جرد</span> is Arabic for a stock count. The owner scans a barcode and records “+12 received” or “−1 sold”, even in a basement with no signal.',
    ],
    highlights: [
      'A quantity is never a column you overwrite: it is the sum of an <b>append-only ledger</b> of movements with device-generated UUIDs, so phones offline for hours merge without lost updates.',
      'Local changes queue in an outbox and sync in <b>idempotent batches</b>; conflicts surface on a sync screen instead of being silently dropped.',
      'The app only talks to a Flask API on Render, which owns the Supabase Postgres database, so no database keys ever ship in the app.',
      'Firebase Cloud Messaging pushes low-stock alerts, and a scheduled GitHub Actions job sends a nightly digest.',
      'Scan an unknown barcode and <b>Gemini</b> suggests a product name and category from a photo of the label; it also drafts reorder suggestions. Arabic, French and English with RTL.',
    ],
  },
  {
    slug: 'qnow', title: 'QNow', year: '2026', area: 'Mobile app', color: 'r3', icon: 'queue', cats: ['apps', 'live'],
    site: 'https://qnow.netlify.app', siteLabel: 'qnow.netlify.app', repo: GH + 'MobDevProject',
    sub: 'Queue management · Mobile',
    headline: 'Waiting in line, without the line.',
    blurb: 'A virtual queue for businesses, so customers can wait for their turn without standing in line.',
    platform: 'Mobile app (Flutter) + Express API',
    kpis: [['Flutter', '+ Node.js'], ['JWT', 'auth with bcrypt hashes']],
    pills: ['Flutter', 'BLoC', 'Express', 'Supabase'],
    stack: ['Dart', 'JavaScript', 'Flutter', 'BLoC', 'Node.js', 'Express', 'JWT', 'Supabase'],
    overview: ['Lets businesses run a virtual queue and customers wait for their turn without standing in line.'],
    highlights: ['A Flutter client built on BLoC.', 'An Express API with JWT authentication and bcrypt-hashed passwords.', 'Supabase for storage.'],
  },
];

export const BY_SLUG: Record<string, Project> = Object.fromEntries(PROJECTS.map(p => [p.slug, p]));
export const projectHref = (p: Project | string) => `/work/${typeof p === 'string' ? p : p.slug}/`;
export const nextProject = (p: Project) => PROJECTS[(PROJECTS.indexOf(p) + 1) % PROJECTS.length];
