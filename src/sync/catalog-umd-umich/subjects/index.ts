import { fetchUndergraduateSubjectsHtml } from './fetch';
import { parseSubjects } from './parse';

export async function fetchUndergraduateSubjects(logger?: (message: string) => void) {
  const subjectsHtml = await fetchUndergraduateSubjectsHtml();
  const log = logger || console.warn.bind(console);
  try {
    return parseSubjects(subjectsHtml);
  } catch (e) {
    log(`Failed to get and parse undergraduate subjects: ${e && e.message}`);
    return undefined;
  }
}
