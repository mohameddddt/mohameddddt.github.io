'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap, ScrollTrigger, getLenis, reduced } from '@/lib/motion';

/*
 * "Latent space": one fixed WebGL point cloud behind every page. Each particle knows five positions —
 * a sphere, a small neural network, a data terrain, a spiral and a clustered cloud — and the shader blends
 * between two of them. Any element with data-field="<stage>" picks the stage while it is on screen, and the
 * cursor pushes particles out of its way.
 */

type Stage = { shape: number; x: number; y: number; scale: number; rx: number; opacity: number };
const STAGES: Record<string, Stage> = {
  hero: { shape: 0, x: -0.9, y: 0.6, scale: 0.88, rx: 0, opacity: 1 },
  stats: { shape: 0, x: 2.6, y: 0.3, scale: 0.8, rx: 0, opacity: 0.7 },
  about: { shape: 1, x: 2.3, y: 0, scale: 0.95, rx: 0.12, opacity: 0.95 },
  projects: { shape: 2, x: 0, y: -1.6, scale: 1, rx: 0.5, opacity: 0.42 },
  playground: { shape: 3, x: -2.2, y: 0.5, scale: 0.95, rx: 1.05, opacity: 0.42 },
  skills: { shape: 4, x: 0, y: 0, scale: 1, rx: 0, opacity: 0.45 },
  contact: { shape: 0, x: 3.3, y: 0.7, scale: 0.72, rx: 0, opacity: 0.9 },
  work: { shape: 4, x: 0.6, y: 0, scale: 1, rx: 0, opacity: 0.4 },
  'work-cover': { shape: 3, x: 0, y: 0, scale: 1.1, rx: 1.1, opacity: 0.55 },
  'work-numbers': { shape: 2, x: 0, y: -1.3, scale: 1, rx: 0.5, opacity: 0.45 },
  lost: { shape: 3, x: 0, y: 0.3, scale: 0.9, rx: 1.15, opacity: 0.7 },
};

const VERT = /* glsl */ `
uniform float uTime, uProgress, uFrom, uTo, uSize, uPR, uHover;
uniform vec3 uMouse;
attribute vec3 aS1, aS2, aS3, aS4;
attribute float aRand;
varying float vRand;
varying float vDepth;

vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

vec3 shapeOf(float k){
  return position * (1.0 - step(0.5, abs(k)))
       + aS1 * (1.0 - step(0.5, abs(k - 1.0)))
       + aS2 * (1.0 - step(0.5, abs(k - 2.0)))
       + aS3 * (1.0 - step(0.5, abs(k - 3.0)))
       + aS4 * (1.0 - step(0.5, abs(k - 4.0)));
}

void main(){
  // each particle leaves a little after the one before it, so shapes dissolve rather than snap
  float d = aRand * 0.4;
  float f = smoothstep(d, d + 0.6, uProgress);
  vec3 p = mix(shapeOf(uFrom), shapeOf(uTo), f);

  float t = uTime * 0.16;
  vec3 q = p * 0.55;
  vec3 drift = vec3(snoise(q + vec3(t, 0.0, 0.0)), snoise(q + vec3(0.0, t + 17.0, 0.0)), snoise(q + vec3(0.0, 0.0, t + 31.0)));
  float flight = sin(f * 3.14159);
  p += drift * (0.07 + flight * 0.9);

  vec4 world = modelMatrix * vec4(p, 1.0);
  vec2 away = world.xy - uMouse.xy;
  float dist = length(away);
  float push = smoothstep(1.5, 0.0, dist) * uHover;
  world.xy += normalize(away + 1e-4) * push * 0.6;
  world.z += push * 0.5;

  vec4 mv = viewMatrix * world;
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.4 + aRand * 0.95) * uPR / -mv.z;
  vRand = aRand;
  vDepth = smoothstep(11.0, 4.0, -mv.z);
}
`;

const FRAG = /* glsl */ `
uniform vec3 uInk, uAccent;
uniform float uOpacity;
varying float vRand;
varying float vDepth;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  if (r > 0.5) discard;
  float a = smoothstep(0.5, 0.08, r);
  vec3 col = mix(uInk, uAccent, step(0.87, vRand));
  gl_FragColor = vec4(col, a * uOpacity * (0.3 + 0.7 * vDepth));
}
`;

