import { getOrWriteHtml } from 'testing-utilities/example-html';
import { parseSubjects } from './parse';
import { fetchUndergraduateSubjectsHtml } from './fetch';

describe('subjects', () => {
  describe('parseSubjects', () => {
    it('parses all the subjects from the HTML page', async () => {
      const html = await getOrWriteHtml(
        'undergrad-subjects',
        __dirname,
        fetchUndergraduateSubjectsHtml,
      );
      const subjects = parseSubjects(html);
      expect(subjects).toMatchSnapshot();
    });
  });
});
