import { fetchSubjects, fetchCourses } from './';
import { sequentially } from 'utilities/utilities';
import { Course } from './models';

describe('catalog-umd-umich-scraper', () => {
  it('gets all the undergraduate courses without crashing', async () => {
    jest.setTimeout(3 * 60 * 1000);
    const subjects = await fetchSubjects('undergraduate');
    if (!subjects) throw new Error('No subjects');
    const subjectCodes = subjects.map(({ code }) => code);
    const _courses = await sequentially(subjectCodes, async subjectCode => {
      const courses = (await fetchCourses('undergraduate', subjectCode))!;
      return { subjectCode, courses };
    });
    const courses = _courses.filter(x => !!x.courses);

    const coursesBySubject = courses.reduce(
      (coursesBySubject, { subjectCode, courses }) => {
        coursesBySubject[subjectCode] = courses;
        return coursesBySubject;
      },
      {} as {
        [subjectCode: string]: Course[];
      },
    );

    expect(coursesBySubject).toMatchSnapshot();
  });
});
