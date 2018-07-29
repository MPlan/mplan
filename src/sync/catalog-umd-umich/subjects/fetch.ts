import axios from 'axios';

export async function fetchSubjectsHtml(level: 'undergraduate' | 'graduate') {
  const response = await axios({
    method: 'GET',
    url: `http://catalog.umd.umich.edu/${level}/coursesaz/`,
    headers: {
      'X-What-Is-This-Request': 'https://github.com/MPlan/mplan',
    },
  });

  const html = response.data as string | undefined;
  if (!html) {
    throw new Error('Subjects response was undefined or empty.');
  }
  return html;
}
