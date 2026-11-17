import Link from "next/link";
import type { ReactNode } from "react";

// Minimal Markdown renderer for legal text we maintain ourselves: headings,
// paragraphs, bullet and numbered lists, bold, italic, and links. Produces
// React elements (no raw HTML), so pasted content can't inject markup.

function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const pattern = /\*\*(.+?)\*\*|__(.+?)__|\[([^\]]+)\]\(([^)\s]+)\)|\*(.+?)\*|_(.+?)_/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let n = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) out.push(text.slice(last, match.index));
    const key = `${keyBase}-${n++}`;
    if (match[1] ?? match[2]) out.push(<strong key={key}>{inline(match[1] ?? match[2], key)}</strong>);
    else if (match[3]) {
      const href = match[4];
      const label = inline(match[3], key);
      if (href.startsWith("/")) out.push(<Link key={key} href={href}>{label}</Link>);
      else if (/^(https?:|mailto:)/i.test(href)) out.push(<a key={key} href={href}>{label}</a>);
      else out.push(<span key={key}>{label}</span>);
    } else out.push(<em key={key}>{inline(match[5] ?? match[6], key)}</em>);
    last = pattern.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function renderMarkdown(source: string, { skipTitle = true } = {}): ReactNode[] {
  const lines = source.replace(/<!--[\s\S]*?-->/g, "").replace(/\r\n?/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let sawHeading = false;

  const flush = () => {
    const key = `b${blocks.length}`;
    if (paragraph.length) blocks.push(<p key={key}>{inline(paragraph.join(" "), key)}</p>);
    else if (list) {
      const items = list.items.map((item, i) => <li key={i}>{inline(item, `${key}-${i}`)}</li>);
      blocks.push(list.ordered ? <ol key={key}>{items}</ol> : <ul key={key}>{items}</ul>);
    }
    paragraph = [];
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    const bullet = /^[-*+]\s+(.*)$/.exec(line);
    const numbered = /^\d+[.)]\s+(.*)$/.exec(line);
    if (!line || /^(-{3,}|\*{3,})$/.test(line)) {
      flush();
    } else if (heading) {
      flush();
      const level = heading[1].length;
      const text = heading[2].replace(/\s*#+$/, "");
      if (level === 1 && skipTitle && !sawHeading) continue;
      sawHeading = true;
      const key = `b${blocks.length}`;
      blocks.push(level <= 2 ? <h2 key={key}>{inline(text, key)}</h2> : <h3 key={key}>{inline(text, key)}</h3>);
    } else if (bullet || numbered) {
      const ordered = Boolean(numbered);
      if (paragraph.length || (list && list.ordered !== ordered)) flush();
      list ??= { ordered, items: [] };
      list.items.push((bullet ?? numbered)![1]);
    } else if (list && /^\s{2,}/.test(raw)) {
      list.items[list.items.length - 1] += ` ${line}`;
    } else {
      if (list) flush();
      paragraph.push(line);
    }
  }
  flush();
  return blocks;
}
