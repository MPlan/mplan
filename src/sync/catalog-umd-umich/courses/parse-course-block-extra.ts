export function parseRestrictionsBlock(restrictionsBlock: Element) {
  return Array.from(restrictionsBlock.childNodes)
    .map(x => x.textContent!)
    .filter(x => !!x)
    .map(x => x.trim())
    .filter(x => !!x)
    .filter(x => !/restriction/i.test(x));
}

export function parseCourseBlockExtra(courseBlockExtra: Element) {
  const textContent = courseBlockExtra.textContent;
  if (!textContent) throw new Error('could not get textContent from .courseblockextra');
  const restrictionsBlock = /restriction/i.test(textContent);
  if (restrictionsBlock) return { restrictions: parseRestrictionsBlock(courseBlockExtra) };
  return undefined;
}