function rng(seed: number) {
  return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

function buildShapes(N: number) {
  const r = rng(20260519);
  const gauss = () => { let u = 0; while (!u) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); };
  const S = [0, 1, 2, 3, 4].map(() => new Float32Array(N * 3));
  const put = (s: Float32Array, i: number, x: number, y: number, z: number) => { s[i * 3] = x; s[i * 3 + 1] = y; s[i * 3 + 2] = z; };
  const order = (shuffle: boolean) => {
    const o = Array.from({ length: N }, (_, i) => i);
    if (shuffle) for (let i = N - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; }
    return o;
  };

  // 0 · sphere (Fibonacci lattice, a thin shell)
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, rad = Math.sqrt(1 - y * y), th = golden * i, R = 2 * (1 + gauss() * 0.014);
    put(S[0], i, Math.cos(th) * rad * R, y * R, Math.sin(th) * rad * R);
  }

  // 1 · a small neural network: five layers of neurons, the rest of the points along the weights
  const layers = [3, 4, 5, 4, 2].map((g, l) => {
    const ns: [number, number, number][] = [];
    for (let a = 0; a < g; a++) for (let b = 0; b < g; b++) ns.push([(l - 2) * 1.15, (a - (g - 1) / 2) * 0.55, (b - (g - 1) / 2) * 0.55]);
    return ns;
  });
  let o = order(true);
  for (let k = 0; k < N; k++) {
    const i = o[k];
    if (k < N * 0.42) {
      const L = layers[k % 5], n = L[Math.floor(r() * L.length)];
      put(S[1], i, n[0] + gauss() * 0.045, n[1] + gauss() * 0.045, n[2] + gauss() * 0.045);
    } else {
      const l = Math.floor(r() * 4), a = layers[l][Math.floor(r() * layers[l].length)], b = layers[l + 1][Math.floor(r() * layers[l + 1].length)], t = r();
      put(S[1], i, a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t);
    }
  }

  // 2 · a data terrain: a dot grid with rolling hills
  o = order(true);
  const cols = Math.ceil(Math.sqrt(N * 1.9)), rows = Math.ceil(N / cols);
  for (let k = 0; k < N; k++) {
    const i = o[k], cx = k % cols, cz = Math.floor(k / cols);
    const x = (cx / (cols - 1) - 0.5) * 12, z = (cz / Math.max(1, rows - 1) - 0.5) * 6.4;
    put(S[2], i, x, Math.sin(x * 0.75) * 0.32 + Math.cos(z * 1.2 + x * 0.35) * 0.26, z);
  }

  // 3 · a three-armed spiral (a delivery fleet's loops, seen from above)
  o = order(true);
  for (let k = 0; k < N; k++) {
    const i = o[k], arm = k % 3, rad = 0.2 + Math.pow(r(), 0.75) * 2.7;
    const ang = arm * (Math.PI * 2 / 3) + rad * 1.25 + gauss() * 0.16 / (rad * 0.5 + 0.35);
    put(S[3], i, Math.cos(ang) * rad, gauss() * 0.07 * (3 - rad) / 3, Math.sin(ang) * rad);
  }

  // 4 · a clustered cloud: eleven groups, like the skill areas
  o = order(true);
  const centers = Array.from({ length: 11 }, () => [(r() - 0.5) * 7.2, (r() - 0.5) * 3.8, (r() - 0.5) * 2.6]);
  for (let k = 0; k < N; k++) {
    const i = o[k];
    if (r() < 0.86) { const c = centers[k % centers.length]; put(S[4], i, c[0] + gauss() * 0.3, c[1] + gauss() * 0.3, c[2] + gauss() * 0.3); }
    else put(S[4], i, (r() - 0.5) * 9, (r() - 0.5) * 5, (r() - 0.5) * 3);
  }

  const rand = new Float32Array(N);
  for (let i = 0; i < N; i++) rand[i] = r();
  return { S, rand };
}

