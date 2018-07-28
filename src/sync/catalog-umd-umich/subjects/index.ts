import { fetchUndergraduateSubjectsHtml } from './fetch';
import { parseSubjects } from './parse';

export async function fetchUndergraduateSubjects() {
  const subjectsHtml = await fetchUndergraduateSubjectsHtml();
  try {
    return parseSubjects(subjectsHtml);
  } catch (e) {
    console.warn(`could not fetch undergraduate subjects`, e);
    return undefined;
  }
}
