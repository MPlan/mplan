import { replacePrerequisiteAnchors, replaceCourseDirective } from './prerequisites';

export function parseCorequisites(courseBlockExtra: Element) {
  const textContent = replacePrerequisiteAnchors(courseBlockExtra);
  const split = textContent.split(',');
  const corequisites = split
    .map(part => {
      const result = replaceCourseDirective(part);
      if (!result) return part;
      return [result[0], result[1]] as [string, string];
    })
    .filter(x => !!x); // removes empty string

  if (corequisites.length <= 0) return undefined;

  return corequisites;
}
