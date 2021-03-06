import { getOrWriteHtml } from 'testing-utilities/example-html';
import { fetchCourseList } from '../fetch';
import { parsePrerequisites } from './prerequisites';
import { JSDOM } from 'jsdom';

describe('parsePrerequisites', () => {
  it('works', async () => {
    const html = await getOrWriteHtml('cis-courses', __dirname, () =>
      fetchCourseList('undergraduate', 'cis'),
    );

    const document = new JSDOM(html).window.document;
    const prerequisitesBlocks = Array.from(document.querySelectorAll('.courseblockextra')).filter(
      courseBlockExtra => {
        const textContent = courseBlockExtra.textContent;
        if (!textContent) return false;
        if (!/prerequisite/i.test(textContent)) return false;
        return true;
      },
    );

    const result = prerequisitesBlocks.map(block => {
      try {
        return parsePrerequisites(block);
      } catch (e) {
        console.warn(e);
      }
    });
    expect(result).toMatchSnapshot();
  });
});
