import { ReactNode } from 'react';

function renderInline(str: string): ReactNode[] {
  return str.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  );
}

export default function RenderMarkdown({ text, color = '#1a2e36' }: { text: string; color?: string }) {
  const lines = text.split('\n');
  const els: ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) { items.push(lines[i].slice(2)); i++; }
      els.push(<ul key={`ul-${i}`} style={{ margin: '4px 0', paddingLeft: '18px' }}>{items.map((it, j) => <li key={j} style={{ marginBottom: '2px' }}>{renderInline(it)}</li>)}</ul>);
      continue;
    }
    if (/^\d+\./.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\./.test(lines[i])) { items.push(lines[i].replace(/^\d+\.\s*/, '')); i++; }
      els.push(<ol key={`ol-${i}`} style={{ margin: '4px 0', paddingLeft: '18px' }}>{items.map((it, j) => <li key={j} style={{ marginBottom: '2px' }}>{renderInline(it)}</li>)}</ol>);
      continue;
    }
    els.push(<p key={i} style={{ margin: '2px 0' }}>{renderInline(line)}</p>);
    i++;
  }
  return <div style={{ color, fontSize: '13.5px', lineHeight: '1.6' }}>{els}</div>;
}
