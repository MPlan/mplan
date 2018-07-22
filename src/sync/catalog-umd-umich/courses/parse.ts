// import { Course } from 'sync/catalog-umd-umich/models';
import { JSDOM } from 'jsdom';
import { oneLine } from 'common-tags';

export function parseCourseBlockTitle(courseBlockTitle: string) {
  const subjectCodeCourseNumberMatch = /(\w*)\s*(\w*)/.exec(courseBlockTitle);
  if (!subjectCodeCourseNumberMatch) {
    throw new Error(
      oneLine`
        could not get the subject code and course number from  course block title
        "${courseBlockTitle}"
      `,
    );
  }

  const subjectCode = subjectCodeCourseNumberMatch[1].toUpperCase().trim();
  const courseNumber = subjectCodeCourseNumberMatch[2].toUpperCase().trim();
  const nameAndCreditHours = courseBlockTitle.substring(
    subjectCodeCourseNumberMatch.index + subjectCodeCourseNumberMatch[0].length,
    courseBlockTitle.length,
  );

  const creditHourRangeMatch = /(\d)+\s*(?:to|or)\s*(\d+)\s*credit\s*hours?/i.exec(
    nameAndCreditHours,
  );
  if (creditHourRangeMatch) {
    const creditHourMin = parseInt(creditHourRangeMatch[1].trim(), 10);
    const creditHourMax = parseInt(creditHourRangeMatch[2].trim(), 10);

    const name = nameAndCreditHours.substring(0, creditHourRangeMatch.index).trim();
    return {
      subjectCode,
      courseNumber,
      name,
      creditHours: [creditHourMin, creditHourMax] as [number, number],
    };
  }

  const creditHourMatch = /(\d+)\s*credit\s*hours?/i.exec(nameAndCreditHours);
  if (creditHourMatch) {
    const creditHours = parseInt(creditHourMatch[1].trim(), 10);

    const name = nameAndCreditHours.substring(0, creditHourMatch.index).trim();
    return {
      subjectCode,
      courseNumber,
      name,
      creditHours,
    };
  }
  throw new Error(
    oneLine`
      could not parse name andd credit hours from course block title "${courseBlockTitle}"
    `,
  );
}

export function parseCourses(courseListHtml: string) {
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

    return {
      subjectCode,
      courseNumber,
      name,
      creditHours,
      description,
    };
  });
}
