import { GITHUB } from './site';

const GH = GITHUB + '/';

export type Cat = 'ml' | 'opt' | 'apps' | 'live';
export type IconName = 'chart' | 'wave' | 'route' | 'pin' | 'shield' | 'doc' | 'note' | 'play' | 'scan' | 'queue' | 'pulse' | 'image' | 'pad' | 'earth' | 'dl' | 'feather' | 'cal';

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
  /** the address shown in the screenshots' browser bar (and the live site's label when there is one) */
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
  /** pixel size of the shots when they aren't 1200×750 */
  shotSize?: [number, number];
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
    slug: 'speech-emotion', title: 'Speech Emotion Recognition', year: '2026', area: 'Audio ML', color: 'r3', icon: 'wave', cats: ['ml', 'live'],
    site: 'https://emotion-speach-recognition.netlify.app', siteLabel: 'emotion-speach-recognition.netlify.app', repo: GH + 'Speech-Emotion-Recognition',
    links: [{ label: 'Run in Colab', href: 'https://colab.research.google.com/github/mohameddddt/Speech-Emotion-Recognition/blob/main/notebooks/embeddings_colab.ipynb' }],
    sub: 'Six-way emotion classification from a short spoken sentence',
    headline: 'Hearing emotion in voices it has never heard.',
    blurb: 'Evaluated on voices the model has never heard: 74.2% with frozen WavLM embeddings, where human listeners manage about 41%.',
    platform: 'Python package + Colab notebook, live demo on Netlify',
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
    slug: 'eo-bench', title: 'EO-Bench Hub', year: '2026', area: 'ML · Web app', color: 'r1', icon: 'earth', cats: ['ml', 'apps', 'live'],
    site: 'https://mohameddddt.github.io/eo-benchmark-hub/', siteLabel: 'mohameddddt.github.io/eo-benchmark-hub', repo: GH + 'eo-benchmark-hub',
    sub: 'Benchmarks for Earth-observation models, with error bars',
    headline: 'Benchmarks that tell you more than one number.',
    blurb: 'Upload predictions, get scored on hidden test splits with confidence intervals, robustness under sensor and atmospheric corruptions, calibration and the accuracy-efficiency trade-off.',
    platform: 'Web app: FastAPI + React, read-only snapshot on GitHub Pages',
    kpis: [['5', 'benchmarks, 4 task types'], ['13', 'reference models'], ['37', 'evaluations on hidden splits'], ['95%', 'bootstrap CI on every score']],
    pills: ['PyTorch', 'FastAPI', 'React', 'Kaggle'],
    stack: ['Python', 'TypeScript', 'PyTorch', 'scikit-learn', 'NumPy', 'Jupyter', 'FastAPI', 'SQLAlchemy', 'JWT', 'Celery', 'React', 'Vite', 'TanStack Query', 'SQLite', 'PostgreSQL', 'Redis', 'Kaggle', 'Docker', 'GitHub Actions', 'pytest', 'Computer vision', 'Geospatial'],
    shots: [
      { src: '/assets/projects/eo-bench/home.webp', caption: 'Home: five benchmarks, every score produced by the hub’s own evaluators.' },
      { src: '/assets/projects/eo-bench/leaderboard.webp', caption: 'EuroSAT leaderboard: 95% intervals, shaded tiers of statistically tied models, calibration and cost.' },
      { src: '/assets/projects/eo-bench/robustness.webp', caption: 'EuroSAT-C: clean accuracy against corruption accuracy, severity curves and a per-corruption heatmap.' },
      { src: '/assets/projects/eo-bench/segmentation.webp', caption: 'LandCover.ai: drag the handle to compare a model’s mask with the ground truth.' },
      { src: '/assets/projects/eo-bench/models.webp', caption: 'Models across benchmarks: each backbone’s score and rank on every track.' },
      { src: '/assets/projects/eo-bench/model-card.webp', caption: 'A model page: per-class AP, training curves and the model card.' },
    ],
    overview: [
      'Researchers upload predictions for Earth-observation tasks and are scored on hidden test splits by versioned evaluators that are identical for every model. Every primary score has a <b>95% bootstrap confidence interval</b>, and entries whose intervals overlap the leader’s share a tier.',
      'Five benchmarks across four task types: EuroSAT, a new robustness track EuroSAT-C, NWPU-RESISC45, BigEarthNet-S2 and LandCover.ai. Each has a model zoo trained on Kaggle T4 GPUs and scored through the same upload path as anyone’s file, so no number on the site is entered by hand.',
    ],
    highlights: [
      'An audit of v1 found the “hidden” EuroSAT ids were filenames like AnnualCrop_1, so reading the label off the id scored <b>100%</b>. v2 ids are content hashes, and byte-identical duplicates are removed so no image sits in both train and test.',
      '<b>Clean accuracy hides robustness.</b> Eight EuroSAT models are statistically tied within about half a point, but under EuroSAT-C’s 7 corruptions × 3 severities they spread over 25 points: ViT-S/16 keeps 70% of its accuracy, ResNet-50 keeps 45%.',
      'Calibration (ECE, NLL and Brier with reliability diagrams) whenever probabilities are uploaded, plus parameters, GFLOPs and measured throughput on a Pareto frontier. Label smoothing shows up as an ECE of about 9% on every smoothed classifier.',
      'Sentinel-2 self-supervised weights (SSL4EO-S12) tie ImageNet on EuroSAT, lose 2.7 points on aerial RESISC45 and trail by 2 mAP on BigEarthNet. Their input normalisation is picked by a frozen-feature kNN probe on train/val, never on test.',
      'A segmentation evaluator streams ZIPs of PNG masks and bootstraps mIoU over tiles; SegFormer leads LandCover.ai at <b>85.79 mIoU</b>, and roads and buildings are what separate the models.',
      'FastAPI with SQLite and in-process evaluation by default, or Postgres, Redis and Celery workers under Docker Compose. The typed React front end draws its charts in hand-built SVG and also exports as a read-only static site.',
    ],
  },
  {
    slug: 'drone-delivery', title: 'Drone-Based Delivery', year: '2026', area: 'Optimization', color: 'r2', icon: 'route', cats: ['opt', 'live'],
    site: 'https://mohameddddt.github.io/Drone-Based-Delivery-Optimization-Problem/', siteLabel: 'mohameddddt.github.io/Drone-Based-Delivery-Optimization-Problem', repo: GH + 'Drone-Based-Delivery-Optimization-Problem',
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
    slug: 'somatrack', title: 'SomaTrack', year: '2026', area: 'ML · Web app', color: 'r4', icon: 'pulse', cats: ['ml', 'apps', 'live'],
    site: 'https://somatrack-audit-web.onrender.com', siteLabel: 'somatrack-audit-web.onrender.com',
    repo: GH + 'SomaTrack-Predicting-Study-Related-Physical-Ailments',
    sub: 'Ergonomic risk audit for students, from a plain-language description',
    headline: 'What your study habits are doing to your back.',
    blurb: 'Describe how you study in your own words; seven models trained on a survey of fellow students estimate the risk of back pain, neck strain, headaches and four other ailments.',
    platform: 'Web app: React on Render, FastAPI on Render',
    role: 'Team of four. I cleaned and merged the survey data, did the feature selection and deployed the app.',
    kpis: [['7', 'ailments predicted'], ['60', 'features per model'], ['4', 'model families compared'], ['AR · FR · EN', 'with RTL']],
    pills: ['scikit-learn', 'XGBoost', 'FastAPI', 'React', 'Render'],
    stack: ['Python', 'TypeScript', 'pandas', 'NumPy', 'scikit-learn', 'XGBoost', 'Matplotlib', 'Jupyter', 'Gemini API', 'FastAPI', 'React', 'Vite', 'Tailwind CSS', 'Render', 'pytest', 'NLP'],
    shots: [
      { src: '/assets/projects/somatrack/landing.webp', caption: 'Start: describe your study habits in plain language.' },
      { src: '/assets/projects/somatrack/review.webp', caption: 'Review: the extracted profile as sliders, with the values the text never mentioned flagged.' },
      { src: '/assets/projects/somatrack/report.webp', caption: 'Report: an overall ergonomic score and a risk level for each of the seven ailments.' },
    ],
    overview: [
      'Long hours at a desk give students back pain, neck strain and tension headaches. SomaTrack turns a student’s own description of how they study into a structured profile and estimates the risk of <b>seven discomfort indicators</b>: back pain, neck strain, headaches, wrist pain, eye strain, finger numbness and overall discomfort.',
      'The models are trained on survey data collected from fellow students. It is an educational tool, not a medical device.',
    ],
    highlights: [
      'Two survey forms cleaned, merged and mapped to ordinal scales, then tested for signal: Kruskal-Wallis, Spearman and Mann-Whitney tests and association rules show stress level and the longest uninterrupted sitting stretch matter for <b>all seven ailments</b>.',
      'One classifier per ailment, each chosen from logistic regression, random forest, gradient boosting and <b>XGBoost</b> over <b>60 engineered features</b>, with oversampling for the rarer severity levels.',
      'The text is turned into features by deterministic extraction or, optionally, by <b>Gemini</b>; every extracted value is shown back as an editable slider, and the ones the text never mentioned are flagged before anything is predicted.',
      'A greedy recourse search changes one habit at a time — breaks, screen time, sitting hours, water, sleep — keeping whichever step lowers the predicted risk most, and never touches age, gender or existing conditions.',
      'FastAPI backend with shared JSON Schema and OpenAPI contracts and a pytest suite; a React + Vite front end in Arabic, French and English; both deployed on Render from one Blueprint.',
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
    links: [{ label: 'Download APK', href: GH + 'Cadence/releases/latest' }],
    sub: 'Your music, in rhythm · open-source Android player',
    headline: 'A music library that tags and tidies itself.',
    blurb: 'A music player and library manager that downloads, fingerprints and tags your files, then keeps the library tidy.',
    platform: 'Android: Flutter with native Kotlin/Java plugins',
    kpis: [['~340', 'tests'], ['Weekly', 'CI canary'], ['1,000+', 'download sources']],
    pills: ['Flutter', 'Kotlin', 'SQLite', 'FastAPI'],
    stack: ['Dart', 'Kotlin', 'Java', 'Python', 'Flutter', 'Provider', 'SQLite', 'FastAPI', 'Docker', 'GitHub Actions', 'ffmpeg', 'yt-dlp', 'Chromaprint', 'Audio'],
    phones: [
      { src: '/assets/projects/cadence/home.webp', caption: 'Home: shortcuts, recently added, and a nudge to fix songs with incomplete tags.' },
      { src: '/assets/projects/cadence/now-playing.webp', caption: 'Now playing: lyrics, sleep timer, equalizer, speed and the queue one tap away.' },
      { src: '/assets/projects/cadence/album.webp', caption: 'Album pages with the year, running time and every track.' },
      { src: '/assets/projects/cadence/albums.webp', caption: 'Your Library: playlists, songs, albums, artists and genres, read from the files’ own tags.' },
      { src: '/assets/projects/cadence/search.webp', caption: 'Search: radio, podcasts, “Surprise me” and the genres in your library.' },
      { src: '/assets/projects/cadence/dashboard.webp', caption: 'Dashboard: library health, tag coverage and what needs attention.' },
    ],
    overview: [
      'An open-source Android music player and library manager for people who keep their own files, built with Flutter and native Kotlin/Java plugins. The screenshots show a demo library.',
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
    slug: 'lumen', title: 'Lumen', year: '2026', area: 'Android app', color: 'r5', icon: 'image', cats: ['apps'],
    repo: GH + 'Lumen',
    links: [{ label: 'Download APK', href: GH + 'Lumen/releases/latest' }],
    sub: 'A calm, fast, offline gallery for Android',
    headline: 'A photo gallery that stays out of the way.',
    blurb: 'An offline gallery in Kotlin and Jetpack Compose: a day-by-day timeline, albums with custom covers and hidden folders locked behind your fingerprint.',
    platform: 'Android 11+: Kotlin & Jetpack Compose',
    kpis: [['5.9 MB', 'release APK'], ['Offline', 'no account, no network'], ['6 × 5', 'palettes × typefaces'], ['Android 11+', 'API 30 and up']],
    pills: ['Kotlin', 'Jetpack Compose', 'Coil', 'ExoPlayer'],
    stack: ['Kotlin', 'Jetpack Compose', 'Material 3', 'Coil', 'DataStore', 'ExoPlayer'],
    phones: [
      { src: '/assets/projects/lumen/photos.webp', caption: 'Photos: the timeline by day, with “On this day” memories from earlier years.' },
      { src: '/assets/projects/lumen/albums.webp', caption: 'Albums: Favorites, Videos and locked Hidden folders, your own albums with chosen covers, then device folders.' },
      { src: '/assets/projects/lumen/details.webp', caption: 'Details: date, file, camera EXIF and where the photo lives.' },
      { src: '/assets/projects/lumen/video.webp', caption: 'Video: ExoPlayer playback with a custom scrubber and mute.' },
      { src: '/assets/projects/lumen/search.webp', caption: 'Search: names, albums and months, with filters for videos, favourites, GIFs and screenshots.' },
      { src: '/assets/projects/lumen/settings.webp', caption: 'Settings: light or dark, six palettes and five typefaces.' },
    ],
    overview: [
      'An offline gallery app for Android with an editorial look: warm paper and ink with a single coral accent, Instrument Serif titles, thin line icons and a floating frosted-glass dock. The chips, switches, segmented controls and video scrubber are all custom. The screenshots show a demo library.',
      'It reads the phone’s own media library, so <b>photos are only referenced, never copied or moved</b>. Your albums, covers and hidden folders live alongside the files instead of replacing them.',
    ],
    highlights: [
      'A photo timeline grouped by day, or by month at five columns and up, with a <b>pinch-to-resize grid</b> from two to six columns and “On this day” memories from earlier years.',
      'Grid thumbnails come from Android’s own thumbnail cache through a custom Coil fetcher, which turns them into <b>hardware bitmaps on a background thread</b> so the render thread never uploads a tile mid-scroll. Release builds are shrunk with R8 and ship startup profiles.',
      '<b>Hidden folders</b> unlock with fingerprint, face or screen lock, stay out of Photos, Albums, Search and Memories, block screenshots while open and lock again when you leave the app.',
      'Recently deleted uses Android’s own trash, with restore, delete forever and the days left on each item. Search understands names, albums and dates (“october 2024”) and filters for videos, favourites, GIFs and screenshots.',
      'A viewer with pinch and double-tap zoom, ExoPlayer video, a slideshow and a details sheet with camera EXIF; six palettes, five typefaces, optional Material You colour and a pure-black dark mode.',
    ],
  },
  {
    slug: 'almanac', title: 'Almanac', year: '2026', area: 'Android app', color: 'r2', icon: 'cal', cats: ['apps'],
    repo: GH + 'almanac',
    links: [{ label: 'Download APK', href: GH + 'almanac/releases/latest' }],
    sub: 'Calendar, clock, tasks and daily rituals in one offline Android app',
    headline: 'The whole day on one page.',
    blurb: 'A calendar, real alarms, a to-do list and habit streaks in one Kotlin and Jetpack Compose app, set like a newspaper: uncoated paper, black ink and one signal red.',
    platform: 'Android 8+: Kotlin & Jetpack Compose',
    kpis: [['2.0 MB', 'release APK'], ['5', 'sections in one app'], ['4', 'clock tools'], ['Offline', 'no network access']],
    pills: ['Kotlin', 'Jetpack Compose', 'Material 3'],
    stack: ['Kotlin', 'Jetpack Compose', 'Material 3'],
    phones: [
      { src: '/assets/projects/almanac/today.webp', caption: 'Today: the hour, the day, week and year so far, the moon, the quarter and how the day feels.' },
      { src: '/assets/projects/almanac/calendar.webp', caption: 'Calendar: event dots, task rings, mood underlines and moon markers on the month grid.' },
      { src: '/assets/projects/almanac/clock.webp', caption: 'Clock: an analog face with a signal-red second hand, over alarms, timer, stopwatch and world clocks.' },
      { src: '/assets/projects/almanac/tasks.webp', caption: 'Tasks: a due date and one of three priorities, grouped from Overdue to Someday.' },
      { src: '/assets/projects/almanac/rituals.webp', caption: 'Rituals: the week, a 30-day tally and a five-week map of how the days felt.' },
    ],
    overview: [
      'One offline Android app for the things a day is made of: the calendar, alarms and timers, a to-do list and a few daily rituals. Its “print edition” look is uncoated paper, black ink and one signal red, set in IBM Plex Sans Condensed, Sans and Mono; events and rituals are marked in a few process inks, and mood shows as ink density.',
      'Everything lives in <b>one JSON file</b> in the app’s private storage, and the app has <b>no network access</b> at all. The screenshots use its built-in starter data.',
    ],
    highlights: [
      'A <b>Today</b> page that reads like a front page: the weekday, a large condensed clock, progress through the day, week and year, the real moon phase (calculated on the device), the day of the year and quarter, a mood check-in, the agenda, rituals and a daily aphorism.',
      'A month <b>calendar</b> you can swipe, with coloured event dots, task rings, mood underlines and full and new moon markers; tap a day to add or edit its events.',
      '<b>Real system alarms</b> with repeat days, snooze and dismiss that survive reboots and app updates, plus a timer with presets that rings even when the app is closed, a stopwatch that highlights the best and worst laps, and world clocks with a day/night mark.',
      '<b>Tasks</b> with three priorities and due dates, grouped into Overdue, Today, Upcoming and Someday; tick to finish, swipe to delete.',
      '<b>Rituals</b>: a habit tracker with streaks, a 30-day tally per habit and a five-week mood map.',
    ],
  },
  {
    slug: 'savepoint', title: 'Savepoint', year: '2026', area: 'Android app', color: 'r4', icon: 'pad', cats: ['apps'],
    repo: GH + 'savepoint',
    sub: 'A private video game diary for Android',
    headline: 'A game diary that never leaves your phone.',
    blurb: 'Log sessions, ratings and reviews, chase a yearly goal and let it pick from your backlog. Covers come from IGDB, playtime from Xbox, and the data stays on the phone.',
    platform: 'Android: Flutter, with SQLite on the device',
    kpis: [['8', 'statuses, half-star ratings'], ['26', 'genre and mood pages'], ['3–4', 'API calls per Xbox sync'], ['0', 'accounts or servers']],
    pills: ['Flutter', 'SQLite', 'IGDB', 'OpenXBL'],
    stack: ['Dart', 'Flutter', 'SQLite'],
    phones: [
      { src: '/assets/projects/savepoint/home.webp', caption: 'Home: what you’re playing, the yearly challenge and what’s up next.' },
      { src: '/assets/projects/savepoint/game.webp', caption: 'Game pages: status, rating, a session timer and your playtime against a typical run.' },
      { src: '/assets/projects/savepoint/library.webp', caption: 'Library: eight statuses, filters, eight sort orders, grid or list.' },
      { src: '/assets/projects/savepoint/stats.webp', caption: 'Stats: a year in review, with games finished by month.' },
      { src: '/assets/projects/savepoint/diary.webp', caption: 'Diary: sessions and milestones, grouped by month.' },
      { src: '/assets/projects/savepoint/pick.webp', caption: 'Pick for me: a slot-machine spin over the backlog, filtered by how much time you have.' },
    ],
    overview: [
      'A single-player video game diary for Android that takes the best parts of Letterboxd, Serializd, Trakt and Backloggd and keeps everything on your phone. Covers, search and discovery come from IGDB, the database Backloggd uses.',
      'Everything is stored in SQLite on the device and loaded into memory at launch, so <b>every screen opens instantly</b>. The screenshots use the app’s built-in demo data.',
    ],
    highlights: [
      'A library with eight statuses (Playing, Completed, 100%, Played, Shelved, Abandoned, Backlog, Wishlist), half-star ratings, likes, tags, priority and private notes, plus reviews with a spoiler veil.',
      'A diary that logs milestones by itself. A <b>play-session timer</b> stays above the navigation and survives the app being closed; stopping it logs the minutes, a note, the platform and an optional new status.',
      '<b>Xbox import</b> through OpenXBL: every game you’ve played is matched to IGDB in batches and reviewed before anything is added. A re-sync adds only the playtime since the last one, so it never double-counts.',
      'Stats per year or all-time: finished games and hours by month, an activity heatmap, streaks, weekday patterns, top genres, rating spread and a backlog forecast.',
      'Discover with trending, anticipated and hidden-gem rails cached for an instant open, 26 genre and mood pages with infinite scroll, a release radar, ranked lists and a top-five shelf.',
      'API keys stay on the device and are left out of backups; JSON backup and restore, plus CSV export.',
    ],
  },
  {
    slug: 'streamline', title: 'Streamline', year: '2026', area: 'Desktop & web app', color: 'r2', icon: 'play', cats: ['apps', 'live'],
    site: 'https://mohameddddt.github.io/Streamline/', siteLabel: 'mohameddddt.github.io/Streamline', repo: GH + 'Streamline',
    links: [{ label: 'Download for Windows', href: GH + 'Streamline/releases/latest' }],
    sub: 'Movie & TV streamer for the desktop and the web',
    headline: 'Play the film before the download finishes.',
    blurb: 'Starts playback long before the torrent finishes, transcodes only when the player can’t decode the file, and runs the same app in a browser.',
    platform: 'Desktop (Windows, macOS, Linux) and the web, from one codebase',
    kpis: [['2', 'builds, one codebase'], ['3', 'playback paths'], ['5', 'history sources imported'], ['v0.3.0', 'latest release']],
    pills: ['Electron', 'React', 'TypeScript', 'ffmpeg'],
    stack: ['TypeScript', 'Electron', 'React', 'Vite', 'WebTorrent', 'ffmpeg', 'GitHub Actions'],
    shotSize: [1200, 625],
    shots: [
      { src: '/assets/projects/streamline/home.webp', caption: 'Home: a rotating spotlight above the titles you were watching.' },
      { src: '/assets/projects/streamline/detail.webp', caption: 'Title pages: artwork, your rating, and the next episode to play.' },
      { src: '/assets/projects/streamline/episodes.webp', caption: 'Episodes: progress per episode, watched ticks and what’s up next.' },
      { src: '/assets/projects/streamline/sources.webp', caption: 'Smart sources: filter by quality, sort by seeds or size, or hit Play best.' },
      { src: '/assets/projects/streamline/player.webp', caption: 'The player: speed, subtitles, picture-in-picture and live peer stats.' },
      { src: '/assets/projects/streamline/insights.webp', caption: 'Insights: hours watched, titles finished and how you rate.' },
      { src: '/assets/projects/streamline/companion.webp', caption: 'Web companion: lets the browser version play torrents through the desktop app.' },
    ],
    phones: [
      { src: '/assets/projects/streamline/phone-home.webp', caption: 'On a phone, the dock becomes a tab bar.' },
      { src: '/assets/projects/streamline/phone-detail.webp', caption: 'A title page on a phone.' },
      { src: '/assets/projects/streamline/phone-sources.webp', caption: 'Sources on a phone.' },
    ],
    overview: [
      'A movie and TV streamer that speaks the Stremio addon protocol, so it works with Torrentio, Cinemeta, OpenSubtitles and any addon that publishes a manifest. Everything it uses is free: no account, no API key.',
      'The desktop app and the web version share one interface and one codebase. The interface only talks to a typed <b>window.api</b>, which is IPC on the desktop and a browser implementation on the web, so the compiler keeps the two builds in step.',
    ],
    highlights: [
      '<b>WebTorrent</b> fetches pieces in order and serves them from a loopback-only HTTP server with range support, so playback starts long before the file is complete.',
      'Downloads run in the background, survive restarts and can be watched while still in progress.',
      'Chromium only decodes H.264/AAC, so <b>ffprobe</b> inspects each file and picks direct play, an AC3→AAC remux that copies the video untouched, or a hardware-accelerated HEVC transcode.',
      'Browsers can’t talk to torrent peers, so the web version hands torrents to the desktop engine through a <b>token-protected companion</b> that listens on 127.0.0.1 only and stays off until you switch it on.',
      '<b>Play best</b> reads resolution, HDR, codec, audio, size and seeds from each source’s text and picks a healthy release the player can decode without converting. Series offer the next episode on the same release.',
      'Imports watch history and ratings from Letterboxd, IMDb, Serializd, Trakt and Simkl, scrobbles live to Trakt and Simkl, and updates itself through electron-updater.',
    ],
  },
  {
    slug: 'mytube', title: 'My Tube', year: '2026', area: 'Desktop app', color: 'r3', icon: 'dl', cats: ['apps'],
    siteLabel: 'localhost:8080', repo: GH + 'mytube-invidious',
    links: [{ label: 'Download for Windows', href: GH + 'mytube-invidious/releases/latest' }],
    sub: 'A self-hosted YouTube interface for Windows',
    headline: 'YouTube on my own PC, gone when I close it.',
    blurb: 'Invidious in Docker inside WSL2 with a hand-written web app on top: search, watch, subscribe without an account and download to the PC. One 1.3 MB Rust exe runs it all, and closing the window shuts it all down.',
    platform: 'Windows desktop app: Rust with a WebView2 window, Invidious in WSL2',
    kpis: [['0 MB', 'RAM while stopped'], ['1.3 MB', 'single-file desktop app'], ['7 MB', 'local server at idle'], ['127.0.0.1', 'every service']],
    pills: ['Rust', 'WebView2', 'Invidious', 'Docker', 'yt-dlp'],
    stack: ['Rust', 'JavaScript', 'WebView2', 'Win32 API', 'Invidious', 'Docker', 'PostgreSQL', 'yt-dlp', 'ffmpeg'],
    shots: [
      { src: '/assets/projects/mytube/feed.webp', caption: 'Feed: the latest from your channels, built on demand without a Google account.' },
      { src: '/assets/projects/mytube/watch.webp', caption: 'Watch: a custom player, with Like, Watch later and Download beside the title.' },
      { src: '/assets/projects/mytube/search.webp', caption: 'Search, with filters for type, sort, date and length.' },
      { src: '/assets/projects/mytube/channels.webp', caption: 'Channels: subscriptions kept on the PC.' },
    ],
    overview: [
      'A personal YouTube interface for Windows. It runs Invidious and its companion service in Docker inside WSL2, with a small hand-written web app on top: no frameworks, no build step, no web fonts.',
      'Subscriptions, history and watch later live in one file behind the local server, so the app window and any browser tab always show the same data.',
    ],
    highlights: [
      'One click starts the containers, the local server and the app window. Closing the window stops everything and hands WSL’s memory back, so it uses <b>0 MB of RAM while stopped</b>.',
      'A custom player with quality and speed menus, picture-in-picture and YouTube’s keyboard shortcuts. It falls back from your downloaded file to DASH, to a 360p stream, to the embedded player.',
      'A small, local and explainable recommender: the feed mixes in videos related to the ones you liked, finished or saved, favours channels you watch often, and says which video each suggestion came from.',
      'Downloads through <b>yt-dlp</b> and ffmpeg, from 480p to 1080p video or MP3, including whole playlists with per-video progress and cancel; videos you already have are skipped.',
      'Rewritten from Python to <b>Rust</b>: the launcher and the backend are now one program. A side-by-side test sent the same requests to both versions and found no differences, and the server idles at <b>7 MB instead of 27 MB</b>.',
      'The window is <b>WebView2</b> in a plain Win32 window instead of an Edge app window: about a third less memory (157 MB against 238 MB), real full screen for videos, and a window that lives exactly as long as the app.',
      'Every service listens on 127.0.0.1, download profiles are fixed, video ids are validated and requests with a foreign Host or Origin are refused.',
      'A <b>1.3 MB</b> single-file exe: the build script embeds the interface and writes the icon, version information and manifest itself, so it builds with cargo alone. Shipped as a signed Inno Setup installer that needs no administrator rights.',
    ],
  },
  {
    slug: 'feather-pdf', title: 'Feather PDF', year: '2026', area: 'Desktop app', color: 'r6', icon: 'feather', cats: ['apps'],
    repo: GH + 'feather-pdf',
    links: [{ label: 'Download for Windows', href: GH + 'feather-pdf/releases/latest' }],
    sub: 'A fast PDF reader for Windows that stays light on memory',
    headline: 'A PDF reader that weighs almost nothing.',
    blurb: 'Rust on top of PDFium, with an interface drawn in plain Win32 and GDI: about 16 MB of memory with a 541-page textbook open, and under 70 MB while scrolling, zooming and searching through it.',
    platform: 'Windows 10 and 11: Rust, Win32 and GDI on PDFium',
    kpis: [['16 MB', 'with a 541-page book open'], ['< 70 MB', 'reading the whole book'], ['0.8 MB', 'executable'], ['1', 'crate: windows-sys']],
    pills: ['Rust', 'PDFium', 'Win32 API'],
    stack: ['Rust', 'PDFium', 'Win32 API'],
    shotSize: [1200, 800],
    shots: [
      { src: '/assets/projects/feather-pdf/reader-dark.webp', caption: 'Reading in dark mode, with the contents sidebar and every search match highlighted.' },
      { src: '/assets/projects/feather-pdf/reader-light.webp', caption: 'Fit-page view in the light theme, which follows the Windows setting.' },
      { src: '/assets/projects/feather-pdf/welcome-dark.webp', caption: 'The welcome screen: open a file, or drop one on the window.' },
      { src: '/assets/projects/feather-pdf/welcome-light.webp', caption: 'The same screen in light mode, with a matching title bar.' },
    ],
    overview: [
      'A PDF reader for Windows written in Rust on top of PDFium. There is no browser engine and no UI framework: the toolbar, scrollbars and welcome screen are drawn with <b>GDI</b>, and the icons come from the Segoe Fluent Icons font that ships with Windows.',
      'With a 541-page, 21 MB textbook it uses about <b>16 MB</b> of memory after opening and stays <b>under 70 MB</b> while scrolling, zooming and searching through the whole book.',
    ],
    highlights: [
      'Only visible pages are rendered, at screen resolution, into a page cache with a fixed <b>32 MB budget</b> that drops the least recently used pages first and empties when the window is minimized.',
      'Zoomed far in, only the visible part of a page is rendered, so 800% zoom never needs a huge bitmap; the file itself is read on demand instead of being loaded into memory.',
      'PDFium keeps fonts and parsed data for every page it has touched. When that grows by more than 32 MB, the reader quietly reopens the document, and what is on screen does not change.',
      'Continuous scrolling, fit width and fit page, zoom from 10% to 800% that keeps the point under the mouse in place, a bookmarks sidebar, text selection across pages, and search that runs in the background so the window never freezes.',
      'Remembers the page, zoom and fit mode of every document; dark and light themes follow Windows, and it is per-monitor DPI aware, so pages stay sharp on high-DPI displays.',
      'Builds with the GNU Rust toolchain and no Visual Studio: <b>build.rs</b> draws the app icon with a small anti-aliased vector rasterizer and writes the Windows resource object by hand.',
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
    phones: [
      { src: '/assets/projects/qnow/queue.webp', caption: 'Running a queue: capacity, who is waiting, and one tap to notify or serve each customer.' },
      { src: '/assets/projects/qnow/my-queues.webp', caption: 'My Queues: the queues a customer has joined, and a button to join another.' },
      { src: '/assets/projects/qnow/notification.webp', caption: 'Push notifications reach the customer’s phone.' },
      { src: '/assets/projects/qnow/login.webp', caption: 'One login for customers and business owners.' },
    ],
    overview: ['Lets businesses run a virtual queue and customers wait for their turn without standing in line.'],
    highlights: ['A Flutter client built on BLoC.', 'An Express API with JWT authentication and bcrypt-hashed passwords.', 'Supabase for storage.'],
  },
];

export const BY_SLUG: Record<string, Project> = Object.fromEntries(PROJECTS.map(p => [p.slug, p]));
export const projectHref = (p: Project | string) => `/work/${typeof p === 'string' ? p : p.slug}/`;
export const nextProject = (p: Project) => PROJECTS[(PROJECTS.indexOf(p) + 1) % PROJECTS.length];
