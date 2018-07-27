import { fetchCourseList } from './fetch';
import { parseCourses } from './parse';

export async function fetchCourses(level: 'undergraduate' | 'graduate', subjectCode: string) {
  const courseList = await fetchCourseList(level, subjectCode);
  return parseCourses(courseList);
}
