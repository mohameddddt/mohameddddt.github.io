// Next's static export writes per-segment prefetch files nested (`__next.work/$d$slug/__PAGE__.txt`),
// but the client router requests them flat (`__next.work.$d$slug.__PAGE__.txt`). Hosts like Vercel map
// one to the other; GitHub Pages serves files as they are, so we also write the flat names. Runs after
// `next build` (npm "postbuild").
import { readdirSync, statSync, copyFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const OUT = 'out';
let copied = 0;

function filesUnder(dir) {
  return readdirSync(dir).flatMap(name => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? filesUnder(p) : [p];
  });
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!statSync(p).isDirectory()) continue;
    if (name.startsWith('__next.')) {
      for (const f of filesUnder(p)) {
        const flat = relative(dir, f).split(sep).join('.');
        copyFileSync(f, join(dir, flat));
        copied++;
      }
    } else if (name !== '_next') {
      walk(p);
    }
  }
}

walk(OUT);
console.log(`flatten-segments: wrote ${copied} flat prefetch file(s)`);
