import { fetchScheduleListings } from './schedule-listings';
import { fetchScheduleDetail } from './schedule-details';
import { sequentially } from 'utilities/utilities';

// prettier-ignore
type Unpacked<T> =
  T extends (infer U)[] ? U :
  T extends (...args: any[]) => infer U ? U :
  T extends Promise<infer U> ? U :
  T;

type ScheduleListing = Unpacked<NonNullable<Unpacked<Unpacked<typeof fetchScheduleListings>>>>;
type ScheduleDetail = NonNullable<Unpacked<Unpacked<typeof fetchScheduleDetail>>>;

export type Section = ScheduleListing &
  ScheduleDetail & {
    subjectCode: string;
    courseNumber: string;
    termCode: string;
    season: 'winter' | 'summer' | 'fall' | 'unknown';
  };

export function getSeasonFromTermCode(termCode: string) {
  const lastDigits = termCode.substr(-2);
  if (lastDigits === '10') return 'fall';
  if (lastDigits === '20') return 'winter';
  if (lastDigits === '30') return 'summer';
  return 'unknown';
}

export async function fetchSections(
  termCode: string,
  subjectCode: string,
  courseNumber: string,
  logger?: (message: string) => void,
): Promise<Section[] | undefined> {
  const log = logger || console.warn.bind(console);

  try {
    const scheduleListings = await fetchScheduleListings(termCode, subjectCode, courseNumber, log);
    if (!scheduleListings) throw new Error('Failed to fetch schedule listings');
    const sections = await sequentially(scheduleListings, async listing => {
      const scheduleDetail = await fetchScheduleDetail(
        termCode,
        listing.courseRegistrationNumber,
        log,
      );

      if (!scheduleDetail) return undefined;
      const section: Section = {
        subjectCode,
        courseNumber,
        termCode,
        season: getSeasonFromTermCode(termCode),
        ...listing,
        ...scheduleDetail,
      };
      return section;
    });

    return sections.filter(x => !!x).map(x => x as Section);
  } catch (e) {
    log(`Failed to get sections for ${termCode} ${subjectCode} ${courseNumber}: ${e && e.message}`);
    return undefined;
  }
}
