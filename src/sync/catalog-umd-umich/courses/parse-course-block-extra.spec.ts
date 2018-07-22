import { JSDOM } from 'jsdom';
import { getOrWriteHtml } from 'testing-utilities/example-html';
import { fetchCourseList } from './fetch';
import { parseRestrictionsBlock } from './parse-course-block-extra';

describe('parseRestrictionsBlock', () => {
  it('parses restrictions and returns an array of them', async () => {
    const html = await getOrWriteHtml('cis-courses', __dirname, () =>
      fetchCourseList('undergraduate', 'cis'),
    );
    const { window } = new JSDOM(html);
    const { document } = window;

    const parsedRestrictions = Array.from(document.querySelectorAll('.courseblockextra'))
      .filter(courseBlockExtra => {
        const textContent = courseBlockExtra.textContent;
        if (!textContent) return false;
        return /restriction/i.test(textContent);
      })
      .map(parseRestrictionsBlock);

    expect(parsedRestrictions).toMatchSnapshot();
  });
});
