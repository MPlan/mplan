import { fetchSubjectsHtml } from './fetch';
import { parseSubjects } from './parse';

export async function fetchSubjects(
  level: 'undergraduate' | 'graduate',
  logger?: (message: string) => void,
) {
  const subjectsHtml = await fetchSubjectsHtml(level);
  const log = logger || console.warn.bind(console);
  try {
    return parseSubjects(subjectsHtml);
  } catch (e) {
    log(`Failed to get and parse ${level} subjects: ${e && e.message}`);
    return undefined;
  }
}
