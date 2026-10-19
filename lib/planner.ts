// Load-dependent drone routing on a canvas: Clarke–Wright savings + load-aware 2-opt / relocate,
// flown on one clock. Plain DOM so it can be mounted more than once (home page and the drone project page).

export type PlannerEls = {
  canvas: HTMLCanvasElement;
  stops: HTMLElement; drones: HTMLElement; energy: HTMLElement; saved: HTMLElement;
  hint: HTMLElement; live: HTMLElement;
};
export type Planner = { shuffle(): void; replay(): void; clear(): void; setBase(base: boolean): void; destroy(): void };

type Stop = { x: number; y: number; w: number };

const ALPHA = 1, BETA = 0.3, CAP = 8, MAX = 26, WORLD_W = 10, WORLD_H = 6.25; // canvas is 16:10
const DEPOT: Stop = { x: .5, y: .5, w: 0 };

export function createPlanner(els: PlannerEls, seed = 7, count = 14): Planner {
  const cv = els.canvas, ctx = cv.getContext('2d')!;
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 0, H = 0, stops: Stop[] = [], plan: number[][] = [], base: number[][] = [], showBase = false;
  let animStart = 0, animDur = 0, raf = 0, started = false, alive = true;
  let C = { bg: '', ink3: '', line: '', accent: '', r: [] as string[] };

  function readColors() {
    const cs = getComputedStyle(root), v = (n: string) => cs.getPropertyValue(n).trim();
    C = { bg: v('--bg-2'), ink3: v('--ink-3'), line: v('--line-2'), accent: v('--accent'),
          r: [v('--r2'), v('--r3'), v('--r4'), v('--r5'), v('--r6'), v('--r1')] };
  }
  const dist = (a: Stop, b: Stop) => Math.hypot((a.x - b.x) * WORLD_W, (a.y - b.y) * WORLD_H);
  const load = (r: number[]) => r.reduce((s, i) => s + stops[i].w, 0);
  function routeEnergy(r: number[]) {
    let w = load(r), e = 0, prev = DEPOT;
    for (const i of r) { e += dist(prev, stops[i]) * (ALPHA + BETA * w / CAP); w -= stops[i].w; prev = stops[i]; }
    return e + dist(prev, DEPOT) * ALPHA;
  }
  const total = (rs: number[][]) => rs.reduce((s, r) => s + routeEnergy(r), 0);

  // naive baseline: nearest feasible neighbour, start a new drone when full
  function nearestNeighbour() {
    const left = new Set(stops.map((_, i) => i)), routes: number[][] = [];
    while (left.size) {
      const r: number[] = []; let cap = CAP, cur = DEPOT;
      for (;;) {
        let best = -1, bd = Infinity;
        for (const i of left) { if (stops[i].w > cap) continue; const d = dist(cur, stops[i]); if (d < bd) { bd = d; best = i; } }
        if (best < 0) break;
        r.push(best); left.delete(best); cap -= stops[best].w; cur = stops[best];
      }
      routes.push(r);
    }
    return routes;
  }
  // Clarke–Wright savings, capacity-constrained
  function savings() {
    const n = stops.length, owner = stops.map((_, i) => [i]), S: [number, number, number][] = [];
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++)
      S.push([dist(DEPOT, stops[i]) + dist(DEPOT, stops[j]) - dist(stops[i], stops[j]), i, j]);
    S.sort((a, b) => b[0] - a[0]);
    for (const [s, i, j] of S) {
      if (s <= 0) break;
      const a = owner[i], b = owner[j];
      if (a === b || load(a) + load(b) > CAP) continue;
      if (a[a.length - 1] !== i) { if (a[0] === i) a.reverse(); else continue; }
      if (b[0] !== j) { if (b[b.length - 1] === j) b.reverse(); else continue; }
      const m = a.concat(b);
      for (const k of m) owner[k] = m;
    }
    return [...new Set(owner)];
  }
  // load-aware local search: 2-opt (incl. reversal) inside routes, relocate between routes
  function improve(input: number[][]) {
    let rs = input.map(r => r.slice()), better = true, guard = 0;
    while (better && guard++ < 50) {
      better = false;
      for (const r of rs) {
        let e = routeEnergy(r);
        for (let a = 0; a < r.length - 1; a++) for (let b = a + 1; b < r.length; b++) {
          const c = r.slice(0, a).concat(r.slice(a, b + 1).reverse(), r.slice(b + 1)), ce = routeEnergy(c);
          if (ce < e - 1e-9) { r.splice(0, r.length, ...c); e = ce; better = true; }
        }
      }
      for (let A = 0; A < rs.length; A++) {
        for (let ai = 0; ai < rs[A].length; ai++) {
          const s = rs[A][ai], ra = rs[A], without = ra.slice(0, ai).concat(ra.slice(ai + 1));
          const gain = routeEnergy(ra) - (without.length ? routeEnergy(without) : 0);
          let best: [number, number[]] | null = null, bestDelta = -1e-9;
          for (let B = 0; B < rs.length; B++) {
            if (B === A || !rs[B].length || load(rs[B]) + stops[s].w > CAP) continue;
            const rb = rs[B], eb = routeEnergy(rb);
            for (let p = 0; p <= rb.length; p++) {
              const c = rb.slice(0, p).concat([s], rb.slice(p)), d = routeEnergy(c) - eb - gain;
              if (d < bestDelta) { bestDelta = d; best = [B, c]; }
            }
          }
          if (best) { rs[A] = without; rs[best[0]] = best[1]; better = true; ai--; }
        }
      }
      rs = rs.filter(r => r.length);
    }
    return rs;
  }
  function replan() {
    if (!stops.length) { plan = []; base = []; return; }
    base = nearestNeighbour();
    const a = improve(savings()), b = improve(base);
    plan = total(a) <= total(b) ? a : b;
  }

  // geometry of a route in canvas pixels, with cumulative lengths
  function geom(r: number[]) {
    const pts = [DEPOT].concat(r.map(i => stops[i]), [DEPOT]).map(p => ({ x: p.x * W, y: p.y * H }));
    const cum = [0];
    for (let k = 1; k < pts.length; k++) cum.push(cum[k - 1] + Math.hypot(pts[k].x - pts[k - 1].x, pts[k].y - pts[k - 1].y));
    return { pts, cum, len: cum[cum.length - 1], pos: pts[0], ang: 0, done: false, col: '' };
  }

  function draw(now: number) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = C.line;
    for (let x = 14; x < W; x += 28) for (let y = 14; y < H; y += 28) ctx.fillRect(x - .75, y - .75, 1.5, 1.5);

    const routes = showBase ? base : plan;
    const gs = routes.map(geom);
    const maxLen = Math.max(1, ...gs.map(g => g.len));
    const speed = animDur ? maxLen / animDur : Infinity;
    const travelled = animStart && !reduce ? (now - animStart) * speed : Infinity;
    const served = new Set<number>();

    gs.forEach((g, k) => {
      const col = C.r[k % C.r.length], d = Math.min(travelled, g.len);
      ctx.save();
      ctx.globalAlpha = .4; ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.setLineDash([3, 5]);
      ctx.beginPath(); g.pts.forEach((p, n) => (n ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.stroke();
      ctx.restore();
      ctx.strokeStyle = col; ctx.lineWidth = 2.25; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(g.pts[0].x, g.pts[0].y);
      let pos = g.pts[0], ang = 0;
      for (let n = 1; n < g.pts.length; n++) {
        const a = g.pts[n - 1], b = g.pts[n];
        ang = Math.atan2(b.y - a.y, b.x - a.x);
        if (g.cum[n] <= d) { ctx.lineTo(b.x, b.y); pos = b; if (n < g.pts.length - 1) served.add(routes[k][n - 1]); }
        else { const f = (d - g.cum[n - 1]) / (g.cum[n] - g.cum[n - 1] || 1); pos = { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f }; ctx.lineTo(pos.x, pos.y); break; }
      }
      ctx.stroke();
      g.pos = pos; g.ang = ang; g.done = d >= g.len; g.col = col;
    });

    const colorOf: Record<number, string> = {};
    routes.forEach((r, k) => r.forEach(i => { colorOf[i] = C.r[k % C.r.length]; }));
    stops.forEach((s, i) => {
      const x = s.x * W, y = s.y * H, rad = 3.6 + s.w * 1.5, col = colorOf[i] || C.ink3;
      ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fillStyle = served.has(i) ? col : C.bg; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = col; ctx.stroke();
    });

    const dx = DEPOT.x * W, dy = DEPOT.y * H;
    ctx.fillStyle = C.accent;
    ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(dx - 8, dy - 8, 16, 16, 4); else ctx.rect(dx - 8, dy - 8, 16, 16); ctx.fill();
    ctx.fillStyle = C.ink3; ctx.font = '500 10px ui-monospace, monospace'; ctx.textAlign = 'center';
    ctx.fillText('HUB', dx, dy + 22);

    gs.forEach(g => {
      if (g.done || travelled === Infinity) return;
      ctx.save(); ctx.translate(g.pos.x, g.pos.y); ctx.rotate(g.ang + Math.PI / 4);
      ctx.strokeStyle = g.col; ctx.fillStyle = g.col; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(6, 0); ctx.moveTo(0, -6); ctx.lineTo(0, 6); ctx.stroke();
      for (const [ox, oy] of [[-6, 0], [6, 0], [0, -6], [0, 6]]) { ctx.beginPath(); ctx.arc(ox, oy, 2.8, 0, Math.PI * 2); ctx.fill(); }
      ctx.beginPath(); ctx.arc(0, 0, 2.6, 0, Math.PI * 2); ctx.fillStyle = C.bg; ctx.fill(); ctx.stroke();
      ctx.restore();
    });

    return gs.length > 0 && travelled < maxLen;
  }

  function loop(now: number) {
    raf = 0;
    if (!alive) return;
    if (draw(now)) raf = requestAnimationFrame(loop);
    else animStart = 0;
  }
  function fly() {
    cancelAnimationFrame(raf); raf = 0;
    const routes = showBase ? base : plan;
    const maxLen = Math.max(0, ...routes.map(r => geom(r).len));
    animDur = Math.min(6500, Math.max(2600, maxLen * 4.2));
    if (reduce || !routes.length) { animStart = 0; draw(performance.now()); return; }
    animStart = performance.now();
    raf = requestAnimationFrame(loop);
  }

  function updateStats() {
    const n = stops.length, routes = showBase ? base : plan;
    els.stops.textContent = n ? String(n) : '–';
    els.drones.textContent = n ? String(routes.length) : '–';
    els.energy.textContent = n ? total(routes).toFixed(1) : '–';
    const saved = n ? (1 - total(plan) / total(base)) * 100 : 0;
    els.saved.textContent = n ? (showBase ? 'baseline' : '−' + saved.toFixed(1) + '%') : '–';
    els.saved.classList.toggle('good', n > 0 && !showBase);
    els.hint.textContent = n >= MAX ? 'max ' + MAX + ' · click one to remove' : (matchMedia('(hover: none)').matches ? 'tap' : 'click') + ' to add a stop';
    els.live.textContent = n
      ? 'Planned ' + plan.length + ' drones for ' + n + ' stops using ' + total(plan).toFixed(1) + ' energy units, ' + saved.toFixed(1) + ' percent less than nearest-neighbour.'
      : 'No stops. Click the map to add some.';
  }
  function changed() { replan(); updateStats(); fly(); }

  function rng(s: number) { return () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function scatter(n: number, sd: number) {
    const r = rng(sd); stops = [];
    let tries = 0;
    while (stops.length < n && tries++ < 4000) {
      const p = { x: .06 + r() * .88, y: .08 + r() * .84, w: 1 + Math.floor(r() * 3) };
      if (dist(p, DEPOT) < 1.1) continue;
      if (stops.some(s => dist(s, p) < .75)) continue;
      stops.push(p);
    }
  }

  function resize() {
    const r = cv.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
    W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!raf) draw(performance.now());
  }

  const onClick = (e: MouseEvent) => {
    const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    const hit = stops.findIndex(s => Math.hypot((s.x - x) * r.width, (s.y - y) * r.height) < 14);
    if (hit >= 0) stops.splice(hit, 1);
    else {
      if (stops.length >= MAX) return;
      if (Math.hypot((x - DEPOT.x) * r.width, (y - DEPOT.y) * r.height) < 16) return;
      stops.push({ x, y, w: 1 + Math.floor(Math.random() * 3) });
    }
    changed();
  };
  const onTheme = () => { readColors(); if (!raf) draw(performance.now()); };

  cv.addEventListener('click', onClick);
  addEventListener('themechange', onTheme);
  readColors();
  scatter(count, seed);
  replan(); updateStats();
  const ro = new ResizeObserver(resize); ro.observe(cv);
  // first flight when the planner scrolls into view
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && !started) { started = true; fly(); io.disconnect(); }
  }), { threshold: .4 });
  io.observe(cv);

  return {
    shuffle() { scatter(10 + Math.floor(Math.random() * 8), (Math.random() * 1e9) | 0); changed(); },
    replay: fly,
    clear() { stops = []; changed(); },
    setBase(b: boolean) { showBase = b; updateStats(); fly(); },
    destroy() {
      alive = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      cv.removeEventListener('click', onClick); removeEventListener('themechange', onTheme);
    },
  };
}
