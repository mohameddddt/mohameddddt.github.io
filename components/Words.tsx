import type { CSSProperties, ElementType } from 'react';

/** a heading whose words rise in one after another when it scrolls into view; `em` is set in the serif accent */
export default function Words({ text, em, as: Tag = 'h2', className = '', id }: { text: string; em?: string; as?: ElementType; className?: string; id?: string }) {
  const words = text.split(' ');
  const word = (w: string, i: number) => <span className="w" key={i}><span style={{ '--i': i } as CSSProperties}>{w}</span></span>;
  return (
    <Tag id={id} className={('reveal words ' + className).trim()} aria-label={em ? `${text} ${em}` : text}>
      <span aria-hidden="true">
        {words.map((w, i) => <span key={i}>{word(w, i)}{i < words.length - 1 || em ? ' ' : ''}</span>)}
        {em && <em>{em.split(' ').map((w, i, a) => <span key={i}>{word(w, words.length + i)}{i < a.length - 1 ? ' ' : ''}</span>)}</em>}
      </span>
    </Tag>
  );
}
