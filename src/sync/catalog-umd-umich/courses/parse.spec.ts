import { getOrWriteHtml } from 'testing-utilities/example-html';
import { parseCourses } from './parse';
import { fetchCourseList } from './fetch';

describe('courses', () => {
  describe('parse', () => {
    it('parses the CIS course page', async () => {
      const html = await getOrWriteHtml('cis-courses', __dirname, () =>
        fetchCourseList('undergraduate', 'cis'),
      );

      const courses = parseCourses(html);
      expect(courses).toMatchSnapshot();
    });
  });
});
