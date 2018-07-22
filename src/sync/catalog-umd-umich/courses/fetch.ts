import axios from 'axios';

export async function fetchCourseList(level: 'undergraduate' | 'graduate', subjectCode: string) {
  const response = await axios({
    url: `http://catalog.umd.umich.edu/${level}/coursesaz/${subjectCode.toLowerCase().trim()}`,
    headers: {
      'X-What-Is-This-Request': 'https://github.com/MPlan/mplan',
    },
  });
  const html = response.data as string | undefined;
  if (!html) throw new Error(`could not get course list for "${level} ${subjectCode}"`);
  return html;
}
