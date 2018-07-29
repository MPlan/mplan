import { fetchSubjectsHtml } from './fetch';

describe('subjects', () => {
  describe('fetchUndergraduateSubjects', () => {
    it('should grab the HTML from the page', async () => {
      const html = await fetchSubjectsHtml('undergraduate');
      expect(html).toMatchSnapshot();
    });
  });
});
