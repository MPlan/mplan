import { fetchSections } from './';
import { fetchSubjects, fetchCourses } from 'sync/catalog-umd-umich';
import { sequentially } from 'utilities/utilities';
import { flatten } from 'lodash';

describe('fetchSections', () => {
  it('fetches the sections for CIS 450 201910', async () => {
    const sections = await fetchSections('201910', 'CIS', '450');
    expect(sections).toBeTruthy();
    expect(sections).toMatchSnapshot();
  });
  it('fetches the sections for all the undergraduate courses in term 201910', async () => {
    jest.setTimeout(30 * 60 * 1000);
    const subjects = await fetchSubjects('undergraduate');
    if (!subjects) throw new Error('subjects was undefined');
    const sections = flatten(
      await sequentially(subjects, async subject => {
        const courses = await fetchCourses('undergraduate', subject.code);
        if (!courses) throw new Error('courses were undefined');
        const sections = flatten(
          (await sequentially(courses, async course => {
            return await fetchSections('201910', course.subjectCode, course.courseNumber);
          }))
            .filter(x => !!x)
            .map(x => x!),
        );
        return sections;
      }),
    );

    expect(sections).toMatchSnapshot();
  });
});
