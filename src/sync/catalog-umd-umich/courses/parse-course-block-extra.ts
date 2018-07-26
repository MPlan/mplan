import { parsePrerequisites } from './parse-prerequisites';

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
  if (/restriction/i.test(textContent)) {
    return { restrictions: parseRestrictionsBlock(courseBlockExtra) };
  }
  if (/prerequisite/i.test(textContent)) {
    return { prerequisites: parsePrerequisites(courseBlockExtra) };
  }
  if (/corequisite/i.test(textContent)) {
    return { corequisites: parsePrerequisites(courseBlockExtra) };
  }
  return undefined;
}
