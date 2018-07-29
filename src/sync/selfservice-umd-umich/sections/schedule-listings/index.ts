import { fetchScheduleListingsHtml } from './fetch';
import { parseScheduleListing } from './parse';

export async function fetchScheduleListings(
  termCode: string,
  subjectCode: string,
  courseNumber: string,
  logger?: (message: string) => void,
) {
  const log = logger || console.warn.bind(console);
  try {
    const html = await fetchScheduleListingsHtml(termCode, subjectCode, courseNumber);
    return parseScheduleListing(html, log);
  } catch (e) {
    log(`Could not get schedule listings for "${termCode} ${subjectCode} ${courseNumber}"`);
    return undefined;
  }
}
