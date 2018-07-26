import { getOrWriteHtml } from 'testing-utilities/example-html';
import { fetchCourseList } from './fetch';
import { parsePrerequisites } from './parse-prerequisites';
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

    const result = prerequisitesBlocks
      .map(block => parsePrerequisites(block))
      .map(result => JSON.stringify(result, null, 2))
      .join('\n====================\n');
    console.log(result);
  });
});
