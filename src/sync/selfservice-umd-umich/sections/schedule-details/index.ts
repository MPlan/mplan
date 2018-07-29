import { parseScheduleDetail } from './parse';
import { fetchScheduleDetailHtml } from './fetch';

export async function fetchScheduleDetail(
  termCode: string,
  crn: string,
  logger?: (message: string) => void,
) {
  const log = logger || console.warn.bind(console);
  try {
    const html = await fetchScheduleDetailHtml(termCode, crn);
    return parseScheduleDetail(html, logger);
  } catch (e) {
    log(`Failed to get schedule detail for CRN "${crn}" "${termCode}": ${e && e.message}`);
    return undefined;
  }
}
