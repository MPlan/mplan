// import { Course } from 'sync/catalog-umd-umich/models';
import { JSDOM } from 'jsdom';
import { parseCourseBlockTitle } from './parse-course-block-title';
import { parseCourseBlockExtra } from './parse-course-block-extra';
import { Prerequisite, Course } from '../models';

export function parseCourses(courseListHtml: string): Course[] {
  const { window } = new JSDOM(courseListHtml);
  const { document } = window;
  const courseBlocks = Array.from(document.querySelectorAll('.courseblock'));
  return courseBlocks.map(courseBlock => {
    // subject code, course number, name, and credit hours
    const courseBlockTitleEl = courseBlock.querySelector('.courseblocktitle');
    if (!courseBlockTitleEl) throw new Error('could not find .courseblocktitle');
    const courseBlockTitle = courseBlockTitleEl.textContent;
    if (!courseBlockTitle) throw new Error('could not get text content of .courseblocktitle');
    const { courseNumber, creditHours, name, subjectCode } = parseCourseBlockTitle(
      courseBlockTitle,
    );

    // description
    const descriptionEl = courseBlock.querySelector('.courseblockdesc');
    if (!descriptionEl) {
      throw new Error('could not get description because could not find .courseblockdesc');
    }
    const _description = descriptionEl.textContent;
    if (!_description) throw new Error('description block text content was falsy');
    const description = _description.trim();

    const extras = Array.from(courseBlock.querySelectorAll('.courseblockextra'))
      .map(block => {
        try {
          return parseCourseBlockExtra(block);
        } catch (e) {
          console.warn(`Couldn't parse ${subjectCode} ${courseNumber}`, e);
          return undefined;
        }
      })
      .filter(x => !!x)
      .reduce(
        (extras, next) => {
          return { ...extras, ...next };
        },
        {} as any,
      ) as { prerequisites?: Prerequisite; corequisites?: Prerequisite; restrictions?: string[] };

    return {
      subjectCode,
      courseNumber,
      name,
      creditHours,
      description,
      ...extras,
    };
  });
}