const hexToVec = (hex: string): [number, number, number] => {
  const h = hex.trim().replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h.slice(0, 6);
  const n = parseInt(full, 16);
  return Number.isNaN(n) ? [1, 1, 1] : [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
};

export default function Field() {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<{ stage: (name: string) => void; tint: () => void } | null>(null);
  const path = usePathname();

  useEffect(() => {
    let alive = true, cleanup = () => {};
    (async () => {
      const THREE = await import('three');
      if (!alive || !host.current) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try { renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' }); }
      catch { return; } // no WebGL: the page reads fine without the field
      const still = reduced();
      const small = innerWidth < 760;
      const N = small ? 4200 : 9000;
      const pr = Math.min(devicePixelRatio || 1, 2);
      renderer.setPixelRatio(pr);
      renderer.setSize(innerWidth, innerHeight);
      renderer.setClearColor(0x000000, 0);
      host.current.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 50);
      camera.position.set(0, 0, 7);

      const { S, rand } = buildShapes(N);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(S[0], 3));
      geo.setAttribute('aS1', new THREE.BufferAttribute(S[1], 3));
      geo.setAttribute('aS2', new THREE.BufferAttribute(S[2], 3));
      geo.setAttribute('aS3', new THREE.BufferAttribute(S[3], 3));
      geo.setAttribute('aS4', new THREE.BufferAttribute(S[4], 3));
      geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));

      const u = {
        uTime: { value: 0 }, uProgress: { value: 1 }, uFrom: { value: 0 }, uTo: { value: 0 },
        uSize: { value: small ? 34 : 30 }, uPR: { value: pr }, uHover: { value: 0 },
        uMouse: { value: new THREE.Vector3(99, 99, 0) },
        uInk: { value: new THREE.Vector3(1, 1, 1) }, uAccent: { value: new THREE.Vector3(1, 0.4, 0.1) }, uOpacity: { value: 0 },
      };
      const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: u, transparent: true, depthWrite: false });
      const points = new THREE.Points(geo, mat);
      points.frustumCulled = false;
      scene.add(points);

      // what GSAP tweens; applied to the object every frame
      const st = { x: 0, y: 0.45, scale: 1, rx: 0, opacity: 0 };
      let current = '';
      const stage = (name: string) => {
        const s = STAGES[name]; if (!s || name === current) return;
        current = name;
        const narrow = innerWidth < 900;
        if (s.shape !== u.uTo.value) {
          u.uFrom.value = u.uProgress.value > 0.5 ? u.uTo.value : u.uFrom.value;
          u.uTo.value = s.shape;
          gsap.fromTo(u.uProgress, { value: 0 }, { value: 1, duration: still ? 0 : 2.2, ease: 'power2.inOut', overwrite: true });
        }
        gsap.to(st, {
          x: narrow ? 0 : s.x, y: narrow ? s.y + 0.4 : s.y, scale: narrow ? s.scale * 0.62 : s.scale, rx: s.rx,
          opacity: narrow ? s.opacity * 0.6 : s.opacity, duration: still ? 0 : 2, ease: 'power3.inOut', overwrite: true,
        });
      };
      const tint = () => {
        const root = getComputedStyle(document.documentElement);
        const main = document.querySelector<HTMLElement>('main.pp');
        const accent = (main && getComputedStyle(main).getPropertyValue('--c').trim()) || root.getPropertyValue('--accent');
        u.uInk.value.set(...hexToVec(root.getPropertyValue('--ink')));
        u.uAccent.value.set(...hexToVec(accent));
      };
      api.current = { stage, tint };
      tint();

      // cursor → a point on the z = 0 plane
      const target = new THREE.Vector3(99, 99, 0), ndc = new THREE.Vector3(), dir = new THREE.Vector3();
      let px = 0, py = 0, hoverTo = 0;
      const onMove = (e: PointerEvent) => {
        px = e.clientX / innerWidth * 2 - 1; py = -(e.clientY / innerHeight) * 2 + 1;
        ndc.set(px, py, 0.5).unproject(camera);
        dir.copy(ndc).sub(camera.position).normalize();
        target.copy(camera.position).addScaledVector(dir, -camera.position.z / dir.z);
        hoverTo = e.pointerType === 'mouse' ? 1 : 0;
      };
      const onLeave = () => { hoverTo = 0; };
      if (!still) { addEventListener('pointermove', onMove, { passive: true }); document.addEventListener('pointerleave', onLeave); }

      const onResize = () => {
        camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
      };
      addEventListener('resize', onResize);
      addEventListener('themechange', tint);

      let spin = 0, last = performance.now(), raf = 0;
      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        if (document.hidden) { last = now; return; }
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        if (!still) {
          u.uTime.value += dt;
          const vel = getLenis()?.velocity ?? 0;
          spin += dt * 0.06 + vel * 0.0009;
          u.uMouse.value.lerp(target, 0.12);
          u.uHover.value += (hoverTo - u.uHover.value) * 0.06;
        }
        points.position.set(st.x + px * 0.12, st.y + py * 0.08, 0);
        points.rotation.set(st.rx - py * 0.08, spin + px * 0.22, 0);
        points.scale.setScalar(st.scale);
        u.uOpacity.value = st.opacity;
        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(frame);
      gsap.to(st, { opacity: STAGES.hero.opacity, duration: still ? 0 : 2.4, ease: 'power2.out', delay: 0.2 });
      dispatchEvent(new Event('field-ready'));

      cleanup = () => {
        cancelAnimationFrame(raf);
        removeEventListener('pointermove', onMove); document.removeEventListener('pointerleave', onLeave);
        removeEventListener('resize', onResize); removeEventListener('themechange', tint);
        gsap.killTweensOf(st); gsap.killTweensOf(u.uProgress);
        geo.dispose(); mat.dispose(); renderer.dispose(); renderer.domElement.remove();
        api.current = null;
      };
    })();
    return () => { alive = false; cleanup(); };
  }, []);

  // each page: watch its data-field sections and re-read the tint
  useEffect(() => {
    let triggers: ScrollTrigger[] = [];
    const bind = () => {
      triggers.forEach(t => t.kill());
      api.current?.tint();
      const els = [...document.querySelectorAll<HTMLElement>('[data-field]')];
      triggers = els.map(el => ScrollTrigger.create({
        trigger: el, start: 'top 60%', end: 'bottom 40%',
        onToggle: self => { if (self.isActive) api.current?.stage(el.dataset.field!); },
      }));
      // whichever section holds the middle of the screen right now
      const mid = innerHeight / 2;
      const now = els.find(el => { const b = el.getBoundingClientRect(); return b.top <= mid && b.bottom >= mid; }) ?? els[0];
      if (now) api.current?.stage(now.dataset.field!);
    };
    const t = setTimeout(bind, 60);
    addEventListener('field-ready', bind);
    return () => { clearTimeout(t); removeEventListener('field-ready', bind); triggers.forEach(tr => tr.kill()); };
  }, [path]);

  return <div className="field" ref={host} aria-hidden="true" />;
}
