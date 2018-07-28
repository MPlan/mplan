import { fetchCourseList } from './fetch';
import { parseCourses } from './parse';

export async function fetchCourses(level: 'undergraduate' | 'graduate', subjectCode: string) {
  const courseList = await fetchCourseList(level, subjectCode);
  try {
    return parseCourses(courseList);
  } catch (e) {
    console.warn(`Could not get courses for "${level}" subject code: "${subjectCode}"`, e);
    return undefined;
  }
}
