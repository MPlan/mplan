import { fetchUndergraduateSubjectsHtml } from './fetch';
import { parseSubjects } from './parse';

export async function fetchUndergraduateSubjects() {
  const subjectsHtml = await fetchUndergraduateSubjectsHtml();
  return parseSubjects(subjectsHtml);
}
