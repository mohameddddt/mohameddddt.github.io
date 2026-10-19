import { NAME } from '@/lib/site';
import Clock from './Clock';

export default function Footer() {
  return (
    <div className="foot-wrap">
      <footer className="wrap-x">
        <p className="foot-big reveal words" aria-hidden="true">
          {NAME.split(' ').map((w, i) => <span className="w" key={w}><span style={{ '--i': i } as React.CSSProperties}>{w}</span></span>)}
        </p>
        <div className="foot">
          <div className="row2">
            <span>© 2026 {NAME}</span>
            <span className="foot-clock">Algiers <Clock /></span>
            <a href="#top">Back to top ↑</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
