import { Subject } from 'sync/catalog-umd-umich/models';
import { JSDOM } from 'jsdom';

export function parseTextContent(textContent: string) {
  const match = /(.*)\((.*)\)/.exec(textContent);
  if (!match) throw new Error(`Could not parse text content of "${textContent}"`);
  const name = match[1].trim();
  const code = match[2].trim();
  return { name, code };
}

export function parseSubjects(html: string): Subject[] {
  const { window } = new JSDOM(html);
  const { document } = window;
  const aToZIndex = document.querySelector('#atozindex');
  if (!aToZIndex) throw new Error('could not find `#atozinddex` in the document');
  const anchors = Array.from(aToZIndex.querySelectorAll('ul li a')) as HTMLAnchorElement[];

  return anchors.map(anchor => ({
    href: anchor.href,
    ...parseTextContent(anchor.textContent || ''),
  }));
}
