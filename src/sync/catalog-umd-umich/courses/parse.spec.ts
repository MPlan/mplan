import { getOrWriteHtml } from 'testing-utilities/example-html';
import { parseCourses, parseCourseBlockTitle } from './parse';
import { fetchCourseList } from './fetch';
import { JSDOM } from 'jsdom';

describe('courses', () => {
  describe('parse', () => {
    it('parses the CIS course page', async () => {
      const html = await getOrWriteHtml('cis-courses', __dirname, () =>
        fetchCourseList('undergraduate', 'cis'),
      );

      const courses = parseCourses(html);
      expect(courses).toMatchSnapshot();
    });

    it('parses the course block correctly for CIS', async () => {
      const html = await getOrWriteHtml('cis-courses', __dirname, () =>
        fetchCourseList('undergraduate', 'cis'),
      );
      const { window } = new JSDOM(html);
      const { document } = window;
      const courseBlocks = Array.from(document.querySelectorAll('.courseblock'));

      const parsedCourseBlockTitles = courseBlocks.map(courseBlock => {
        const courseBlockTitleEl = courseBlock.querySelector('.courseblocktitle');
        if (!courseBlockTitleEl) throw new Error('could not find .courseblocktitle');
        const courseBlockTitle = courseBlockTitleEl.textContent;
        if (!courseBlockTitle) throw new Error('could not get text content of .courseblocktitle');
        return parseCourseBlockTitle(courseBlockTitle);
      });

      expect(parsedCourseBlockTitles).toMatchSnapshot();
    });

    it('parses the course block correctly for CHEM', async () => {
      const html = await getOrWriteHtml('chem-courses', __dirname, () =>
        fetchCourseList('undergraduate', 'chem'),
      );
      const { window } = new JSDOM(html);
      const { document } = window;
      const courseBlocks = Array.from(document.querySelectorAll('.courseblock'));

      const parsedCourseBlockTitles = courseBlocks.map(courseBlock => {
        const courseBlockTitleEl = courseBlock.querySelector('.courseblocktitle');
        if (!courseBlockTitleEl) throw new Error('could not find .courseblocktitle');
        const courseBlockTitle = courseBlockTitleEl.textContent;
        if (!courseBlockTitle) throw new Error('could not get text content of .courseblocktitle');
        return parseCourseBlockTitle(courseBlockTitle);
      });

      expect(parsedCourseBlockTitles).toMatchSnapshot();
    });

    it('parses the course block correctly for PSYC', async () => {
      const html = await getOrWriteHtml('psyc-courses', __dirname, () =>
        fetchCourseList('undergraduate', 'psyc'),
      );
      const { window } = new JSDOM(html);
      const { document } = window;
      const courseBlocks = Array.from(document.querySelectorAll('.courseblock'));

      const parsedCourseBlockTitles = courseBlocks.map(courseBlock => {
        const courseBlockTitleEl = courseBlock.querySelector('.courseblocktitle');
        if (!courseBlockTitleEl) throw new Error('could not find .courseblocktitle');
        const courseBlockTitle = courseBlockTitleEl.textContent;
        if (!courseBlockTitle) throw new Error('could not get text content of .courseblocktitle');
        return parseCourseBlockTitle(courseBlockTitle);
      });

      expect(parsedCourseBlockTitles).toMatchSnapshot();
    });
  });
});
