import * as fs from 'fs';

export function writeExampleHtml(id: string, dirname: string, html: string) {
  const examplesDirectory = `${dirname}/__examples__`;
  if (!fs.existsSync(examplesDirectory)) fs.mkdirSync(examplesDirectory);
  fs.writeFileSync(`${examplesDirectory}/${id}.html`, html);
  console.info(`wrote ${id}.html`);
}

export function getExampleHtml(id: string, dirname: string) {
  return fs.readFileSync(`${dirname}/__examples__/${id}.html`).toString();
}

export async function getOrWriteHtml(id: string, dirname: string, get: () => Promise<string>) {
  try {
    return getExampleHtml(id, dirname);
  } catch (e) {
    console.info('could not find HTML so getting...');
    const html = await get();
    writeExampleHtml(id, dirname, html);
    return html;
  }
}
