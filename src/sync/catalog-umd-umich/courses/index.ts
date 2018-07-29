import { fetchCourseList } from './fetch';
import { parseCourses } from './parse';

export async function fetchCourses(
  level: 'undergraduate' | 'graduate',
  subjectCode: string,
  logger?: (message: string) => void,
) {
  const log = logger || console.warn.bind(console);
  try {
    const courseList = await fetchCourseList(level, subjectCode);
    return parseCourses(courseList, log);
  } catch (e) {
    log(`Could not get courses for "${level}" subject code: "${subjectCode}"`, e);
    return undefined;
  }
}
