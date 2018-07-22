import { fetchUndergraduateSubjectsHtml } from './fetch';
import { writeExampleHtml } from 'testing-utilities/example-html';

describe('subjects', () => {
  describe('fetchUndergraduateSubjects', () => {
    it('should grab the HTML from the page', async () => {
      const html = await fetchUndergraduateSubjectsHtml();
      expect(typeof html).toBe('string');
      expect(html).toMatchSnapshot();
      writeExampleHtml('undergrad-subjects', html);
    });
  });
});
