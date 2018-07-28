import { parsePrerequisites } from './prerequisites';
import { parseRestrictionsBlock } from './restrictions';

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
