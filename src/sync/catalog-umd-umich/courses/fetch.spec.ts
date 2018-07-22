import { writeExampleHtml } from 'testing-utilities/example-html';
import { fetchCourseList } from './fetch';

describe('courses', () => {
  describe('fetch', () => {
    it('should grab the html for any valid subject code', async () => {
      const html = await fetchCourseList('undergraduate', 'cis');
      expect(html).toMatchSnapshot();
      writeExampleHtml('cis-courses', html);
    });
  });
});
