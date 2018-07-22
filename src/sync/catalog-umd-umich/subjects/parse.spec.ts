import { getExampleHtml } from 'testing-utilities/example-html';
import { parseSubjects } from './parse';

describe('subjects', () => {
  describe('parseSubjects', () => {
    it('parses all the subjects from the HTML page', () => {
      const html = getExampleHtml('undergrad-subjects');
      const subjects = parseSubjects(html);
      expect(subjects).toMatchSnapshot();
    });
  });
});
