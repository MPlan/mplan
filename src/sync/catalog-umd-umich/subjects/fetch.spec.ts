import { fetchUndergraduateSubjectsHtml } from './fetch';

describe('subjects', () => {
  describe('fetchUndergraduateSubjects', () => {
    it('should grab the HTML from the page', async () => {
      const html = await fetchUndergraduateSubjectsHtml();
      expect(html).toMatchSnapshot();
    });
  });
});
