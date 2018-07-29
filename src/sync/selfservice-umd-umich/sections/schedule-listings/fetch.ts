import * as https from 'https';
import axios from 'axios';
import { oneLineTrim } from 'common-tags';
import { formEncode } from 'utilities/form-encode-decode';

export async function fetchScheduleListingsHtml(
  termCode: string,
  subjectCode: string,
  courseNumber: string,
) {
  const url = oneLineTrim`
    https://selfservice.umd.umich.edu/BANP/bwckctlg.p_disp_listcrse?
    ${formEncode({
      term_in: termCode.toUpperCase().trim(),
      subj_in: subjectCode.toUpperCase().trim(),
      crse_in: courseNumber.toUpperCase().trim(),
      schd_in: '',
    })}
  `;

  const response = await axios({
    method: 'GET',
    url,
    httpsAgent: new https.Agent({ ciphers: 'ALL' }),
    headers: {
      'X-What-Is-This-Request': 'https://github.com/mplan/mplan',
    },
  });

  const html = response.data as string | undefined;
  if (!html) throw new Error('Subjects response was undefined or empty.');

  return html;
}
