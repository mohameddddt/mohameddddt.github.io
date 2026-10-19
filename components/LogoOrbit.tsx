import type { CSSProperties } from 'react';
import type { Project } from '@/lib/projects';
import SkillIcon from './SkillIcon';
import ProjectIcon from './ProjectIcon';

// a project's tools circling its icon: the cover visual for projects without screenshots
export default function LogoOrbit({ p }: { p: Project }) {
  const items = p.stack.slice(0, 12);
  const inner = items.slice(0, 5), outer = items.slice(5);
  const ring = (list: string[], cls: string) => (
    <div className={'ring ' + cls} aria-hidden="true">
      {list.map((s, i) => (
        <span key={s} style={{ '--a': `${(360 / list.length) * i}deg` } as CSSProperties}>
          <i title={s}><SkillIcon name={s} size={22} /></i>
        </span>
      ))}
    </div>
  );
  return (
    <div className="orbit" role="img" aria-label={`${p.title} is built with ${items.join(', ')}`}>
      {outer.length > 0 && ring(outer, 'r-out')}
      {ring(inner, 'r-in')}
      <div className="orbit-core"><ProjectIcon name={p.icon} className="ic-tile big" /></div>
    </div>
  );
}
