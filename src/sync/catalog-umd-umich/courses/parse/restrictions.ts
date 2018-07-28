export function parseRestrictionsBlock(restrictionsBlock: Element) {
  return Array.from(restrictionsBlock.childNodes)
    .map(x => x.textContent!)
    .filter(x => !!x)
    .map(x => x.trim())
    .filter(x => !!x)
    .filter(x => !/restriction/i.test(x));
}
